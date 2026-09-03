from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0003_email_verification"),
    ]

    operations = [
        migrations.AddField(
            model_name="emailjob",
            name="send_payload",
            field=models.TextField(blank=True, default=""),
        ),
    ]
