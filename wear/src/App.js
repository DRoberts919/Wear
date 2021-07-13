import "./styles/App.css";
import logo from "./images/w-logo.png";
// import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  // useHistory,
  Switch,
  Link,
} from "react-router-dom";

import { Button } from "@material-ui/core";
import { useAuth } from "./context/AuthContext";
import { auth } from "./firebase";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";

// helper fucntions

function App() {
  const { currentUser } = useAuth();

  // const test = useHistory();

  // useEffect(() => {
  //   if (currentUser) {
  //     test.push("/home");
  //   }
  // }, [currentUser,test]);

  return (
    <Router>
      <div className="app">
        <div className="app__header">
          <Link to="/">
            <img alt="" className="app__logo" src={logo} />
          </Link>
          {currentUser ? (
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
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/home" component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
