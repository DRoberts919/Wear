import React, { useState, useEffect } from "react";
import {Route} from 'react-router-dom'

import Signup from "./Signup.js";
import Login from "./Login.js";
import Home from "./Home.js";

function RouterSwitch() {
  return (
    <div className="routerSwitch">
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/Home" component={Home}/>
    </div>
  );
}

export default RouterSwitch;
