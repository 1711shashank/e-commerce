import django.db.models.deletion
from django.db import migrations, models


def forwards_migrate_variants(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    ProductColor = apps.get_model("products", "ProductColor")
    ProductSize = apps.get_model("products", "ProductSize")
    ProductVariant = apps.get_model("products", "ProductVariant")

    for product in Product.objects.all():
        if ProductVariant.objects.filter(product=product).exists():
            continue

        colors = product.colors if isinstance(product.colors, list) else []
        sizes = product.sizes if isinstance(product.sizes, list) else []
        if not colors or not sizes:
            continue

        stock_map: dict[tuple[str, str], int] = {}
        raw_stock = (
            product.variant_stock if isinstance(product.variant_stock, list) else []
        )
        for entry in raw_stock:
            if not isinstance(entry, dict):
                continue
            color = entry.get("color") or entry.get("Color")
            size = entry.get("size") or entry.get("Size")
            qty = (
                entry.get("stockQty")
                or entry.get("stock")
                or entry.get("stock_qty")
                or 0
            )
            if color and size:
                stock_map[(str(color), str(size))] = int(qty)

        color_objs: dict[str, object] = {}
        for i, name in enumerate(colors):
            color_objs[str(name)] = ProductColor.objects.create(
                product=product,
                name=str(name),
                sort_order=i,
                is_default=i == 0,
            )

        size_objs: dict[str, object] = {}
        for i, label in enumerate(sizes):
            size_objs[str(label)] = ProductSize.objects.create(
                product=product,
                label=str(label),
                sort_order=i,
            )

        variant_stock: list[dict] = []
        for color_name, color in color_objs.items():
            for size_label, size in size_objs.items():
                stock_qty = stock_map.get((color_name, size_label), 0)
                if not stock_map and product.in_stock:
                    stock_qty = 10
                sku = f"{product.slug}-{color.pk}-{size.pk}"
                ProductVariant.objects.create(
                    product=product,
                    color=color,
                    size=size,
                    sku=sku,
                    stock_qty=stock_qty,
                    is_active=True,
                )
                variant_stock.append(
                    {"color": color_name, "size": size_label, "stockQty": stock_qty}
                )

        Product.objects.filter(pk=product.pk).update(
            variant_stock=variant_stock,
            in_stock=any(v["stockQty"] > 0 for v in variant_stock),
        )


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="variant_stock",
            field=models.JSONField(default=list),
        ),
        migrations.CreateModel(
            name="ProductColor",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                ("hex_code", models.CharField(blank=True, max_length=7)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("is_default", models.BooleanField(default=False)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="product_colors",
                        to="products.product",
                    ),
                ),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.CreateModel(
            name="ProductSize",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("label", models.CharField(max_length=20)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="product_sizes",
                        to="products.product",
                    ),
                ),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.CreateModel(
            name="ProductVariant",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("sku", models.CharField(max_length=64, unique=True)),
                ("stock_qty", models.PositiveIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "color",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="variants",
                        to="products.productcolor",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="variants",
                        to="products.product",
                    ),
                ),
                (
                    "size",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="variants",
                        to="products.productsize",
                    ),
                ),
            ],
            options={
                "ordering": ["color__sort_order", "size__sort_order", "id"],
            },
        ),
        migrations.AddConstraint(
            model_name="productcolor",
            constraint=models.UniqueConstraint(
                fields=("product", "name"), name="unique_product_color_name"
            ),
        ),
        migrations.AddConstraint(
            model_name="productsize",
            constraint=models.UniqueConstraint(
                fields=("product", "label"), name="unique_product_size_label"
            ),
        ),
        migrations.AddConstraint(
            model_name="productvariant",
            constraint=models.UniqueConstraint(
                fields=("product", "color", "size"),
                name="unique_product_color_size_variant",
            ),
        ),
        migrations.RunPython(forwards_migrate_variants, migrations.RunPython.noop),
    ]
