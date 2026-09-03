from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .email_verification_serializers import (
    ResendVerificationOTPSerializer,
    VerifyEmailSerializer,
)

VERIFY_EMAIL_RESEND_MESSAGE = (
    "If that email needs verification, a new code has been sent."
)


class VerifyEmailThrottle(AnonRateThrottle):
    scope = "email_verification_verify"


class ResendVerificationOTPThrottle(AnonRateThrottle):
    scope = "email_verification_resend"


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [VerifyEmailThrottle]

    def post(self, request):
        serializer = VerifyEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class ResendVerificationOTPView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ResendVerificationOTPThrottle]

    def post(self, request):
        serializer = ResendVerificationOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": VERIFY_EMAIL_RESEND_MESSAGE}, status=status.HTTP_200_OK)
