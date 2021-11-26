*** Authors
    - URL: ://service/authors/
      - GET: retrieve all profiles on the server paginated
         - page: how many pages
         - size: how big is a page
    - Example query: GET ://service/authors?page=10&size=5 
      - Gets the 5 authors, authors 45 to 49.
    - Example: GET ://service/authors/
      #+BEGIN_SRC json
      {
          "type": "authors",      
          "items":[
              {
                  "type":"author",
                  "id":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                  "url":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                  "host":"http://127.0.0.1:5454/",
                  "displayName":"Greg Johnson",
                  "github": "http://github.com/gjohnson",
                  "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
              },
              {
                  "type":"author",
                  "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                  "host":"http://127.0.0.1:5454/",
                  "displayName":"Lara Croft",
                  "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                  "github": "http://github.com/laracroft",
                  "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
              }
          ]
      }
      #+END_SRC

*** Author
    - URL: ://service/author/{AUTHOR_ID}/
      - GET: retrieve their profile
      - POST: update profile
    - Example Format:
      #+BEGIN_SRC json
      {
          "type":"author",
          # ID of the Author
          "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
          # the home host of the author
          "host":"http://127.0.0.1:5454/",
          # the display name of the author
          "displayName":"Lara Croft",
          # url to the authors profile
          "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
          # HATEOS url for Github API
          "github": "http://github.com/laracroft",
          # Image from a public domain
          "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
      }
      #+END_SRC
*** Followers
    - URL: ://service/author/{AUTHOR_ID}/followers
      - GET: get a list of authors who are their followers
    - URL: ://service/author/{AUTHOR_ID}/followers/{FOREIGN_AUTHOR_ID}
      - DELETE: remove a follower
      - PUT: Add a follower (must be authenticated)
      - GET check if follower
    - Example: GET ://service/author/{AUTHOR_ID}/followers
      #+BEGIN_SRC json
      {
          "type": "followers",      
          "items":[
              {
                  "type":"author",
                  "id":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                  "url":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                  "host":"http://127.0.0.1:5454/",
                  "displayName":"Greg Johnson",
                  "github": "http://github.com/gjohnson",
                  "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
              },
              {
                  "type":"author",
                  "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                  "host":"http://127.0.0.1:5454/",
                  "displayName":"Lara Croft",
                  "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                  "github": "http://github.com/laracroft",
                  "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
              }
          ]
      }
      #+END_SRC
   
*** FriendRequest
    - This allows someone to follow you, so you can send them your posts.
    - Sent to inbox
    - Example format:
      #+BEGIN_SRC json
      {
          "type": "Follow",      
          "summary":"Greg wants to follow Lara",
          "actor":{
              "type":"author",
              "id":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
              "url":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
              "host":"http://127.0.0.1:5454/",
              "displayName":"Greg Johnson",
              "github": "http://github.com/gjohnson",
              "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
          },
          "object":{
              "type":"author",
              # ID of the Author
              "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
              # the home host of the author
              "host":"http://127.0.0.1:5454/",
              # the display name of the author
              "displayName":"Lara Croft",
              # url to the authors profile
              "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
              # HATEOS url for Github API
              "github": "http://github.com/laracroft",
              # Image from a public domain
              "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
          }
      }
      #+END_SRC

