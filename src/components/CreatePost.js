import React from "react"
import "./CreatePost.css"
import {
  Row,
  Col,
  Image,
  Button,
  Form,
  Card,
  FloatingLabel,
} from "react-bootstrap"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  withoutTrailingSlash,
  getBackEndHostWithSlash,
  getAuthorIdOrRemoteLink,
  isNotNullOrUndefined,
  getAuthorImgOrDefault,
} from "../utils"

export default function CreatePost({ loggedInUser, author, triggerRerender }) {
  const [postContentType, setPostContentType] = React.useState("text/plain")
  const [postImageSrc, setPostImageSrc] = React.useState(null)
  const [disableSubmit, setDisableSubmit] = React.useState(false)
  let postHasImageContentType =
    postContentType === "image/png;base64" ||
    postContentType === "image/jpeg;base64"

  // schema to validate form inputs
  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Post content is required"),
  })

  // get form functions and link validation schema to form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  })

  const submitHandler = (data) => {
    console.log("data")
    console.log(data)

    const newData = { ...data }
    if (newData.title === "") {
      delete newData.title
    }

    newData.type = "post"

    if (isNotNullOrUndefined(postImageSrc)) {
      newData.content = postImageSrc
    }

    if (
      withoutTrailingSlash(loggedInUser.id) !== withoutTrailingSlash(author.id)
    ) {
      setError("content", {
        type: "server",
        message: `${author.displayName} cannot post for ${loggedInUser.displayName}!`,
      })
      return
    }

    const host = getBackEndHostWithSlash()
    console.log("newData")
    console.log(newData)

    // post the validated data to the backend registration service
    fetch(`${host}service/author/${loggedInUser.uuid}/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newData),
    }).then((corsResponse) => {
      const apiPromise = corsResponse.json()
      apiPromise
        .then((apiResponse) => {
          // empty out the form
          reset()
          setPostImageSrc(null)
          setPostContentType("text/plain")
          triggerRerender()
          setDisableSubmit(false)

          console.log(apiResponse)
        })
        .catch((e) => {
          // get the errors object
          const errors = e.response.data

          // set content errors
          if (errors.content) {
            setError("content", {
              type: "server",
              message: errors.content[0],
            })
          }

          // set visibility errors
          if (errors.visibility) {
            setError("visibility", {
              type: "server",
              message: errors.visibility[0],
            })
          }

          // set type errors
          if (errors.type) {
            setError("type", {
              type: "server",
              message: errors.type[0],
            })
          }
        })
    })
  }

  function updateImage() {
    const file = document.getElementById("formFile").files[0]
    const reader = new FileReader()

    reader.onloadend = function () {
      // convert image file to base64 string
      setPostImageSrc(reader.result)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Card
          key={1}
          className="Card my-5 border-0"
          style={{
            boxShadow: "#e0e3e8 0px 1px 1px, #e0e3e8 0px 1px 2px",
            borderRadius: "7px",
          }}
        >
          <Card.Body className="p-4">
            <Row>
              <Col
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <a
                  href={getAuthorIdOrRemoteLink(author)}
                  style={{ textDecoration: "none" }}
                >
                  <Image
                    className="fluid"
                    src={getAuthorImgOrDefault(author?.profileImage)}
                    roundedCircle
                    style={{
                      objectfit: "cover",
                      backgroundColor: "#EEE",
                      width: "40px",
                      height: "40px",
                      marginRight: "8px",
                    }}
                  />
                </a>
                {/* title Form Field */}
                <Form.Group className="mb-3" style={{ flexGrow: 1 }}>
                  <Form.Control
                    defaultValue=""
                    name="title"
                    placeholder="Post title (optional)"
                    as="textarea"
                    rows={1}
                    style={{
                      padding: "1rem 0.85rem",
                      resize: "none",
                    }}
                    {...register("title")}
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
                    }`}
                  />
                  <Form.Text className="invalid-feedback">
                    {errors.title?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={3}>
                <FloatingLabel
                  controlId="contentType"
                  name="contentType"
                  label="Type"
                >
                  <Form.Select
                    id="postType"
                    aria-label="Floating label select example"
                    {...register("contentType")}
                    onChange={(e) => {
                      setPostImageSrc(null)
                      setPostContentType(
                        document.getElementById("postType").value
                      )
                    }}
                  >
                    <option value="text/plain">text/plain</option>
                    <option value="text/markdown">text/markdown</option>
                    <option value="application/base64">
                      application/base64
                    </option>
                    <option value="image/png;base64">image/png;base64</option>
                    <option value="image/jpeg;base64">image/jpeg;base64</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col xs={3}>
                <FloatingLabel
                  controlId="visibility"
                  name="visibility"
                  label="Visibility"
                >
                  <Form.Select
                    aria-label="Floating label select example"
                    {...register("visibility")}
                  >
                    <option value="PUBLIC">PUBLIC</option>
                    <option value="FRIENDS">FRIENDS</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col
                xs={12}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                {/* content Form Field */}
                {!postHasImageContentType && (
                  <Form.Group style={{ flexGrow: 1, marginLeft: "48px" }}>
                    <Form.Control
                      defaultValue=""
                      name="content"
                      id="content"
                      placeholder="Create your post"
                      as="textarea"
                      rows={5}
                      style={{ padding: "0.75rem 0.85rem" }}
                      {...register("content")}
                      className={`form-control ${
                        errors.content ? "is-invalid" : ""
                      }`}
                    />
                    <Form.Text className="invalid-feedback">
                      {errors.content?.message}
                    </Form.Text>
                  </Form.Group>
                )}
              </Col>
            </Row>

            {postHasImageContentType && (
              <Row
                style={{
                  marginLeft: "37px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    minHeight: "200px",
                    maxHeight: "500px",
                    position: "relative",
                    padding: "0px",
                    backgroundColor: "transparent",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {postImageSrc ? (
                    <img
                      id="postImageContent"
                      src={postImageSrc}
                      objectfit="contain"
                      alt="preview..."
                      style={{
                        maxWidth: "100%",
                        minHeight: "200px",
                        maxHeight: "500px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        position: "absolute",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        fontSize: "18px",
                      }}
                    >
                      No Image Selected
                    </div>
                  )}
                </div>
              </Row>
            )}

            <Row className="mt-3">
              {/* Submit Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {postHasImageContentType && (
                  <Button
                    className="pl-5"
                    variant="outline-primary"
                    // type="file"
                    // id="formFile"
                    onClick={() => {
                      document.getElementById("formFile").click()
                    }}
                    style={{ padding: "0.6rem 1rem", marginRight: "10px" }}
                  >
                    Upload Image
                  </Button>
                )}
                <Button
                  className="pl-5"
                  variant="primary"
                  type="submit"
                  style={{
                    padding: "0.6rem 1rem",
                    pointerEvents: `${disableSubmit ? "none" : "auto"}`,
                  }}
                  onClick={() => {
                    setDisableSubmit(true)
                    setValue("content", "value")
                  }}
                >
                  Create Post
                </Button>
                <input
                  className="form-control"
                  type="file"
                  id="formFile"
                  accept={
                    postContentType === "image/png;base64"
                      ? "image/png"
                      : postContentType === "image/jpeg;base64"
                      ? "image/jpeg"
                      : null
                  }
                  // {...register("contentx")}
                  onChange={updateImage}
                  style={{ display: "none" }}
                ></input>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </Form>
    </div>
  )
}
