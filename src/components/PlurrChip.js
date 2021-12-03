import React from "react"

export default function PlurrChip({ text }) {
  let bgColor
  let textColor

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
      <span style={{ fontSize: "12px", color: textColor }}>{text}</span>
    </div>
  )
}
