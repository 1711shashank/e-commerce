from django.contrib.auth import get_user_model
from rest_framework import serializers

from .password_reset_services import (
    PasswordResetError,
    confirm_password_reset,
    get_valid_reset_token,
    request_password_reset,
)

User = get_user_model()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self, **kwargs):
        request_password_reset(self.validated_data["email"])


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=64)
    new_password = serializers.CharField(write_only=True, min_length=8, max_length=128)

    def validate_token(self, value):
        if not get_valid_reset_token(value):
            raise serializers.ValidationError(
                "This reset link is invalid or has expired."
            )
        return value.strip()

    def save(self, **kwargs):
        try:
            confirm_password_reset(
                self.validated_data["token"],
                self.validated_data["new_password"],
            )
        except PasswordResetError as exc:
            raise serializers.ValidationError({exc.field: exc.message}) from exc
