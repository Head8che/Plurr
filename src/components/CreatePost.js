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
import { appendOrKeepSlash, getBackEndHostWithSlash } from "../utils"

export default function CreatePost({ loggedInUser, author, setRenderNewPost }) {
    // schema to validate form inputs
    const validationSchema = Yup.object().shape({
        content: Yup.string().required("Post content is required"),
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

        if (
            appendOrKeepSlash(loggedInUser.id) !== appendOrKeepSlash(author.id)
        ) {
            setError("content", {
                type: "server",
                message: `${author.displayName} cannot post for ${loggedInUser.displayName}!`,
            })
            return
        }

        const host = getBackEndHostWithSlash()

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
                    setRenderNewPost(JSON.stringify(apiResponse))

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
                                    href={author.id}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Image
                                        className="fluid"
                                        src={author?.profileImage}
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
                                {/* title Form Field */}
                                <Form.Group
                                    className="mb-3"
                                    style={{ flexGrow: 1 }}
                                >
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
                                    controlId="type"
                                    name="type"
                                    label="Type"
                                >
                                    <Form.Select
                                        aria-label="Floating label select example"
                                        {...register("type")}
                                    >
                                        <option value="text/plain">
                                            text/plain
                                        </option>
                                        <option value="text/markdown">
                                            text/markdown
                                        </option>
                                        <option value="application/base64">
                                            application/base64
                                        </option>
                                        <option value="image/png;base64">
                                            image/png;base64
                                        </option>
                                        <option value="image/jpeg;base64">
                                            image/jpeg;base64
                                        </option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Col>
                            <Col xs={3}>
                                <FloatingLabel
                                    controlId="visibility"
                                    name="visibility"
                                    label="Visibility"
                                    {...register("visibility")}
                                >
                                    <Form.Select aria-label="Floating label select example">
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
                                <a
                                    href={author.id}
                                    style={{
                                        textDecoration: "none",
                                        opacity: "0",
                                        pointerEvents: "none",
                                    }}
                                >
                                    <Image
                                        className="fluid"
                                        src={author?.profileImage}
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
                                {/* content Form Field */}
                                <Form.Group
                                    className="mb-3"
                                    style={{ flexGrow: 1 }}
                                >
                                    <Form.Control
                                        defaultValue=""
                                        name="content"
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
                            </Col>
                        </Row>

                        <Row>
                            {/* Submit Button */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Button
                                    className="pl-5"
                                    variant="primary"
                                    type="submit"
                                    style={{ padding: "0.6rem 1rem" }}
                                >
                                    Create Post
                                </Button>
                            </div>
                        </Row>
                    </Card.Body>
                </Card>
            </Form>
        </div>
    )
}
