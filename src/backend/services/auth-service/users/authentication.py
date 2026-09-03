from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from .token_utils import TOKEN_VERSION_CLAIM


class VersionedJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user = super().get_user(validated_token)
        token_version = validated_token.get(TOKEN_VERSION_CLAIM, 0)
        try:
            token_version = int(token_version)
        except (TypeError, ValueError) as exc:
            raise InvalidToken("Token has been revoked.") from exc
        if token_version != int(user.token_version or 0):
            raise InvalidToken("Token has been revoked.")
        return user
