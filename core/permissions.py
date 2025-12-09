from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrPrincipal(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return getattr(user, "role", None) in {"ADMIN", "PRINCIPAL"}


class IsTeacherOrStaff(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return getattr(user, "role", None) in {"TEACHER", "STAFF", "PRINCIPAL", "ADMIN"}


class IsParent(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        return getattr(user, "role", None) == "PARENT"


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
