from ecommerce_shared.timezone_utils import format_iso
from rest_framework import serializers

from .address_services import promote_next_default, set_default_address, validate_mobile
from .models import Address


class AddressSerializer(serializers.ModelSerializer):
    display_label = serializers.CharField(read_only=True)

    class Meta:
        model = Address
        fields = (
            "id",
            "full_name",
            "mobile",
            "address_type",
            "custom_label",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postal_code",
            "country",
            "is_default",
            "display_label",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "display_label", "created_at", "updated_at")


    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["created_at"] = format_iso(instance.created_at)
        data["updated_at"] = format_iso(instance.updated_at)
        return data


class AddressWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "full_name",
            "mobile",
            "address_type",
            "custom_label",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "postal_code",
            "country",
            "is_default",
        )

    def validate_mobile(self, value):
        try:
            return validate_mobile(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc)) from exc

    def validate(self, attrs):
        address_type = attrs.get(
            "address_type",
            getattr(self.instance, "address_type", None),
        )
        custom_label = attrs.get(
            "custom_label",
            getattr(self.instance, "custom_label", ""),
        )
        if address_type == Address.AddressType.OTHER:
            label = (custom_label or "").strip()
            if len(label) < 2:
                raise serializers.ValidationError(
                    {"custom_label": "Enter a label for this address type."}
                )
            attrs["custom_label"] = label
        else:
            attrs["custom_label"] = ""
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        if user.addresses.count() >= Address.MAX_PER_USER:
            raise serializers.ValidationError(
                f"You can save up to {Address.MAX_PER_USER} addresses."
            )
        is_default = validated_data.get("is_default", False)
        if not user.addresses.exists():
            is_default = True
        validated_data["is_default"] = is_default
        address = Address.objects.create(user=user, **validated_data)
        if is_default:
            set_default_address(user, address)
        return address

    def update(self, instance, validated_data):
        user = instance.user
        wants_default = validated_data.pop("is_default", instance.is_default)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        total = user.addresses.count()
        if total == 1:
            if not instance.is_default:
                set_default_address(user, instance)
            return instance

        if wants_default:
            set_default_address(user, instance)
        elif instance.is_default:
            instance.is_default = False
            instance.save(update_fields=["is_default", "updated_at"])
            promote_next_default(user, exclude_pk=instance.pk)

        return instance

    def to_representation(self, instance):
        return AddressSerializer(instance).data
