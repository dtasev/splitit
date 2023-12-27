import os
from django.contrib.auth import get_user_model
from rest_framework import viewsets, serializers
from splitit.bill.models import Debt
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Q

import logging

logging.basicConfig(level=os.environ.get("LOG_LEVEL", logging.INFO),
                    format='%(asctime)s %(filename)s:%(lineno)d %(levelname)s %(message)s',
                    force=True)
logger = logging.getLogger(__name__)

User = get_user_model()


class DebtSerializer(serializers.ModelSerializer):

    owner_username = serializers.CharField(source="owner.username", read_only=True)
    is_owed_username = serializers.CharField(source="is_owed.username", read_only=True)

    class Meta:
        model = Debt
        fields = "__all__"


class DebtView(viewsets.ModelViewSet):

    serializer_class = DebtSerializer

    def get_queryset(self):
        query = Q(owner=self.request.user) | Q(is_owed=self.request.user)
        return Debt.objects.filter(query).order_by("-added", "-pk")

    def create(self, request, *args, **kwargs):
        data = request.data

        # manually set the owner and is_owed
        data["owner"] = request.user.pk
        is_owed_username = request.data.get("is_owed")
        data["is_owed"] = User.objects.get(username=is_owed_username).pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data
        is_owed_username = request.data.get("is_owed")
        data["is_owed"] = User.objects.get(username=is_owed_username).pk
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
