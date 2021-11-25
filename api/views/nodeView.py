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


def getAuthorsFromNode(nodeUser):
    try:  # try to get the node
        node = Node.objects.get(username=nodeUser.username, password=nodeUser.password)
    except:  # return an error if something goes wrong
        return None
    get_authors_path = node.host + "authors/"
    json_response = _makeRemoteGetRequest(get_authors_path, node)
    if json_response is not None:
        print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_authors_path, response=str(json_response)))

def getAuthorsFromNodeAndSaveToDB(nodeUser):
    try:  # try to get the node
        node = Node.objects.get(username=nodeUser.username, password=nodeUser.password)
        _createAuthorObjectsFromNode(node)
    except:  # return an error if something goes wrong
        return None

def getAuthorsFromAllNodes():
    try:  # try to get the node
        nodes = Node.objects.all()
        for node in nodes:
            get_authors_path = node.host + "authors/"
            json_response = _makeRemoteGetRequest(get_authors_path, node)
            if json_response is not None:
                print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_authors_path, response=str(json_response)))
    except:  # return an error if something goes wrong
        return None

def getPostsFromAllNodes():
    try:  # try to get the node
        nodes = Node.objects.all()
        for node in nodes:
            get_authors_path = node.host + "authors/"
            json_response = _makeRemoteGetRequest(get_authors_path, node)
            if json_response is not None:
                print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_authors_path, response=str(json_response)))
                remote_authors_list = json_response.get('items', None)
                for remote_author in remote_authors_list:
                    print(remote_author.id)
    except:  # return an error if something goes wrong
        return None

def getAuthorsFromAllNodesAndSaveToDB():
    try:  # try to get the node
        nodes = Node.objects.all()
        for node in nodes:
            _createAuthorObjectsFromNode(node)
    except:  # return an error if something goes wrong
        return None

class BasicAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):

        authRequest = str(request.META.get('HTTP_AUTHORIZATION', None))

        if authRequest != None and authRequest.split()[0] == 'Basic':
            username, password = base64.b64decode(authRequest.split()[-1]).decode('utf8').split(":")
            try:  # try to get the node
                node = Node.objects.get(username=username, password=password)
            except:  # return an error if something goes wrong
                return None
            return (NodeUser(node.host, node.username, node.password), None)
        else:
            return None
