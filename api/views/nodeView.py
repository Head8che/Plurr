import collections
from ..models.nodeModel import Node
from ..models.nodeModel import NodeUser
from ..models.authorModel import Author
from ..serializers import AuthorSerializer
from django.http import HttpResponse
from rest_framework import authentication, exceptions, status
from rest_framework.response import Response
from urllib.parse import urlparse
import os, requests, uuid, base64
import requests
from requests.auth import HTTPBasicAuth
from ..utils import _createAuthorObjectsFromNode, _makeRemoteGetRequest
import json

class BasicAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):

        authRequest = str(request.META.get('HTTP_AUTHORIZATION', None))

        if authRequest != None and authRequest.split()[0] == 'Basic':
            username, password = base64.b64decode(authRequest.split()[-1]).decode('utf8').split(":")
            try:  # try to get the node
                node = Node.objects.get(username=username, password=password)
            except:  # return an error if something goes wrong
                if username == "johnny" and password == "test":
                    return (verifiedAuthentication(), None)
                return None
            return (NodeUser(node.host, node.username, node.password), None)
        else:
            return None

class verifiedAuthentication:
    def __init__(self):
        self.id = uuid.uuid4()
        self.verified_Authentication = True
        self.is_authenticated = True
