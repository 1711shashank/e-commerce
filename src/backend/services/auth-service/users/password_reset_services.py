import hashlib
import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from .models import EmailJob, PasswordResetToken
from .tasks import send_password_reset_email

User = get_user_model()


class PasswordResetError(Exception):
    def __init__(self, message: str, field: str = "non_field_errors"):
        self.message = message
        self.field = field
        super().__init__(message)


def _token_lifetime() -> timedelta:
    minutes = int(getattr(settings, "AUTH_PASSWORD_RESET_TOKEN_LIFETIME_MINUTES", 30))
    return timedelta(minutes=minutes)


def build_reset_url(token: str) -> str:
    base = settings.AUTH_PASSWORD_RESET_URL.rstrip("/")
    return f"{base}?token={token}"


def _hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode()).hexdigest()


def request_password_reset(email: str) -> None:
    normalized = User.objects.normalize_email(email.strip())
    user = User.objects.filter(email__iexact=normalized).first()
    if not user or not user.is_active or user.role != User.Role.CUSTOMER:
        return

    token_obj, raw_token = _create_password_reset_token(user)
    _enqueue_password_reset_email(user, token_obj, build_reset_url(raw_token))


def _enqueue_password_reset_email(
    user: User,
    token_obj: PasswordResetToken,
    reset_url: str,
) -> EmailJob:
    job = EmailJob.objects.create(
        email_type=EmailJob.EmailType.PASSWORD_RESET,
        recipient=user.email,
        user=user,
        password_reset_token=token_obj,
        status=EmailJob.Status.PENDING,
    )
    async_result = send_password_reset_email.delay(str(job.id), user.email, reset_url)
    if async_result.id:
        job.celery_task_id = async_result.id
        job.save(update_fields=["celery_task_id", "updated_at"])
    return job


@transaction.atomic
def _create_password_reset_token(user: User) -> tuple[PasswordResetToken, str]:
    now = timezone.now()
    PasswordResetToken.objects.filter(user=user, used_at__isnull=True).update(used_at=now)
    raw_token = secrets.token_urlsafe(32)
    token_obj = PasswordResetToken.objects.create(
        user=user,
        token_hash=_hash_token(raw_token),
        expires_at=now + _token_lifetime(),
    )
    return token_obj, raw_token


def get_valid_reset_token(raw_token: str) -> PasswordResetToken | None:
    token = raw_token.strip()
    if not token or len(token) > 128:
        return None
    token_hash = _hash_token(token)
    token_obj = (
        PasswordResetToken.objects.select_related("user")
        .filter(token_hash=token_hash, used_at__isnull=True)
        .first()
    )
    if not token_obj:
        return None
    if token_obj.expires_at <= timezone.now():
        return None
    user = token_obj.user
    if not user.is_active or user.role != User.Role.CUSTOMER:
        return None
    return token_obj


@transaction.atomic
def confirm_password_reset(raw_token: str, new_password: str) -> None:
    token = raw_token.strip()
    token_hash = _hash_token(token)
    token_obj = (
        PasswordResetToken.objects.select_for_update()
        .select_related("user")
        .filter(token_hash=token_hash, used_at__isnull=True)
        .first()
    )
    if not token_obj or token_obj.expires_at <= timezone.now():
        raise PasswordResetError(
            "This reset link is invalid or has expired.",
            field="token",
        )

    user = token_obj.user
    if not user.is_active or user.role != User.Role.CUSTOMER:
        raise PasswordResetError(
            "This reset link is invalid or has expired.",
            field="token",
        )

    if user.check_password(new_password):
        raise PasswordResetError(
            "New password must be different from the current password.",
            field="new_password",
        )

    try:
        validate_password(new_password, user)
    except DjangoValidationError as exc:
        raise PasswordResetError(exc.messages[0], field="new_password") from exc

    user.set_password(new_password)
    user.save(update_fields=["password"])

    token_obj.used_at = timezone.now()
    token_obj.save(update_fields=["used_at"])

    _blacklist_user_refresh_tokens(user)


def _blacklist_user_refresh_tokens(user: User) -> None:
    for outstanding in OutstandingToken.objects.filter(user_id=user.id):
        BlacklistedToken.objects.get_or_create(token=outstanding)
