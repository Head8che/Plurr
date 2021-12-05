import React from "react"
import "./Authors.css"
import { Image, Card } from "react-bootstrap"
import PlurrChip from "../components/PlurrChip"
import {
  getAuthorIdOrRemoteLink,
  isRemoteAuthor,
  getAuthorImgOrDefault,
  isNotNullOrUndefined,
} from "../utils"

function Authors({ authors }) {
  return (
    <div>
      <h1 className="Authors-leftColLink" style={{ color: "black" }}>
        Authors
      </h1>
      {authors?.items?.map(
        (author, count) =>
          author?.displayName && (
            <Card key={count} className="Card my-5">
              <Card.Body
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
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
                        {author?.displayName}
                      </div>
                    </a>
                  </div>
                </div>
                {isRemoteAuthor(author) &&
                  (isNotNullOrUndefined(author?.host) ? (
                    <PlurrChip text="remote" host={author.host} />
                  ) : (
                    <PlurrChip text="remote" />
                  ))}
              </Card.Body>
            </Card>
          )
      )}
    </div>
  )
}

export default Authors
