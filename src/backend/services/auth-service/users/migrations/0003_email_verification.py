import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


def mark_existing_users_verified(apps, schema_editor):
    User = apps.get_model("users", "User")
    User.objects.filter(is_active=True).update(email_verified=True)


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0002_alter_user_groups"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="email_verified",
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(mark_existing_users_verified, migrations.RunPython.noop),
        migrations.CreateModel(
            name="EmailVerificationOTP",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("otp_hash", models.CharField(db_index=True, max_length=64)),
                ("expires_at", models.DateTimeField()),
                ("used_at", models.DateTimeField(blank=True, null=True)),
                ("failed_attempts", models.PositiveSmallIntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="email_verification_otps",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddField(
            model_name="emailjob",
            name="email_verification_otp",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="email_jobs",
                to="users.emailverificationotp",
            ),
        ),
        migrations.AlterField(
            model_name="emailjob",
            name="email_type",
            field=models.CharField(
                choices=[
                    ("password_reset", "Password reset"),
                    ("email_verification", "Email verification"),
                ],
                max_length=32,
            ),
        ),
    ]
