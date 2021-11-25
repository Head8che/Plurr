import React from "react"
import { Row, Col, Image, Button } from "react-bootstrap"
import EditProfileModal from "../components/EditProfileModal"
import PostContent from "../components/PostContent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import CreatePost from "../components/CreatePost"
import { getBackEndHostWithSlash, getUUIDFromId } from "../utils"

export default function Author({
  loggedInUser,
  author,
  authorFollowers,
  posts,
  liked,
  inbox,
  triggerRerender,
}) {
  const showEdit = author.id === loggedInUser.id
  const [showUnfollow, setShowUnfollow] = React.useState(
    authorFollowers?.items?.filter((author) => author.id === loggedInUser.id)
      .length > 0
  )
  const [disableRequest, setDisableRequest] = React.useState(
    inbox?.items?.filter(
      (item) =>
        item.type === "follow" &&
        item.actor.id === loggedInUser.id &&
        item.object.id === author.id
    ).length > 0
  )
  const [modalShowEdit, setModalShowEdit] = React.useState(false)
  const authorLiked = liked?.items?.map((likedObject) => likedObject.object)

  const host = getBackEndHostWithSlash()

  const sendFriendRequest = () => {
    const author_uuid = getUUIDFromId(author.id)
    host &&
      fetch(`${host}service/author/${author_uuid}/inbox/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          type: "follow",
          actor: loggedInUser,
          object: author,
        }),
      }).then((corsResponse) => {
        const apiPromise = corsResponse.json()
        apiPromise.then((apiResponse) => {
          if (corsResponse.status === 201) {
            setDisableRequest(true)
          }
          console.log(apiResponse)
        })
      })
  }

  const unfollowAuthor = () => {
    const author_uuid = author.id.endsWith("/")
      ? author.id.split("/").slice(-2).shift()
      : author.id.split("/").pop()
    host &&
      fetch(
        `${host}service/author/${author_uuid}/followers/${loggedInUser.uuid}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ).then((corsResponse) => {
        if (corsResponse.status === 204) {
          setShowUnfollow(false)
        }
      })
  }

  return (
    <div>
      <Row>
        <Col xs={6} md={10} style={{ display: "flex", alignItems: "center" }}>
          <Image
            className="fluid"
            src={author?.profileImage}
            roundedCircle
            style={{
              objectFit: "cover",
              backgroundColor: "#EEE",
              width: "50px",
              height: "50px",
              marginRight: "12px",
            }}
          />
          <div
            style={{
              color: "#333",
              fontSize: "1.3rem",
              fontWeight: "700",
              marginRight: "7px",
            }}
          >
            {author.displayName}
          </div>
          <a href={author.github}>
            <FontAwesomeIcon
              icon={faGithub}
              style={{
                width: "23px",
                height: "23px",
                marginTop: "0px",
                color: "#777",
              }}
            />
          </a>
        </Col>
        <Col
          xs={6}
          md={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
          }}
        >
          {showEdit ? (
            <>
              <Button
                className="pl-5"
                variant="outline-primary"
                style={{
                  justifySelf: "end",
                  padding: "5px 20px",
                }}
                onClick={() => setModalShowEdit(true)}
              >
                Edit
              </Button>
              <EditProfileModal
                authorUUID={loggedInUser.uuid}
                author={author}
                show={modalShowEdit}
                onHide={() => setModalShowEdit(false)}
                closeModal={() => setModalShowEdit(false)}
              />
            </>
          ) : showUnfollow ? (
            <Button
              id="unfollowButton"
              className="pl-5"
              variant="secondary"
              onClick={() => {
                unfollowAuthor()
              }}
            >
              Unfollow
            </Button>
          ) : disableRequest ? (
            <Button
              id="followButton"
              className="pl-5"
              variant="outline-secondary"
              style={{ pointerEvents: "none" }}
            >
              Friend Request
            </Button>
          ) : (
            <Button
              id="followButton"
              className="pl-5"
              variant="outline-primary"
              onClick={() => {
                sendFriendRequest()
              }}
            >
              Friend Request
            </Button>
          )}
        </Col>
      </Row>
      {showEdit ? (
        <CreatePost
          loggedInUser={loggedInUser}
          author={author}
          triggerRerender={triggerRerender}
        />
      ) : null}
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
