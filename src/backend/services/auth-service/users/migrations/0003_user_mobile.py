from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_address"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="mobile",
            field=models.CharField(blank=True, default="", max_length=20),
        ),
    ]
