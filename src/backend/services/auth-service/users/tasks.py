import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import EmailJob

logger = logging.getLogger(__name__)

EMAIL_MAX_RETRIES = 3
EMAIL_RETRY_DELAY_SECONDS = 60


def _mark_job_processing(job: EmailJob | None, attempt: int) -> None:
    if not job:
        return
    job.status = EmailJob.Status.PROCESSING
    job.attempts = attempt
    job.save(update_fields=["status", "attempts", "updated_at"])


def _mark_job_failed(job: EmailJob | None, attempt: int, exc: Exception) -> None:
    if not job:
        return
    job.last_error = str(exc)[:2000]
    if attempt >= EMAIL_MAX_RETRIES:
        job.status = EmailJob.Status.DEAD
    else:
        job.status = EmailJob.Status.FAILED
    job.save(update_fields=["status", "last_error", "updated_at"])


def _mark_job_sent(job: EmailJob | None) -> None:
    if not job:
        return
    job.status = EmailJob.Status.SENT
    job.sent_at = timezone.now()
    job.last_error = ""
    job.save(update_fields=["status", "sent_at", "last_error", "updated_at"])


@shared_task(bind=True, max_retries=3, default_retry_delay=EMAIL_RETRY_DELAY_SECONDS)
def send_password_reset_email(self, job_id: str, user_email: str, reset_url: str) -> None:
    """Send password reset link. Retries up to 3 times on transient failures."""
    job = EmailJob.objects.filter(pk=job_id).first()
    attempt = self.request.retries + 1
    _mark_job_processing(job, attempt)

    lifetime = getattr(settings, "AUTH_PASSWORD_RESET_TOKEN_LIFETIME_MINUTES", 30)
    try:
        send_mail(
            subject="Reset your Aurelia password",
            message=(
                "We received a request to reset your password.\n\n"
                f"Reset your password: {reset_url}\n\n"
                f"This link expires in {lifetime} minutes. If you did not request this, "
                "you can ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.warning(
            "Password reset email failed for %s (attempt %s/%s): %s",
            user_email,
            attempt,
            EMAIL_MAX_RETRIES,
            exc,
        )
        _mark_job_failed(job, attempt, exc)
        raise self.retry(exc=exc) from exc

    _mark_job_sent(job)
    logger.info(
        "Password reset email sent successfully via %s to %s (job_id=%s, attempt=%s)",
        settings.EMAIL_BACKEND,
        user_email,
        job_id,
        attempt,
    )


@shared_task(bind=True, max_retries=3, default_retry_delay=EMAIL_RETRY_DELAY_SECONDS)
def send_email_verification_otp(self, job_id: str, user_email: str, otp: str) -> None:
    """Send signup email verification OTP. Retries up to 3 times on transient failures."""
    job = EmailJob.objects.filter(pk=job_id).first()
    attempt = self.request.retries + 1
    _mark_job_processing(job, attempt)

    lifetime = getattr(settings, "AUTH_EMAIL_VERIFICATION_OTP_LIFETIME_MINUTES", 10)
    try:
        send_mail(
            subject="Verify your Aurelia email",
            message=(
                "Welcome to Aurelia.\n\n"
                f"Your verification code is: {otp}\n\n"
                f"This code expires in {lifetime} minutes. If you did not create an account, "
                "you can ignore this email."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.warning(
            "Email verification OTP failed for %s (attempt %s/%s): %s",
            user_email,
            attempt,
            EMAIL_MAX_RETRIES,
            exc,
        )
        _mark_job_failed(job, attempt, exc)
        raise self.retry(exc=exc) from exc

    _mark_job_sent(job)
    logger.info(
        "Email verification OTP sent successfully via %s to %s (job_id=%s, attempt=%s)",
        settings.EMAIL_BACKEND,
        user_email,
        job_id,
        attempt,
    )
