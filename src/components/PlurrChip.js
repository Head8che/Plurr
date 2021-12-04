import React from "react"

export default function PlurrChip({ text, host = null }) {
  let bgColor
  let textColor
  let remoteName

  switch (text.toLowerCase()) {
    case "remote":
      bgColor = "#ffdb99"
      textColor = "#b37300"
      break
    case "friends":
      bgColor = "#b3ffb3"
      textColor = "#009900"
      break
    default:
      bgColor = "#000"
      textColor = "#fff"
  }

  if (host !== null) {
    if (host.includes("cmput404-vgt-socialdist")) {
      remoteName = "404 VGT"
    } else if (host.includes("project-api-404")) {
      remoteName = "Project API"
    } else if (host.includes("newconnection-server")) {
      remoteName = "New Connection"
    } else if (host.includes("cmput-404-social-distribution")) {
      remoteName = "404 Social"
    } else {
      remoteName = null
    }
  }

  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: "40px",
        padding: "2px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: "12px", color: textColor }}>
        {remoteName ? `${text} : ${remoteName}` : text}
      </span>
    </div>
  )
}
