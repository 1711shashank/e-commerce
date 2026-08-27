from rest_framework import serializers

from .models import Category, Product


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
    inStock = serializers.BooleanField(source="in_stock", required=False)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

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
            "images",
            "sizes",
            "colors",
            "fabric",
            "description",
            "isNew",
            "isOnSale",
            "inStock",
            "rating",
            "tags",
            "createdAt",
        )
        read_only_fields = ("id", "slug", "createdAt")

    def validate_images(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("At least one image URL is required.")
        return value

    def validate_sizes(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("At least one size is required.")
        return value

    def validate_colors(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("At least one color is required.")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["id"] = str(instance.id)
        data["price"] = float(instance.price)
        if instance.discount_price is not None:
            data["discountPrice"] = float(instance.discount_price)
        else:
            data["discountPrice"] = None
        data["createdAt"] = instance.created_at.isoformat().replace("+00:00", "Z")
        return data
