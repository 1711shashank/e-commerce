import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Category",
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
                ("name", models.CharField(max_length=120)),
                ("slug", models.SlugField(unique=True)),
                ("image", models.URLField(blank=True)),
                ("description", models.TextField(blank=True)),
            ],
            options={
                "verbose_name_plural": "categories",
                "ordering": ["name"],
            },
        ),
        migrations.CreateModel(
            name="Product",
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
                ("name", models.CharField(max_length=255)),
                ("slug", models.SlugField(max_length=255, unique=True)),
                ("category", models.CharField(max_length=64)),
                ("sub_category", models.CharField(blank=True, max_length=64)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "discount_price",
                    models.DecimalField(
                        blank=True, decimal_places=2, max_digits=10, null=True
                    ),
                ),
                ("images", models.JSONField(default=list)),
                ("sizes", models.JSONField(default=list)),
                ("colors", models.JSONField(default=list)),
                ("fabric", models.CharField(blank=True, max_length=64)),
                ("description", models.TextField()),
                ("is_new", models.BooleanField(default=True)),
                ("is_on_sale", models.BooleanField(default=False)),
                ("in_stock", models.BooleanField(default=True)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "rating",
                    models.FloatField(blank=True, default=5.0, null=True),
                ),
                ("tags", models.JSONField(default=list)),
                ("created_by", models.CharField(blank=True, max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddField(
            model_name="category",
            name="parent",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="children",
                to="products.category",
            ),
        ),
    ]
