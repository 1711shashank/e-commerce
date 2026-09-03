from django.urls import path

from .address_views import AddressDetailView, AddressListCreateView, AddressSetDefaultView
from .email_verification_views import ResendVerificationOTPView, VerifyEmailView
from .password_reset_views import PasswordResetConfirmView, PasswordResetRequestView
from .views import ChangePasswordView, LoginView, LogoutView, MeView, RefreshView, RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("verify-email/", VerifyEmailView.as_view(), name="auth-verify-email"),
    path(
        "resend-verification-otp/",
        ResendVerificationOTPView.as_view(),
        name="auth-resend-verification-otp",
    ),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("token/refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("me/password/", ChangePasswordView.as_view(), name="auth-change-password"),
    path("password-reset/", PasswordResetRequestView.as_view(), name="auth-password-reset"),
    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="auth-password-reset-confirm",
    ),
    path("addresses/", AddressListCreateView.as_view(), name="auth-address-list"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="auth-address-detail"),
    path(
        "addresses/<int:pk>/set-default/",
        AddressSetDefaultView.as_view(),
        name="auth-address-set-default",
    ),
]
