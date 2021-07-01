import React, { useState } from "react";
import logo from "../images/w-logo.png";
import { auth } from "../firebase.js";
import { Input, Button } from "@material-ui/core";
import { Redirect } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToRefferrer, setRedirectToRefferrer] = useState(false);

  const login = (evt) => {
    evt.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message))
      .then(setRedirectToRefferrer(true));

    setPassword("");
    setEmail("");
  };

  if (redirectToRefferrer === true) {
    return <Redirect to="/Home" />;
  }
  return (
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
  );
}

export default Login;
