import React from "react"
import "./CreateComment.css"
import { Row, Col, Image, Button, Form } from "react-bootstrap"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { getBackEndHostWithSlash, getAuthorImgOrDefault } from "../utils"

export default function CreateComment({
  loggedInUser,
  author,
  post,
  triggerRerender,
  postCommentCount,
  setPostCommentCount,
}) {
  // schema to validate form inputs
  const validationSchema = Yup.object().shape({
    comment: Yup.string().required("Post comment is required"),
  })

  // get form functions and link validation schema to form
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const submitHandler = (data) => {
    console.log(data)

    const newData = { ...data }
    if (newData.title === "") {
      delete newData.title
    }

    const host = getBackEndHostWithSlash()

    // post the validated data to the backend registration service
    fetch(`${host}service/author${post.id.split("/author")[1]}/comments/`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newData),
    })
      .then((corsResponse) => {
        const apiPromise = corsResponse.json()
        apiPromise
          .then((apiResponse) => {
            // empty out the form
            reset()
            setPostCommentCount(postCommentCount + 1)
            triggerRerender()

            console.log(apiResponse)
          })
          .catch((e) => {
            // get the errors object
            const errors = e.response.data

            // set comment errors
            if (errors.comment) {
              setError("comment", {
                type: "server",
                message: errors.comment[0],
              })
            }
          })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Row style={{ marginTop: "30px" }}>
          <Col xs={12} style={{ display: "flex", alignItems: "flex-start" }}>
            <a href={loggedInUser.id} style={{ textDecoration: "none" }}>
              <Image
                className="fluid"
                src={getAuthorImgOrDefault(loggedInUser?.profileImage)}
                roundedCircle
                style={{
                  objectFit: "cover",
                  backgroundColor: "#EEE",
                  width: "40px",
                  height: "40px",
                  marginRight: "8px",
                }}
              />
            </a>
            {/* comment Form Field */}
            <Form.Group className="mb-3" style={{ flexGrow: 1 }}>
              <Form.Control
                defaultValue=""
                name="comment"
                placeholder="Add your comment"
                as="textarea"
                rows={5}
                style={{ padding: "0.75rem 0.85rem" }}
                {...register("comment")}
                className={`form-control ${errors.comment ? "is-invalid" : ""}`}
              />
              <Form.Text className="invalid-feedback">
                {errors.comment?.message}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row style={{ display: "flex" }}>
          {/* Submit Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className="pl-5"
              variant="primary"
              type="submit"
              style={{ padding: "0.6rem 1rem" }}
            >
              Comment
            </Button>
          </div>
        </Row>
      </Form>
    </div>
  )
}
