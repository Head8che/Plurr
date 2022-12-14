import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import UserProvider from "./UserContext"
import "./App.css"
import PlurrPage from "./pages/PlurrPage"

function App() {
  return (
    <UserProvider>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/inbox">
              <PlurrPage page="Inbox" />
            </Route>
            <Route exact path="/stream">
              <PlurrPage page="Stream" />
            </Route>
            <Route exact path="/authors">
              <PlurrPage page="Authors" />
            </Route>
            <Route exact path="/author/:authorId/followers">
              <PlurrPage page="Followers" />
            </Route>
            <Route exact path="/author/:authorId/posts/:postId">
              <PlurrPage page="Post" />
            </Route>
            <Route exact path="/author/:authorId/posts/:postId/likes">
              <PlurrPage page="PostLikes" />
            </Route>
            <Route exact path="/author/:authorId/posts/:postId/comments">
              <PlurrPage page="PostComments" />
            </Route>
            <Route exact path="/author/:authorId">
              <PlurrPage page="Author" />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App
