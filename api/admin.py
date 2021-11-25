from django.contrib import admin

from .models.accountRegistrationModel import accountRequest
from .models.authorModel import Author
from .models.friendRequestModel import FriendRequest as Friend
from .models.postModel import Post
from .models.likeModel import Like
from .models.commentModel import Comment
from .models.inboxModel import Inbox
from .models.nodeModel import Node
from .utils import _createAuthorObjectsFromNode


from .views.adminView import pendingRequestView

def create_local_authors(modeladmin, request, queryset):
    for node in queryset:
        _createAuthorObjectsFromNode(node)
create_local_authors.short_description = 'Create local Author objects'

class NodeAdmin(admin.ModelAdmin):
    actions = [create_local_authors, ]

admin.site.register(Author)
admin.site.register(Friend)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Inbox)
admin.site.register(Like)
admin.site.register(Node, NodeAdmin)




admin.site.register(accountRequest, pendingRequestView)
