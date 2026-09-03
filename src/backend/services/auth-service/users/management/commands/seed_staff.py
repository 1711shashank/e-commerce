import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()

WEAK_PASSWORDS = {"", "admin", "password", "Password1", "12345678"}


class Command(BaseCommand):
    help = "Seed portal admin/staff users into the auth database"

    def handle(self, *args, **options):
        admin_email = os.environ.get("ADMIN_EMAIL", "").strip()
        admin_password = os.environ.get("ADMIN_PASSWORD", "")
        if not admin_email or not admin_password:
            raise CommandError(
                "ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed portal users."
            )
        if admin_password in WEAK_PASSWORDS or len(admin_password) < 10:
            raise CommandError(
                "ADMIN_PASSWORD is too weak. Use at least 10 characters and avoid common defaults."
            )

        self._upsert_user(
            email=admin_email,
            password=admin_password,
            role=User.Role.ADMIN,
            is_superuser=True,
        )

        staff_email = os.environ.get("STAFF_EMAIL", "").strip()
        staff_password = os.environ.get("STAFF_PASSWORD", "")
        if staff_email and staff_email.lower() != admin_email.lower():
            if not staff_password or staff_password in WEAK_PASSWORDS or len(staff_password) < 10:
                raise CommandError(
                    "STAFF_PASSWORD must be set to a strong value when STAFF_EMAIL is provided."
                )
            self._upsert_user(
                email=staff_email,
                password=staff_password,
                role=User.Role.STAFF,
                is_superuser=False,
            )

    def _upsert_user(
        self,
        *,
        email: str,
        password: str,
        role: str,
        is_superuser: bool,
    ) -> None:
        email = User.objects.normalize_email(email)
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "role": role,
                "is_staff": True,
                "is_superuser": is_superuser,
                "is_active": True,
                "email_verified": True,
            },
        )
        user.role = role
        user.is_staff = True
        user.is_superuser = is_superuser
        user.is_active = True
        user.email_verified = True
        user.set_password(password)
        user.save()
        action = "Created" if created else "Updated"
        self.stdout.write(
            self.style.SUCCESS(f"{action} {role} user {email}")
        )
