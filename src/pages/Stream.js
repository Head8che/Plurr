import React from "react"
import PostContent from "../components/PostContent"

function Stream({ loggedInUser, posts, liked, triggerRerender }) {
  const authorLiked = liked?.items?.map((likedObject) => likedObject.object)

  return (
    <div>
      <h1 className="" style={{ color: "black" }}>
        {" "}
        My Plurr Feed
      </h1>
      {posts &&
        posts.items?.map((post) => {
          return (
            <PostContent
              key={post.id}
              loggedInUser={loggedInUser}
              post={post}
              liked={liked}
              authorHasLiked={authorLiked?.includes(post.id)}
              triggerRerender={triggerRerender}
            />
          )
        })}
    </div>
  )
}

export default Stream
