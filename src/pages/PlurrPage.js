import React from 'react'
import { useUserHandler } from "../UserContext"
import { useParams } from 'react-router-dom'
import { setObjectFromApi, validateToken } from "../utils"
import PlurrContainer from '../components/PlurrContainer';
import Author from './Author';
import Authors from './Authors';
import Stream from './Stream';
import Inbox from './Inbox';
import { getBackEndHostWithSlash } from "../utils"


export default function PlurrPage ({ page })  {
  const { authorId } = useParams()
  const { loggedInUser } = useUserHandler()
  const [loading, setLoading] = React.useState(true);
  const [object, setObject] = React.useState({});
  const [secondObject, setSecondObject] = React.useState({});
  const [thirdObject, setThirdObject] = React.useState({});
  const [fourthObject, setFourthObject] = React.useState({});
  const [renderNewPost, setRenderNewPost] = React.useState("1");

  const host = getBackEndHostWithSlash();
  console.log(host)

  // array of page objects
  const pageObjects = [
    {
      name: "Author",
      apiRoute: `${host}service/author/${authorId}/`,
      secondApiRoute: `${host}service/author/${authorId}/followers/`,
      thirdApiRoute: `${host}service/author/${authorId}/posts/`,
      fourthApiRoute: `${host}service/author/${loggedInUser.uuid}/liked/?size=10000`,
      component: <Author loggedInUser={loggedInUser} author={object} 
        authorFollowers={secondObject} posts={thirdObject} liked={fourthObject} setRenderNewPost={setRenderNewPost} />
    },
    {
      name: "Authors",
      apiRoute: `${host}service/authors/`,
      component: <Authors authors={object} />
    },
    {
      name: "Inbox",
      apiRoute: `${host}service/author/${loggedInUser.uuid}/inbox/`,
      component: <Inbox inbox={object} />
    },
    {
      name: "Stream",
      apiRoute: `${host}service/stream/?size=1000`,
      secondApiRoute: `${host}service/author/${loggedInUser.uuid}/liked/?size=10000`,
      component: <Stream loggedInUser={loggedInUser} posts={object} liked={secondObject} setRenderNewPost={setRenderNewPost} />
    },
  ]

  // get page object based on page argument
  const currentPageObject = pageObjects.find(
    (pageObject) => (pageObject.name.toUpperCase() === page.toUpperCase())
  );

  // set loading to false once object has been set
  React.useEffect(() => {
    if (Object.keys(object).length !== 0) {
      if ((currentPageObject?.fourthApiRoute !== undefined) 
        && (currentPageObject?.fourthApiRoute !== null)) {
          if ((currentPageObject?.thirdApiRoute !== undefined) 
            && (currentPageObject?.thirdApiRoute !== null)) {
              if ((currentPageObject?.secondApiRoute !== undefined) 
                && (currentPageObject?.secondApiRoute !== null)) {
                  if (Object.keys(secondObject).length !== 0) {
                    setLoading(false);
                  }
              } else {
                setLoading(false);
              }
          } else {
            if ((currentPageObject?.secondApiRoute !== undefined) 
              && (currentPageObject?.secondApiRoute !== null)) {
                if (Object.keys(secondObject).length !== 0) {
                  setLoading(false);
                }
            } else {
              setLoading(false);
            }
          }
      }
      if ((currentPageObject?.thirdApiRoute !== undefined) 
        && (currentPageObject?.thirdApiRoute !== null)) {
          if ((currentPageObject?.secondApiRoute !== undefined) 
            && (currentPageObject?.secondApiRoute !== null)) {
              if (Object.keys(secondObject).length !== 0) {
                setLoading(false);
              }
          } else {
            setLoading(false);
          }
      } else {
        if ((currentPageObject?.secondApiRoute !== undefined) 
          && (currentPageObject?.secondApiRoute !== null)) {
            if (Object.keys(secondObject).length !== 0) {
              setLoading(false);
            }
        } else {
          setLoading(false);
        }
      }
      // console.log(object)
    }
  }, [object, secondObject, currentPageObject.apiRoute, 
    currentPageObject.secondApiRoute, 
    thirdObject, currentPageObject.thirdApiRoute, fourthObject, 
    currentPageObject.fourthApiRoute])
  
  // validate the token on each page load
  React.useEffect(() => {
    validateToken()
  }, [page])

  // make api call and use setObject setter to set object
  React.useEffect(() => {
    if (host && (loggedInUser.uuid !== undefined)) {
      setObjectFromApi(
        currentPageObject?.apiRoute, setObject
      );

      if ((currentPageObject?.secondApiRoute !== undefined) 
        && (currentPageObject?.secondApiRoute !== null)) {
          setObjectFromApi(
            currentPageObject?.secondApiRoute, setSecondObject
          )
      }

      if ((currentPageObject?.thirdApiRoute !== undefined) 
        && (currentPageObject?.thirdApiRoute !== null)) {
          setObjectFromApi(
            currentPageObject?.thirdApiRoute, setThirdObject
          )
      }

      if ((currentPageObject?.fourthApiRoute !== undefined) 
        && (currentPageObject?.fourthApiRoute !== null)) {
          setObjectFromApi(
            currentPageObject?.fourthApiRoute, setFourthObject
          )
      }
    }
  }, [host, loggedInUser, loggedInUser.uuid, currentPageObject.apiRoute, 
    currentPageObject.secondApiRoute, currentPageObject.thirdApiRoute, 
    currentPageObject.fourthApiRoute, renderNewPost]);
  
  // show component when loading is complete
  return (    
    <PlurrContainer>
      {loading ? null : currentPageObject?.component}
    </PlurrContainer>
  );
}