*** Post    
    - URL: ://service/author/{AUTHOR_ID}/posts/{POST_ID}
      - GET get the public post
      - POST update the post (must be authenticated)
      - DELETE remove the post
      - PUT create a post with that post_id
    - Creation URL ://service/author/{AUTHOR_ID}/posts/
      - GET get recent posts of author (paginated)
      - POST create a new post but generate a post_id
    - Be aware that Posts can be images that need base64 decoding.
      - posts can also hyperlink to images that are public
    - Example Format:
      #+BEGIN_SRC json
      {
          "type":"post",
          # title of a post
          "title":"A post title about a post about web dev",
          # id of the post
          "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e"
          # where did you get this post from?
          "source":"http://lastplaceigotthisfrom.com/posts/yyyyy",
          # where is it actually from
          "origin":"http://whereitcamefrom.com/posts/zzzzz",
          # a brief description of the post
          "description":"This post discusses stuff -- brief",
          # The content type of the post
          # assume either
          # text/markdown -- common mark
          # text/plain -- UTF-8
          # application/base64
          # image/png;base64 # this is an embedded png -- images are POSTS. So you might have a user make 2 posts if a post includes an image!
          # image/jpeg;base64 # this is an embedded jpeg
          # for HTML you will want to strip tags before displaying
          "contentType":"text/plain",
          "content":"Þā wæs on burgum Bēowulf Scyldinga, lēof lēod-cyning, longe þrāge folcum gefrǣge (fæder ellor hwearf, aldor of earde), oð þæt him eft onwōc hēah Healfdene; hēold þenden lifde, gamol and gūð-rēow, glæde Scyldingas. Þǣm fēower bearn forð-gerīmed in worold wōcun, weoroda rǣswan, Heorogār and Hrōðgār and Hālga til; hȳrde ic, þat Elan cwēn Ongenþēowes wæs Heaðoscilfinges heals-gebedde. Þā wæs Hrōðgāre here-spēd gyfen, wīges weorð-mynd, þæt him his wine-māgas georne hȳrdon, oð þæt sēo geogoð gewēox, mago-driht micel. Him on mōd bearn, þæt heal-reced hātan wolde, medo-ærn micel men gewyrcean, þone yldo bearn ǣfre gefrūnon, and þǣr on innan eall gedǣlan geongum and ealdum, swylc him god sealde, būton folc-scare and feorum gumena. Þā ic wīde gefrægn weorc gebannan manigre mǣgðe geond þisne middan-geard, folc-stede frætwan. Him on fyrste gelomp ǣdre mid yldum, þæt hit wearð eal gearo, heal-ærna mǣst; scōp him Heort naman, sē þe his wordes geweald wīde hæfde. Hē bēot ne ālēh, bēagas dǣlde, sinc æt symle. Sele hlīfade hēah and horn-gēap: heaðo-wylma bād, lāðan līges; ne wæs hit lenge þā gēn þæt se ecg-hete āðum-swerian 85 æfter wæl-nīðe wæcnan scolde. Þā se ellen-gǣst earfoðlīce þrāge geþolode, sē þe in þȳstrum bād, þæt hē dōgora gehwām drēam gehȳrde hlūdne in healle; þǣr wæs hearpan swēg, swutol sang scopes. Sægde sē þe cūðe frum-sceaft fīra feorran reccan",
          # the author has an ID where by authors can be disambiguated
          "author":{
                "type":"author",
                # ID of the Author
                "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                # the home host of the author
                "host":"http://127.0.0.1:5454/",
                # the display name of the author
                "displayName":"Lara Croft",
                # url to the authors profile
                "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                # HATEOS url for Github API
                "github": "http://github.com/laracroft",
                # Image from a public domain (optional, can be missing)
                "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
          },
          # categories this post fits into (a list of strings
          "categories":["web","tutorial"],
          # comments about the post
          # return a maximum number of comments
          # total number of comments for this post
          "count": 1023,
          # the first page of comments
          "comments":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments"
          # commentsSrc is OPTIONAL and can be missing
          # You should return ~ 5 comments per post.
          # should be sorted newest(first) to oldest(last)
          # this is to reduce API call counts
          "commentsSrc":{
              "type":"comments",
              "page":1,
              "size":5,
              "post":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e"
              "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments"
              "comments":[
                  {
                      "type":"comment",
                      "author":{
                          "type":"author",
                          # ID of the Author (UUID)
                          "id":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                          # url to the authors information
                          "url":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                          "host":"http://127.0.0.1:5454/",
                          "displayName":"Greg Johnson",
                          # HATEOS url for Github API
                          "github": "http://github.com/gjohnson",
                          # Image from a public domain
                          "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                      },
                      "comment":"Sick Olde English",
                      "contentType":"text/markdown",
                      # ISO 8601 TIMESTAMP
                      "published":"2015-03-09T13:07:04+00:00",
                      # ID of the Comment (UUID)
                      "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
                  }
              ]
          }
          # ISO 8601 TIMESTAMP
          "published":"2015-03-09T13:07:04+00:00",
          # visibility ["PUBLIC","FRIENDS"]
          "visibility":"PUBLIC",
          # for visibility PUBLIC means it is open to the wild web
          # FRIENDS means if we're direct friends I can see the post
          # FRIENDS should've already been sent the post so they don't need this
          "unlisted":false
          # unlisted means it is public if you know the post name -- use this for images, it's so images don't show up in timelines
      }
      #+END_SRC



*** Comments
    - URL: ://service/author/{author_id}/posts/{post_id}/comments access
      - GET get comments of the post
      - POST if you post an object of "type":"comment", it will add your comment to the post
    - paginated
    - example comment from ://service/author/{author_id}/posts/{post_id}/comments
      #+BEGIN_SRC json
      {
          "type":"comment",
          "author":{
              "type":"author",
              # ID of the Author (UUID)
              "id":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
              # url to the authors information
              "url":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
              "host":"http://127.0.0.1:5454/",
              "displayName":"Greg Johnson",
              # HATEOS url for Github API
              "github": "http://github.com/gjohnson",
              # Image from a public domain
              "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
          }
          "comment":"Sick Olde English",
          "contentType":"text/markdown",
          # ISO 8601 TIMESTAMP
          "published":"2015-03-09T13:07:04+00:00",
          # ID of the Comment (UUID)
          "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
      }
      #+END_SRC
    - example comments
      #+BEGIN_SRC json
      {
          "type":"comments",
          "page":1,
          "size":5,
          "post":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e"
          "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments"
          "comments":[
              {
                  "type":"comment",
                  "author":{
                      "type":"author",
                      # ID of the Author (UUID)
                      "id":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                      # url to the authors information
                      "url":"http://127.0.0.1:5454/author/1d698d25ff008f7538453c120f581471",
                      "host":"http://127.0.0.1:5454/",
                      "displayName":"Greg Johnson",
                      # HATEOS url for Github API
                      "github": "http://github.com/gjohnson",
                      # Image from a public domain
                      "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                  },
                  "comment":"Sick Olde English",
                  "contentType":"text/markdown",
                  # ISO 8601 TIMESTAMP
                  "published":"2015-03-09T13:07:04+00:00",
                  # ID of the Comment (UUID)
                  "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments/f6255bb01c648fe967714d52a89e8e9c",
              }
          ]
      }
      #+END_SRC


*** Likes
    - You can like posts and comments
    - Send them to the inbox
    - URL: ://service/author/{author_id}/inbox/
      - POST: send a like object to {author_id}
    - URL: ://service/author/{author_id}/post/{post_id}/likes
      - GET a list of likes from other authors on author_id's post post_id
    - URL: ://service/author/{author_id}/post/{post_id}/comments/{comment_id}/likes
      - GET a list of likes from other authors on author_id's post post_id comment comment_id
    - Example like object:
      #+BEGIN_SRC json
      {
          "@context": "https://www.w3.org/ns/activitystreams",
          "summary": "Lara Croft Likes your post",         
          "type": "Like",
          "author":{
              "type":"author",
              "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
              "host":"http://127.0.0.1:5454/",
              "displayName":"Lara Croft",
              "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
              "github":"http://github.com/laracroft",
              "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
          },
          "object":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e"
     }
     #+END_SRC
*** Liked
    - URL: ://service/author/{author_id}/liked
      - GET list what public things author_id liked.
        - It's a list of of likes originating from this author
    - 7
    - Example liked object:
      #+BEGIN_SRC json
      {
          "type":"liked",
          "items":[
              {
                  "@context": "https://www.w3.org/ns/activitystreams",
                  "summary": "Lara Croft Likes your post",         
                  "type": "Like",
                  "author":{
                      "type":"author",
                      "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                      "host":"http://127.0.0.1:5454/",
                      "displayName":"Lara Croft",
                      "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                      "github":"http://github.com/laracroft",
                      "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                  },
                  "object":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e"
              }
          ]
      }
      #+END_SRC

*** Inbox
    - The inbox is all the new posts from who you follow
    - URL: ://service/author/{AUTHOR_ID}/inbox
      - GET: if authenticated get a list of posts sent to {AUTHOR_ID}
      - POST: send a post to the author
        - if the type is "post" then add that post to the author's inbox
        - if the type is "follow" then add that follow is added to the author's inbox to approve later
        - if the type is "like" then add that like to the author's inbox
      - DELETE: clear the inbox
    - paginated
    - Example, retrieving an inbox
      #+BEGIN_SRC json
      {
          "type":"inbox",
          "author":"http://127.0.0.1:5454/author/c1e3db8ccea4541a0f3d7e5c75feb3fb",
          "items":[
              {
                  "type":"post",
                  "title":"A Friendly post title about a post about web dev",
                  "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/764efa883dda1e11db47671c4a3bbd9e"
                  "source":"http://lastplaceigotthisfrom.com/posts/yyyyy",
                  "origin":"http://whereitcamefrom.com/posts/zzzzz",
                  "description":"This post discusses stuff -- brief",
                  "contentType":"text/plain",
                  "content":"Þā wæs on burgum Bēowulf Scyldinga, lēof lēod-cyning, longe þrāge folcum gefrǣge (fæder ellor hwearf, aldor of earde), oð þæt him eft onwōc hēah Healfdene; hēold þenden lifde, gamol and gūð-rēow, glæde Scyldingas. Þǣm fēower bearn forð-gerīmed in worold wōcun, weoroda rǣswan, Heorogār and Hrōðgār and Hālga til; hȳrde ic, þat Elan cwēn Ongenþēowes wæs Heaðoscilfinges heals-gebedde. Þā wæs Hrōðgāre here-spēd gyfen, wīges weorð-mynd, þæt him his wine-māgas georne hȳrdon, oð þæt sēo geogoð gewēox, mago-driht micel. Him on mōd bearn, þæt heal-reced hātan wolde, medo-ærn micel men gewyrcean, þone yldo bearn ǣfre gefrūnon, and þǣr on innan eall gedǣlan geongum and ealdum, swylc him god sealde, būton folc-scare and feorum gumena. Þā ic wīde gefrægn weorc gebannan manigre mǣgðe geond þisne middan-geard, folc-stede frætwan. Him on fyrste gelomp ǣdre mid yldum, þæt hit wearð eal gearo, heal-ærna mǣst; scōp him Heort naman, sē þe his wordes geweald wīde hæfde. Hē bēot ne ālēh, bēagas dǣlde, sinc æt symle. Sele hlīfade hēah and horn-gēap: heaðo-wylma bād, lāðan līges; ne wæs hit lenge þā gēn þæt se ecg-hete āðum-swerian 85 æfter wæl-nīðe wæcnan scolde. Þā se ellen-gǣst earfoðlīce þrāge geþolode, sē þe in þȳstrum bād, þæt hē dōgora gehwām drēam gehȳrde hlūdne in healle; þǣr wæs hearpan swēg, swutol sang scopes. Sægde sē þe cūðe frum-sceaft fīra feorran reccan",
                  "author":{
                        "type":"author",
                        "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                        "host":"http://127.0.0.1:5454/",
                        "displayName":"Lara Croft",
                        "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                        "github": "http://github.com/laracroft",
                        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                  },
                  "categories":["web","tutorial"],
                  "comments":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments"
                  "published":"2015-03-09T13:07:04+00:00",
                  "visibility":"FRIENDS",
                  "unlisted":false
              },
              {
                  "type":"post",
                  "title":"DID YOU READ MY POST YET?",
                  "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/999999983dda1e11db47671c4a3bbd9e",
                  "source":"http://lastplaceigotthisfrom.com/posts/yyyyy",
                  "origin":"http://whereitcamefrom.com/posts/zzzzz",
                  "description":"Whatever",
                  "contentType":"text/plain",
                  "content":"Are you even reading my posts Arjun?",
                  "author":{
                        "type":"author",
                        "id":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                        "host":"http://127.0.0.1:5454/",
                        "displayName":"Lara Croft",
                        "url":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e",
                        "github": "http://github.com/laracroft",
                        "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                  },
                  "categories":["web","tutorial"],
                  "comments":"http://127.0.0.1:5454/author/9de17f29c12e8f97bcbbd34cc908f1baba40658e/posts/de305d54-75b4-431b-adb2-eb6b9e546013/comments"
                  "published":"2015-03-09T13:07:04+00:00",
                  "visibility":"FRIENDS",
                  "unlisted":false
              }
          ]
      }
      #+END_SRC

adapted from https://github.com/abramhindle/CMPUT404-project-socialdistribution/blob/master/project.org
