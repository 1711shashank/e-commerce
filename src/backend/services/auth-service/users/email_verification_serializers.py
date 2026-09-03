from rest_framework import serializers

from .email_verification_services import (
    EmailVerificationError,
    resend_verification_otp,
    verify_email_otp,
)


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=8, min_length=4)

    def save(self, **kwargs):
        try:
            return verify_email_otp(
                self.validated_data["email"],
                self.validated_data["otp"],
            )
        except EmailVerificationError as exc:
            raise serializers.ValidationError({exc.field: exc.message}) from exc


class ResendVerificationOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self, **kwargs):
        resend_verification_otp(self.validated_data["email"])
