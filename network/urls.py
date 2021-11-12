from django.urls import path, include, re_path
from django.contrib import admin
from rest_framework import routers
from django.views.generic import TemplateView
from api.views import index, authorView, followerView, postView, authView, inboxView, likeView, likedView, commentView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# router = routers.DefaultRouter()
# router.register(r'api', views.TodoView, 'api')

urlpatterns = [
    # path('service/',include('api.urls')),
    path('admin/', admin.site.urls),
    
    # re_path('.*', TemplateView.as_view(template_name='index.html')),
    

    # Index
    # path('', index.index, name="index"),
    
    # Auth Endpoints
    path('service/author/login/', authView.LoginView.as_view(), name="login"),
    path('service/author/register/', authView.SignupView, name="register"),

    # Author Endpoints
    path('service/authors/',authorView.AuthorList, name ='authorList'),
    path('service/author/<str:author_uuid>/', authorView.AuthorDetail, name="authorDetail"),

    # Inbox Endpoint
    path('service/author/<str:author_uuid>/inbox/', inboxView.InboxList, name="inboxList"),

    # Follower Endpoints
    path('service/author/<str:author_uuid>/followers/', followerView.FollowerList, name="followerList"),
    path('service/author/<str:author_uuid>/followers/<str:follower_uuid>/', followerView.FollowerDetail, name="followerDetail"),

    # Post Endpoints
    # path('service/author/<str:authorID>/stream/', postView.getStreamPosts, name="streamPosts"),
    path('service/author/<str:author_uuid>/posts/', postView.PostList, name="authorPosts"),
    path('service/author/<str:author_uuid>/posts/<str:post_uuid>/', postView.PostDetail, name="authorPost"),

    # Comment Endpoints
    path('service/author/<str:author_uuid>/posts/<str:post_uuid>/comments/', commentView.CommentList, name='commentList'),
    path('service/author/<str:author_uuid>/posts/<str:post_uuid>/comments/<str:comment_uuid>/', commentView.CommentDetail, name='commentDetail'),

    # Liked Endpoints
    path('service/author/<str:author_uuid>/liked/', likedView.LikedList, name="likedList"),

    # Like Endpoints
    path('service/author/<str:author_uuid>/posts/<str:post_uuid>/likes/', likeView.LikeListPost, name="likeListPost"),
    path('service/author/<str:author_uuid>/posts/<str:post_uuid>/comments/<str:comment_uuid>/likes/', likeView.LikeListComment, name="likeListComment"),

    # Token Endpoints
    path('api-auth/', include('rest_framework.urls')),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    re_path('.*', TemplateView.as_view(template_name='index.html')),

]

