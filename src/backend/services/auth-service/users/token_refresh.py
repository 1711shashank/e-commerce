from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .token_utils import TOKEN_VERSION_CLAIM, apply_token_claims

User = get_user_model()


class ClaimAwareTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = RefreshToken(attrs["refresh"])
        user_id = refresh.get(api_settings.USER_ID_CLAIM)
        try:
            user = User.objects.get(**{api_settings.USER_ID_FIELD: user_id})
        except User.DoesNotExist as exc:
            raise InvalidToken("Token has been revoked.") from exc

        try:
            token_version = int(refresh.get(TOKEN_VERSION_CLAIM, 0))
        except (TypeError, ValueError) as exc:
            raise InvalidToken("Token has been revoked.") from exc
        if token_version != int(user.token_version or 0):
            raise InvalidToken("Token has been revoked.")

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    refresh.blacklist()
                except AttributeError:
                    pass
            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()
            apply_token_claims(refresh, user)
            return {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }

        apply_token_claims(refresh, user)
        return {"access": str(refresh.access_token)}
