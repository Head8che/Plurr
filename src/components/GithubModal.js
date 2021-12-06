import React from "react"
import { ListGroup, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import moment from "moment"
import { useState } from "react"
import "./GithubModal.css"

export default function GithubModal({ loggedInUser, show, onHide }) {
  const [events, setEvents] = useState([])
  const gitUsername = loggedInUser.github.split("/")[3]
  if (show === true && events.length === 0) {
    fetch(`https://api.github.com/users/${gitUsername}/events`)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setEvents(data)
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
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overflow-scroll">
        <div className="github-header">
          <div className="github-icon">
            <FontAwesomeIcon
              icon={faGithub}
              style={{
                width: "40px",
                height: "40px",
                marginTop: "0px",
                color: "#777",
              }}
            />
          </div>
          <a className="github-link" href={"https://github.com/" + gitUsername}>
            <div className="github-displayname">
              {loggedInUser?.displayName}
            </div>
            <div className="github-username">{gitUsername}</div>
          </a>
          <div className="github-image">
            <img
              className="github-avatar"
              src={events[0] ? events[0].actor.avatar_url : ""}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="github-stats">
        <ListGroup style={{ width: "100%" }}>
          <div>
            {events.map((event) => {
              if (event.type === "IssuesEvent") {
                return (
                  <ListGroup.Item
                    key={event.id}
                    className="github-card octicon octicon-issue-closed"
                  >
                    {" "}
                    {gitUsername} {event.payload.action}{" "}
                    <a href={"https://github.com/" + event.repo.name}>
                      {event.repo.name}
                    </a>
                    <span className="github-time">
                      {" "}
                      {moment(event.created_at).fromNow()}{" "}
                    </span>
                  </ListGroup.Item>
                )
              } else {
                return (
                  <ListGroup.Item
                    key={event.id}
                    className="github-card octicon octicon-git-commit"
                  >
                    {" "}
                    {gitUsername} pushed{" "}
                    <a href={"https://github.com/" + event.repo.name}>
                      {event.repo.name}
                    </a>
                    <span className="github-time">
                      {" "}
                      {moment(event.created_at).fromNow()}{" "}
                    </span>
                  </ListGroup.Item>
                )
              }
            })}
          </div>
        </ListGroup>
      </Modal.Footer>
    </Modal>
  )
}
