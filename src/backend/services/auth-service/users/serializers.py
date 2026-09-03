from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .token_utils import apply_token_claims, bump_token_version

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "role", "first_name", "last_name", "mobile")
        read_only_fields = ("id", "email", "role")


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "mobile")

    def validate_mobile(self, value):
        value = value.strip()
        if not value:
            return ""
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 10 or len(digits) > 15:
            raise serializers.ValidationError(
                "Enter a valid mobile number (10–15 digits)."
            )
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        current = attrs.get("current_password")
        new = attrs.get("new_password")
        if current and new and current == new:
            raise serializers.ValidationError(
                {"new_password": "New password must be different from the current password."}
            )
        return attrs

    def validate_new_password(self, value):
        validate_password(value, self.context["request"].user)
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        bump_token_version(user)
        return user


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("email", "password", "first_name", "last_name")

    def validate_email(self, value):
        return User.objects.normalize_email(value)

    def validate(self, attrs):
        password = attrs.get("password")
        if password:
            candidate = User(
                email=attrs.get("email", ""),
                first_name=attrs.get("first_name", ""),
                last_name=attrs.get("last_name", ""),
            )
            try:
                validate_password(password, candidate)
            except DjangoValidationError as exc:
                raise serializers.ValidationError({"password": list(exc.messages)}) from exc
        return attrs

    def create(self, validated_data):
        from .email_verification_services import issue_and_send_verification_otp

        email = User.objects.normalize_email(validated_data["email"])
        password = validated_data["password"]
        first_name = validated_data.get("first_name", "")
        last_name = validated_data.get("last_name", "")

        existing = User.objects.filter(email__iexact=email).first()
        if existing:
            if existing.email_verified or existing.role != User.Role.CUSTOMER:
                # Enumeration-safe no-op for verified / non-customer accounts.
                return existing

            existing.set_password(password)
            existing.first_name = first_name
            existing.last_name = last_name
            existing.is_active = False
            existing.email_verified = False
            existing.save(
                update_fields=[
                    "password",
                    "first_name",
                    "last_name",
                    "is_active",
                    "email_verified",
                ]
            )
            issue_and_send_verification_otp(existing)
            return existing

        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.CUSTOMER,
            is_active=False,
            email_verified=False,
        )
        issue_and_send_verification_otp(user)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    username_field = User.EMAIL_FIELD

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["audience"] = serializers.ChoiceField(
            choices=("customer", "staff"),
            write_only=True,
        )

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        apply_token_claims(token, user)
        return token

    def validate(self, attrs):
        audience = attrs.pop("audience", None)
        email = attrs.get(self.username_field, "")
        password = attrs.get("password", "")
        normalized = User.objects.normalize_email(str(email).strip())
        attrs[self.username_field] = normalized
        candidate = User.objects.filter(email__iexact=normalized).first()
        if (
            candidate
            and candidate.check_password(password)
            and candidate.role == User.Role.CUSTOMER
            and not candidate.email_verified
        ):
            raise serializers.ValidationError(
                {
                    "detail": "Please verify your email before signing in.",
                    "code": "email_not_verified",
                }
            )

        data = super().validate(attrs)
        user = self.user
        if audience == "customer" and user.role != User.Role.CUSTOMER:
            raise serializers.ValidationError(
                {"detail": "No active account found with the given credentials."}
            )
        if audience == "staff" and user.role not in (User.Role.STAFF, User.Role.ADMIN):
            raise serializers.ValidationError(
                {"detail": "No active account found with the given credentials."}
            )

        data["user"] = UserSerializer(user).data
        return data
