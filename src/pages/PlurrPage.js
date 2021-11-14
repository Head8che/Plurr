import React from 'react'
import { useUserHandler } from "../UserContext"
import { useParams } from 'react-router-dom'
import { setObjectFromApi, validateToken } from "../utils"
import PlurrContainer from '../components/PlurrContainer';
import Author from './Author';
import Authors from './Authors';
import Stream from './Stream';
import Inbox from './Inbox';


export default function PlurrPage ({ page })  {
  const { authorId } = useParams()
  const { loggedInUser } = useUserHandler()
  const [loading, setLoading] = React.useState(true);
  const [object, setObject] = React.useState({});
  const [secondObject, setSecondObject] = React.useState({});
  const [thirdObject, setThirdObject] = React.useState({});

  // array of page objects
  const pageObjects = [
    {
      name: "Author",
      apiRoute: `https://plurr.herokuapp.com/service/author/${authorId}/`,
      secondApiRoute: `https://plurr.herokuapp.com/service/author/${authorId}/followers/`,
      // thirdApiRoute: `https://plurr.herokuapp.com/service/author/${authorId}/posts/`,
      component: <Author loggedInUser={loggedInUser} author={object} authorFollowers={secondObject} posts={thirdObject} />
    },
    {
      name: "Authors",
      apiRoute: `https://plurr.herokuapp.com/service/authors/`,
      component: <Authors authors={object} />
    },
    {
      name: "Posts",
      apiRoute: `https://plurr.herokuapp.com/service/author/${authorId}/`,
      secondApiRoute: `https://plurr.herokuapp.com/service/author/${authorId}/followers/`,
      thirdApiRoute: `https://plurr.herokuapp.com/service/author/${authorId}/posts/`,
      component: <Author loggedInUser={loggedInUser} author={object} authorFollowers={secondObject} posts={thirdObject} />
    },
    {
      name: "Inbox",
      apiRoute: `https://plurr.herokuapp.com/service/author/${authorId}/inbox`,
      component: <Inbox authors={object} />
    },
    {
      name: "Stream",
      apiRoute: `https://plurr.herokuapp.com/service/authors/`,
      component: <Stream authors={object} />
    },
  ]

  // get page object based on page argument
  const currentPageObject = pageObjects.find(
    (pageObject) => (pageObject.name.toUpperCase() === page.toUpperCase())
  );

  // set loading to false once object has been set
  React.useEffect(() => {
    if (Object.keys(object).length !== 0) {
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
  }, [object, secondObject, currentPageObject.secondApiRoute, 
    thirdObject, currentPageObject.thirdApiRoute])
  
  // validate the token on each page load
  React.useEffect(() => {
    validateToken()
  }, [page])

  // make api call and use setObject setter to set object
  React.useEffect(() => {
    if (loggedInUser.uuid !== undefined) {
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
    }
  }, [loggedInUser, loggedInUser.uuid, currentPageObject.apiRoute, 
    currentPageObject.secondApiRoute,currentPageObject.thirdApiRoute]);
  
  // show component when loading is complete
  return (    
    <PlurrContainer>
      {loading ? null : currentPageObject?.component}
    </PlurrContainer>
  );
}