from rest_framework.throttling import AnonRateThrottle


class LoginThrottle(AnonRateThrottle):
    scope = "login"


class RegisterThrottle(AnonRateThrottle):
    scope = "register"


class PasswordResetRequestThrottle(AnonRateThrottle):
    scope = "password_reset_request"


class PasswordResetConfirmThrottle(AnonRateThrottle):
    scope = "password_reset_confirm"


class VerifyEmailThrottle(AnonRateThrottle):
    scope = "email_verification_verify"


class ResendVerificationOTPThrottle(AnonRateThrottle):
    scope = "email_verification_resend"


class TokenRefreshThrottle(AnonRateThrottle):
    scope = "token_refresh"
