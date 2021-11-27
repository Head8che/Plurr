from django.core.paginator import Paginator, EmptyPage
from requests.auth import HTTPBasicAuth
from rest_framework.response import Response

from api.serializers import AuthorSerializer, PostSerializer
from .models.authorModel import Author
from .models.postModel import Post
from rest_framework import status
from django.contrib.auth.hashers import make_password
import base64, requests, json

def getPageNumber(request, number=1):
  try:  # try to get the `page` query parameter
    page = int(request.query_params['page'])
  except:  # set `page` to `1` if something goes wrong
    page = number
  
  # return the page number
  return page

def getPageSize(request, size=10):
  try:  # try to get the `size` query parameter
    page_size = int(request.query_params['size'])
  except:  # set `size` to `10` if something goes wrong
    page_size = size
  
  # return the page size
  return page_size

def getPaginatedObject(object, page, page_size):
  
  try:  # try to get the paginated object
    paginator = Paginator(object, page_size)
    paginated_object = paginator.page(page)
  except EmptyPage:  # get the last non-empty page if the requested page is empty
    paginated_object = paginator.page(paginator.num_pages)
  
  # return the paginated object
  return paginated_object

def handlePostImage(body):
  # check if the request body has a content type
  if hasattr(body, 'contentType'):
    try:  # try to handle the image if it exists
      contentType = body["contentType"]
      
      # if the content type is an image
      if (contentType.startswith("image/")):
        content = body["content"]
        
        # base64 encode the image
        if not content.startswith("data:image/"):
          url = content
          base64Img = base64.b64encode(requests.get(url).content).decode("utf-8")
          body["content"] = "data:" + contentType + "," + base64Img
    
    except:  # raise an error if something goes wrong
      raise ValueError('Image handling went wrong.')
  
  # return the request body
  return body

def isNotNoneOrEmpty(string):
  return str(string) is not None and str(string) != ""

def withTrailingSlash(string):
  if (isNotNoneOrEmpty(string)):
    return str(string) if string.endswith("/") else str(string) + "/"
  return None

def withoutTrailingSlash(string):
  if (isNotNoneOrEmpty(string)):
    return str(string[:-1]) if string.endswith("/") else str(string)
  return None

def getUUIDFromId(string):
  if (isNotNoneOrEmpty(string)):
    return (
      str(string.split("/")[-2]) if string.endswith("/")
      else str(string.split("/")[-1])
    )
  return None

def loggedInUserExists(request):
  try:  # try to get the logged in author
    logged_in_author_uuid = request.user.uuid
    Author.objects.get(uuid=logged_in_author_uuid)
  except:  # return an error if something goes wrong
    return False
  
  return True

def loggedInUserIsAuthor(request, author_uuid):
  print(request.user)
  try:  # try to get the logged in author
    logged_in_author_uuid = request.user.uuid
    Author.objects.get(uuid=logged_in_author_uuid)
  except:  # return an error if something goes wrong
    return False
  
  # if the logged in author isn't the author
  if str(logged_in_author_uuid) != str(author_uuid):
    return False
  
  return True

def loggedInUserHasId(request, author_id):
  try:  # try to get the logged in author
    logged_in_author_uuid = request.user.uuid
    loggedInAuthorObject = Author.objects.get(uuid=logged_in_author_uuid)
    authorObject = Author.objects.get(id=author_id)
  except:  # return an error if something goes wrong
    return False
  
  # if the logged in author isn't the author
  if loggedInAuthorObject.id != authorObject.id:  
    return False
  
  return True

def getLoggedInAuthorUUID(request):
  try:  # try to get the logged in author
    logged_in_author_uuid = request.user.uuid
    Author.objects.get(uuid=logged_in_author_uuid)
  except:  # return an error if something goes wrong
    return None
  
  return logged_in_author_uuid

def getLoggedInAuthorObject(request):
  try:  # try to get the logged in author
    logged_in_author_uuid = request.user.uuid
    loggedInAuthorObject = Author.objects.get(uuid=logged_in_author_uuid)
  except:  # return an error if something goes wrong
    return None
  
  return loggedInAuthorObject

