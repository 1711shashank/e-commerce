from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .address_serializers import AddressSerializer, AddressWriteSerializer
from .address_services import promote_next_default, set_default_address
from .models import Address


class AddressListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AddressWriteSerializer
        return AddressSerializer


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return AddressWriteSerializer
        return AddressSerializer

    def perform_destroy(self, instance):
        was_default = instance.is_default
        user = instance.user
        instance.delete()
        if was_default:
            promote_next_default(user)


class AddressSetDefaultView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            address = Address.objects.get(pk=pk, user=request.user)
        except Address.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        set_default_address(request.user, address)
        return Response(AddressSerializer(address).data)
