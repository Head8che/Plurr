from django.core.paginator import Paginator, EmptyPage
from requests.auth import HTTPBasicAuth
from rest_framework.response import Response

from api.serializers import AuthorSerializer, PostSerializer
from .models.authorModel import Author
from .models.likeModel import Like
from .models.commentModel import Comment
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

def postIsInInbox(post, inbox):
  inboxItems = inbox if type(inbox) is list else inbox.items
  try:
    for item in inboxItems:
      try:
        if (item["type"] == "post" and item["id"] == post["id"]):
          return True
      except:
        pass
    return False
  except:
    return False

def followIsInInbox(follow, inbox):
  inboxItems = inbox if type(inbox) is list else inbox.items
  try:
    for item in inboxItems:
      try:
        if (
          item["type"] == "follow" 
          and item["actor"]["id"] == follow["actor"]["id"]
          and item["object"]["id"] == follow["object"]["id"]
        ):
          return True
      except:
        pass
    return False
  except:
    return False

def likeIsInInbox(like, inbox):
  inboxItems = inbox if type(inbox) is list else inbox.items
  try:
    for item in inboxItems:
      try:
        if (
          item["type"] == "like" 
          and item["author"]["id"] == like["author"]["id"] 
          and item["object"] == like["object"]
        ):
          return True
      except:
        pass
    return False
  except:
    return False

def commentIsInInbox(comment, inbox):
  inboxItems = inbox if type(inbox) is list else inbox.items
  try:
    for item in inboxItems:
      try:
        if (
          item["type"] == "comment" 
          and item["author"]["id"] == comment["author"]["id"] 
          and item["id"] == comment["id"]
        ):
          return True
      except:
        pass
    return False
  except:
    return False

def stripApiAndService(id):
  return id.lower().replace('/service', '').replace('/api', '')

def validateAuthorObject(author, plurrAuthor=None):
  try:
    authorKeys = ['type', 'id', 'url', 'host', 'displayName', 'github', 'profileImage']
    authorObject = author.copy()

    for key in authorObject.keys():
      if key not in authorKeys:
        return [key + " is not a valid property of the Author object", 
          status.HTTP_400_BAD_REQUEST]
    
    if len(authorObject.keys()) != len(authorKeys):
      return ["the Author object has the wrong number of properties", 
        status.HTTP_400_BAD_REQUEST]
    
    if authorObject['type'].lower() != "author":
      return ["the Author object has an invalid type", 
        status.HTTP_400_BAD_REQUEST]
    
    if authorObject['host'] is None:
      return ["the Author object needs to have a valid host", 
        status.HTTP_400_BAD_REQUEST]
    
    if plurrAuthor is True:
      if not authorObject['id'].startswith(authorObject['host']):
        return ["the Author id needs to start with the Author host", 
          status.HTTP_400_BAD_REQUEST]
      
      if not authorObject['url'].startswith(authorObject['host']):
        return ["the Author url needs to start with the Author host", 
          status.HTTP_400_BAD_REQUEST]
    
    authorObject['type'] = authorObject['type'].lower()
    authorObject['id'] = withoutTrailingSlash(authorObject['id'])
    authorObject['host'] = withTrailingSlash(authorObject['host'])

    if plurrAuthor is True:
      authorObject['id'] = authorObject['id'].lower().replace('/service', '').replace('/api', '')
      authorObject['url'] = authorObject['url'].lower().replace('/service', '').replace('/api', '')

    try:  # try to get the specific author
      authorObjectUUID = getUUIDFromId(authorObject['id'])
      author = Author.objects.get(uuid=authorObjectUUID)
    except:  # return an error if something goes wrong
      if authorObject['profileImage'] is None:
        authorObject['profileImage'] = 'https://180dc.org/wp-content/uploads/2016/08/default-profile.png'
      Author.objects.update_or_create(uuid=authorObjectUUID, username=authorObjectUUID, 
        password=make_password(str(authorObjectUUID) + "pass"), **authorObject)
      print("Author object created")
    
    return authorObject
  except:
    return ["the Plurr Author object is invalid" if plurrAuthor is True else "the Author object is invalid", 
      status.HTTP_400_BAD_REQUEST]


