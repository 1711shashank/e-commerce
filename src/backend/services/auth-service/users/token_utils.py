from django.contrib.auth import get_user_model
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

TOKEN_VERSION_CLAIM = "tv"


def blacklist_user_refresh_tokens(user: User) -> None:
    for outstanding in OutstandingToken.objects.filter(user_id=user.id):
        BlacklistedToken.objects.get_or_create(token=outstanding)


def bump_token_version(user: User) -> None:
    user.token_version = int(user.token_version or 0) + 1
    user.save(update_fields=["token_version"])
    blacklist_user_refresh_tokens(user)


def apply_token_claims(token: RefreshToken, user: User) -> None:
    claims = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        TOKEN_VERSION_CLAIM: int(user.token_version or 0),
    }
    for key, value in claims.items():
        token[key] = value
        token.access_token[key] = value


def build_tokens_for_user(user: User) -> dict:
    from .serializers import UserSerializer

    refresh = RefreshToken.for_user(user)
    apply_token_claims(refresh, user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "user": UserSerializer(user).data,
    }
