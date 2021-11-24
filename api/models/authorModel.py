from django.db import models
from .inboxModel import Inbox
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid

# Author Model extends from Django's User model when a new account is registered
class Author(AbstractUser):
    # Author type
    type = models.CharField(default='author', max_length=100)
    # Author UUID
    uuid = models.UUIDField(primary_key=True, null=False, default=uuid.uuid4, editable=False)
    # Author URL ID
    id = models.URLField(null=True, blank=True)
    # Author Display Name (i.e. full name)
    displayName = models.CharField(null=True, blank=True, max_length=100)
    # Author Personal URL
    url = models.URLField(null=True, blank=True)
    # Author Host URL
    host = models.URLField(null=True, blank=True, max_length=150)
    # Author Github URL
    github = models.URLField(null=True, blank=True)
    # Author Profile Image
    profileImage = models.URLField(null=True, blank=True)
    # symmetrical=False allows Author to follow people that don't follow them
    followers = models.ManyToManyField("self", symmetrical=False, blank=True)

    def __init__(self, *args, **kwargs):
        super(Author, self).__init__(*args, **kwargs)
        if self.host != None:
            # make sure host ends with a '/'
            self.host += '/' if (not self.host.endswith('/')) else ''

            # set id and url to format specified in the project specifications
            self.id = self.host + 'author/' + str(self.uuid)
            self.url = self.id

# https://stackoverflow.com/a/52196396 to auto-create Inbox when Author is created
@receiver(post_save, sender=Author)
def create_author_inbox(sender, instance, created, **kwargs):
    if created:
        Inbox.objects.create(author=instance.id)
