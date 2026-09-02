import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import EmailJob

logger = logging.getLogger(__name__)

PASSWORD_RESET_EMAIL_MAX_RETRIES = 3
PASSWORD_RESET_EMAIL_RETRY_DELAY_SECONDS = 60


@shared_task(bind=True, max_retries=3, default_retry_delay=PASSWORD_RESET_EMAIL_RETRY_DELAY_SECONDS)
def send_password_reset_email(self, job_id: int, user_email: str, reset_url: str) -> None:
    """Send password reset link. Retries up to 3 times on transient failures."""
    job = EmailJob.objects.filter(pk=job_id).first()
    attempt = self.request.retries + 1

    if job:
        job.status = EmailJob.Status.PROCESSING
        job.attempts = attempt
        job.save(update_fields=["status", "attempts", "updated_at"])

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
            PASSWORD_RESET_EMAIL_MAX_RETRIES,
            exc,
        )
        if job:
            job.last_error = str(exc)[:2000]
            if attempt >= PASSWORD_RESET_EMAIL_MAX_RETRIES:
                job.status = EmailJob.Status.DEAD
            else:
                job.status = EmailJob.Status.FAILED
            job.save(update_fields=["status", "last_error", "updated_at"])
        raise self.retry(exc=exc) from exc

    if job:
        job.status = EmailJob.Status.SENT
        job.sent_at = timezone.now()
        job.last_error = ""
        job.save(update_fields=["status", "sent_at", "last_error", "updated_at"])
