from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .password_reset_serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
)
from .password_reset_throttles import (
    PasswordResetConfirmIPThrottle,
    PasswordResetEmailThrottle,
    PasswordResetRequestIPThrottle,
)


class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetRequestIPThrottle, PasswordResetEmailThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        detail = serializer.save()
        return Response({"detail": detail}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetConfirmIPThrottle]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password reset successfully."},
            status=status.HTTP_200_OK,
        )
