import hashlib
import logging
import secrets

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db import transaction
from django.utils import timezone

from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)

from .models import PasswordResetToken

User = get_user_model()
logger = logging.getLogger(__name__)

GENERIC_RESET_MESSAGE = (
    "If an account exists with that email, a reset link has been sent."
)


def hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()


def normalize_reset_email(email: str) -> str:
    return User.objects.normalize_email(email.strip())


def _reset_lifetime_minutes() -> int:
    return int(getattr(settings, "PASSWORD_RESET_TOKEN_LIFETIME_MINUTES", 30))


def _reset_base_url() -> str:
    return getattr(settings, "PASSWORD_RESET_URL", "http://localhost:3000/reset-password").rstrip("/")


def blacklist_user_refresh_tokens(user) -> None:
    for outstanding in OutstandingToken.objects.filter(user_id=user.id):
        BlacklistedToken.objects.get_or_create(token=outstanding)


def invalidate_unused_tokens(user) -> None:
    now = timezone.now()
    PasswordResetToken.objects.filter(
        user=user,
        used_at__isnull=True,
        expires_at__gt=now,
    ).update(used_at=now)


def create_reset_token(user) -> str:
    invalidate_unused_tokens(user)
    raw_token = secrets.token_urlsafe(32)
    PasswordResetToken.objects.create(
        user=user,
        token_hash=hash_token(raw_token),
        expires_at=timezone.now() + timezone.timedelta(minutes=_reset_lifetime_minutes()),
    )
    return raw_token


def send_password_reset_email(user, raw_token: str) -> None:
    reset_url = f"{_reset_base_url()}?token={raw_token}"
    lifetime = _reset_lifetime_minutes()
    subject = "Reset your Aurelia password"
    message = (
        f"Hi,\n\n"
        f"We received a request to reset the password for your Aurelia account.\n\n"
        f"Reset your password:\n{reset_url}\n\n"
        f"This link expires in {lifetime} minutes and can only be used once.\n\n"
        f"If you did not request this, you can ignore this email.\n"
    )
    from_email = settings.DEFAULT_FROM_EMAIL
    try:
        send_mail(subject, message, from_email, [user.email], fail_silently=False)
    except Exception:
        logger.exception("Failed to send password reset email for user_id=%s", user.id)
        raise


def request_password_reset(email: str) -> str:
    normalized = normalize_reset_email(email)
    user = User.objects.filter(email__iexact=normalized).first()
    if (
        user is None
        or not user.is_active
        or user.role != User.Role.CUSTOMER
    ):
        return GENERIC_RESET_MESSAGE

    raw_token = create_reset_token(user)
    try:
        send_password_reset_email(user, raw_token)
    except Exception:
        PasswordResetToken.objects.filter(
            user=user,
            token_hash=hash_token(raw_token),
            used_at__isnull=True,
        ).update(used_at=timezone.now())
    return GENERIC_RESET_MESSAGE


def get_valid_reset_token(raw_token: str) -> PasswordResetToken | None:
    if not raw_token or len(raw_token) > 128:
        return None
    token_hash = hash_token(raw_token.strip())
    now = timezone.now()
    return (
        PasswordResetToken.objects.select_related("user")
        .filter(
            token_hash=token_hash,
            used_at__isnull=True,
            expires_at__gt=now,
            failed_attempts__lt=PasswordResetToken.MAX_FAILED_ATTEMPTS,
        )
        .first()
    )


def record_failed_reset_attempt(raw_token: str) -> None:
    if not raw_token:
        return
    token_hash = hash_token(raw_token.strip())
    token = PasswordResetToken.objects.filter(
        token_hash=token_hash,
        used_at__isnull=True,
    ).first()
    if token is None:
        return
    token.failed_attempts += 1
    token.save(update_fields=["failed_attempts"])


@transaction.atomic
def confirm_password_reset(raw_token: str, new_password: str) -> None:
    reset_token = get_valid_reset_token(raw_token)
    if reset_token is None:
        record_failed_reset_attempt(raw_token)
        raise ValueError("invalid_token")

    user = reset_token.user
    if not user.is_active or user.role != User.Role.CUSTOMER:
        record_failed_reset_attempt(raw_token)
        raise ValueError("invalid_token")

    if user.check_password(new_password):
        raise ValueError("same_password")

    user.set_password(new_password)
    user.save(update_fields=["password"])

    now = timezone.now()
    updated = PasswordResetToken.objects.filter(
        pk=reset_token.pk,
        used_at__isnull=True,
    ).update(used_at=now)
    if updated == 0:
        raise ValueError("invalid_token")

    invalidate_unused_tokens(user)
    blacklist_user_refresh_tokens(user)
