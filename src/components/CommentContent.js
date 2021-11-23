import React from 'react'
import './CommentContent.css'
import { Row, Col, Image, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
// import { faComment } from '@fortawesome/free-solid-svg-icons'
import { RiShareLine } from 'react-icons/ri'
// import { RiShareFill } from 'react-icons/ri'
import { faHeart as farHeart, faComment as farComment } from '@fortawesome/free-regular-svg-icons'

export default function CommentContent ({ loggedInUser, liked, comment, authorHasLiked })  {

  const loggedInUserId = loggedInUser?.id?.endsWith("/") ? loggedInUser?.id?.slice(0, -1) : loggedInUser?.id
  const commentAuthorId = comment?.author?.id?.endsWith("/") ? comment?.author?.id?.slice(0, -1) : comment?.author?.id
  const author = comment?.author
  const loggedInUserIsAuthor = loggedInUserId === commentAuthorId
  const [isLiked, setIsLiked] = React.useState(authorHasLiked)

  const authorLiked = liked?.items?.map(likedObject => likedObject.object)

  const fetchAndSetIsLiked = () => {
    // post the validated data to the backend registration service
      fetch(`http://127.0.0.1:8000/service/author${comment.id.split('/author')[1]}/likes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((corsResponse) => {
          const apiPromise = corsResponse.json();
          apiPromise.then((apiResponse) => {

            console.log(apiResponse)
            setIsLiked(!isLiked)
          }).catch((e) => {
            console.log(e)
          })
        })
  }
  
    return (
      <div style={{marginTop: "20px"}}>
              <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <div>
                  <a href={author.id} style={{textDecoration: "none"}}>
                    <Image className='fluid' 
                      src={author?.profileImage} 
                      roundedCircle style={{objectFit: "cover", 
                        backgroundColor: "#EEE", width: "40px", height: "40px", marginRight: "8px"}} />
                  </a>
                </div>
                <div style={{display: "flex", flexDirection: "column", flexGrow: "1", backgroundColor: "#F8F8F8", borderRadius: "5px", padding: "0.6rem 1rem"}}>
                  <Row style={{display: "flex", flexGrow: "1"}}>
                    <Col xs={12} style={{display: "flex", justifyContent: "space-between"}}>
                      <a href={author.id} style={{textDecoration: "none"}}>
                        <div style={{color: "#333", fontSize: "1rem", fontWeight: '700'}}>
                          {author.displayName}
                        </div>
                      </a>
                      <div className={`icon-container like ${loggedInUserIsAuthor ? "isAuthor" : ""} ${isLiked ? "isLiked" : ""}`} 
                        onClick={() => loggedInUserIsAuthor ? null : isLiked ? null : fetchAndSetIsLiked()}>
                          {isLiked ? 
                            <FontAwesomeIcon 
                              style={{color:'red', width: "18px", height: "18px"}} icon={faHeart}/> : 
                            <FontAwesomeIcon 
                              style={{color:`${loggedInUserIsAuthor ? "#CCC" : "grey"}`, 
                                pointerEvents: `${loggedInUserIsAuthor ? "none" : ""}`, 
                                width: "18px", height: "18px"}} icon={farHeart}/>
                          }
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} style={{display: 'flex', alignItems: 'center'}}>
                    {comment.comment}
                    </Col>
                  </Row>
                </div>
              </div>
      </div>
    );
  }
