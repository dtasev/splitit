import os
from django.contrib.auth import get_user_model
from rest_framework import viewsets, serializers
from splitit.bill.models import Debt
from rest_framework import status
from rest_framework.response import Response
from rest_framework import authentication
import logging

logging.basicConfig(level=os.environ.get("LOG_LEVEL", logging.INFO),
                    format='%(asctime)s %(filename)s:%(lineno)d %(levelname)s %(message)s',
                    force=True)
logger = logging.getLogger(__name__)

User = get_user_model()


class DebtSerializer(serializers.ModelSerializer):

    class Meta:
        model = Debt
        fields = "__all__"


class DebtView(viewsets.ModelViewSet):
    serializer_class = DebtSerializer

    # authentication_classes = [authentication.TokenAuthentication]

    def get_queryset(self):
        return Debt.objects.filter(owner=self.request.user)

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
