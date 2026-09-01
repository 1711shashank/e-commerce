from django.db import migrations, models


def seed_banners(apps, schema_editor):
    Banner = apps.get_model("products", "Banner")
    if Banner.objects.exists():
        return
    Banner.objects.bulk_create(
        [
            Banner(
                eyebrow="Aurelia Collection",
                title="Spring Lawn Collection",
                subtitle="Light fabrics, bold prints — new season arrivals",
                cta_label="Shop New Arrivals",
                cta_href="/collections/women",
                image="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
                sort_order=0,
                is_active=True,
                text_color="light",
            ),
            Banner(
                eyebrow="Aurelia Collection",
                title="Mid-Season Sale",
                subtitle="Up to 40% off selected ready-to-wear",
                cta_label="Shop Sale",
                cta_href="/collections/sale",
                image="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1600&q=80",
                sort_order=1,
                is_active=True,
                text_color="light",
            ),
            Banner(
                eyebrow="Aurelia Collection",
                title="Menswear Essentials",
                subtitle="Tailored shirts and everyday kurtas",
                cta_label="Explore Men",
                cta_href="/collections/men",
                image="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1600&q=80",
                sort_order=2,
                is_active=True,
                text_color="light",
            ),
        ]
    )


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0004_remove_product_images"),
    ]

    operations = [
        migrations.CreateModel(
            name="Banner",
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
                ("eyebrow", models.CharField(blank=True, max_length=60)),
                ("title", models.CharField(max_length=80)),
                ("subtitle", models.CharField(max_length=160)),
                ("cta_label", models.CharField(max_length=40)),
                ("cta_href", models.CharField(max_length=500)),
                ("image", models.URLField()),
                ("image_alt", models.CharField(blank=True, max_length=200)),
                ("sort_order", models.PositiveSmallIntegerField(default=0)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "text_color",
                    models.CharField(
                        choices=[("light", "Light"), ("dark", "Dark")],
                        default="light",
                        max_length=8,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["sort_order", "id"],
            },
        ),
        migrations.RunPython(seed_banners, migrations.RunPython.noop),
    ]
