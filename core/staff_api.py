from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response

from .permissions import IsAdminOrPrincipal


User = get_user_model()


class StaffUserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=["PRINCIPAL", "TEACHER", "STAFF"])

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "role",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password")
        role = validated_data.pop("role")
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.role = role
        user.save(update_fields=["password", "role"])
        return user


class StaffUserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.filter(role__in=["PRINCIPAL", "TEACHER", "STAFF"]).order_by("username")
    serializer_class = StaffUserSerializer
    permission_classes = [IsAdminOrPrincipal]


staff_user_view = StaffUserListCreateView.as_view()
