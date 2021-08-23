import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../images/w-logo.png";


import "../styles/landingpage.css";

function LandingPage() {
  const { currentUser } = useAuth();

  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      history.push("/home");
    }
  }, [currentUser, history]);
  return (
    <div className="landingPage">
      <div className="landingPage__welcome">
        <h3 className="welcomeText">WELCOME to </h3>
        <div className="wear">
          <img className="landingPage__logo" src={logo} />
          <h2>EAR</h2>
        </div>
      </div>
      <div className="landingPage__intro">
        <p style={{ margin: "0 auto" }}>
          Welcome to WEAR! we are so happy you are here visitng our site.
          <br /> Our goal and mission is to give you as the small compnay a
          chance at selling your clothing faster and simpler.
          <br />
          <br />
          Go create an account and work with us to bring your company to life
          and bring your <br />
          product to the world!
        </p>
      </div>
      <div className="landingPage__haveAcount flexer">
        <div className="textSetter">
          <h2>Have an account?</h2>
          <Link to="/login">
            <button className="login__button">Log In</button>
          </Link>
        </div>
        <div className="textSetter">
          <h2>Want an account?</h2>
          <Link to="/signup">
            <button className="login__button">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
