export const isNotNullOrUndefined = (string) => {
  return string !== null && string !== undefined
}

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
      if (
        apiResponse.code === "token_not_valid" ||
        apiResponse.code === "user_not_found"
      ) {
        const host = getBackEndHostWithSlash()

        if (host !== null) {
          // try to get a new token
          fetch(`${host}service/api/token/refresh/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh: `Bearer ${localStorage.getItem("refresh")}`,
            }),
          }).then((corsResponse) => {
            const apiPromise = corsResponse.json()
            apiPromise.then((apiResponse) => {
              console.log(apiResponse)

              // if getting a new token did not work
              if (
                apiResponse.code === "token_not_valid" ||
                apiResponse.code === "user_not_found"
              ) {
                // remove the token
                localStorage.removeItem("token")
              } else {
                // update the token
                localStorage.setItem("token", apiResponse.access)
                fetch(path, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",

                    Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        if (
          apiResponse.code === "token_not_valid" ||
          apiResponse.code === "user_not_found"
        ) {
          const secondHost = getBackEndHostWithSlash()

          if (secondHost !== null) {
            // try to get a new token
            fetch(`${getBackEndHostWithSlash()}service/api/token/refresh/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh: `Bearer ${localStorage.getItem("refresh")}`,
              }),
            }).then((corsResponse) => {
              const apiPromise = corsResponse.json()
              apiPromise.then((apiResponse) => {
                // if getting a new token did not work
                if (
                  apiResponse.code === "token_not_valid" ||
                  apiResponse.code === "user_not_found"
                ) {
                  // remove the token
                  localStorage.removeItem("token")
                } else {
                  // update the token
                  localStorage.setItem("token", apiResponse.access)
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
      ? "http://127.0.0.1:8000/"
      : host.endsWith("/")
      ? host
      : null
  }

  return null
}

export const getNonServiceHost = (host) => {
  if (isNotNullOrUndefined(host)) {
    return host.split("/").slice(0, 3).join("/") + "/"
  }
}

export const isRemoteAuthor = (author) => {
  if (isNotNullOrUndefined(author)) {
    return !(
      author?.host.includes("plurr") ||
      author?.host.includes("local") ||
      author?.host.includes("127.0.0.1")
    )
  }
}

export const getAuthorIdOrRemoteLink = (author) => {
  if (isNotNullOrUndefined(author)) {
    return isRemoteAuthor(author) ? getNonServiceHost(author.id) : author.id
  }
}

export const getAuthorImgOrDefault = (author) => {
  if (isNotNullOrUndefined(author)) {
    return author?.profileImage &&
      (author?.profileImage.endsWith(".jpg") ||
        author?.profileImage.endsWith(".jpeg") ||
        author?.profileImage.endsWith(".png"))
      ? author?.profileImage
      : "https://180dc.org/wp-content/uploads/2016/08/default-profile.png"
  }
}

export const withTrailingSlash = (string) => {
  if (isNotNullOrUndefined(string)) {
    return string.endsWith("/") ? string : `${string}/`
  }
}

export const withoutTrailingSlash = (string) => {
  if (isNotNullOrUndefined(string)) {
    return string.endsWith("/") ? string.slice(0, -1) : string
  }
}

export const getUUIDFromId = (string) => {
  if (isNotNullOrUndefined(string)) {
    return string.endsWith("/")
      ? string.split("/").slice(-2).shift()
      : string.split("/").pop()
  }
}
