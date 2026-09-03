import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    help = "Seed portal admin/staff users into the auth database"

    def handle(self, *args, **options):
        # Primary portal admin (requested credentials)
        admin_email = os.environ.get("ADMIN_EMAIL", "admin@gmail.com")
        admin_password = os.environ.get("ADMIN_PASSWORD", "admin")
        self._upsert_user(
            email=admin_email,
            password=admin_password,
            role=User.Role.ADMIN,
            is_superuser=True,
        )

        # Optional extra staff from env (skip if same as admin)
        staff_email = os.environ.get("STAFF_EMAIL", "").strip()
        staff_password = os.environ.get("STAFF_PASSWORD", "StaffPass123!")
        if staff_email and staff_email.lower() != admin_email.lower():
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
