import React from 'react'
import './CreatePost.css'
import { Row, Col, Form, FloatingLabel } from 'react-bootstrap';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { appendOrKeepSlash } from "../utils"
import { getBackEndHostWithSlash } from "../utils"

// export default function EditPost ({ loggedInUser, author, setRenderNewPost })  {
export default function EditPost ({ loggedInUser, author, post, setIsEditing, setRenderNewPost })  {

  // schema to validate form inputs
    const validationSchema = Yup.object().shape({
      content: Yup.string()
        .required('Post content is required')
      });

   // get form functions and link validation schema to form
    const { register, handleSubmit, setError, formState: { errors } } = useForm({
      resolver: yupResolver(validationSchema)
    });

    const submitHandler = (data) => {
      console.log(data)

      const newData = {...data}
      if (newData.title === '') {
        delete newData.title
      }

      if (appendOrKeepSlash(loggedInUser.id) !== appendOrKeepSlash(author.id)) {
        setError('content', {
          type: "server",
          message: `${author.displayName} cannot post for ${loggedInUser.displayName}!`,
        });
        return;
      }

      const host = getBackEndHostWithSlash();

      // post the validated data to the backend registration service
      fetch(`${host}service/author${post.id.split('/author')[1]}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newData)
      })
        .then((corsResponse) => {
          const apiPromise = corsResponse.json();
          apiPromise.then((apiResponse) => {

            console.log(apiResponse)
            if (setRenderNewPost) {
              setRenderNewPost(JSON.stringify(apiResponse))
            }
            setTimeout(() => {
              setIsEditing(false)
            }, 100);
          }).catch((e) => {
            // get the errors object
            console.log(e)
            const errors = e?.response?.data;

            // set content errors
            if (errors.content) {
              setError('content', {
                type: "server",
                message: errors.content[0],
              });
            }

            // set visibility errors
            if (errors.visibility) {
              setError('visibility', {
                type: "server",
                message: errors.visibility[0],
              });
            }

            // set type errors
            if (errors.type) {
              setError('type', {
                type: "server",
                message: errors.type[0],
              });
            }
          })
        })
    };

    
    return (
      <div>
        <Form id="edit_form" onSubmit={handleSubmit(submitHandler)}>
              <Row style={{marginTop: "15px"}}>
                <Col xs={6} style={{display: 'flex', alignItems: 'flex-start'}}>
                  {/* title Form Field */}
                  <Form.Group className="mb-3" style={{flexGrow: 1}}>
                    <Form.Control defaultValue={post.title} name="title" placeholder="Post title (optional)" as="textarea" rows={1} style={{padding: "1rem 0.85rem", resize: "none"}}
                      {...register('title')} 
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}/>
                    <Form.Text className="invalid-feedback">{errors.title?.message}</Form.Text>
                  </Form.Group>
                </Col>
                <Col xs={3}>
                  <FloatingLabel controlId="type" name="type" label="Type">
                    <Form.Select defaultValue={post.type} aria-label="Floating label select example" {...register('type')} >
                      <option value="text/plain">text/plain</option>
                      <option value="text/markdown">text/markdown</option>
                      <option value="application/base64">application/base64</option>
                      <option value="image/png;base64">image/png;base64</option>
                      <option value="image/jpeg;base64">image/jpeg;base64</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col xs={3}>
                  <FloatingLabel controlId="visibility" name="visibility" label="Visibility" {...register('visibility')} >
                    <Form.Select defaultValue={post.visibility} aria-label="Floating label select example">
                      <option value="PUBLIC">PUBLIC</option>
                      <option value="FRIENDS">FRIENDS</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
              </Row>
              <Row>
                <Col xs={12} style={{display: 'flex', alignItems: 'flex-start'}}>
                  {/* content Form Field */}
                  <Form.Group className="mb-3" style={{flexGrow: 1}}>
                    <Form.Control defaultValue={post.content} name="content" placeholder="Create your post" as="textarea" rows={5} style={{padding: "0.75rem 0.85rem"}}
                      {...register('content')} 
                      className={`form-control ${errors.content ? 'is-invalid' : ''}`}/>
                    <Form.Text className="invalid-feedback">{errors.content?.message}</Form.Text>
                  </Form.Group>
                </Col>
              </Row>
        </Form>
      </div>
    );
  }
  