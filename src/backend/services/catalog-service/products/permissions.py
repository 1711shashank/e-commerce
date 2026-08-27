from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsStaffOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool(
            user
            and getattr(user, "is_authenticated", False)
            and getattr(user, "is_staff_user", False)
        )
