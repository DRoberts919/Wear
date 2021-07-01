import React from "react";
import { auth } from "../firebase.js";
import { TextField, Input, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import logo from "../images/w-logo.png";


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

    console.log("user signupj works");
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

export default Signup;
