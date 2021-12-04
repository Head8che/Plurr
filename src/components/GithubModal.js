import React from "react"
import { Modal, Button } from "react-bootstrap"
import { getBackEndHostWithSlash, withoutTrailingSlash } from "../utils"

export default function GithubModal({ loggedInUser, post, show, onHide }) {
  const loggedInUserIsAuthor =
    loggedInUser?.id &&
    withoutTrailingSlash(loggedInUser?.id) ===
      withoutTrailingSlash(post?.author?.id)

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
          Your Github Activity
          {loggedInUser?.github}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body></Modal.Body>
    </Modal>
  )
}
