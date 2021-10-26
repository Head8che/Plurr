from django.conf.urls import url
from django.urls import path, include
from backend.views import *
from network.views import *

urlpatterns = [
    # path('',index,name='index'),
    path('', apiOverview, name="apiOverview"),
    path('authors/', AuthorList, name ='authorList'),
    path('author/<str:author_uuid>/', AuthorDetail, name="authorDetail"),
    path('author/<str:author_uuid>/followers/', FollowerList, name="followerList"),
    path('author/<str:author_uuid>/followers/<str:follower_uuid>', FollowerDetail, name="followerDetail"),
    path('author/<str:author_uuid>/posts/', PostList, name="postList"),
    path('author/<str:author_uuid>/posts/<str:post_uuid>', PostDetail, name="postDetail"),
    path('author/<str:author_uuid>/posts/<str:post_uuid>/comments', CommentList, name="commentList"),
    path('author/<str:author_uuid>/posts/<str:post_uuid>/comments/<str:comment_uuid>', CommentDetail, name="commentDetail"),
]
