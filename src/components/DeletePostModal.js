import React from "react"
import { Modal, Button } from "react-bootstrap"
import { getBackEndHostWithSlash, withoutTrailingSlash } from "../utils"

export default function DeletePostModal({
  loggedInUser,
  post,
  show,
  onHide,
  closeModal,
  triggerRerender,
}) {
  const loggedInUserIsAuthor =
    loggedInUser?.id &&
    withoutTrailingSlash(loggedInUser?.id) ===
      withoutTrailingSlash(post?.author?.id)

  const submitHandler = (data) => {
    const host = getBackEndHostWithSlash()

    host &&
      loggedInUserIsAuthor &&
      fetch(`${host}service/author${post.id.split("/author")[1]}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((corsResponse) => {
        const apiPromise = corsResponse.text()
        apiPromise
          .then((apiResponse) => {
            console.log(apiResponse)
            closeModal()
            triggerRerender()
          })
          .catch((e) => {
            console.log(e)
          })
      })
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Delete your post
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Are you sure you want to delete this post?
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className="pl-5"
              variant="outline-primary"
              style={{ padding: "0.375rem 1rem" }}
              onClick={() => {
                closeModal()
              }}
            >
              Cancel
            </Button>
          </div>
          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className="pl-5"
              variant="primary"
              type="submit"
              style={{
                padding: "0.375rem 1rem",
                marginLeft: "10px",
              }}
              onClick={() => {
                submitHandler()
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
