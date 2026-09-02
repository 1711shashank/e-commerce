from django.db import transaction
from django.utils.text import slugify
from ecommerce_shared.timezone_utils import format_iso
from rest_framework import serializers

from .models import Banner, Category, Product, ProductColor, ProductSize, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    parentId = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "name", "slug", "image", "description", "parentId")

    def get_parentId(self, obj):
        return str(obj.parent_id) if obj.parent_id else None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = f"cat-{instance.slug}" if not instance.parent_id else f"sub-{instance.slug}"
        return data


class ProductVariantInputSerializer(serializers.Serializer):
    color = serializers.CharField(max_length=50)
    size = serializers.CharField(max_length=20)
    stockQty = serializers.IntegerField(min_value=0)


class ProductVariantSerializer(serializers.ModelSerializer):
    color = serializers.CharField(source="color.name", read_only=True)
    size = serializers.CharField(source="size.label", read_only=True)
    stockQty = serializers.IntegerField(source="stock_qty", read_only=True)

    class Meta:
        model = ProductVariant
        fields = ("id", "color", "size", "stockQty", "sku")


class ProductSerializer(serializers.ModelSerializer):
    subCategory = serializers.CharField(
        source="sub_category", required=False, allow_blank=True
    )
    discountPrice = serializers.DecimalField(
        source="discount_price",
        max_digits=10,
        decimal_places=2,
        required=False,
        allow_null=True,
    )
    isNew = serializers.BooleanField(source="is_new", required=False)
    isOnSale = serializers.BooleanField(source="is_on_sale", required=False)
    inStock = serializers.BooleanField(source="in_stock", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    imagesByColor = serializers.JSONField(required=False, write_only=True)
    variants = ProductVariantInputSerializer(many=True, required=False, write_only=True)
    variantsRead = ProductVariantSerializer(
        source="variants", many=True, read_only=True
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "slug",
            "name",
            "category",
            "subCategory",
            "price",
            "discountPrice",
            "imagesByColor",
            "sizes",
            "colors",
            "variants",
            "variantsRead",
            "fabric",
            "description",
            "isNew",
            "isOnSale",
            "inStock",
            "rating",
            "tags",
            "createdAt",
        )
        read_only_fields = ("id", "slug", "createdAt", "variantsRead", "inStock")

    def validate_imagesByColor(self, value):
        if value is None:
            return value
        if not isinstance(value, dict):
            raise serializers.ValidationError("imagesByColor must be an object.")
        cleaned: dict[str, list[str]] = {}
        for color, urls in value.items():
            if not isinstance(color, str) or not color.strip():
                continue
            if not isinstance(urls, list):
                raise serializers.ValidationError(
                    {color: "Images must be a list of URLs."}
                )
            cleaned[color.strip()] = [
                str(url).strip() for url in urls if isinstance(url, str) and url.strip()
            ]
        return cleaned

    def validate_sizes(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("At least one size is required.")
        return value

    def validate_colors(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("At least one color is required.")
        return value

    def validate(self, attrs):
        variants = attrs.get("variants")
        colors = attrs.get("colors")
        sizes = attrs.get("sizes")
        color_images = attrs.get("imagesByColor")

        if color_images is not None and colors is not None:
            color_set = set(colors)
            for color_name in color_images:
                if color_name not in color_set:
                    raise serializers.ValidationError(
                        {"imagesByColor": f"Unknown color: {color_name}"}
                    )
            for color_name in colors:
                if not color_images.get(color_name):
                    raise serializers.ValidationError(
                        {
                            "imagesByColor": (
                                f"Add at least one image for color: {color_name}"
                            )
                        }
                    )

        if self.instance is None and not color_images:
            raise serializers.ValidationError(
                {"imagesByColor": "Add at least one product image."}
            )

        if variants is not None:
            color_set = set(colors or [])
            size_set = set(sizes or [])
            for entry in variants:
                if entry["color"] not in color_set:
                    raise serializers.ValidationError(
                        {"variants": f"Unknown color: {entry['color']}"}
                    )
                if entry["size"] not in size_set:
                    raise serializers.ValidationError(
                        {"variants": f"Unknown size: {entry['size']}"}
                    )
            seen = set()
            for entry in variants:
                key = (entry["color"], entry["size"])
                if key in seen:
                    raise serializers.ValidationError(
                        {"variants": f"Duplicate variant: {entry['color']} / {entry['size']}"}
                    )
                seen.add(key)
            expected = len(color_set) * len(size_set)
            if len(seen) != expected:
                raise serializers.ValidationError(
                    {
                        "variants": (
                            "Provide stock for every color and size combination."
                        )
                    }
                )
            if not any(entry["stockQty"] > 0 for entry in variants):
                raise serializers.ValidationError(
                    {"variants": "Set stock for at least one color and size."}
                )
        return attrs

    @staticmethod
    def _ensure_has_stock(product: Product) -> None:
        if not product.variants.filter(is_active=True, stock_qty__gt=0).exists():
            raise serializers.ValidationError(
                {"variants": "Set stock for at least one color and size."}
            )

    def _build_variant_sku(self, product: Product, color: ProductColor, size: ProductSize) -> str:
        base = slugify(f"{product.slug}-{color.name}-{size.label}")[:50] or "variant"
        sku = f"{base}-{product.pk}"
        n = 1
        while ProductVariant.objects.filter(sku=sku).exclude(
            product=product, color=color, size=size
        ).exists():
            n += 1
            sku = f"{base}-{product.pk}-{n}"
        return sku

    @transaction.atomic
    def _sync_variants(
        self,
        product: Product,
        colors: list[str],
        sizes: list[str],
        variants: list[dict],
        color_images: dict[str, list[str]] | None = None,
    ) -> None:
        color_objs: dict[str, ProductColor] = {}
        for i, name in enumerate(colors):
            defaults: dict = {"sort_order": i, "is_default": i == 0}
            color, _ = ProductColor.objects.update_or_create(
                product=product,
                name=name,
                defaults=defaults,
            )
            color_objs[name] = color

        if color_images is not None:
            for color_name, color in color_objs.items():
                color.images = color_images.get(color_name, [])
                color.save(update_fields=["images"])

        ProductColor.objects.filter(product=product).exclude(
            name__in=colors
        ).delete()

        size_objs: dict[str, ProductSize] = {}
        for i, label in enumerate(sizes):
            size, _ = ProductSize.objects.update_or_create(
                product=product,
                label=label,
                defaults={"sort_order": i},
            )
            size_objs[label] = size

        ProductSize.objects.filter(product=product).exclude(
            label__in=sizes
        ).delete()

        stock_map = {(v["color"], v["size"]): v["stockQty"] for v in variants}

        for color_name, color in color_objs.items():
            for size_label, size in size_objs.items():
                stock_qty = stock_map.get((color_name, size_label), 0)
                variant, created = ProductVariant.objects.get_or_create(
                    product=product,
                    color=color,
                    size=size,
                    defaults={
                        "stock_qty": stock_qty,
                        "sku": self._build_variant_sku(product, color, size),
                    },
                )
                if not created:
                    variant.stock_qty = stock_qty
                    variant.is_active = True
                    variant.save(update_fields=["stock_qty", "is_active"])

        ProductVariant.objects.filter(product=product).exclude(
            color__name__in=colors, size__label__in=sizes
        ).delete()

        product.sync_denormalized_from_variants()
        product.save(
            update_fields=["colors", "sizes", "variant_stock", "in_stock"]
        )

    def _sync_color_images(
        self,
        product: Product,
        colors: list[str],
        color_images: dict[str, list[str]],
    ) -> None:
        color_objs = {
            c.name: c for c in product.product_colors.filter(name__in=colors)
        }
        for color_name in colors:
            color = color_objs.get(color_name)
            if not color:
                continue
            color.images = color_images.get(color_name, [])
            color.save(update_fields=["images"])

    def create(self, validated_data):
        variants = validated_data.pop("variants", None)
        color_images = validated_data.pop("imagesByColor", None)
        colors = validated_data.get("colors", [])
        sizes = validated_data.get("sizes", [])
        product = Product.objects.create(**validated_data)
        if variants is not None:
            self._sync_variants(product, colors, sizes, variants, color_images)
        else:
            self._sync_variants(
                product,
                colors,
                sizes,
                [
                    {"color": c, "size": s, "stockQty": 0}
                    for c in colors
                    for s in sizes
                ],
                color_images,
            )
        self._ensure_has_stock(product)
        return product

    def update(self, instance, validated_data):
        variants = validated_data.pop("variants", None)
        color_images = validated_data.pop("imagesByColor", None)
        colors = validated_data.get("colors", instance.colors)
        sizes = validated_data.get("sizes", instance.sizes)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if variants is not None:
            self._sync_variants(instance, colors, sizes, variants, color_images)
            self._ensure_has_stock(instance)
        elif color_images is not None:
            self._sync_color_images(instance, colors, color_images)
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        data["price"] = float(instance.price)
        if instance.discount_price is not None:
            data["discountPrice"] = float(instance.discount_price)
        else:
            data["discountPrice"] = None
        data["createdAt"] = format_iso(instance.created_at)
        data["variants"] = data.pop("variantsRead", [])
        color_images: dict[str, list[str]] = {}
        for color in instance.product_colors.all():
            imgs = color.images if isinstance(color.images, list) else []
            color_images[color.name] = [str(url) for url in imgs if url]
        data["imagesByColor"] = color_images
        return data


def _validate_cta_href(value: str) -> str:
    value = value.strip()
    if not value:
        raise serializers.ValidationError("Redirect URL is required.")
    lower = value.lower()
    if lower.startswith("javascript:") or lower.startswith("data:"):
        raise serializers.ValidationError("Invalid URL scheme.")
    if value.startswith("/"):
        return value
    if value.startswith("https://"):
        return value
    raise serializers.ValidationError(
        "Use an internal path (/collections/sale) or https:// URL."
    )


class BannerSerializer(serializers.ModelSerializer):
    ctaLabel = serializers.CharField(source="cta_label")
    ctaHref = serializers.CharField(source="cta_href")
    imageAlt = serializers.CharField(
        source="image_alt", required=False, allow_blank=True
    )
    sortOrder = serializers.IntegerField(source="sort_order", required=False)
    isActive = serializers.BooleanField(source="is_active", required=False)
    textColor = serializers.ChoiceField(
        source="text_color",
        choices=[Banner.TEXT_LIGHT, Banner.TEXT_DARK],
        required=False,
    )
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = Banner
        fields = (
            "id",
            "eyebrow",
            "title",
            "subtitle",
            "ctaLabel",
            "ctaHref",
            "image",
            "imageAlt",
            "sortOrder",
            "isActive",
            "textColor",
            "createdAt",
            "updatedAt",
        )

    def validate_ctaHref(self, value):
        return _validate_cta_href(value)

    def validate_image(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Background image is required.")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        data["createdAt"] = format_iso(instance.created_at)
        data["updatedAt"] = format_iso(instance.updated_at)
        return data
