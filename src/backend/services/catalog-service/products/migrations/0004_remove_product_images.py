from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("products", "0003_productcolor_images"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="product",
            name="images",
        ),
    ]
