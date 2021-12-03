import React from "react"
import { Image, Button, Card } from "react-bootstrap"
import {
  getBackEndHostWithSlash,
  getUUIDFromId,
  withoutTrailingSlash,
} from "../utils"

export default function Followers({
  loggedInUser,
  author,
  followers,
  friends,
  triggerRerender,
}) {
  const host = getBackEndHostWithSlash()
  const friendIds = friends?.items?.map((friend) =>
    withoutTrailingSlash(friend?.id)
  )

  const isFriend = (follower) => {
    return friendIds?.includes(withoutTrailingSlash(follower?.id))
  }

  const unfollowAuthor = (follower) => {
    const author_uuid = author.id.endsWith("/")
      ? author.id.split("/").slice(-2).shift()
      : author.id.split("/").pop()
    host &&
      fetch(
        `${host}service/author/${author_uuid}/followers/${getUUIDFromId(
          follower.id
        )}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((corsResponse) => {
        if (corsResponse.status === 204) {
          triggerRerender()
        }
      })
  }

  return followers?.items?.map((follower, count) => {
    return (
      <Card key={count} className="Card my-5">
        <Card.Body
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Image
                className="fluid"
                src={follower?.profileImage}
                roundedCircle
                style={{
                  objectFit: "cover",
                  backgroundColor: "#EEE",
                  width: "40px",
                  height: "40px",
                  marginRight: "8px",
                }}
              />
              <div>
                <div
                  style={{
                    color: "#333",
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                >
                  <a
                    href={host + "author/" + getUUIDFromId(follower.id)}
                    style={{
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    {follower?.displayName}
                  </a>
                </div>
                <Card.Text>
                  {isFriend(follower) ? "Friend" : "Follower"}
                </Card.Text>
              </div>
            </div>
          </div>
          <Button
            style={{
              float: "right",
            }}
            onClick={() => unfollowAuthor(follower)}
          >
            Unfollow
          </Button>
        </Card.Body>
      </Card>
    )
  })
}
