from django.conf import settings
from rest_framework import authentication, exceptions
from ecommerce_shared.jwt_utils import TokenValidationError, validate_token


class JWTUser:
    def __init__(self, claims: dict):
        self.claims = claims
        self.id = claims.get("sub") or claims.get("user_id")
        self.email = claims.get("email", "")
        self.role = claims.get("role", "customer")
        self.is_authenticated = True

    @property
    def is_staff_user(self) -> bool:
        return self.role in ("staff", "admin")


class JWTAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        header = authentication.get_authorization_header(request).decode("utf-8")
        if not header:
            return None
        parts = header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            return None
        token = parts[1]
        try:
            claims = validate_token(
                token,
                secret=settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
            )
        except TokenValidationError as exc:
            raise exceptions.AuthenticationFailed(str(exc)) from exc
        return (JWTUser(claims), token)
