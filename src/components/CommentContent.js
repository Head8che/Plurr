import React from "react"
import "./CommentContent.css"
import { Row, Col, Image } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"
import {
  getBackEndHostWithSlash,
  withoutTrailingSlash,
  getAuthorIdOrRemoteLink,
  getAuthorImgOrDefault,
} from "../utils"

export default function CommentContent({
  loggedInUser,
  liked,
  comment,
  authorHasLiked,
}) {
  const author = comment?.author
  const loggedInUserIsAuthor =
    loggedInUser?.id &&
    withoutTrailingSlash(loggedInUser?.id) ===
      withoutTrailingSlash(comment?.author?.id)
  const [isLiked, setIsLiked] = React.useState(authorHasLiked)

  // const authorLiked = liked?.items?.map(likedObject => likedObject.object)

  const host = getBackEndHostWithSlash()

  const fetchAndSetIsLiked = () => {
    // post the validated data to the backend registration service
    host &&
      fetch(`${host}service/author${comment.id.split("/author")[1]}/likes/`, {
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
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div>
          <a
            href={getAuthorIdOrRemoteLink(author)}
            style={{ textDecoration: "none" }}
          >
            <Image
              className="fluid"
              src={getAuthorImgOrDefault(author?.profileImage)}
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
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: "1",
            backgroundColor: "#F8F8F8",
            borderRadius: "5px",
            padding: "0.6rem 1rem",
          }}
        >
          <Row style={{ display: "flex", flexGrow: "1" }}>
            <Col
              xs={12}
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <a
                href={getAuthorIdOrRemoteLink(author)}
                style={{ textDecoration: "none" }}
              >
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
            </Col>
          </Row>
          <Row>
            <Col xs={12} style={{ display: "flex", alignItems: "center" }}>
              {comment.comment}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
