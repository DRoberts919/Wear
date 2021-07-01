import React, { useState } from "react";
import logo from "../images/w-logo.png";
import { auth } from "../firebase.js";
import { Input, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  let history = useHistory();

  const login = (evt) => {
    evt.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));
    history.push("/Home");

    setPassword("");
    setEmail("");
  };
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
