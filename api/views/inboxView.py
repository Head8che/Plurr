from ..models.inboxModel import Inbox
from ..models.authorModel import Author
from ..models.likeModel import Like
from ..models.postModel import Post
from ..serializers import InboxSerializer, AuthorSerializer, LikeSerializer, PostSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..utils import getPageNumber, getPageSize, getPaginatedObject, loggedInUserIsAuthor, getLoggedInAuthorObject, withTrailingSlash, withoutTrailingSlash


def postIsInInbox(post, inbox):
  inboxItems = inbox if type(inbox) is list else inbox.items
  try:
    for item in inboxItems:
      if (item.type == "post" and item.id == post.id):
        return True
    return False
  except:
    return False

def followIsInInbox(follow, inbox):
  inboxItems = inbox if type(inbox) is list else inbox.items
  try:
    for item in inboxItems:
      if (
        item["type"] == "follow" 
        and item["actor"]["id"] == follow["actor"]["id"]
        and item["object"]["id"] == follow["object"]["id"]
      ):
        return True
    return False
  except:
    return False

def likeIsInInbox(like, inbox):
  inboxItems = inbox if type(inbox) is list else inbox.items
  try:
    for item in inboxItems:
      if (
        item.type == "like" 
        and item.author.id == like.author.id 
        and item.object == like.object
      ):
        return True
    return False
  except:
    return False

def validateAuthorObject(author, plurrAuthor=None):
  try:
    authorKeys = ['type', 'id', 'url', 'host', 'displayName', 'github', 'profileImage']
    authorObject = author.copy()

    for key in authorObject.keys():
      if key not in authorKeys:
        return [key.lower() + " is not a valid property of the Author object", 
          status.HTTP_400_BAD_REQUEST]
    
    if len(authorObject.keys()) != len(authorKeys):
      return ["the Author object has the wrong number of properties", 
        status.HTTP_400_BAD_REQUEST]
    
    if authorObject['host'] is None:
      return ["the Author object needs to have a valid host", 
        status.HTTP_400_BAD_REQUEST]
    
    if plurrAuthor is True:
      if not authorObject['id'].startswith(authorObject['host']):
        return ["the Author id needs to needs to start with the Author host", 
          status.HTTP_400_BAD_REQUEST]
      
      if not authorObject['url'].startswith(authorObject['host']):
        return ["the Author url needs to needs to start with the Author host", 
          status.HTTP_400_BAD_REQUEST]
    
    authorObject['type'] = authorObject['type'].lower()
    authorObject['id'] = withoutTrailingSlash(authorObject['id'])
    authorObject['host'] = withTrailingSlash(authorObject['host'])
    authorObject['id'] = authorObject['id'][:-1] if authorObject['id'].endsWith("/") else authorObject['id']

    if plurrAuthor is True:
      authorObject['id'] = authorObject['id'].lower().replace('/service', '').replace('/api', '')
      authorObject['url'] = authorObject['url'].lower().replace('/service', '').replace('/api', '')

    return authorObject
  except:
    return ["the Plurr Author object is invalid" if plurrAuthor is True else "the Author object is invalid", 
      status.HTTP_400_BAD_REQUEST]


def validateFollowObject(follow, inbox=None, toPlurr=None):
  try:
    followKeys = ['type', 'summary', 'actor', 'object']
    followObject = follow.copy()

    for key in followObject.keys():
      if key not in followKeys:
        return [key.lower() + " is not a valid property of the Follow object", 
          status.HTTP_400_BAD_REQUEST]
    
    if len(followObject.keys()) != len(followKeys):
      return ["the Follow object has the wrong number of properties", 
        status.HTTP_400_BAD_REQUEST]
    
    followObject['type'] = followObject['type'].lower()
    
    if toPlurr is True:
      followObject['actor'] = validateAuthorObject(followObject['actor'])
      followObject['object'] = validateAuthorObject(followObject['object'], plurrAuthor=True)
    else:
      followObject['actor'] = validateAuthorObject(followObject['actor'], plurrAuthor=True)
      followObject['object'] = validateAuthorObject(followObject['object'])

    if type(followObject['actor']) is list:
      return followObject['actor']
    
    if type(followObject['object']) is list:
      return followObject['object']
    
    if followObject['actor']['id'] == followObject['object']['id']:
      return ["Self-following is prohibited.", status.HTTP_409_CONFLICT]
    
    try:
      Author.objects.get(id=followObject['object']['id']).followers.get(id=followObject['actor']['id'])
      return ["Already following.", status.HTTP_409_CONFLICT]
    except:
      if (inbox is True) and followIsInInbox(followObject, inbox):
        return ["Inbox item already exists.", status.HTTP_409_CONFLICT]

    return followObject
  except:
    return ["the Follow object is invalid", status.HTTP_400_BAD_REQUEST]

