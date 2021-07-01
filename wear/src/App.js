import "./App.css";
import logo from "./images/w-logo.png";

import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import { TextField, Input, Button } from "@material-ui/core";
import { auth, db } from "./firebase.js";

// helper fucntions

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

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
  }, [user, username]);

  // login funciton for logining in a user
  const login = (evt) => {
    evt.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setPassword("");
    setEmail("");
  };

  return (
    <Router>
      <div className="app">
        {/* header for login in and */}
        {/* within header use react router */}
        <div className="app__header">
          <Link to="/Home">
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
            <div className="login__conatiner">
              <img alt="wearLogo" src={logo} className="app__logo" />
              <h1>lOGIN</h1>

              <form className="app__signUp">
                <Input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button onClick={login}>sign-In</Button>
              </form>
            </div>
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route>{/* route for seeing all posts */}</Route>
          <Route path="/Home">
            <LandingPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// components

// singup component
function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // singup function that will use firebase to signup a user
  const signUp = (evt) => {
    evt.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));

    console.log("user signup");
    setPassword("");
    setEmail("");
    setUsername("");
  };
  return (
    <div className="login__conatiner">
      <img alt="wearLogo" src={logo} className="app__logo" />
      <h1>Signup</h1>

      <form className="app__signUp">
        <Input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button onClick={signUp}>signUp</Button>
      </form>
    </div>
  );
}
