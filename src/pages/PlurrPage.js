import React from "react"
import { useUserHandler } from "../UserContext"
import { useParams } from "react-router-dom"
import { setObjectFromApi, validateToken } from "../utils"
import PlurrContainer from "../components/PlurrContainer"
import Author from "./Author"
import Authors from "./Authors"
import Stream from "./Stream"
import Inbox from "./Inbox"
import { getBackEndHostWithSlash } from "../utils"

const allObjectsAreLoaded = (arr) => {
  return arr.filter((item) => Object.keys(item).length === 0).length === 0
}

export default function PlurrPage({ page }) {
  const { authorId } = useParams()
  const { loggedInUser } = useUserHandler()
  const [loading, setLoading] = React.useState(true)
  const [object, setObject] = React.useState({})
  const [secondObject, setSecondObject] = React.useState({})
  const [thirdObject, setThirdObject] = React.useState({})
  const [fourthObject, setFourthObject] = React.useState({})
  const [fifthObject, setFifthObject] = React.useState({})
  const [renderNewPost, setRenderNewPost] = React.useState(Math.random())

  const host = getBackEndHostWithSlash()

  const triggerRerender = () => {
    setRenderNewPost(Math.random())
  }

  // array of page objects
  const pageObjects = [
    {
      name: "Author",
      apiRoute: `${host}service/author/${authorId}/`,
      secondApiRoute: `${host}service/author/${authorId}/followers/`,
      thirdApiRoute: `${host}service/author/${authorId}/posts/`,
      fourthApiRoute: `${host}service/author/${loggedInUser.uuid}/liked/?size=10000`,
      fifthApiRoute: `${host}service/author/${authorId}/inbox/`,
      component: (
        <Author
          loggedInUser={loggedInUser}
          author={object}
          authorFollowers={secondObject}
          posts={thirdObject}
          liked={fourthObject}
          inbox={fifthObject}
          triggerRerender={triggerRerender}
        />
      ),
    },
    {
      name: "Authors",
      apiRoute: `${host}service/authors/`,
      component: <Authors authors={object} />,
    },
    {
      name: "Inbox",
      apiRoute: `${host}service/author/${loggedInUser.uuid}/inbox/`,
      secondApiRoute: `${host}service/author/${loggedInUser.uuid}/followers/`,
      component: (
        <Inbox
          loggedInUser={loggedInUser}
          inbox={object}
          followers={secondObject}
          triggerRerender={triggerRerender}
        />
      ),
    },
    {
      name: "Stream",
      apiRoute: `${host}service/stream/?size=1000`,
      secondApiRoute: `${host}service/author/${loggedInUser.uuid}/liked/?size=10000`,
      component: (
        <Stream
          loggedInUser={loggedInUser}
          posts={object}
          liked={secondObject}
          triggerRerender={triggerRerender}
        />
      ),
    },
  ]

  // get page object based on page argument
  const currentPageObject = pageObjects.find(
    (pageObject) => pageObject.name.toUpperCase() === page.toUpperCase()
  )

  // set loading to false once object has been set
  React.useEffect(() => {
    if (
      currentPageObject?.fifthApiRoute !== undefined &&
      currentPageObject?.fifthApiRoute !== null
    ) {
      if (
        allObjectsAreLoaded([
          object,
          secondObject,
          thirdObject,
          fourthObject,
          fifthObject,
        ])
      ) {
        setLoading(false)
      }
    } else if (
      currentPageObject?.fourthApiRoute !== undefined &&
      currentPageObject?.fourthApiRoute !== null
    ) {
      if (
        allObjectsAreLoaded([object, secondObject, thirdObject, fourthObject])
      ) {
        setLoading(false)
      }
    } else if (
      currentPageObject?.thirdApiRoute !== undefined &&
      currentPageObject?.thirdApiRoute !== null
    ) {
      if (allObjectsAreLoaded([object, secondObject, thirdObject])) {
        setLoading(false)
      }
    } else if (
      currentPageObject?.secondApiRoute !== undefined &&
      currentPageObject?.secondApiRoute !== null
    ) {
      if (allObjectsAreLoaded([object, secondObject])) {
        setLoading(false)
      }
    } else {
      if (allObjectsAreLoaded([object])) {
        setLoading(false)
      }
    }
  }, [
    object,
    secondObject,
    currentPageObject.apiRoute,
    currentPageObject.secondApiRoute,
    thirdObject,
    currentPageObject.thirdApiRoute,
    fourthObject,
    currentPageObject.fourthApiRoute,
    fifthObject,
    currentPageObject.fifthApiRoute,
  ])

  // validate the token on each page load
  React.useEffect(() => {
    validateToken()
  }, [page])

  // make api call and use setObject setter to set object
  React.useEffect(() => {
    if (host && loggedInUser.uuid !== undefined) {
      setObjectFromApi(currentPageObject?.apiRoute, setObject)

      if (
        currentPageObject?.secondApiRoute !== undefined &&
        currentPageObject?.secondApiRoute !== null
      ) {
        setObjectFromApi(currentPageObject?.secondApiRoute, setSecondObject)
      }

      if (
        currentPageObject?.thirdApiRoute !== undefined &&
        currentPageObject?.thirdApiRoute !== null
      ) {
        setObjectFromApi(currentPageObject?.thirdApiRoute, setThirdObject)
      }

      if (
        currentPageObject?.fourthApiRoute !== undefined &&
        currentPageObject?.fourthApiRoute !== null
      ) {
        setObjectFromApi(currentPageObject?.fourthApiRoute, setFourthObject)
      }

      if (
        currentPageObject?.fifthApiRoute !== undefined &&
        currentPageObject?.fifthApiRoute !== null
      ) {
        setObjectFromApi(currentPageObject?.fifthApiRoute, setFifthObject)
      }
    }
  }, [
    host,
    loggedInUser,
    loggedInUser.uuid,
    currentPageObject.apiRoute,
    currentPageObject.secondApiRoute,
    currentPageObject.thirdApiRoute,
    currentPageObject.fourthApiRoute,
    currentPageObject.fifthApiRoute,
    renderNewPost,
  ])

  // show component when loading is complete
  return (
    <PlurrContainer>
      {loading ? null : currentPageObject?.component}
    </PlurrContainer>
  )
}
