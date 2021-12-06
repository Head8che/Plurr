import React from "react"
import { Card, Button } from "react-bootstrap"
import PostContent from "../components/PostContent"
import {
  getBackEndHostWithSlash,
  getUUIDFromId,
  withoutTrailingSlash,
} from "../utils"

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
    console.log(withoutTrailingSlash(newFollower.id))
    console.log(
      followers?.items?.map((author) => withoutTrailingSlash(author.id))
    )
    return (
      followers?.items?.filter(
        (author) =>
          withoutTrailingSlash(author.id) ===
          withoutTrailingSlash(newFollower.id)
      ).length > 0
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
                  {`${inboxItem.author?.displayName} likes your `}
                  <a style={{ textDecoration: "none" }} href={inboxItem.object}>
                    {inboxItem.object.includes("comment") ? `comment` : `post`}
                  </a>
                  .
                </div>
              </Card.Body>
            </Card>
          )
        } else if (inboxItem?.type.toLowerCase() === "comment") {
          return (
            <Card key={count} className="Card my-5">
              <Card.Body>
                <Card.Title>
                  {inboxItem.type.charAt(0).toUpperCase() +
                    inboxItem.type.slice(1)}
                </Card.Title>
                <div>
                  {inboxItem?.comment !== null &&
                  inboxItem?.comment !== undefined ? (
                    <div>
                      <div>
                        {`${inboxItem.author?.displayName} commented on `}
                        <a
                          style={{ textDecoration: "none" }}
                          href={inboxItem.id.split("/comments")[0]}
                        >
                          one of your posts
                        </a>
                        .
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          backgroundColor: "#f4f4f5",
                          marginTop: "8px",
                          padding: "10px",
                          borderRadius: "5px",
                        }}
                      >
                        {`${inboxItem?.comment}`}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {`${inboxItem.author?.displayName} commented on `}
                      <a style={{ textDecoration: "none" }} href={inboxItem.id}>
                        one of your posts
                      </a>
                      .
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
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
