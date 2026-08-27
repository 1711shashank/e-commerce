import django.db.models.deletion
from django.db import migrations, models


def assign_product_images_to_colors(apps, schema_editor):
    Product = apps.get_model("products", "Product")
    ProductColor = apps.get_model("products", "ProductColor")

    for product in Product.objects.all():
        images = product.images if isinstance(product.images, list) else []
        if not images:
            continue

        colors = ProductColor.objects.filter(product=product).order_by(
            "sort_order", "id"
        )
        if not colors.exists():
            continue

        default_color = colors.filter(is_default=True).first() or colors.first()
        for color in colors:
            if color.pk == default_color.pk:
                color.images = list(images)
            else:
                color.images = []
            color.save(update_fields=["images"])


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0002_product_variants"),
    ]

    operations = [
        migrations.AddField(
            model_name="productcolor",
            name="images",
            field=models.JSONField(default=list),
        ),
        migrations.RunPython(
            assign_product_images_to_colors, migrations.RunPython.noop
        ),
    ]
