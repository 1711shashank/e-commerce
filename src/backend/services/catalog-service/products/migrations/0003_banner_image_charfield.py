from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0002_banner_image_url_length"),
    ]

    operations = [
        migrations.AlterField(
            model_name="banner",
            name="image",
            field=models.CharField(max_length=2048),
        ),
    ]
