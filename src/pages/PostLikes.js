import React from "react"
import "./Authors.css"
import { Card } from "react-bootstrap"
import { getFrontEndHostWithSlash, getUUIDFromId } from "../utils"

export default function PostLikes({ postLikes }) {
  const frontendHost = getFrontEndHostWithSlash()

  return (
    <div>
      <h1 className="Authors-leftColLink" style={{ color: "black" }}>
        Likes
      </h1>
      {postLikes?.items?.map(
        (like, count) =>
          like?.author?.displayName && (
            <Card key={count} className="Card my-5">
              <Card.Body>
                <Card.Title>
                  {like.type.charAt(0).toUpperCase() + like.type.slice(1)}
                </Card.Title>
                <div>
                  <a
                    style={{ textDecoration: "none" }}
                    href={`${frontendHost}author/${getUUIDFromId(
                      like?.author?.id
                    )}/`}
                  >{`${like.author?.displayName} `}</a>
                  {`likes this `}
                  <a style={{ textDecoration: "none" }} href={like.object}>
                    {like.object.includes("comment") ? `comment` : `post`}
                  </a>
                  .
                </div>
              </Card.Body>
            </Card>
          )
      )}
    </div>
  )
}
