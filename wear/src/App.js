import "./styles/App.css";
import logo from "./images/w-logo.png";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { AuthProvider } from "./context/AthContext";
import { auth } from "./firebase";

import RouterSwitch from "./components/RouterSwitch.js";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import PrivateRoute from "./components/PrivateRoute";

// helper fucntions

function App() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <AuthProvider>
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
          {/* <RouterSwitch /> */}
          <Switch>
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Home} />
          </Switch>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

// components
