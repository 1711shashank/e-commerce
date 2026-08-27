from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "slug")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "discount_price",
        "in_stock",
        "is_active",
        "is_new",
        "created_at",
    )
    list_filter = ("category", "is_active", "is_new", "is_on_sale", "in_stock")
    search_fields = ("name", "slug", "fabric")
    prepopulated_fields = {"slug": ("name",)}
