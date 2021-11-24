from django.db import models
from django.utils import timezone

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