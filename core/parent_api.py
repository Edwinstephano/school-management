from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response

from .models import ParentProfile
from .permissions import IsAdminOrPrincipal


User = get_user_model()


class ParentAdminSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    address = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "phone",
            "address",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        phone = validated_data.pop("phone", "")
        address = validated_data.pop("address", "")
        user = User.objects.create_user(**validated_data)
        user.role = "PARENT"
        user.save(update_fields=["role"])
        ParentProfile.objects.create(user=user, phone=phone, address=address)
        return user


class ParentAdminListCreateView(generics.ListCreateAPIView):
    # Creation still uses User via ParentAdminSerializer, but listing is
    # based on ParentProfile so the id matches the ParentProfile pk.
    queryset = ParentProfile.objects.select_related("user").all()
    serializer_class = ParentAdminSerializer
    permission_classes = [IsAdminOrPrincipal]

    def list(self, request, *args, **kwargs):
        profiles = self.get_queryset()
        data = []
        for profile in profiles:
            user = profile.user
            data.append(
                {
                    "id": profile.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "phone": profile.phone,
                    "address": profile.address,
                }
            )
        return Response(data, status=status.HTTP_200_OK)


parent_admin_view = ParentAdminListCreateView.as_view()
