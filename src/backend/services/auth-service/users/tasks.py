import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone

from .email_payload import load_send_payload
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
    # Drop send secrets once the job can no longer succeed, or always clear on
    # terminal DEAD so OTP/reset URLs do not linger in the database.
    clear_payload = attempt >= EMAIL_MAX_RETRIES
    if clear_payload:
        job.send_payload = ""
    if attempt >= EMAIL_MAX_RETRIES:
        job.status = EmailJob.Status.DEAD
    else:
        job.status = EmailJob.Status.FAILED
    fields = ["status", "last_error", "updated_at"]
    if clear_payload:
        fields.append("send_payload")
    job.save(update_fields=fields)


def _mark_job_sent(job: EmailJob | None) -> None:
    if not job:
        return
    job.status = EmailJob.Status.SENT
    job.sent_at = timezone.now()
    job.last_error = ""
    job.send_payload = ""
    job.save(update_fields=["status", "sent_at", "last_error", "send_payload", "updated_at"])


def _send_templated_email(
    *,
    subject: str,
    template_base: str,
    context: dict,
    recipient: str,
) -> None:
    text_body = render_to_string(f"{template_base}.txt", context)
    html_body = render_to_string(f"{template_base}.html", context)
    message = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
    )
    message.attach_alternative(html_body, "text/html")
    message.send(fail_silently=False)


@shared_task(bind=True, max_retries=3, default_retry_delay=EMAIL_RETRY_DELAY_SECONDS)
def send_password_reset_email(self, job_id: str) -> None:
    """Send password reset link. Retries up to 3 times on transient failures."""
    job = EmailJob.objects.filter(pk=job_id).first()
    attempt = self.request.retries + 1
    _mark_job_processing(job, attempt)

    if not job or not job.send_payload:
        logger.error("Password reset email job missing payload (job_id=%s)", job_id)
        if job:
            _mark_job_failed(job, EMAIL_MAX_RETRIES, ValueError("Missing send payload"))
        return

    try:
        payload = load_send_payload(job.send_payload)
        reset_url = payload["reset_url"]
        lifetime = getattr(settings, "AUTH_PASSWORD_RESET_TOKEN_LIFETIME_MINUTES", 30)
        _send_templated_email(
            subject="Reset your Aurelia password",
            template_base="users/emails/password_reset",
            context={"reset_url": reset_url, "lifetime_minutes": lifetime},
            recipient=job.recipient,
        )
    except Exception as exc:
        logger.warning(
            "Password reset email failed for %s (attempt %s/%s): %s",
            job.recipient if job else "unknown",
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
        job.recipient,
        job_id,
        attempt,
    )


@shared_task(bind=True, max_retries=3, default_retry_delay=EMAIL_RETRY_DELAY_SECONDS)
def send_email_verification_otp(self, job_id: str) -> None:
    """Send signup email verification OTP. Retries up to 3 times on transient failures."""
    job = EmailJob.objects.filter(pk=job_id).first()
    attempt = self.request.retries + 1
    _mark_job_processing(job, attempt)

    if not job or not job.send_payload:
        logger.error("Email verification job missing payload (job_id=%s)", job_id)
        if job:
            _mark_job_failed(job, EMAIL_MAX_RETRIES, ValueError("Missing send payload"))
        return

    try:
        payload = load_send_payload(job.send_payload)
        otp = payload["otp"]
        lifetime = getattr(settings, "AUTH_EMAIL_VERIFICATION_OTP_LIFETIME_MINUTES", 10)
        _send_templated_email(
            subject="Verify your Aurelia email",
            template_base="users/emails/email_verification",
            context={"otp": otp, "lifetime_minutes": lifetime},
            recipient=job.recipient,
        )
    except Exception as exc:
        logger.warning(
            "Email verification OTP failed for %s (attempt %s/%s): %s",
            job.recipient if job else "unknown",
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
        job.recipient,
        job_id,
        attempt,
    )