def validateLikeObject(like, inbox=None, toPlurr=None):
  try:
    likeKeys = ['context', 'summary', 'type', 'author', 'object']
    likeObject = like.copy()

    for key in likeObject.keys():
      if key not in likeKeys:
        return [key.lower() + " is not a valid property of the Like object", 
          status.HTTP_400_BAD_REQUEST]
    
    if len(likeObject.keys()) != len(likeKeys):
      return ["the Like object has the wrong number of properties", 
        status.HTTP_400_BAD_REQUEST]
    
    likeObject['type'] = likeObject['type'].lower()
    
    if toPlurr is True:
      likeObject['author'] = validateAuthorObject(likeObject['author'])
      likeObject['object'] = validateAuthorObject(likeObject['object'], plurrAuthor=True)
    else:
      likeObject['author'] = validateAuthorObject(likeObject['author'], plurrAuthor=True)
      likeObject['object'] = validateAuthorObject(likeObject['object'])

    if type(likeObject['author']) is list:
      return likeObject['author']
    
    if type(likeObject['object']) is list:
      return likeObject['object']
    
    if likeObject['author']['id'] == likeObject['object']['id']:
      return ["Self-liking is prohibited.", status.HTTP_409_CONFLICT]
    
    try:
      Like.objects.get(author=likeObject['author'], object=likeObject['object'])
      return ["Already liked.", status.HTTP_409_CONFLICT]
    except:
      if (inbox is True) and likeIsInInbox(likeObject, inbox):
        return ["Inbox item already exists.", status.HTTP_409_CONFLICT]

    return likeObject
  except:
    return ["the Like object is invalid", status.HTTP_400_BAD_REQUEST]

def validatePostObject(post, inbox=None, toPlurr=None):
  try:
    postKeys = ['type', 'title', 'id', 'source', 'origin', 'description', 
        'contentType', 'content', 'author', 'categories', 'count', 'comments', 
        'published', 'visibility', 'unlisted']
    postObject = post.copy()

    for key in postObject.keys():
      if key not in postKeys:
        return [key.lower() + " is not a valid property of the Post object", 
          status.HTTP_400_BAD_REQUEST]
    
    postObject['type'] = postObject['type'].lower()
    
    if toPlurr is True:
      postObject['author'] = validateAuthorObject(postObject['author'])
    else:
      postObject['author'] = validateAuthorObject(postObject['author'], plurrAuthor=True)

    if type(postObject['author']) is list:
      return postObject['author']
    
    if postObject['author']['id'] == postObject['object']['id']:
      return ["Self-liking is prohibited.", status.HTTP_409_CONFLICT]
    
    try:
      Post.objects.get(id=postObject['id'])
      return ["Already posted.", status.HTTP_409_CONFLICT]
    except:
      if (inbox is True) and postIsInInbox(postObject, inbox):
        return ["Inbox item already exists.", status.HTTP_409_CONFLICT]

    return postObject
  except:
    return ["the Post object is invalid", status.HTTP_400_BAD_REQUEST]