def validateFollowObject(follow, inbox=None, toPlurr=None):
  try:
    followKeys = ['type', 'summary', 'actor', 'object']
    followObject = follow.copy()

    if followObject['actor'].get('uuid', None) is not None:
      del followObject['actor']['uuid']
    
    if followObject['actor'].get('username', None) is not None:
      del followObject['actor']['username']

    for key in followObject.keys():
      if key not in followKeys:
        return [key + " is not a valid property of the Follow object", 
          status.HTTP_400_BAD_REQUEST]
    
    if len(followObject.keys()) != len(followKeys):
      return ["the Follow object has the wrong number of properties", 
        status.HTTP_400_BAD_REQUEST]
    
    if followObject['type'].lower() != "follow":
      return ["the Follow object has an invalid type", 
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
    
    if getUUIDFromId(followObject['actor']['id']) == getUUIDFromId(followObject['object']['id']):
      return ["Self-following is prohibited.", status.HTTP_409_CONFLICT]
    
    try:
      Author.objects.get(uuid=getUUIDFromId(followObject['object']['id'])).followers.get(uuid=getUUIDFromId(followObject['actor']['id']))
      return ["Already following.", status.HTTP_409_CONFLICT]
    except:
      if (inbox is not None) and followIsInInbox(followObject, inbox):
        return ["Inbox item already exists.", status.HTTP_409_CONFLICT]

    return followObject
  except:
    return ["the Follow object is invalid", status.HTTP_400_BAD_REQUEST]

def validateLikeObject(like, inbox=None, toPlurr=None):
  try:
    likeKeys = ['context', 'summary', 'type', 'author', 'object']
    likeObject = like.copy()

    if likeObject.get('@context', None) is not None:
      likeObject['context'] = likeObject['@context']
      del likeObject['@context']

    for key in likeObject.keys():
      if key not in likeKeys:
        return [key + " is not a valid property of the Like object", 
          status.HTTP_400_BAD_REQUEST]
    
    if len(likeObject.keys()) != len(likeKeys):
      return ["the Like object has the wrong number of properties", 
        status.HTTP_400_BAD_REQUEST]
    
    if likeObject['type'].lower() != "like":
      return ["the Like object has an invalid type", 
        status.HTTP_400_BAD_REQUEST]
    
    likeObject['type'] = likeObject['type'].lower()
    
    if toPlurr is True:
      likeObject['author'] = validateAuthorObject(likeObject['author'])
    else:
      likeObject['author'] = validateAuthorObject(likeObject['author'], plurrAuthor=True)

    if type(likeObject['author']) is list:
      return likeObject['author']
    
    try:
      Like.objects.get(author__id=likeObject['author']['id'], object=likeObject['object'])
      return ["Already liked.", status.HTTP_409_CONFLICT]
    except:
      if (inbox is not None) and likeIsInInbox(likeObject, inbox):
        return ["Inbox item already exists.", status.HTTP_409_CONFLICT]
      likeObjectWithoutAuthor = likeObject.copy()
      del likeObjectWithoutAuthor['author']
      try:  # try to get the specific author
        authorObjectUUID = getUUIDFromId(likeObject['author']['id'])
        author = Author.objects.get(uuid=authorObjectUUID)
        Like.objects.update_or_create(author=author, **likeObjectWithoutAuthor)
        print("Like object created")
      except:  # return an error if something goes wrong
        print("\n\nLike Object Author does not exist locally!\n\n")

    return likeObject
  except:
    return ["the Like object is invalid", status.HTTP_400_BAD_REQUEST]

def validateCommentObject(comment, inbox=None, toPlurr=None):
  try:
    commentKeys = ['type', 'author', 'comment', 'contentType', 'published', 'id']
    commentObject = comment.copy()

    for key in commentObject.keys():
      if key not in commentKeys:
        return [key + " is not a valid property of the comment object", 
          status.HTTP_400_BAD_REQUEST]
    
    if len(commentObject.keys()) != len(commentKeys):
      return ["the Comment object has the wrong number of properties", 
        status.HTTP_400_BAD_REQUEST]
    
    if commentObject['type'].lower() != "comment":
      return ["the Comment object has an invalid type", 
        status.HTTP_400_BAD_REQUEST]
    
    commentObject['type'] = commentObject['type'].lower()
    
    if toPlurr is True:
      commentObject['author'] = validateAuthorObject(commentObject['author'])
    else:
      commentObject['author'] = validateAuthorObject(commentObject['author'], plurrAuthor=True)

    if type(commentObject['author']) is list:
      return commentObject['author']
    
    try:
      comment.objects.get(author__id=commentObject['author']['id'], object=commentObject['object'])
      return ["Already commentd.", status.HTTP_409_CONFLICT]
    except:
      if (inbox is not None) and commentIsInInbox(commentObject, inbox):
        return ["Inbox item already exists.", status.HTTP_409_CONFLICT]
      commentObjectWithoutAuthor = commentObject.copy()
      del commentObjectWithoutAuthor['author']
      try:  # try to get the specific author
        authorObjectUUID = getUUIDFromId(commentObject['author']['id'])
        author = Author.objects.get(uuid=authorObjectUUID)
        postUUID = getUUIDFromId(commentObject['id'][:commentObject['id'].find('/comments')])
        post = Post.objects.get(uuid=postUUID)
        Comment.objects.update_or_create(uuid=getUUIDFromId(commentObject['id']), 
          author=author, post=post, **commentObjectWithoutAuthor)
        print("Comment object created")
      except:  # return an error if something goes wrong
        print("\n\nComment Object Author does not exist locally!\n\n")

    return commentObject
  except:
    return ["the Comment object is invalid", status.HTTP_400_BAD_REQUEST]

def validatePostObject(post, inbox=None, toPlurr=None):
  try:
    postKeys = ['type', 'title', 'id', 'source', 'origin', 'description', 
        'contentType', 'content', 'author', 'categories', 'count', 'comments', 
        'commentsSrc', 'published', 'visibility', 'unlisted']
    postObject = post.copy()

    if postObject.get('url', None) is not None:
      del postObject['url']
    if postObject.get('numLikes', None) is not None:
      del postObject['numLikes']
    
    for key in postObject.keys():
      if key not in postKeys:
        return [key + " is not a valid property of the Post object", 
          status.HTTP_400_BAD_REQUEST]
    
    if postObject['type'].lower() != "post":
      return ["the Post object has an invalid type", 
        status.HTTP_400_BAD_REQUEST]
    
    postObject['type'] = postObject['type'].lower()
    
    if toPlurr is True:
      postObject['author'] = validateAuthorObject(postObject['author'])
    else:
      postObject['author'] = validateAuthorObject(postObject['author'], plurrAuthor=True)

    if type(postObject['author']) is list:
      return postObject['author']
    
    if (inbox is not None) and postIsInInbox(postObject, inbox):
      return ["Inbox item already exists.", status.HTTP_409_CONFLICT]
    
    try:
      try:
        postObjectUUID = getUUIDFromId(postObject['id'])
        post = Post.objects.get(uuid=postObjectUUID)
      except:
        postObjectWithoutAuthor = postObject.copy()
        del postObjectWithoutAuthor['author']
        if postObjectWithoutAuthor.get('commentsSrc', None) is not None:
          del postObjectWithoutAuthor['commentsSrc']
        author = Author.objects.get(uuid=getUUIDFromId(postObject['author']['id']))
        postObjectUUID = getUUIDFromId(postObject['id'])
        Post.objects.update_or_create(uuid=postObjectUUID, author=author, **postObjectWithoutAuthor)
        print("Post object created")
    except:
      print("\nPost Object Author does not exist locally!\n\n")
    
    return postObject
  except:
    return ["the Post object is invalid", status.HTTP_400_BAD_REQUEST]

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

def getNodeServiceHostWithTralingSlash(node):
  if 'cmput404-vgt-socialdist' in node.host:
    return 'https://cmput404-vgt-socialdist.herokuapp.com/service/'
  elif 'project-api-404' in node.host:
    return 'https://project-api-404.herokuapp.com/api/'
  elif 'newconnection-server' in node.host:
    return 'https://newconnection-server.herokuapp.com/api/v1/'
  elif 'cmput-404-social-distribution' in node.host:
    return 'https://cmput-404-social-distribution.herokuapp.com/api/'
  else:
    return None

def _createAuthorObjectsFromNode(node):
  connected_hosts = ["https://cmput404-vgt-socialdist.herokuapp.com/", "https://project-api-404.herokuapp.com/api/",
    "https://newconnection-server.herokuapp.com/", "https://cmput-404-social-distribution.herokuapp.com/api/"]
  get_authors_path = getNodeServiceHostWithTralingSlash(node) + "authors/"
  json_response = _makeRemoteGetRequest(get_authors_path, node)
  print("\n\nJSON RESPONSE\n" + str(json_response) + "\n\n")
  if json_response is not None:
    print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_authors_path, response=str(json_response)))
    remote_authors_list = json_response if type(json_response) is list else json_response.get('items', None)
    if remote_authors_list is not None:
      for remote_author in remote_authors_list:
          remote_author_uuid = getUUIDFromId(stripApiAndService(remote_author.get('id')))
          remote_author_data = remote_author.copy()
          remote_author_data['id'] = stripApiAndService(remote_author_data['id'])
          validated_data = validateAuthorObject(remote_author_data)

          if type(validated_data) is not list:
              # remote_author_data['uuid'] = remote_author_uuid
              validated_data['username'] = remote_author_uuid
              if validated_data['profileImage'] is None:
                  validated_data['profileImage'] = 'https://180dc.org/wp-content/uploads/2016/08/default-profile.png'
              validated_data['password'] = make_password(str(remote_author_uuid) + "pass")
              if (remote_author_data['host'] in connected_hosts):
                try:  # try to get the specific author
                  Author.objects.get(uuid=remote_author_uuid)
                  print("Author object exists.")
                except:  # return an error if something goes wrong
                  Author.objects.update_or_create(uuid=remote_author_uuid, **validated_data)
                  print(validated_data)
                  print("Author object created.")
          else:
              print("\nauthor error list:\n")
              print(validated_data)
              print("\n\n")
    return None
  
