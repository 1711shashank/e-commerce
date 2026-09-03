import hashlib
import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from .email_payload import dump_send_payload
from .models import EmailJob, EmailVerificationOTP
from .tasks import send_email_verification_otp

User = get_user_model()


class EmailVerificationError(Exception):
    def __init__(self, message: str, field: str = "non_field_errors"):
        self.message = message
        self.field = field
        super().__init__(message)


def _otp_lifetime() -> timedelta:
    minutes = int(getattr(settings, "AUTH_EMAIL_VERIFICATION_OTP_LIFETIME_MINUTES", 10))
    return timedelta(minutes=minutes)


def _otp_length() -> int:
    return int(getattr(settings, "AUTH_EMAIL_VERIFICATION_OTP_LENGTH", 6))


def _hash_otp(raw_otp: str) -> str:
    return hashlib.sha256(raw_otp.encode()).hexdigest()


def _generate_raw_otp() -> str:
    length = max(4, min(_otp_length(), 8))
    upper = 10**length
    return f"{secrets.randbelow(upper):0{length}d}"


@transaction.atomic
def create_email_verification_otp(user: User) -> tuple[EmailVerificationOTP, str]:
    now = timezone.now()
    EmailVerificationOTP.objects.filter(user=user, used_at__isnull=True).update(used_at=now)
    raw_otp = _generate_raw_otp()
    otp_obj = EmailVerificationOTP.objects.create(
        user=user,
        otp_hash=_hash_otp(raw_otp),
        expires_at=now + _otp_lifetime(),
    )
    return otp_obj, raw_otp


def enqueue_email_verification_otp(user: User, otp_obj: EmailVerificationOTP, raw_otp: str) -> EmailJob:
    job = EmailJob.objects.create(
        email_type=EmailJob.EmailType.EMAIL_VERIFICATION,
        recipient=user.email,
        user=user,
        email_verification_otp=otp_obj,
        status=EmailJob.Status.PENDING,
        send_payload=dump_send_payload({"otp": raw_otp}),
    )
    async_result = send_email_verification_otp.delay(str(job.id))
    if async_result.id:
        job.celery_task_id = async_result.id
        job.save(update_fields=["celery_task_id", "updated_at"])
    return job


def issue_and_send_verification_otp(user: User) -> None:
    otp_obj, raw_otp = create_email_verification_otp(user)
    enqueue_email_verification_otp(user, otp_obj, raw_otp)


def resend_verification_otp(email: str) -> None:
    normalized = User.objects.normalize_email(email.strip())
    user = User.objects.filter(email__iexact=normalized).first()
    if (
        not user
        or user.role != User.Role.CUSTOMER
        or user.email_verified
        or user.is_active
    ):
        return
    issue_and_send_verification_otp(user)


def _tokens_for_user(user: User) -> dict:
    from .serializers import UserSerializer

    refresh = RefreshToken.for_user(user)
    claims = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    }
    for key, value in claims.items():
        refresh[key] = value
        refresh.access_token[key] = value
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": UserSerializer(user).data,
    }


@transaction.atomic
def verify_email_otp(email: str, raw_otp: str) -> dict:
    normalized = User.objects.normalize_email(email.strip())
    otp = "".join(ch for ch in raw_otp.strip() if ch.isdigit())
    if not otp or len(otp) > 8:
        raise EmailVerificationError("Invalid verification code.", field="otp")

    user = (
        User.objects.select_for_update()
        .filter(email__iexact=normalized, role=User.Role.CUSTOMER)
        .first()
    )
    if not user:
        raise EmailVerificationError("Invalid verification code.", field="otp")

    if user.email_verified and user.is_active:
        return _tokens_for_user(user)

    otp_obj = (
        EmailVerificationOTP.objects.select_for_update()
        .filter(user=user, used_at__isnull=True)
        .order_by("-created_at")
        .first()
    )
    if not otp_obj or otp_obj.expires_at <= timezone.now():
        raise EmailVerificationError(
            "This verification code is invalid or has expired.",
            field="otp",
        )

    if otp_obj.failed_attempts >= EmailVerificationOTP.MAX_FAILED_ATTEMPTS:
        raise EmailVerificationError(
            "Too many invalid attempts. Request a new code.",
            field="otp",
        )

    if otp_obj.otp_hash != _hash_otp(otp):
        otp_obj.failed_attempts += 1
        otp_obj.save(update_fields=["failed_attempts"])
        raise EmailVerificationError(
            "This verification code is invalid or has expired.",
            field="otp",
        )

    now = timezone.now()
    otp_obj.used_at = now
    otp_obj.save(update_fields=["used_at"])

    EmailVerificationOTP.objects.filter(user=user, used_at__isnull=True).update(used_at=now)

    user.email_verified = True
    user.is_active = True
    user.save(update_fields=["email_verified", "is_active"])

    return _tokens_for_user(user)
