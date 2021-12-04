from ..models.inboxModel import Inbox
from ..models.authorModel import Author
from ..models.likeModel import Like
from ..models.postModel import Post
from ..serializers import InboxSerializer, AuthorSerializer, LikeSerializer, PostSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..utils import (getPageNumber, getPageSize, getPaginatedObject, loggedInUserIsAuthor, 
  getLoggedInAuthorObject, validatePostObject, validateFollowObject, validateLikeObject, validateCommentObject)


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
        validated_request = validatePostObject(request.data, inbox=inbox, toPlurr=True)
        
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
        validated_request = validateFollowObject(request.data, inbox=inbox, toPlurr=True)
        
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
        validated_request = validateLikeObject(request.data, inbox=inbox, toPlurr=True)
        
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

    elif item_type.lower() == 'comment':
      try:  # try to validate the data
        print("\n\Comment Object\n" + str(request.data) + "\n\n")
        validated_request = validateCommentObject(request.data, inbox=inbox, toPlurr=True)
        
        if type(validated_request) is list:
          return Response({"message": validated_request[0], 
            "data": request.data}, status=validated_request[1])
      except:  # return an error if something goes wrong
        return Response({"message": "the Comment object is invalid.", 
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
