import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
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
        console.log("Auth user" + authUser);
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
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      {/* <AuthenticatedRoute path="/Home" authUser={user} component={Home} /> */}
      <PrivateRoute exact={true} path="/Home" authenticated={user} component={Home}/>
    </div>
  );
}

// function AuthenticatedRoute({
//   component: Component,
//   path,
//   authUser,
//   ...props
// }) {
//   console.log(path);
//   return (
//     // <Redirect
//     //   {...props}
//     //   to={path}
//     //   render={(routeProps) =>
//     //     authUser ? <Component /> : <Redirect to="/login" />
//     //   }
//     // />
//     <Route exact path="/Home">
//       {authUser ? <Component /> : <Redirect to="/login" />}
//     </Route>
//   );
// }

// function AuthenticatedRoute({authUser,...rest}){
//   const user = authUser;
//   if(!user){
//     <Redirect to="/login"/>

//   }
//   return <Route {...rest}/>
// }

function PrivateRoute({ component: Component, authenticated, path, exact }) {
  return (
    <Route
      path={path}
      exact={exact}
      render={(props) =>
        authenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default RouterSwitch;