@api_view(['POST', 'GET', 'DELETE'])
def InboxList(request, author_uuid):
  try:  # try to get the specific author
      authorObject = Author.objects.get(uuid=author_uuid)
  except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)

  # Create a new comment
  if request.method == 'POST':
    try:  # try to get the inbox
        inbox = Inbox.objects.get(author=authorObject.id)
    except:  # create an inbox if one doesn't already exist
        serializer = InboxSerializer(data={'author': authorObject.id})
        if serializer.is_valid():
          serializer.save(author=author_uuid)
        inbox = Inbox.objects.get(author=authorObject.id)

    try:  # try to get the item type
        item_type = request.data['type']
    except:  # # return an error if something goes wrong
        return Response({"message": "request has no type"}, status=status.HTTP_400_BAD_REQUEST)

    if item_type.lower() == 'post':
      try:  # try to validate the data
        print("\n\Post Object\n" + str(request.data) + "\n\n")
        validated_request = validatePostObject(request.data, inbox=True, toPlurr=True)
        
        if type(validated_request) is list:
          return Response({"message": validated_request[0], 
            "data": request.data}, status=validated_request[1])
      except:  # return an error if something goes wrong
        return Response({"message": "the Post object is invalid.", 
          "data": request.data}, status=status.HTTP_400_BAD_REQUEST)
        
      inbox.items.append(validated_request)
      inbox.save()
      return Response({"message": "Inbox item added", "data": validated_request}, 
        status=status.HTTP_201_CREATED)

    elif item_type.lower() == 'follow':
      try:  # try to validate the data
        print("\n\Follow Object\n" + str(request.data) + "\n\n")
        validated_request = validateFollowObject(request.data, inbox=True, toPlurr=True)
        
        if type(validated_request) is list:
          return Response({"message": validated_request[0], 
            "data": request.data}, status=validated_request[1])
      except:  # return an error if something goes wrong
        return Response({"message": "the Follow object is invalid.", 
          "data": request.data}, status=status.HTTP_400_BAD_REQUEST)
        
      inbox.items.append(validated_request)
      inbox.save()
      return Response({"message": "Inbox item added", "data": validated_request}, 
        status=status.HTTP_201_CREATED)

    elif item_type.lower() == 'like':
      try:  # try to validate the data
        print("\n\Like Object\n" + str(request.data) + "\n\n")
        validated_request = validateLikeObject(request.data, inbox=True, toPlurr=True)
        
        if type(validated_request) is list:
          return Response({"message": validated_request[0], 
            "data": request.data}, status=validated_request[1])
      except:  # return an error if something goes wrong
        return Response({"message": "the Like object is invalid.", 
          "data": request.data}, status=status.HTTP_400_BAD_REQUEST)
        
      inbox.items.append(validated_request)
      inbox.save()
      return Response({"message": "Inbox item added", "data": validated_request}, 
        status=status.HTTP_201_CREATED)

    else:
      # return an error if something goes wrong with the update
      return Response({"message": "Item type must be `post`, `follow` or `like`!"}, 
        status=status.HTTP_400_BAD_REQUEST)

  # List all the things in the author's inbox
  if request.method == 'GET':
    try:  # try to get the inbox items
        author = Author.objects.get(uuid=author_uuid)
        inbox = Inbox.objects.get(author=author.id)
    except:  # return an error if something goes wrong
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    loggedInAuthorObject = getLoggedInAuthorObject(request)

    # if the logged in user does not have an Author object
    if loggedInAuthorObject is None:
      return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    # get the page number and size
    page_number = getPageNumber(request)
    page_size = getPageSize(request)

    # get the paginated inbox
    paginated_inbox = getPaginatedObject(inbox.items, page_number, page_size)

    # create the `type` field for the Posts data
    new_data = {'type': "inbox", 'author': author.id}

    # add the `type` field to the Posts data
    new_data.update({
        'items': paginated_inbox.object_list,
    })

    # return the Inbox data
    return Response(new_data, status=status.HTTP_200_OK)
  
  # Delete the inbox
  elif request.method == 'DELETE':
    try:  # try to get the inbox
      inbox = Inbox.objects.get(author=authorObject.id)
    except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)
    
    # if the logged in user is not the author
    if not loggedInUserIsAuthor(request, author_uuid):  
      return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:  # if the logged in user is the author
      loggedInAuthorObject = getLoggedInAuthorObject(request)
      # if the logged in user does not have an Author object
      if loggedInAuthorObject is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    # clear the inbox
    inbox.items.clear()
    inbox.save()

    # return a deletion message
    return Response({"message": "Inbox cleared"}, 
      status=status.HTTP_204_NO_CONTENT)
  
  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
