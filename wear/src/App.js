import "./App.css";
import logo from "./images/w-logo.png";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  useHistory,
  Redirect,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage.js";
import { Input, Button } from "@material-ui/core";
import { auth, db } from "./firebase.js";

import Signup from "./components/Signup.js";
import Login from "./components/Login.js";

// helper fucntions

function App() {
  const [user, setUser] = useState(null);

  // useEffect to check if a user is already logged in and will
  // auto login for them

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // login funciton for logining in a user

  return (
    <Router>
      <div className="app">
        {/* header for login in and */}
        {/* within header use react router */}
        <div className="app__header">
          <Link to="/">
            <img className="app__logo" src={logo} />
          </Link>
          {user ? (
            <Button
              onClick={() => {
                auth.signOut();
                console.log("user signed out");
              }}
            >
              Log out
            </Button>
          ) : (
            <div className="app__authButtons">
              <Link to="/login">
                <button className="app__loginButton">Login</button>
              </Link>
              <Link to="/signup">
                <button className="app__singupButton">Signup</button>
              </Link>
            </div>
          )}
        </div>

        {/* router with all components in it. */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route>{/* route for seeing all posts */}</Route>
          <PrivateRoute user={user} path="/Home">
            <LandingPage />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// components

function PrivateRoute({ children, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        console.log(user)
        return user ? children : <Redirect to="/login"></Redirect>;
      }}
    />
  );
}

// singup component
