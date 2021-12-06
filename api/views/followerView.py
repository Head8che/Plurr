from api.models.postModel import Post
from ..models.authorModel import Author
from ..serializers import AuthorSerializer, PostSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..utils import getPageNumber, getPageSize, getPaginatedObject, loggedInUserIsAuthor


@api_view(['GET'])
def FriendList(request, author_uuid):
  # List all the followers
  if request.method == 'GET':
    try:  # try to get the followers
      author = Author.objects.get(uuid=author_uuid)
      followers = author.followers.all()
      friendIds = []
      
      for follower in followers:
        followerFollowers = Author.objects.get(uuid=follower.uuid).followers.all()
        for followerFollower in followerFollowers:
          if str(followerFollower.id) == str(author.id):
            friendIds.append(follower.id)
      
      friends = Author.objects.filter(id__in=friendIds).order_by('id')

    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # get the page number and size
    page_number = getPageNumber(request)
    page_size = getPageSize(request)

    # get the paginated friends
    paginated_friends = getPaginatedObject(friends, page_number, page_size)

    # get the Author serializer
    serializer = AuthorSerializer(paginated_friends, many=True)

    # create the `type` field for the Friends data
    new_data = {'type': "friends"}

    # add the `type` field to the Friends data
    new_data.update({
        'items': serializer.data,
    })

    # return the updated Authors data
    return Response(new_data, status=status.HTTP_200_OK)
  
  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
def FriendPostList(request, author_uuid):
  # List all the followers
  if request.method == 'GET':
    try:  # try to get the followers
      author = Author.objects.get(uuid=author_uuid)
      followers = author.followers.all()
      friendIds = []
      
      for follower in followers:
        followerFollowers = Author.objects.get(uuid=follower.uuid).followers.all()
        for followerFollower in followerFollowers:
          if str(followerFollower.id) == str(author.id):
            friendIds.append(follower.id)
      
      friend_posts = Post.objects.filter(author__id__in=friendIds, unlisted=False).order_by('-published')

    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # get the page number and size
    page_number = getPageNumber(request)
    page_size = getPageSize(request)

    # get the paginated friend_posts
    paginated_friend_posts = getPaginatedObject(friend_posts, page_number, page_size)

    # get the Post serializer
    serializer = PostSerializer(paginated_friend_posts, many=True)

    # create the `type` field for the Friends data
    new_data = {'type': "friendPosts"}

    # add the `type` field to the Friends data
    new_data.update({
        'items': serializer.data,
    })

    # return the updated Authors data
    return Response(new_data, status=status.HTTP_200_OK)
  
  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
def FollowerList(request, author_uuid):
  # List all the followers
  if request.method == 'GET':
    try:  # try to get the followers
        followers = Author.objects.get(uuid=author_uuid).followers.all()
    except:  # return an error if something goes wrong
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # get the page number and size
    page_number = getPageNumber(request)
    page_size = getPageSize(request)

    # get the paginated followers
    paginated_followers = getPaginatedObject(followers, page_number, page_size)

    # get the Author serializer
    serializer = AuthorSerializer(paginated_followers, many=True)

    # create the `type` field for the Followers data
    new_data = {'type': "followers"}

    # add the `type` field to the Followers data
    new_data.update({
        'items': serializer.data,
    })

    # return the updated Authors data
    return Response(new_data, status=status.HTTP_200_OK)
  
  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'PUT', 'DELETE'])
def FollowerDetail(request, author_uuid, follower_uuid):

  # List a specific follower
  if request.method == 'GET':
    try:  # try to get the specific follower
      follower = Author.objects.get(uuid=author_uuid).followers.get(uuid=follower_uuid)
    except:  # return an error if something goes wrong
      return Response("false", status=status.HTTP_404_NOT_FOUND)

    # get the Author serializer
    # serializer = AuthorSerializer(follower, many=False)

    # return the Follower data
    return Response("true", status=status.HTTP_200_OK)

  # Create a specific follower
  elif request.method == 'PUT':
    # if the logged in user is not the author
    
    if not loggedInUserIsAuthor(request, author_uuid):  
      return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    try:  # try to get the author and potential follower
      author = Author.objects.get(uuid=author_uuid)
      follower = Author.objects.get(uuid=follower_uuid)
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)

    try:  # try to add the potential follower
      author.followers.add(follower)
      return Response({"message": "Follower created"}, # "data": follower raised and internal server error 500
        status=status.HTTP_201_CREATED)
    except:  # return an error if something goes wrong with the update
      return Response({"message": "something went wrong", 
        "author": author, "follower": follower}, 
        status=status.HTTP_400_BAD_REQUEST)
  
  # Delete a specific follower
  elif request.method == 'DELETE':
    # if the logged in user is not the author
    # if not loggedInUserIsAuthor(request, author_uuid):  
    #   return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    try:  # try to get the specific follower
      author = Author.objects.get(uuid=author_uuid)
      follower = Author.objects.get(uuid=follower_uuid)
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)
    
    try:
      # remove follower from the author's followers
      author.followers.remove(follower)
      # return a deletion message
      return Response({"message": "Follower deleted"}, 
        status=status.HTTP_204_NO_CONTENT)
    except:
      return Response(status=status.HTTP_404_NOT_FOUND)
  
  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
