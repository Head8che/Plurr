import React from "react"
import { Modal } from "react-bootstrap"
import GitHubFeed from "react-github-activity"
import { useState } from "react"

export default function GithubModal({ loggedInUser, show, onHide }) {
  const [events, setEvents] = useState([])
  const gitUsername = loggedInUser.github.split("/")[3]
  const avatarUrl = ""
  if (show === true && events.length === 0) {
    fetch(`https://api.github.com/users/${gitUsername}/events`)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setEvents(data)
        console.log("fetched")
      })
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Your Github Activity
          {loggedInUser?.displayName}
          {loggedInUser?.github}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overflow-auto">
        <GitHubFeed
          fullName={loggedInUser?.displayName}
          userName={gitUsername}
          avatarUrl={avatarUrl}
          events={events}
        />
      </Modal.Body>
    </Modal>
  )
}
