from ..models.likeModel import Like
from ..models.authorModel import Author
from ..serializers import LikeSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from ..utils import getPageNumber, getPageSize, getPaginatedObject


@api_view(['GET'])
def LikedList(request, author_uuid):
  try:  # try to get the specific author
      authorObject = Author.objects.get(uuid=author_uuid)
  except:  # return an error if something goes wrong
      return Response(status=status.HTTP_404_NOT_FOUND)
  
  # List all the things that author has liked
  if request.method == 'GET':
    try:  # try to get the liked items
        liked = Like.objects.filter(author=authorObject)
    except:  # return an error if something goes wrong
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # get the page number and size
    page_number = getPageNumber(request)
    page_size = getPageSize(request)

    # get the paginated liked
    paginated_liked = getPaginatedObject(liked, page_number, page_size)

    # get the Like serializer
    serializer = LikeSerializer(paginated_liked, many=True)

    # create the `type` field for the Liked data
    new_data = {'type': "liked"}

    # add the `type` field to the Liked data
    new_data.update({
        'items': serializer.data,
    })

    # return the updated Liked data
    return Response(new_data, status=status.HTTP_200_OK)
  
  # Handle unaccepted methods
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
