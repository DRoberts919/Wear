import React, { useState } from "react";
import { auth } from "../firebase.js";
import { Input, Button } from "@material-ui/core";
import { withRouter } from "react-router";
import logo from "../images/w-logo.png";
import "../styles/signUp.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // singup function that will use firebase to signup a user
  const signUp = (evt) => {
    evt.preventDefault();
    console.log(email);
    console.log(password);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error));

    console.log("user signup works");
    setPassword("");
    setEmail("");
    setUsername("");
  };

  return (
    <div className="auth__conatiner">
      <img alt="wearLogo" src={logo} className="app__logo" />
      <h1>Signup</h1>

      <form className="signUp__form" onSubmit={signUp}>
        <Input
          name="email"
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          name="username"
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button type="submit">signUp</Button>
      </form>
    </div>
  );
}

export default withRouter(Signup);
