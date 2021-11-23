import React from "react";
import { Modal, Row, Col, Image, Button, Form, Card } from 'react-bootstrap';
import { useUserHandler } from "../UserContext"
import { getBackEndHostWithSlash } from "../utils"

export default function DeletePostModal({authorUUID, postUUID, author, show, onHide, closeModal}) {
  const {setLoggedInUser} = useUserHandler()
    
  
// // get form functions and link validation schema to form
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(validationSchema)
//   });

  const submitHandler = (data) => {
    var postID = postUUID
    postID = postID.split('/').pop();
    

    const host = getBackEndHostWithSlash();

    fetch(`${host}service/author/${authorUUID}/posts/${postID}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    })
      .then((corsResponse) => {
        const apiPromise = corsResponse.text();
        apiPromise.then((apiResponse) => {
          const userData = JSON.parse(apiResponse).data
          const userObject = {
            ...JSON.parse(localStorage.getItem('user')), 
            displayName: userData.displayName, 
            github: userData.github
          }
          
          // set the logged in user
          localStorage.setItem('user', JSON.stringify(userObject));
          setLoggedInUser(userObject);

          closeModal();
        }).catch((error) => {
          console.log(error)
        })
      })
    };

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
      <Form onSubmit={(submitHandler)}>
          <Card key={1} className = 'Card my-5 border-0' style={{boxShadow: "#e0e3e8 0px 1px 1px, #e0e3e8 0px 1px 2px", borderRadius: "7px"}}>
            <Card.Body className="p-4">
              <Row>
                <Col xs={6} style={{display: 'flex', alignItems: 'flex-start'}}>
                  <a href={author.id} style={{textDecoration: "none"}}>
                    <Image className='fluid' 
                      src={author?.profileImage} 
                      roundedCircle style={{objectFit: "cover", 
                        backgroundColor: "#EEE", width: "40px", height: "40px", marginRight: "8px"}} />
                  </a>
                  {/* title Form Field */}
                  {/* <Form.Group className="mb-3" style={{flexGrow: 1}}>
                    <Form.Control defaultValue="" name="title" placeholder="Post title (optional)" as="textarea" rows={1} style={{padding: "1rem 0.85rem", resize: "none"}}
                      {...register('title')} 
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}/>
                    <Form.Text className="invalid-feedback">{errors.title?.message}</Form.Text>
                  </Form.Group> */}
                </Col>
                <Col xs={3}>
                  {/* <FloatingLabel controlId="type" name="type" label="Type">
                    <Form.Select aria-label="Floating label select example" {...register('type')} >
                      <option value="text/plain">text/plain</option>
                      <option value="text/markdown">text/markdown</option>
                      <option value="application/base64">application/base64</option>
                      <option value="image/png;base64">image/png;base64</option>
                      <option value="image/jpeg;base64">image/jpeg;base64</option>
                    </Form.Select>
                  </FloatingLabel> */}
                </Col>
                <Col xs={3}>
                  {/* <FloatingLabel controlId="visibility" name="visibility" label="Visibility" {...register('visibility')} >
                    <Form.Select aria-label="Floating label select example">
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="FRIENDS">FRIENDS</option>
                    </Form.Select>
                  </FloatingLabel> */}
                </Col>
              </Row>
              <Row>
                <Col xs={12} style={{display: 'flex', alignItems: 'flex-start'}}>
                  <a href={author.id} style={{textDecoration: "none", opacity: '0', pointerEvents: 'none'}}>
                    <Image className='fluid' 
                      src={author?.profileImage} 
                      roundedCircle style={{objectFit: "cover", 
                        backgroundColor: "#EEE", width: "40px", height: "40px", marginRight: "8px"}} />
                  </a>
                  {/* content Form Field */}
                  {/* <Form.Group className="mb-3" style={{flexGrow: 1}}>
                    <Form.Control defaultValue="" name="content" placeholder="Create your post" as="textarea" rows={5} style={{padding: "0.75rem 0.85rem"}}
                      {...register('content')} 
                      className={`form-control ${errors.content ? 'is-invalid' : ''}`}/>
                    <Form.Text className="invalid-feedback">{errors.content?.message}</Form.Text>
                  </Form.Group> */}
                </Col>
              </Row>

              <Row >
                {/* Submit Button */}
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Button className="pl-5" variant="primary" type="submit" style={{padding: '0.375rem 1rem'}}>Delete Post</Button>
                </div>
              </Row>
            </Card.Body>
          </Card>
        </Form>
     </Modal.Body>

    </Modal>
  );
}
