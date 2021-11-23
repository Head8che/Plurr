import React from "react"
import "./PostContent.css"
import CommentContent from "./CommentContent"
import EditPost from "./EditPost"
import CreateComment from "./CreateComment"
import { Row, Col, Image, Button, Card } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeletePostModal from "../components/DeletePostModal"
// import EditPostModal from '../components/EditPostModal';
import { faHeart } from "@fortawesome/free-solid-svg-icons"
// import { faComment } from '@fortawesome/free-solid-svg-icons'
import { RiShareLine } from "react-icons/ri"
// import { RiShareFill } from 'react-icons/ri'
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"
import { getBackEndHostWithSlash } from "../utils"

export default function PostContent({
  loggedInUser,
  post,
  liked,
  authorHasLiked,
  setRenderNewPost,
}) {
  const [modalShowDelete, setModalShowDelete] = React.useState(false)
  // const [modalShowEdit, setModalShowEdit] = React.useState(false);
  const loggedInUserId = loggedInUser?.id?.endsWith("/")
    ? loggedInUser?.id?.slice(0, -1)
    : loggedInUser?.id
  const postAuthorId = post?.author?.id?.endsWith("/")
    ? post?.author?.id?.slice(0, -1)
    : post?.author?.id
  const author = post?.author
  const loggedInUserIsAuthor = loggedInUserId === postAuthorId
  const [isLiked, setIsLiked] = React.useState(authorHasLiked)
  const [isEditing, setIsEditing] = React.useState(false)
  const [shouldSubmitForm, setShouldSubmitForm] = React.useState(true)
  const [comments, setComments] = React.useState([])
  const authorLiked = liked?.items?.map((likedObject) => likedObject.object)

  const host = getBackEndHostWithSlash()

  React.useEffect(() => {
    post?.id?.split("/author")[1] &&
      fetch(`${host}service/author${post?.id?.split("/author")[1]}/comments/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((corsResponse) => {
        const apiPromise = corsResponse.json()
        apiPromise
          .then((apiResponse) => {
            // console.log(apiResponse)
            setComments(apiResponse.items)
          })
          .catch((e) => {
            console.log(e)
          })
      })
  }, [host, post, isLiked])

  const fetchAndSetIsLiked = () => {
    // post the validated data to the backend registration service
    fetch(`${host}service/author${post.id.split("/author")[1]}/likes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((corsResponse) => {
      const apiPromise = corsResponse.json()
      apiPromise
        .then((apiResponse) => {
          console.log(apiResponse)
          setIsLiked(!isLiked)
        })
        .catch((e) => {
          console.log(e)
        })
    })
  }

  return (
    <div>
      <Card
        key={1}
        className="Card my-5 border-0"
        style={{
          boxShadow: "#e0e3e8 0px 1px 1px, #e0e3e8 0px 1px 2px",
          borderRadius: "7px",
        }}
      >
        <Card.Body className="p-4">
          <Row>
            <Col xs={12} style={{ display: "flex", alignItems: "center" }}>
              <a href={author.id} style={{ textDecoration: "none" }}>
                <Image
                  className="fluid"
                  src={author?.profileImage}
                  roundedCircle
                  style={{
                    objectFit: "cover",
                    backgroundColor: "#EEE",
                    width: "40px",
                    height: "40px",
                    marginRight: "8px",
                  }}
                />
              </a>
              <a href={author.id} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    color: "#333",
                    fontSize: "1rem",
                    fontWeight: "700",
                  }}
                >
                  {author.displayName}
                </div>
              </a>
              {loggedInUserIsAuthor ? (
                <>
                  <Col
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    {isEditing ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          className="pl-5"
                          variant="primary"
                          form="edit_form"
                          type="submit"
                          style={{
                            padding: "0.4rem 1rem",
                          }}
                        >
                          Submit Edits
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline-primary"
                        style={{
                          padding: "0.4rem 1rem",
                        }}
                        onClick={() => {
                          setIsEditing(true)
                        }}
                      >
                        Edit
                      </Button>
                    )}

                    <Button
                      variant="outline-danger"
                      style={{
                        padding: "0.4rem 1rem",
                        marginLeft: "10px",
                      }}
                      onClick={() => setModalShowDelete(true)}
                    >
                      Delete
                    </Button>
                    <DeletePostModal
                      loggedInUser={loggedInUser}
                      post={post}
                      show={modalShowDelete}
                      onHide={() => setModalShowDelete(false)}
                      closeModal={() => setModalShowDelete(false)}
                      setRenderNewPost={setRenderNewPost}
                    />
                  </Col>
                </>
              ) : null}
            </Col>
          </Row>
          {isEditing ? (
            <EditPost
              key={shouldSubmitForm}
              loggedInUser={loggedInUser}
              author={author}
              post={post}
              shouldSubmitForm={shouldSubmitForm}
              setShouldSubmitForm={setShouldSubmitForm}
              setIsEditing={setIsEditing}
              setRenderNewPost={setRenderNewPost}
            />
          ) : (
            <>
              <Card.Title
                className="mt-3"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "500",
                }}
              >
                {post.title}
              </Card.Title>
              <Card.Text className="mb-2">{post.content}</Card.Text>
            </>
          )}
          <Row>
            <Col
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                className={`icon-container like ${
                  loggedInUserIsAuthor ? "isAuthor" : ""
                } ${isLiked ? "isLiked" : ""}`}
                onClick={() =>
                  loggedInUserIsAuthor
                    ? null
                    : isLiked
                    ? null
                    : fetchAndSetIsLiked()
                }
              >
                {isLiked ? (
                  <FontAwesomeIcon
                    style={{
                      color: "red",
                      width: "18px",
                      height: "18px",
                    }}
                    icon={faHeart}
                  />
                ) : (
                  <FontAwesomeIcon
                    style={{
                      color: `${loggedInUserIsAuthor ? "#CCC" : "grey"}`,
                      pointerEvents: `${loggedInUserIsAuthor ? "none" : ""}`,
                      width: "18px",
                      height: "18px",
                    }}
                    icon={farHeart}
                  />
                )}
              </div>
              <div className="icon-container share">
                <RiShareLine
                  style={{
                    color: "grey",
                    width: "18px",
                    height: "18px",
                  }}
                />
              </div>
            </Col>
          </Row>
          {comments.length === 0 ? null : (
            <div
              style={{
                borderBottom: "1px solid #CCC",
                height: "0px",
                width: "100%",
                marginTop: "20px",
                marginBottom: "30px",
              }}
            ></div>
          )}
          {comments &&
            comments?.map((comment) => {
              return (
                <CommentContent
                  key={comment.id}
                  loggedInUser={loggedInUser}
                  comment={comment}
                  liked={liked}
                  authorHasLiked={authorLiked?.includes(comment.id)}
                />
              )
            })}
          <div
            style={{
              borderBottom: "1px solid #CCC",
              height: "0px",
              width: "100%",
              marginTop: "30px",
            }}
          ></div>
          <CreateComment
            author={author}
            post={post}
            setRenderNewPost={setRenderNewPost}
          />
        </Card.Body>
      </Card>
    </div>
  )
}
