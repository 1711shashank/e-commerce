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
    images = models.JSONField(default=list)
    sizes = models.JSONField(default=list)
    colors = models.JSONField(default=list)
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
