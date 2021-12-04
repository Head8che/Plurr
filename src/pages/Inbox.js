import React from "react"
import { Card, Button } from "react-bootstrap"
import CommentContent from "../components/CommentContent"
import PostContent from "../components/PostContent"
import { getBackEndHostWithSlash, getUUIDFromId } from "../utils"

function Inbox({ loggedInUser, inbox, followers, liked, triggerRerender }) {
  const host = getBackEndHostWithSlash()
  const [inboxItemCount, setInboxItemCount] = React.useState(
    inbox.type !== "inbox" ? 0 : inbox?.items?.length
  )
  const [disableClear, setDisableClear] = React.useState(
    inbox.type !== "inbox" ? true : inbox?.items?.length === 0
  )

  if (inbox.type !== "inbox") return null

  const authorLiked = liked?.items?.map((likedObject) => likedObject.object)

  const isAlreadyAFollower = (newFollower) => {
    return (
      followers?.items?.filter((author) => author.id === newFollower.id)
        .length > 0
    )
  }

  const clearInbox = () => {
    host &&
      fetch(`${host}service/author/${loggedInUser.uuid}/inbox/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((corsResponse) => {
        console.log(corsResponse)
        if (corsResponse.status === 204) {
          setDisableClear(true)
          setInboxItemCount(0)
          triggerRerender()
        }
      })
  }

  const acceptFriendRequest = (object, actor) => {
    const object_uuid = getUUIDFromId(object.id)
    const actor_uuid = getUUIDFromId(actor.id)

    host &&
      fetch(`${host}service/author/${object_uuid}/followers/${actor_uuid}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(actor),
      }).then((corsResponse) => {
        const apiPromise = corsResponse.json()
        apiPromise.then(() => {
          triggerRerender()
        })
      })
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 className="" style={{ color: "black" }}>
          My Inbox
        </h1>
        {disableClear ? (
          <Button
            className="pl-5"
            variant="outline-secondary"
            style={{
              justifySelf: "end",
              padding: "7px 13px",
              pointerEvents: "none",
            }}
          >
            Clear Inbox
          </Button>
        ) : (
          <Button
            className="pl-5"
            variant="outline-primary"
            style={{
              justifySelf: "end",
              padding: "7px 13px",
            }}
            onClick={() => {
              clearInbox()
            }}
          >
            Clear Inbox
          </Button>
        )}
      </div>
      <div>Number of Items in Inbox: {inboxItemCount}</div>
      {inbox?.items?.map((inboxItem, count) => {
        if (inboxItem?.type.toLowerCase() === "follow") {
          return (
            <Card key={count} className="Card my-5">
              <Card.Body>
                <Card.Title>
                  {inboxItem.type.charAt(0).toUpperCase() +
                    inboxItem.type.slice(1)}
                </Card.Title>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {" "}
                  {inboxItem.actor?.displayName} wants to follow you!
                  <Button
                    variant={`${
                      isAlreadyAFollower(inboxItem.actor)
                        ? "secondary"
                        : "primary"
                    }`}
                    style={{
                      pointerEvents: `${
                        isAlreadyAFollower(inboxItem.actor) ? "none" : "auto"
                      }`,
                    }}
                    onClick={() => {
                      acceptFriendRequest(inboxItem?.object, inboxItem?.actor)
                    }}
                  >
                    Accept
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )
        } else if (inboxItem?.type.toLowerCase() === "like") {
          return (
            <Card key={count} className="Card my-5">
              <Card.Body>
                <Card.Title>
                  {inboxItem.type.charAt(0).toUpperCase() +
                    inboxItem.type.slice(1)}
                </Card.Title>
                <div>
                  {inboxItem?.summary !== null &&
                  inboxItem?.summary !== undefined &&
                  inboxItem?.summary !== ""
                    ? inboxItem?.summary
                    : inboxItem?.summary?.includes("comment")
                    ? `${inboxItem.actor?.displayName} likes something your comment`
                    : `${inboxItem.actor?.displayName} likes something your post`}
                </div>
              </Card.Body>
            </Card>
          )
        } else if (inboxItem?.type.toLowerCase() === "comment") {
          return (
            <CommentContent
              key={inboxItem.id}
              loggedInUser={loggedInUser}
              comment={inboxItem}
              liked={liked}
              authorHasLiked={authorLiked?.includes(inboxItem.id)}
            />
          )
        } else if (inboxItem?.type.toLowerCase() === "post") {
          return (
            <PostContent
              key={inboxItem.id}
              loggedInUser={loggedInUser}
              post={inboxItem}
              liked={liked}
              authorHasLiked={authorLiked?.includes(inboxItem.id)}
              triggerRerender={triggerRerender}
              inInbox={true}
            />
          )
        } else {
          return null
        }
      })}
    </div>
  )
}

export default Inbox
