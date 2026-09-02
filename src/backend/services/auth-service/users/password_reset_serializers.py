from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .password_reset_services import (
    confirm_password_reset,
    get_valid_reset_token,
    record_failed_reset_attempt,
    request_password_reset,
)

User = get_user_model()


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)

    def validate_email(self, value):
        return User.objects.normalize_email(value.strip())

    def save(self, **kwargs):
        return request_password_reset(self.validated_data["email"])


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=128, trim_whitespace=True)
    new_password = serializers.CharField(write_only=True, min_length=8, max_length=128)

    def validate_new_password(self, value):
        return value

    def save(self, **kwargs):
        token = self.validated_data["token"]
        new_password = self.validated_data["new_password"]
        try:
            confirm_password_reset(token, new_password)
        except ValueError as exc:
            code = str(exc)
            if code == "same_password":
                raise serializers.ValidationError(
                    {"new_password": "New password must be different from the current password."}
                ) from exc
            raise serializers.ValidationError(
                {"token": "This reset link is invalid or has expired."}
            ) from exc
        return None

    def validate(self, attrs):
        token = attrs.get("token", "").strip()
        reset_token = get_valid_reset_token(token)
        if reset_token is None:
            record_failed_reset_attempt(token)
            raise serializers.ValidationError(
                {"token": "This reset link is invalid or has expired."}
            )

        new_password = attrs.get("new_password")
        if new_password:
            if reset_token.user.check_password(new_password):
                raise serializers.ValidationError(
                    {
                        "new_password": "New password must be different from the current password."
                    }
                )
            try:
                validate_password(new_password, reset_token.user)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(
                    {"new_password": list(exc.messages)}
                ) from exc
        return attrs
