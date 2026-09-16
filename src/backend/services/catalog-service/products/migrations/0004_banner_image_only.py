from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0003_banner_image_charfield"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="banner",
            name="cta_label",
        ),
        migrations.RemoveField(
            model_name="banner",
            name="eyebrow",
        ),
        migrations.RemoveField(
            model_name="banner",
            name="image_alt",
        ),
        migrations.RemoveField(
            model_name="banner",
            name="is_active",
        ),
        migrations.RemoveField(
            model_name="banner",
            name="subtitle",
        ),
        migrations.RemoveField(
            model_name="banner",
            name="text_color",
        ),
        migrations.RemoveField(
            model_name="banner",
            name="title",
        ),
    ]
