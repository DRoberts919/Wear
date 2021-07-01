import React from "react";
import "./landingpage.css";
import { Redirect } from "react-router-dom";

const LandingPage = ({ authorized }) => {
  if (!authorized) {
    return <Redirect to="/login" />;
  }
  return (
    <div className="landingPage">
      <h1>Home</h1>
      <h3>hello this is the best thing ever</h3>
    </div>
  );
};

export default LandingPage;
