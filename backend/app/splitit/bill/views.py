import os
from django.contrib.auth import get_user_model
from rest_framework import viewsets, serializers
from splitit.bill.models import Debt
from rest_framework import status
from rest_framework.response import Response
from django.db.models import Q
from functools import reduce
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


class DebtListSerializer(serializers.ModelSerializer):

    owner_username = serializers.CharField(source="owner.username", read_only=True)
    is_owed_username = serializers.CharField(source="is_owed.username", read_only=True)
    total_owed = serializers.SerializerMethodField()

    class Meta:
        model = Debt
        fields = ["owner", "is_owed", "owner_username", "is_owed_username", "total_owed"]

    def get_total_owed(self, obj):

        # qs should be coming from .distinct
        assert self.instance.count() == 1
        owner = self.instance[0].owner

        # unforunately to calculate we still need to pull in all the related debts
        query = Q(owner=owner) | Q(is_owed=owner)
        qs = Debt.objects.filter(query, settled=False)

        def reductor(acc: int, b: Debt):
            logger.info("%s vs %s", b.owner, owner)
            if b.owner == owner:
                return acc + b.lent
            else:
                return acc - b.lent

        return reduce(reductor, qs, 0)


class DebtView(viewsets.ModelViewSet):

    serializer_class = DebtSerializer

    def get_queryset(self):
        query = Q(owner=self.request.user) | Q(is_owed=self.request.user)
        return Debt.objects.filter(query, settled=False).order_by("-added", "-pk")

    def create(self, request, *args, **kwargs):
        data = request.data

        # manually set the owner and is_owed
        owner = request.data.get("owner")
        data["owner"] = User.objects.get(username=owner).pk
        is_owed_username = request.data.get("is_owed")
        data["is_owed"] = User.objects.get(username=is_owed_username).pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, pk=None, **kwargs):
        partial = kwargs.pop('partial', False)
        # instance = self.get_object()
        instance = Debt.objects.get(pk=pk)

        data = request.data

        # manually set the owner and is_owed
        owner = request.data.get("owner")
        data["owner"] = User.objects.get(username=owner).pk
        is_owed_username = request.data.get("is_owed")
        data["is_owed"] = User.objects.get(username=is_owed_username).pk

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED, headers=headers)

    def list(self, request):
        qs = request.user.owes.all().distinct('is_owed')
        serializer = DebtListSerializer(qs, many=True)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    def retrieve(self, request, pk=None):
        qs = self.get_queryset()
        query = Q(owner=pk) | Q(is_owed=pk)
        qs = qs.filter(query)
        serializer = DebtSerializer(qs, many=True)
        headers = self.get_success_headers(serializer.data)
        return Response({
            "other_user": User.objects.get(pk=pk).username,
            "debts": serializer.data
        },
                        status=status.HTTP_200_OK,
                        headers=headers)
