import React from "react"
import { Image, Button, Card } from "react-bootstrap"
import { getFrontEndHostWithSlash, getUUIDFromId } from "../utils"

export default function Followers({
  loggedInUser,
  author,
  followers,
  triggerRerender,
}) {
  const host = getFrontEndHostWithSlash()
  const isFriend = (follower) => {
    // doesn't work yet
    return true
  }

  const unfollowAuthor = (follower) => {
    host &&
      fetch(
        `${host}service/author/${follower.uuid}/followers/${loggedInUser.uuid}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((corsResponse) => {
        if (corsResponse.status === 204) {
          console.log(corsResponse.status)
        }
      })
  }

  // for (let follower of followers) {
  //   // make a fetch api call
  //   fetch(`${host}service/author/${getUUIDFromId(follower.id)}/followers/`, {})
  // }

  return followers?.items?.map((follower, count) => {
    return (
      <Card key={count} className="Card my-5">
        <Card.Body>
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
          <Button
            style={{
              float: "right",
            }}
            onClick={unfollowAuthor(follower)}
          >
            Unfollow
          </Button>
          <Card.Text>{isFriend(follower) ? "Friend" : "Follower"}</Card.Text>
        </Card.Body>
      </Card>
    )
  })
}
