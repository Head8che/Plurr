import json
from re import A
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models.authorModel import Author
from ..models.postModel import Post
from rest_framework import status
from ..serializers import PostSerializer
from django.db.models import Q
from ..utils import getPageNumber, getPageSize, getPaginatedObject, getUUIDFromId, handlePostImage, loggedInUserIsAuthor, postToAuthorInbox


@api_view(['GET'])
def StreamList(request):
  # List all the posts
  if request.method == 'GET':
    try:  # try to get the posts
      if request.user.id is not None:
        author = Author.objects.get(uuid=getUUIDFromId(request.user.id))
        followers = author.followers.all()
        friendIds = []
        
        for follower in followers:
          followerFollowers = Author.objects.get(uuid=follower.uuid).followers.all()
          for followerFollower in followerFollowers:
            if str(followerFollower.id) == str(author.id):
              friendIds.append(follower.id)
        
        publicPosts = Post.objects.filter(Q(visibility="PUBLIC")).order_by('-published')
        otherAuthorsFriendPosts = Post.objects.filter(Q(visibility="FRIENDS"), author__id__in=friendIds).order_by('-published')
        ownFriendPosts = Post.objects.filter(Q(visibility="FRIENDS"), author__id=request.user.id).order_by('-published')
        posts = publicPosts | otherAuthorsFriendPosts | ownFriendPosts
      else:
        posts = Post.objects.filter(Q(visibility="PUBLIC")).order_by('-published')
    
    except:  # return an error if something goes wrong
        return Response(status=status.HTTP_404_NOT_FOUND)

    # get the page number and size
    page_number = getPageNumber(request)
    page_size = getPageSize(request)

    # get the paginated posts
    paginated_posts = getPaginatedObject(posts, page_number, page_size)

    # get the Post serializer
    serializer = PostSerializer(paginated_posts, many=True)

    # create the `type` field for the Posts data
    new_data = {'type': "posts"}

    # add the `type` field to the Posts data
    new_data.update({
        'items': serializer.data,
    })

    # return the updated Posts data
    return Response(new_data, status=status.HTTP_200_OK)

  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST', 'GET'])
