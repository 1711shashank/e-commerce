import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    help = "Seed a Django admin superuser for the catalog Jazzmin dashboard"

    def handle(self, *args, **options):
        email = os.environ.get("ADMIN_EMAIL", "admin@gmail.com")
        password = os.environ.get("ADMIN_PASSWORD", "admin")
        username = os.environ.get("ADMIN_USERNAME", "admin")

        # Default User model uses username; create/update for Jazzmin login
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save()
        action = "Created" if created else "Updated"
        self.stdout.write(
            self.style.SUCCESS(
                f"{action} catalog admin user '{username}' ({email})"
            )
        )
