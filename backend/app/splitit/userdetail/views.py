from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.request import HttpRequest
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from rest_framework.decorators import api_view

User = get_user_model()


class UserListSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username']


class UserDetailSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'token']

    def get_token(self, obj):
        token, _ = Token.objects.get_or_create(user=obj)
        return token.key


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
        serializer = UserListSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Ignores the pk lul, always returns the current user. Gonna troll me some day"""
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)


@api_view(["GET"])
def logout_view(request):
    logout(request)
    return Response({"message": "ok"}, status=200)
