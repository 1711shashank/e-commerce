from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.html import format_html

from .models import Address, EmailJob, EmailVerificationOTP, PasswordResetToken, User

STATUS_COLORS = {
    EmailJob.Status.PENDING: "#6c757d",
    EmailJob.Status.PROCESSING: "#0d6efd",
    EmailJob.Status.SENT: "#198754",
    EmailJob.Status.FAILED: "#fd7e14",
    EmailJob.Status.DEAD: "#dc3545",
}


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


class EmailJobInline(admin.TabularInline):
    model = EmailJob
    extra = 0
    fields = ("status_badge", "attempts", "created_at", "sent_at", "last_error")
    readonly_fields = ("status_badge", "attempts", "created_at", "sent_at", "last_error")
    ordering = ("-created_at",)

    @admin.display(description="Status")
    def status_badge(self, obj: EmailJob) -> str:
        color = STATUS_COLORS.get(obj.status, "#6c757d")
        return format_html(
            '<span style="color:{};font-weight:600;">{}</span>',
            color,
            obj.get_status_display(),
        )

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("email",)
    list_display = ("email", "role", "email_verified", "is_staff", "is_active")
    list_filter = ("role", "email_verified", "is_active", "is_staff")
    search_fields = ("email",)
    inlines = [AddressInline]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("first_name", "last_name", "mobile")}),
        (
            "Permissions",
            {
                "fields": (
                    "role",
                    "email_verified",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "role",
                    "email_verified",
                    "is_staff",
                ),
            },
        ),
    )


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "expires_at", "used_at", "created_at")
    list_filter = ("used_at",)
    search_fields = ("user__email",)
    readonly_fields = ("user", "token_hash", "expires_at", "used_at", "failed_attempts", "created_at")
    ordering = ("-created_at",)
    inlines = [EmailJobInline]


@admin.register(EmailVerificationOTP)
class EmailVerificationOTPAdmin(admin.ModelAdmin):
    list_display = ("user", "expires_at", "used_at", "failed_attempts", "created_at")
    list_filter = ("used_at",)
    search_fields = ("user__email",)
    readonly_fields = (
        "user",
        "otp_hash",
        "expires_at",
        "used_at",
        "failed_attempts",
        "created_at",
    )
    ordering = ("-created_at",)
    inlines = [EmailJobInline]


@admin.register(EmailJob)
class EmailJobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "recipient",
        "email_type",
        "status_badge",
        "attempts",
        "created_at",
        "sent_at",
    )
    list_filter = ("status", "email_type", "created_at")
    search_fields = ("recipient", "user__email", "celery_task_id")
    readonly_fields = (
        "email_type",
        "recipient",
        "user",
        "password_reset_token",
        "email_verification_otp",
        "status_badge",
        "attempts",
        "celery_task_id",
        "last_error",
        "created_at",
        "updated_at",
        "sent_at",
    )
    exclude = ("send_payload",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj: EmailJob) -> str:
        color = STATUS_COLORS.get(obj.status, "#6c757d")
        return format_html(
            '<span style="color:{};font-weight:600;">{}</span>',
            color,
            obj.get_status_display(),
        )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
