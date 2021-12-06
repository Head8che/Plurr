import React from "react"
import "./Authors.css"
import { Card } from "react-bootstrap"
import { getFrontEndHostWithSlash, getUUIDFromId } from "../utils"

export default function PostComments({ postComments }) {
  const frontendHost = getFrontEndHostWithSlash()

  return (
    <div>
      <h1 className="Authors-leftColLink" style={{ color: "black" }}>
        Comments
      </h1>
      {postComments?.items?.map(
        (comment, count) =>
          comment?.author?.displayName && (
            <Card key={count} className="Card my-5">
              <Card.Body>
                <Card.Title>
                  {comment.type.charAt(0).toUpperCase() + comment.type.slice(1)}
                </Card.Title>
                <div>
                  {comment?.comment !== null &&
                  comment?.comment !== undefined ? (
                    <div>
                      <div>
                        <a
                          style={{ textDecoration: "none" }}
                          href={`${frontendHost}author/${getUUIDFromId(
                            comment?.author?.id
                          )}/`}
                        >{`${comment.author?.displayName} `}</a>
                        {`commented on this `}
                        <a
                          style={{ textDecoration: "none" }}
                          href={comment.id.split("/comments")[0]}
                        >
                          post
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
                        {`${comment?.comment}`}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <a
                        style={{ textDecoration: "none" }}
                        href={`${frontendHost}author/${getUUIDFromId(
                          comment?.author?.id
                        )}/`}
                      >{`${comment.author?.displayName} `}</a>
                      {`commented on this `}
                      <a style={{ textDecoration: "none" }} href={comment.id}>
                        post
                      </a>
                      .
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          )
      )}
    </div>
  )
}
