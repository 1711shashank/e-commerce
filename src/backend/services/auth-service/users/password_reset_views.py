from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .password_reset_serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
)
from .throttles import PasswordResetConfirmThrottle, PasswordResetRequestThrottle

PASSWORD_RESET_REQUEST_MESSAGE = (
    "If an account exists with that email, a reset link has been sent."
)
PASSWORD_RESET_CONFIRM_MESSAGE = "Password reset successfully."


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetRequestThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": PASSWORD_RESET_REQUEST_MESSAGE})


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetConfirmThrottle]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": PASSWORD_RESET_CONFIRM_MESSAGE})