def PostList(request, author_uuid):
  try:  # try to get the specific author
      authorObject = Author.objects.get(uuid=author_uuid)
  except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)

  # Create a new post
  if request.method == 'POST':
    # if the logged in user is not the author
    if not loggedInUserIsAuthor(request, author_uuid):  
      return Response(status=status.HTTP_401_UNAUTHORIZED)

    try:  # try to get the image handled data
      post_count = Post.objects.filter(author=author_uuid).count()
      request_data = handlePostImage(request.data)
      if request_data.get('title') == None:
        request_data["title"] = "Post " + str(post_count + 1) + " by " + authorObject.displayName
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_400_BAD_REQUEST)
        
    # get the Post serializer
    serializer = PostSerializer(data=request_data)

    # update the Post data if the serializer is valid
    if serializer.is_valid():
      serializer.save(author=authorObject)

      try:  # try to get the followers
        followers = Author.objects.get(uuid=author_uuid).followers.all()
        for follower in followers:
          postToAuthorInbox(request, serializer.data, follower.uuid)
      except:  # return an error if something goes wrong
        pass

      return Response({"message": "Post created", "data": serializer.data}, 
        status=status.HTTP_201_CREATED)

    # return an error if something goes wrong with the update
    return Response({"message": serializer.errors}, 
      status=status.HTTP_400_BAD_REQUEST)

  # List all the posts
  elif request.method == 'GET':
    try:  # try to get the posts
      if request.user.id is not None:
        author = Author.objects.get(uuid=getUUIDFromId(authorObject.id))
        followers = author.followers.all()
        friendIds = []
        
        for follower in followers:
          followerFollowers = Author.objects.get(uuid=follower.uuid).followers.all()
          for followerFollower in followerFollowers:
            if str(followerFollower.id) == str(author.id):
              friendIds.append(follower.id)
        
        loggedInUserIsFriend = request.user.id in friendIds

        if loggedInUserIsFriend or loggedInUserIsAuthor(request, author_uuid):
          posts = Post.objects.filter(Q(visibility="FRIENDS") | Q(visibility="PUBLIC"), 
            author=author_uuid).order_by('-published')
        else:
          posts = Post.objects.filter(author=author_uuid, visibility="PUBLIC").order_by('-published')
      else:
          posts = Post.objects.filter(author=author_uuid, visibility="PUBLIC").order_by('-published')

    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)

    # get the page number and size
    page_number = getPageNumber(request)
    page_size = getPageSize(request)

    # get the paginated posts
    paginated_posts = getPaginatedObject(posts, page_number, page_size)

    # get the Post serializer
    serializer = PostSerializer(paginated_posts, many=True)

    # create the `type` field for the Posts data
    new_data = {'type': "posts"}

    # add the `type` field to the Posts data
    new_data.update({
        'items': serializer.data,
    })

    # return the updated Posts data
    return Response(new_data, status=status.HTTP_200_OK)

  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def PostDetail(request, author_uuid, post_uuid):
  try:  # try to get the specific author
    authorObject = Author.objects.get(uuid=author_uuid)
  except:  # return an error if something goes wrong
    return Response(status=status.HTTP_404_NOT_FOUND)
  
  # List a specific post
  if request.method == 'GET':
    try:  # try to get the specific post
      post = Post.objects.get(author=author_uuid, uuid=post_uuid)
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)
    
    # get the Post serializer
    serializer = PostSerializer(post, many=False)

    # return the Post data
    return Response(serializer.data, status=status.HTTP_200_OK)

  # Update a specific post
  elif request.method == 'POST':
    # if the logged in user is not the author
    if not loggedInUserIsAuthor(request, author_uuid):  
      return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    try:  # try to get the specific post & image handled data
      post = Post.objects.get(author=author_uuid, uuid=post_uuid)
      request_data = handlePostImage(request.data)
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)
    
    # get the Post serializer
    serializer = PostSerializer(instance=post, data=request_data)

    # update the Post data if the serializer is valid
    if serializer.is_valid():
      serializer.save()
      return Response({"message": "Post updated", "data": serializer.data}, 
        status=status.HTTP_200_OK)

    # return an error if something goes wrong with the update
    return Response({"message": serializer.errors}, 
      status=status.HTTP_400_BAD_REQUEST)
  
  # Create a specific post
  elif request.method == 'PUT':
    # if the logged in user is not the author
    if not loggedInUserIsAuthor(request, author_uuid):  
      return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    try:  # try to get the image handled data
      request_data = handlePostImage(request.data)
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # get the Post serializer
    serializer = PostSerializer(data=request_data)

    # update the Post data if the serializer is valid
    if serializer.is_valid():
      serializer.save(uuid=post_uuid, author=authorObject)
      
      try:  # try to get the followers
        followers = Author.objects.get(uuid=author_uuid).followers.all()
        for follower in followers:
          postToAuthorInbox(request, serializer.data, follower.uuid)
      except:  # return an error if something goes wrong
        pass
      
      return Response({"message": "Post created", "data": serializer.data}, 
        status=status.HTTP_201_CREATED)

    # return an error if something goes wrong with the update
    return Response({"message": serializer.errors}, 
      status=status.HTTP_400_BAD_REQUEST)

  # Delete a specific post
  elif request.method == 'DELETE':
    # if the logged in user is not the author
    if not loggedInUserIsAuthor(request, author_uuid):  
      return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    try:  # try to get the specific post
      post = Post.objects.get(author=author_uuid, uuid=post_uuid)
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)
    
    # delete the post
    post.delete()

    # return a deletion message
    return Response({"message": "Post deleted"}, 
      status=status.HTTP_204_NO_CONTENT)

  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
