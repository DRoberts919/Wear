import "./styles/App.css";
import logo from "./images/w-logo.png";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { auth } from "./firebase.js";

import RouterSwitch from "./components/RouterSwitch.js";

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
        <div className="app__header">
          <Link to="/">
            <img alt="" className="app__logo" src={logo} />
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
        <RouterSwitch />
      </div>
    </Router>
  );
}

export default App;

// components
