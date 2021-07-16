import React, { useState } from "react";
import { Input, Button } from "@material-ui/core";
import logo from "../images/w-logo.png";
import { useAuth } from "../context/AuthContext";
import { Alert } from "react-bootstrap";
import "../styles/signUp.css";
import { useHistory, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // singup function that will use firebase to signup a user
  async function handleSignUp(evt) {
    evt.preventDefault();

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await signUp(email, password, username);
      history.push("/home");
    } catch {
      setError("failed to create an accoutn");
    }

    setLoading(false);

    console.log("user signup works");
    setPassword("");
    setEmail("");
    setUsername("");
  }

  return (
    <div className="auth__conatiner">
      <img alt="wearLogo" src={logo} className="app__logo" />
      <h1>Signup</h1>

      <form className="signUp__form" onSubmit={handleSignUp}>
        {error && <Alert variant="danger">{error}</Alert>}
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
          name="passwordConfirm"
          placeholder="Password Confirmation"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <Input
          name="username"
          placeholder="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Button disabled={loading} type="submit">
          signUp
        </Button>
      </form>
      <div className="w-100 text-center mt-2">
        Have an account? <Link to="/login">Login In</Link> here
      </div>
    </div>
  );
}

export default Signup;
