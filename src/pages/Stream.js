import React from 'react'
import PostContent from '../components/PostContent';


function Stream ({ loggedInUser, posts, liked })  {

  const authorLiked = liked?.items?.map(likedObject => likedObject.object)

  return (
    <div>
      <h1 className='' style={{color: "black"}}> My Plurr Feed</h1>
      { posts && posts.items?.map((post) => {
          return <PostContent key={post.id} loggedInUser={loggedInUser} liked={liked} post={post} authorHasLiked={authorLiked?.includes(post.id)} />
        })
      }
    </div>
  );
}

export default Stream;
