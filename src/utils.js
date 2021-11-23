// uses setObject setter to set object to fetch response
export const setObjectFromApi = (path, setObject) => {
    fetch(path, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    }).then((corsResponse) => {
        const apiPromise = corsResponse.json()
        apiPromise.then((apiResponse) => {
            console.log(apiResponse)

            // if the token is not valid
            if (apiResponse.code === "token_not_valid") {
                const host = getBackEndHostWithSlash()

                if (host !== null) {
                    // try to get a new token
                    fetch(`${host}service/api/token/refresh/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            refresh: `Bearer ${localStorage.getItem(
                                "refresh"
                            )}`,
                        }),
                    }).then((corsResponse) => {
                        const apiPromise = corsResponse.json()
                        apiPromise.then((apiResponse) => {
                            console.log(apiResponse)

                            // if getting a new token did not work
                            if (apiResponse.code === "token_not_valid") {
                                // remove the token
                                localStorage.removeItem("token")
                            } else {
                                // update the token
                                localStorage.setItem(
                                    "token",
                                    apiResponse.access
                                )
                                fetch(path, {
                                    method: "GET",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${localStorage.getItem(
                                            "token"
                                        )}`,
                                    },
                                }).then((corsResponse) => {
                                    const apiPromise = corsResponse.json()
                                    apiPromise.then((apiResponse) => {
                                        console.log(apiResponse)
                                        setObject(apiResponse)
                                    })
                                })
                            }
                        })
                    })
                }
            } else {
                setObject(apiResponse)
            }
        })
    })
}

// validate the token
export const validateToken = () => {
    const firstHost = getBackEndHostWithSlash()

    if (firstHost !== null) {
        // get a resource from the backend
        fetch(`${firstHost}service/authors/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((corsResponse) => {
            const apiPromise = corsResponse.json()
            apiPromise.then((apiResponse) => {
                console.log(apiResponse)

                // if the token is not valid
                if (apiResponse.code === "token_not_valid") {
                    const secondHost = getBackEndHostWithSlash()

                    if (secondHost !== null) {
                        // try to get a new token
                        fetch(
                            `${getBackEndHostWithSlash()}service/api/token/refresh/`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    refresh: `Bearer ${localStorage.getItem(
                                        "refresh"
                                    )}`,
                                }),
                            }
                        ).then((corsResponse) => {
                            const apiPromise = corsResponse.json()
                            apiPromise.then((apiResponse) => {
                                // if getting a new token did not work
                                if (apiResponse.code === "token_not_valid") {
                                    // remove the token
                                    localStorage.removeItem("token")
                                } else {
                                    // update the token
                                    localStorage.setItem(
                                        "token",
                                        apiResponse.access
                                    )
                                }
                            })
                        })
                    }
                }
            })
        })
    }
}

// get host (e.g. "https://plurr.herokuapp.com/")
export const getFrontEndHostWithSlash = () => {
    if (window !== null && window !== undefined) {
        const host = window.location.href.split("/").slice(0, 3).join("/") + "/"
        return host.includes("localhost") || host.includes("127.0.0.1")
            ? "http://127.0.0.1:3000/"
            : host.endsWith("/")
            ? host
            : null
    }

    return null
}

// get host (e.g. "https://plurr.herokuapp.com/")
export const getBackEndHostWithSlash = () => {
    if (window !== null && window !== undefined) {
        const host = window.location.href.split("/").slice(0, 3).join("/") + "/"
        return host.includes("localhost") || host.includes("127.0.0.1")
            ? "http://localhost:8000/"
            : host.endsWith("/")
            ? host
            : null
    }

    return null
}

export const appendOrKeepSlash = (url) => {
    return url.endsWith("/") ? url.slice(0, -1) : url
}
