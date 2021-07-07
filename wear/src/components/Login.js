import React, { useState, useEffect } from "react";
import logo from "../images/w-logo.png";

import { Input, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    console.log(currentUser);

    if (currentUser) {
      history.push("/home");
    }
  }, [currentUser]);

  async function handleLogin(evt) {
    evt.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      history.push("/home");
    } catch {
      setError("failed to Sign in");
      alert(error);
    }

    setLoading(false);

    console.log("user signup works");
    setPassword("");
    setEmail("");
  }

  return (
    <div className="login__conatiner">
      <img alt="wearLogo" src={logo} className="app__logo" />
      <h1>lOGIN</h1>

      <form className="login__form" onSubmit={handleLogin}>
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
      <div className="w-100 text-center mt-2">
        Need an Account? <Link to="/signup">Sing Up</Link>
      </div>
    </div>
  );
}

export default Login;
