import React from "react"

function Inbox({ loggedInUser, inbox }) {
    if (inbox.type !== "inbox") return null

    return (
        <div>
            <h1 className="" style={{ color: "black" }}>
                {" "}
                My Inbox
            </h1>
            <div>Number of Items in Inbox: {inbox?.items?.length}</div>
            {inbox?.items?.map((inboxItem, count) => {
                // console.log(inboxItem)
                return <div key={count}>{inboxItem.type}</div>
            })}
        </div>
    )
}

export default Inbox
