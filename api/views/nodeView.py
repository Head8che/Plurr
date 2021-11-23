from ..models.nodeModel import Node
from ..models.authorModel import Author
from ..serializers import AuthorSerializer
from django.http import HttpResponse
from rest_framework import authentication, exceptions, status
from rest_framework.response import Response
from urllib.parse import urlparse
import os, requests, uuid, base64

class nodeServices():
    ## Authentication of remote node(hosts) ##
    @staticmethod
    def nodeHeaders(request, userStatus=False):
        headers = {}
        ## Request header indicating the origin of the request ##
        headers['Origin'] = os.environ.get('HEROKU_HOST')
        if not userStatus:
            try:    
                author = Author.objects.get(request.user.id)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
            serializers = AuthorSerializer(author)
            # X-Request-User; the client that is requesting to the server 
            headers['X-Request-User'] = serializers.data['url']
        return headers


    ### HTTP Methods for RESTFUL Services [POST/GET/PUT/DELETE]
    ## POST Request of authenticated remote node(hosts) ##
    @staticmethod
    def authenticatedNode_POST(url, node, body, headers=None, JSONFormat=False):
        if body != None:
            if JSONFormat:
                postResponse = requests.post(url, json=body, auth=(node.authUsername, node.authPassword), headers=headers)
            else:
                postResponse = requests.post(url, data=body, auth=(node.authUsername, node.authPassword), headers=headers)
        else:
            postResponse = requests.post(url, auth=(node.authUsername, node.authPassword), headers=headers)
        return postResponse 

    ## GET Request of authenticated remote node(hosts) ##
    @staticmethod
    def authenticatedNode_GET(url, node, headers=None):
        getResponse = requests.get(url, auth=(node.authUsername, node.authPassword), headers=headers)
        return getResponse 


    ## PUT Request of authenticated remote node(hosts) ##
    @staticmethod
    def authenticatedNode_PUT(url, node, body, headers=None, JSONFormat=False):
        if body != None:
            if JSONFormat:
                putResponse = requests.put(url, json=body, auth=(node.authUsername, node.authPassword), headers=headers)
            else:
                putResponse = requests.put(url, data=body, auth=(node.authUsername, node.authPassword), headers=headers)
        else:            
            putResponse = requests.put(url, auth=(node.authUsername, node.authPassword), headers=headers)
        return putResponse 

    ## DELETE Request of authenticated remote node(hosts) ##
    @staticmethod
    def authenticatedNode_DELETE(url, node, body, headers=None, JSONFormat=False):
        if body != None:
            if JSONFormat:
                deleteResponse = requests.delete(url, json=body, auth=(node.authUsername, node.authPassword), headers=headers)
            else:
                deleteResponse = requests.delete(url, data=body, auth=(node.authUsername, node.authPassword), headers=headers)
        else:            
            deleteResponse = requests.delete(url, auth=(node.authUsername, node.authPassword), headers=headers)
        return deleteResponse 


    ## PUT REQUESTS ##
    ## [REMOTE ADD FOLLOWER] ##
    ## ''PUT'' Add Friend Request on remote node(hosts) ##
    @staticmethod
    def remoteAdd_FOLLOWER(request, **kwargs):
        ## Setting up the headers and the post request ##
        headers = nodeServices.nodeHeaders(request)
        urlParsed = urlparse(request.headers.get('X-Url'))
        ## scheme: The protocol name, usually http/https ;  netloc: Contains the network location ##
        parsedResult = urlParsed.scheme + "://" + urlParsed.netloc
        ## Get the established node object ##
        node = Node.objects.get(host=parsedResult)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            # PUT Request 
            url = f"{node.host}{urlParsed.path}"
            addfollower_Request = nodeServices.authenticatedNode_PUT(url, node, None, headers)
            return Response(addfollower_Request.json(), status=addfollower_Request.status_code)


    # DELETE REQUESTS ##
    ## [REMOTE DELETE FRIEND] ##
    ## ''DELETE'' Add Friend Request on remote node(hosts) ##
    @staticmethod
    def remoteDelete_FOLLOWER(request, **kwargs):
        ## Setting up the headers and the post request ##
        headers = nodeServices.nodeHeaders(request)
        urlParsed = urlparse(request.headers.get('X-Url'))
        ## scheme: The protocol name, usually http/https ;  netloc: Contains the network location ##
        parsedResult = urlParsed.scheme + "://" + urlParsed.netloc
        ## Get the established node object ##
        node = Node.objects.get(host=parsedResult)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            url = f"{node.host}{urlParsed.path}"
            # DELETE Request 
            deletefollower_Request = nodeServices.authenticatedNode_DELETE(url, node, request.data, headers)
            return Response(deletefollower_Request.text, status=deletefollower_Request.status_code)



    ## POST REQUESTS ##
    ## [REMOTE POST LIKE] ##
    ## ''POST'' Like Requests on remote node(hosts) ##
    @staticmethod 
    def remotePost_Like(request, **kwargs):
        ## Identifying the original host requested by the client in the Host HTTP request header ##
        hostHeader_Request = request.headers.get('X-Request-Host')
        ## Get the established node object ##
        node = Node.objects.get(host=hostHeader_Request)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            ## Setting up the headers ##.
            # POST Request 
            headers = nodeServices.nodeHeaders(request)
            urlParsed = urlparse(request.headers.get('X-Url'))
            url=f"{node.host}{urlParsed.path}"
            postlike_Request = nodeServices.authenticatedNode_POST(url, node, request.data, headers=headers, JSONFormat=True)
            return Response(postlike_Request.text, status=postlike_Request.status_code)
    
    
    ## POST REQUESTS ##
    ## [REMOTE POST COMMENT] ##
    ## ''POST'' Comment Requests on remote node(hosts) ##
    @staticmethod
    def remotePost_Comment(request, **kwargs):
        ## Identifying the original host requested by the client in the Host HTTP request header ##
        hostHeader_Request = request.headers.get('X-Request-Host')
        ## Get the established node object ##
        node = Node.objects.get(host=hostHeader_Request)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            ## Setting up the headers ##.
            # POST Request 
            headers = nodeServices.nodeHeaders(request)
            urlParsed = urlparse(request.headers.get('X-Url'))
            url =f"{node.host}{urlParsed.path}"
            postcomment_Request = nodeServices.authenticatedNode_POST(url, node, request.data, headers=headers, JSONFormat=True)
            return Response(postcomment_Request.text, status=postcomment_Request.status_code)

        
    ## POST REQUESTS ##
    ## [REMOTE POST INBOX] ##
    ## ''POST'' Inbox Requests on remote node(hosts) ##
    def remotePost_Inbox(request, **kwargs):
        ## Identifying the original host requested by the client in the Host HTTP request header ##
        hostHeader_Request = request.headers.get('X-Request-Host')
        ## Get the established node object ##
        node = Node.objects.get(host=hostHeader_Request)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            ## Setting up the headers ##.
            # POST Request 
            headers = nodeServices.nodeHeaders(request)
            urlParsed = urlparse(request.headers.get('X-Url'))
            url=f"{node.host}{urlParsed.path}"
            postinbox_Request = nodeServices.authenticatedNode_POST(url, node, request.data, headers=headers, JSONFormat=True)
            return Response(postinbox_Request.text, status=postinbox_Request.status_code)

        
    ## POST REQUESTS ##
    ## [REMOTE POST FRIEND REQUEST] ##
    ## ''POST'' Friend Request on remote node(hosts) ##
    @staticmethod
    def remotePost_FriendRequest(request, **kwargs):
        ## Setting up the headers and the post request ##
        headers = nodeServices.nodeHeaders(request)
        urlParsed = urlparse(request.headers.get('X-Url'))
        ## scheme: The protocol name, usually http/https ;  netloc: Contains the network location ##
        parsedResult= urlParsed.scheme + "://" + urlParsed.netloc
        ## Get the established node object ##
        node = Node.objects.get(host=parsedResult)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            ## Setting up the headers ##.
            # POST Request 
            url = f"{node.host}{urlParsed.path}"
            postfriend_Request = nodeServices.authenticatedNode_POST(url, node, request.data, headers=headers, JSONFormat=True)
            return Response(postfriend_Request.text, status=postfriend_Request.status_code)


    ## GET REQUESTS ##
    ## [REMOTE GET AUTHOR REQUEST] ##
    ## ''GET'' Author on remote node(hosts) ##
    @staticmethod
    def remoteGet_Author(request, **kwargs):
        ## Setting up the headers  ##
        headers = nodeServices.nodeHeaders(request)
        urlParsed = urlparse(request.headers.get('X-Url'))
        ## scheme: The protocol name, usually http/https ;  netloc: Contains the network location ##
        parsedResult= urlParsed.scheme + "://" + urlParsed.netloc
        ## Get the established node object ##
        node = Node.objects.get(host=parsedResult)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_404_NOT_FOUND)
        else:
            ## Setting up the headers ##.
            # GET Request 
            url = f"{node.host}{urlParsed.path}"
            getauthor_Request = nodeServices.authenticatedNode_GET(url, node, headers=headers)
            # Checks if a Remote connection has been established to an Author
            if not getauthor_Request:
                 return Response("Remote connection(Node) hasn't been established to Author", status=status.HTTP_404_NOT_FOUND)
            else:
                return Response(getauthor_Request.text, status=getauthor_Request.status_code)

    ## GET REQUESTS ##
    ## [REMOTE GET POSTS] ##
    ## ''GET'' POSTS on remote node(hosts) ##
    #### !!! STILL NEEDS PAGINATION TO BE INTEGERATED !!! ####
    @staticmethod
    def remoteGet_Posts(request, **kwargs):
        list_of_posts = []
        for node in Node.objects.exclude(host=os.environ.get('HEROKU_HOST')):
            try:
                headers = nodeServices.nodeHeaders(request)
                urlParsed = urlparse(request.headers.get('X-Url'))
                url=f"{node.host}{urlParsed.path}"
                getposts_Request = nodeServices.authenticatedNode_GET(url, node, headers=headers)
                return Response(getposts_Request.text, status=getposts_Request.status_code)
            except Exception as error:
                print(error)
                continue
        return list_of_posts
            

    ## GET REQUESTS ##
    ## [REMOTE GET POSTS] ##
    ## ''GET'' POSTS on remote node(hosts) ##
    #### !!! STILL NEEDS PAGINATION TO BE INTEGERATED !!! ####
    @staticmethod
    def remoteGet_Post(request,):
        ## Identifying the original host requested by the client in the Host HTTP request header ##
        hostHeader_Request = request.headers.get('X-Request-Host')
        ## Get the established node object ##
        node = Node.objects.get(host=hostHeader_Request)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            ## Setting up the headers ##.
            # GET Request 
            headers = nodeServices.nodeHeaders(request)
            urlParsed = urlparse(request.headers.get('X-Url'))
            url=f"{node.host}{urlParsed.path}"
            getpost_Request = nodeServices.authenticatedNode_GET(url, node, headers=headers)
            return Response(getpost_Request.text, status=getpost_Request.status_code)


    ## GET REQUESTS ##
    ## [REMOTE GET POSTS LIKES] ##
    ## ''GET'' POSTS LIKES on remote node(hosts) ##
    @staticmethod
    def remoteGet_PostLikes(request, **kwargs):
        ## Identifying the original host requested by the client in the Host HTTP request header ##
        hostHeader_Request = request.headers.get('X-Request-Host')
        ## Get the established node object ##
        node = Node.objects.get(host=hostHeader_Request)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            ## Setting up the headers ##.
            # GET Request 
            headers = nodeServices.nodeHeaders(request)
            urlParsed = urlparse(request.headers.get('X-Url'))
            url=f"{node.host}{urlParsed.path}"
            getpostLikes_Request = nodeServices.authenticatedNode_GET(url, node, headers=headers)
            return Response(getpostLikes_Request.text, status=getpostLikes_Request.status_code)


    ## GET REQUESTS ##
    ## [REMOTE GET Comments] ##
    ## ''GET'' Comments on remote node(hosts) ##
    @staticmethod
    def remoteGet_Comments(request, **kwargs):
        ## Identifying the original host requested by the client in the Host HTTP request header ##
        hostHeader_Request = request.headers.get('X-Request-Host')
        ## Get the established node object ##
        node = Node.objects.get(host=hostHeader_Request)
        # Checks if a Remote connection has been already established
        if not node:
            return Response("Remote connection(Node) hasn't been established", status=status.HTTP_400_BAD_REQUEST)
        else:
            ## Setting up the headers ##.
            # POST Request 
            headers = nodeServices.nodeHeaders(request)
            urlParsed = urlparse(request.headers.get('X-Url'))
            url=f"{node.host}{urlParsed.path}"
            getcomments_Request = nodeServices.authenticatedNode_GET(url, node, headers=headers)
            return Response(getcomments_Request.text, status=getcomments_Request.status_code)


## get_authorization_header ##
## From authentication.py from rest_framework ##
class BasicAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        authRequst = request.META
        if 'Basic' in authRequst:
            auth_split = authRequst.split()
            # authenticated username and pasword
            authentication = base64.b64decode(auth_split[-1]).decode('utf8')
            authenticated_Username, authenticated_Password = authentication.split(':')
            node = Node.objects.filter(host__exact=os.environ.get('HEROKU_HOST'))
            if not node.exist():
                response = HttpResponse("Request Admins, to add credentials to Server")
                response.status_code = status.HTTP_401_UNAUTHORIZED
            elif authenticated_Username == node[0].authUsername and authenticated_Password == node[0].authPassword:
                return (verifiedAuthentication(), None)
            else:
                raise exceptions.AuthenticationFailed("invalid Node credentials provided.")
        else:
            return None

class verifiedAuthentication:
    def __init__(self):
        # make a UUID based on the host ID and current time
        self.id = uuid.uuid1()
        self.verified_Authentication = True