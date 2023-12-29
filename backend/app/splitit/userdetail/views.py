from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.request import HttpRequest
from rest_framework import serializers, viewsets
from rest_framework.response import Response

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    def list(self, request: HttpRequest):
        """
        :param username (str): Username that is matched on startswith for auto-completion
        """
        username = request.GET.get("username", "")
        if username:
            queryset = User.objects.filter(username__startswith=username)
        else:
            queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
