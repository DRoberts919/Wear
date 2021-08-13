import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import { useAuth } from "../context/AuthContext";
import { Alert } from "react-bootstrap";
import "../styles/signUp.css";
import { useHistory, Link } from "react-router-dom";

// material-ui
import MailIcon from "@material-ui/icons/Mail";
import LockIcon from "@material-ui/icons/Lock";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import PersonIcon from "@material-ui/icons/Person";

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
      setError("failed to create an account");
    }

    setLoading(false);

    console.log("user signup works");
    setPassword("");
    setEmail("");
    setUsername("");
    setError("");
  }

  return (
    <div className="signUp__background">
      <div className="signUp__conatiner">
        {/* <img alt="wearLogo" src={logo} className="app__logo" /> */}
        <h1 className="signUp__singUP">Signup</h1>

        <form className="signUp__form" onSubmit={handleSignUp}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Input
            className="signUp__input"
            name="email"
            placeholder="Type your email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <MailIcon />
              </InputAdornment>
            }
          />
          <Input
            className="signUp__input"
            name="password"
            placeholder="Type your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            }
          />
          <Input
            className="signUp__input"
            name="passwordConfirm"
            placeholder="Retype your password"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <LockOutlinedIcon />
              </InputAdornment>
            }
          />

          <Input
            className="signUp__input"
            name="username"
            placeholder="Type your username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <PersonIcon />
              </InputAdornment>
            }
          />

          <button className="signUp__button" disabled={loading} type="submit">
            signUp
          </button>
        </form>
        <div className="signUp__login">
          Have an account? <Link to="/login">Login In</Link> here
        </div>
      </div>
    </div>
  );
}

export default Signup;
