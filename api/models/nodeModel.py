from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AnonymousUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from ..utils import _createAuthorObjectsFromNode

# Node Model
class Node(models.Model):  
    # Host URL (Main host identifier)
    host = models.URLField(primary_key=True, null=False, max_length=200)
    # Host Username
    username = models.CharField(max_length=100, null=False)
    # Host Password
    password = models.CharField(max_length=128, verbose_name='password', null=False)
    # Remote Username (Username to use when we connect to them)
    remoteUsername = models.CharField(max_length=100, null=True, blank=True)
    # Remote Password (Password to use when we connect to them)
    remotePassword = models.CharField(max_length=128, verbose_name='remote_password', null=True, blank=True)
    # Host Connected Date
    connectedDate = models.DateTimeField(default=timezone.now, null=True, blank=True)

    def __init__(self, *args, **kwargs):
        super(Node, self).__init__(*args, **kwargs)
        if self.host != None:
            # make sure host ends with a '/'
            self.host += '/' if (not self.host.endswith('/')) else ''

    def __str__(self, *args, **kwargs):
        return (f"Node: Host={self.host}, Name={self.username}, Password={self.password}")

# https://stackoverflow.com/a/52196396 to auto-create local objects when Node is created
# @receiver(post_save, sender=Node)
# def create_node_objects_locally(sender, instance, created, **kwargs):
#     if created:
#         _createAuthorObjectsFromNode(instance)

# Node User Model
class NodeUser(AnonymousUser):
    def __init__(self, host, username, password):
        self.host = host
        self.username = username
        self.password = password
        
        if self.host != None:
            # make sure host ends with a '/'
            self.host += '/' if (not self.host.endswith('/')) else ''

    @property 
    def is_authenticated(self):
        return True
