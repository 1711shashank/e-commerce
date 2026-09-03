from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken

from users.email_payload import load_send_payload
from users.models import EmailJob, User
from users.tasks import send_email_verification_otp, send_password_reset_email
from users.throttles import LoginThrottle, RegisterThrottle


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    AUTH_PASSWORD_RESET_URL="http://localhost:3000/reset-password",
)
class AuthFlowTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.register_url = reverse("auth-register")
        self.verify_url = reverse("auth-verify-email")
        self.login_url = reverse("auth-login")
        self.refresh_url = reverse("auth-refresh")
        self.change_password_url = reverse("auth-change-password")
        self.reset_request_url = reverse("auth-password-reset")
        self.reset_confirm_url = reverse("auth-password-reset-confirm")

    def _register(self, email="customer@example.com", password="StrongPass123!"):
        return self.client.post(
            self.register_url,
            {
                "email": email,
                "password": password,
                "first_name": "Ada",
                "last_name": "Lovelace",
            },
            format="json",
        )

    def _patch_otp_send(self):
        captured: dict[str, str] = {}

        def enqueue(job_id):
            job = EmailJob.objects.get(pk=job_id)
            captured["otp"] = load_send_payload(job.send_payload)["otp"]
            send_email_verification_otp(job_id)
            return type("R", (), {"id": "eager-task"})()

        return patch(
            "users.email_verification_services.send_email_verification_otp.delay",
            side_effect=enqueue,
        ), captured

    def _patch_reset_send(self):
        captured: dict[str, str] = {}

        def enqueue(job_id):
            job = EmailJob.objects.get(pk=job_id)
            captured["reset_url"] = load_send_payload(job.send_payload)["reset_url"]
            send_password_reset_email(job_id)
            return type("R", (), {"id": "eager-task"})()

        return patch(
            "users.password_reset_services.send_password_reset_email.delay",
            side_effect=enqueue,
        ), captured

    def test_register_verify_login_flow(self):
        patcher, captured = self._patch_otp_send()
        with patcher:
            response = self._register()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["email"], "customer@example.com")

        user = User.objects.get(email="customer@example.com")
        self.assertFalse(user.is_active)
        self.assertFalse(user.email_verified)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("verification code", mail.outbox[0].body.lower())

        verify = self.client.post(
            self.verify_url,
            {"email": user.email, "otp": captured["otp"]},
            format="json",
        )
        self.assertEqual(verify.status_code, status.HTTP_200_OK)
        self.assertIn("access", verify.data)
        self.assertIn("refresh", verify.data)

        user.refresh_from_db()
        self.assertTrue(user.is_active)
        self.assertTrue(user.email_verified)

        login = self.client.post(
            self.login_url,
            {"email": user.email, "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.assertEqual(login.data["user"]["email"], user.email)

    def test_login_blocked_for_unverified_customer(self):
        with patch(
            "users.email_verification_services.send_email_verification_otp.delay",
            return_value=type("R", (), {"id": None})(),
        ):
            self._register(email="pending@example.com")

        login = self.client.post(
            self.login_url,
            {"email": "pending@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_400_BAD_REQUEST)
        payload = login.data
        if isinstance(payload.get("code"), list):
            self.assertIn("email_not_verified", payload["code"])
        else:
            self.assertEqual(payload.get("code"), "email_not_verified")

    def test_register_rejects_weak_password(self):
        response = self._register(password="password")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    def test_password_reset_request_and_confirm(self):
        user = User.objects.create_user(
            email="reset@example.com",
            password="OldPass123!",
            role=User.Role.CUSTOMER,
            is_active=True,
            email_verified=True,
        )
        patcher, captured = self._patch_reset_send()
        with patcher:
            request = self.client.post(
                self.reset_request_url,
                {"email": user.email},
                format="json",
            )
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)

        token = captured["reset_url"].split("token=")[-1]
        confirm = self.client.post(
            self.reset_confirm_url,
            {"token": token, "new_password": "NewPass123!"},
            format="json",
        )
        self.assertEqual(confirm.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.check_password("NewPass123!"))

    def test_password_reset_unknown_email_is_enumeration_safe(self):
        response = self.client.post(
            self.reset_request_url,
            {"email": "nobody@example.com"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 0)

    def test_change_password_blacklists_refresh_tokens(self):
        user = User.objects.create_user(
            email="change@example.com",
            password="OldPass123!",
            role=User.Role.CUSTOMER,
            is_active=True,
            email_verified=True,
        )
        refresh = RefreshToken.for_user(user)
        old_refresh = str(refresh)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        response = self.client.post(
            self.change_password_url,
            {
                "current_password": "OldPass123!",
                "new_password": "BrandNewPass123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        outstanding = OutstandingToken.objects.filter(user_id=user.id)
        self.assertTrue(outstanding.exists())
        for token in outstanding:
            self.assertTrue(BlacklistedToken.objects.filter(token=token).exists())

        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": old_refresh},
            format="json",
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_throttle(self):
        User.objects.create_user(
            email="throttle@example.com",
            password="StrongPass123!",
            role=User.Role.CUSTOMER,
            is_active=True,
            email_verified=True,
        )
        with patch.object(LoginThrottle, "rate", "1/minute", create=True):
            first_login = self.client.post(
                self.login_url,
                {"email": "throttle@example.com", "password": "wrong"},
                format="json",
            )
            self.assertIn(
                first_login.status_code,
                (status.HTTP_401_UNAUTHORIZED, status.HTTP_400_BAD_REQUEST),
            )
            second_login = self.client.post(
                self.login_url,
                {"email": "throttle@example.com", "password": "wrong"},
                format="json",
            )
        self.assertEqual(second_login.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_register_throttle(self):
        with patch.object(RegisterThrottle, "rate", "1/hour", create=True):
            with patch(
                "users.email_verification_services.send_email_verification_otp.delay",
                return_value=type("R", (), {"id": None})(),
            ):
                first_register = self._register(email="one@example.com")
                self.assertEqual(first_register.status_code, status.HTTP_201_CREATED)
                second_register = self._register(email="two@example.com")
        self.assertEqual(second_register.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_celery_task_args_do_not_include_otp(self):
        with patch(
            "users.email_verification_services.send_email_verification_otp.delay",
            return_value=type("R", (), {"id": "task-1"})(),
        ) as mock_delay:
            self._register(email="secure@example.com")
            mock_delay.assert_called_once()
            args = mock_delay.call_args.args
            self.assertEqual(len(args), 1)
            job = EmailJob.objects.get(pk=args[0])
            self.assertTrue(job.send_payload)
