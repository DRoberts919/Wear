import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { auth } from "../firebase.js";

import Signup from "./Signup.js";
import Login from "./Login.js";
import Home from "./Home.js";

function RouterSwitch() {
  const [user, setUser] = useState(null);

  // useEffect to check if a user is already logged in and will
  // auto login for them
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);
  return (
    <div className="routerSwitch">
      <Route exact path="/login" component={Login}></Route>
      <Route exact path="/signup" component={Signup}></Route>
      <Route exact path="/Home" component={Home} />
    </div>
  );
}

export default RouterSwitch;
