from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Address, PasswordResetToken, User


class AddressInline(admin.TabularInline):
    model = Address
    extra = 0
    fields = (
        "full_name",
        "mobile",
        "address_type",
        "custom_label",
        "city",
        "is_default",
    )


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "role", "is_staff", "is_active")
    search_fields = ("email",)
    inlines = [AddressInline]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("first_name", "last_name", "mobile")}),
        ("Permissions", {"fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2", "role", "is_staff"),
            },
        ),
    )


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at", "expires_at", "used_at", "failed_attempts")
    list_filter = ("used_at",)
    search_fields = ("user__email",)
    readonly_fields = (
        "user",
        "token_hash",
        "created_at",
        "expires_at",
        "used_at",
        "failed_attempts",
    )

    def has_add_permission(self, request):
        return False