def postToAuthorInbox(request, data, receiver_author_uuid):
  try:
    url = 'http://' + request.get_host() + '/service/author/' + receiver_author_uuid + '/inbox/'
    payload = data
    sender_author_authorization = request.headers['Authorization']
    headers = {'content-type': 'application/json', 'Authorization': sender_author_authorization}
    requests.post(url, data=json.dumps(payload), headers=headers)
  except:  # raise an error if something goes wrong
      raise ValueError('Posting to Inbox went wrong.')

# code adapted from https://stackoverflow.com/a/16511493
def _makeRemoteGetRequest(path, node):
    print("\npath\n" + path + "\n")
    print("username: " + node.remoteUsername + "\npassword: " + node.remotePassword + "\n")
    
    try:
      login_request = requests.get(path, auth=HTTPBasicAuth(node.remoteUsername, node.remotePassword))
      print("\n" + login_request.text + "\n")
      # print("\nstatus code: " + str(login_request.status_code) + "\n")
      return json.loads(login_request.text)
    except requests.exceptions.Timeout:
      print("\nREQUEST FAILED: TIMEOUT\n")
      return None
    except requests.exceptions.TooManyRedirects:
      print("\nREQUEST FAILED: BAD URL\n")
      return None
    except:
      print("\nREQUEST FAILED\n")
      return None
  
def _createAuthorObjectsFromNode(node):
  get_authors_path = node.host + "authors/"
  json_response = _makeRemoteGetRequest(get_authors_path, node)
  print("\n\nJSON RESPONSE\n" + str(json_response) + "\n\n")
  if json_response is not None:
    print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_authors_path, response=str(json_response)))
    remote_authors_list = json_response.get('items', None)
    if remote_authors_list is not None:
      for remote_author in remote_authors_list:
          remote_author_uuid = getUUIDFromId(remote_author.get('id'))
          remote_author_data = remote_author.copy()
          serializer = AuthorSerializer(data=remote_author_data)

          if serializer.is_valid():
              remote_author_data['uuid'] = remote_author_uuid
              remote_author_data['username'] = remote_author_uuid
              if remote_author_data['profileImage'] is None:
                  remote_author_data['profileImage'] = 'https://180dc.org/wp-content/uploads/2016/08/default-profile.png'
              remote_author_data['password'] = make_password(remote_author_uuid + "pass")
              Author.objects.update_or_create(**remote_author_data)
    return None
  
def _createPostObjectsFromNode(node):
  get_authors_path = node.host + "authors/"
  json_response = _makeRemoteGetRequest(get_authors_path, node)
  print("\n\nJSON RESPONSE\n" + str(json_response) + "\n\n")
  if json_response is not None:
    print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_authors_path, response=str(json_response)))
    remote_authors_list = json_response.get('items', None)
    if remote_authors_list is not None:
      for remote_author in remote_authors_list:
        remote_author_uuid = getUUIDFromId(remote_author.get('id'))
        remote_author_data = remote_author.copy()

        get_posts_path = node.host + "authors/" + remote_author_uuid + "/posts/"
        json_response = _makeRemoteGetRequest(get_posts_path, node)
        print("\n\nJSON RESPONSE\n" + str(json_response) + "\n\n")
        if json_response is not None:
          print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_posts_path, response=str(json_response)))
          remote_posts_list = json_response.get('items', None)
          if remote_posts_list is not None:
            for remote_post in remote_posts_list:
              remote_post_uuid = str(remote_post.get('id').split('/')[-1])
              remote_post_data = remote_post.copy()
              serializer = PostSerializer(data=remote_post_data)

              if serializer.is_valid():
                remote_post_data['host'] = remote_post_uuid
                Post.objects.update_or_create(**remote_post_data)
    return None

# def sendPostRequestAsUser(path, username, password, data=None):
#   try:
#     login_request = requests.post("http://127.0.0.1:8000/service/author/login/", data = {'username': username, 'password': password})
#     requests.post(path, json = data, headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + json.loads(login_request.text)["token"]})
#   except:  # raise an error if something goes wrong
#     raise ValueError('Sending the POST request went wrong.')