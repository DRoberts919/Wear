import React, { useState } from "react";
import logo from "../images/w-logo.png";
import { auth } from "../firebase.js";
import { Input, Button } from "@material-ui/core";
import { Redirect, withRouter } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (evt) => {
    evt.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error));

    setPassword("");
    setEmail("");
  };

  return (
    <div className="login__conatiner">
      <img alt="wearLogo" src={logo} className="app__logo" />
      <h1>lOGIN</h1>

      <form className="login__form" onSubmit={login}>
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

        <Button type="submit">Log-In</Button>
      </form>
    </div>
  );
}

export default Login;
