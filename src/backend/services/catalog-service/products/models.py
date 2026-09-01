from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    image = models.URLField(blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        related_name="children",
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    category = models.CharField(max_length=64)
    sub_category = models.CharField(max_length=64, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    sizes = models.JSONField(default=list)
    colors = models.JSONField(default=list)
    variant_stock = models.JSONField(default=list)
    fabric = models.CharField(max_length=64, blank=True)
    description = models.TextField()
    is_new = models.BooleanField(default=True)
    is_on_sale = models.BooleanField(default=False)
    in_stock = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    rating = models.FloatField(null=True, blank=True, default=5.0)
    tags = models.JSONField(default=list)
    created_by = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name)[:80] or "product"
            slug = base
            n = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                n += 1
                slug = f"{base}-{n}"
            self.slug = slug
        if self.discount_price is not None:
            self.is_on_sale = True
        super().save(*args, **kwargs)

    def sync_denormalized_from_variants(self) -> None:
        colors = list(
            self.product_colors.order_by("sort_order", "id").values_list(
                "name", flat=True
            )
        )
        sizes = list(
            self.product_sizes.order_by("sort_order", "id").values_list(
                "label", flat=True
            )
        )
        variant_rows = self.variants.select_related("color", "size").filter(
            is_active=True
        )
        variant_stock = [
            {
                "color": v.color.name,
                "size": v.size.label,
                "stockQty": v.stock_qty,
            }
            for v in variant_rows
        ]
        self.colors = colors
        self.sizes = sizes
        self.variant_stock = variant_stock
        self.in_stock = any(v.stock_qty > 0 for v in variant_rows)


class ProductColor(models.Model):
    product = models.ForeignKey(
        Product, related_name="product_colors", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=50)
    hex_code = models.CharField(max_length=7, blank=True)
    images = models.JSONField(default=list)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["sort_order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["product", "name"],
                name="unique_product_color_name",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.product_id}:{self.name}"


class ProductSize(models.Model):
    product = models.ForeignKey(
        Product, related_name="product_sizes", on_delete=models.CASCADE
    )
    label = models.CharField(max_length=20)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["product", "label"],
                name="unique_product_size_label",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.product_id}:{self.label}"


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product, related_name="variants", on_delete=models.CASCADE
    )
    color = models.ForeignKey(
        ProductColor, related_name="variants", on_delete=models.CASCADE
    )
    size = models.ForeignKey(
        ProductSize, related_name="variants", on_delete=models.CASCADE
    )
    sku = models.CharField(max_length=64, unique=True)
    stock_qty = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["color__sort_order", "size__sort_order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["product", "color", "size"],
                name="unique_product_color_size_variant",
            ),
        ]

    def __str__(self) -> str:
        return self.sku


class Banner(models.Model):
    TEXT_LIGHT = "light"
    TEXT_DARK = "dark"
    TEXT_COLOR_CHOICES = [
        (TEXT_LIGHT, "Light"),
        (TEXT_DARK, "Dark"),
    ]

    eyebrow = models.CharField(max_length=60, blank=True)
    title = models.CharField(max_length=80)
    subtitle = models.CharField(max_length=160)
    cta_label = models.CharField(max_length=40)
    cta_href = models.CharField(max_length=500)
    image = models.URLField()
    image_alt = models.CharField(max_length=200, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    text_color = models.CharField(
        max_length=8, choices=TEXT_COLOR_CHOICES, default=TEXT_LIGHT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.title
