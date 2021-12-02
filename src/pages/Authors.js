import React from "react"
import "./Authors.css"
import { Row, Col, Image, Card } from "react-bootstrap"

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
                    <a href={author.id} style={{ textDecoration: "none" }}>
                      <Image
                        className="fluid"
                        src={
                          author?.profileImage &&
                          (author?.profileImage.endsWith(".jpg") ||
                            author?.profileImage.endsWith(".jpeg") ||
                            author?.profileImage.endsWith(".png"))
                            ? author?.profileImage
                            : "https://180dc.org/wp-content/uploads/2016/08/default-profile.png"
                        }
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
                        {author?.displayName}
                      </div>
                    </a>
                  </div>
                </div>
                {!(
                  author?.host.includes("plurr") ||
                  author?.host.includes("local")
                ) && (
                  <div
                    style={{
                      backgroundColor: "orange",
                      borderRadius: "40px",
                      padding: "2px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    remote
                  </div>
                )}
              </Card.Body>
            </Card>
          )
      )}
    </div>
  )
}

export default Authors
