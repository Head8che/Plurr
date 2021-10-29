from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from network.models import *
from django.dispatch import receiver
from django.db.models.signals import pre_save
from .models import CustomUser

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'displayName', 'url', 'github', 'profileImage']  

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['type', 'title', 'id', 'source', 'origin', 'description', 
        'contentType', 'content', 'author', 'categories', 'count', 'comments', 
        'published', 'visibility', 'unlisted']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['type', 'author', 'comment', 'contentType', 'published', 'id'] 

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object'] 


@receiver(pre_save, sender=User)
def set_new_user_inactive(sender, instance, **kwargs):
    if instance._state.adding is True:
        print("Creating Inactive User")
        instance.is_active = False
    else:
        print("Updating User Record")


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            max_length=32,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User(email=validated_data['email'],
                username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', )


# class UserSerializer(ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ('email', 'last_login', 'date_joined', 'is_staff')

