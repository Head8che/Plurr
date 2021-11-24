import base64
from .models.nodeModel import Node
from rest_framework import permissions


class NodePermission(permissions.BasePermission):
  def has_permission(self, request, view):
    try:
      auth_header = request.META.get('HTTP_AUTHORIZATION', '')
      if 'Token' in auth_header:
        return True
      token_type, _, credentials = auth_header.partition(' ')
      username, password = base64.b64decode(credentials).decode('utf8').split(":")
      Node.objects.get(username=username, password=password)
    except:
      return False
    
    if token_type != 'Basic':
        return False
    return True
