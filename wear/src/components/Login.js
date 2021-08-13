import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// material-ui
import InputAdornment from "@material-ui/core/InputAdornment";
import Input from "@material-ui/core/Input";

import MailIcon from "@material-ui/icons/Mail";
import LockIcon from "@material-ui/icons/Lock";

// css
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      history.push("/home");
    }
  }, [currentUser, history]);

  async function handleLogin(evt) {
    evt.preventDefault();

    try {
      setError("");

      await login(email, password);
      history.push("/home");
    } catch {
      setError("failed to Sign in");
      alert(error);
    }

    console.log("user signup works");
    setPassword("");
    setEmail("");
  }

  return (
    <div className="login__background">
      <div className="login__conatiner">
        <h1 className="login__login">Login</h1>

        <form className="login__form" onSubmit={handleLogin}>
          <label className="login__label">Email</label>
          <Input
            className="login__input"
            variant="outlined"
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

          <label className="login__label">Password</label>

          <Input
            className="login__input"
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

          <button className="login__button" type="submit">
            Log-In
          </button>
        </form>
        <div className="app__signup">
          Need an Account?
          <Link to="/signup">Sing Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