def _createPostObjectsFromNode(node):
  connected_hosts = ["https://cmput404-vgt-socialdist.herokuapp.com/", "https://project-api-404.herokuapp.com/api/",
    "https://newconnection-server.herokuapp.com/", "https://cmput-404-social-distribution.herokuapp.com/api/"]
  get_authors_path = getNodeServiceHostWithTralingSlash(node) + "authors/"
  json_response = _makeRemoteGetRequest(get_authors_path, node)
  # print("\n\nJSON RESPONSE\n" + str(json_response) + "\n\n")
  if json_response is not None:
    # print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_authors_path, response=str(json_response)))
    remote_authors_list = json_response if type(json_response) is list else json_response.get('items', None)
    if remote_authors_list is not None:
      for remote_author in remote_authors_list:
        remote_author_uuid = getUUIDFromId(stripApiAndService(remote_author.get('id')))
        remote_author_data = remote_author.copy()

        get_posts_path = getNodeServiceHostWithTralingSlash(node) + "author/" + remote_author_uuid + "/posts/"
        json_response = _makeRemoteGetRequest(get_posts_path, node)
        print("\n\nJSON RESPONSE\n" + str(json_response) + "\n\n")
        if json_response is not None:
          print("\nPATH\n{path}\nRESPONSE\n{response}\n".format(path=get_posts_path, response=str(json_response)))
          remote_posts_list = json_response if type(json_response) is list else json_response.get('items', None)
          if remote_posts_list is not None:
            for remote_post in remote_posts_list:
              remote_post_data = remote_post.copy()

              if remote_post.get('post_id', None) is not None:
                remote_post_data['id'] = remote_post['post_id']
                remote_post_data.pop('post_id', None)
              
              remote_post_uuid = getUUIDFromId(remote_post_data.get('id'))
              validated_data = validatePostObject(remote_post_data, toPlurr=True)
              

              if type(validated_data) is not list:
                try:
                  if (remote_author_data['host'] in connected_hosts):
                    try:
                      Post.objects.get(uuid=remote_post_uuid)
                      print("Post object exists.")
                    except:
                      validated_data.pop('author', None)
                      validated_data['categories'] = '{}'
                      postAuthor = Author.objects.get(uuid=getUUIDFromId(remote_author.get('id')))
                      if (postAuthor['host'] in connected_hosts):
                        Post.objects.update_or_create(uuid=remote_post_uuid, author=postAuthor, **validated_data)
                        print("Post object created.")
                except:
                  print("post could not be created")
              else:
                print("\npost error list:")
                print(validated_data)
                print("\n\n")
    return None

# def sendPostRequestAsUser(path, username, password, data=None):
#   try:
#     login_request = requests.post("http://127.0.0.1:8000/service/author/login/", data = {'username': username, 'password': password})
#     requests.post(path, json = data, headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + json.loads(login_request.text)["token"]})
#   except:  # raise an error if something goes wrong
#     raise ValueError('Sending the POST request went wrong.')