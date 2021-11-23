import React from 'react'
import { Button, Card} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faComment, faShare } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from "@fortawesome/free-brands-svg-icons"


function Inbox ({ loggedInUser, inbox })  {

  const [inboxItems, setInboxItems] = React.useState(inbox?.items);
  if (inbox.type !== 'inbox') return null;
  
  return (
    <div>
      <h1 className='' style={{color: "black"}}> My Inbox</h1>
      {console.log(inbox)}
      {inbox?.items?.map((inboxItem, count) => {
        // console.log(inboxItem)   
        return <div key={count}>{inboxItem.type}</div>
      })}
      <div>a {inbox?.items?.length}</div>
    </div>
  );
}

export default Inbox;
