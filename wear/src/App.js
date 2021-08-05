import "./styles/App.css";
import logo from "./images/w-logo.png";
import { useState } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import { Button } from "@material-ui/core";
import { useAuth } from "./context/AuthContext";
import { auth, db } from "./firebase";

// components
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Account from "./components/Account";
import Cart from "./components/Cart.js";
import WishList from "./components/WishList";
import UserPost from "./components/UserPost";
import PrivateRoute from "./components/PrivateRoute";
import EditAccount from "./components/EditAccount";
import LandingPage from "./components/LandingPage";
import SearchedUser from "./components/SearchedUser";
import Searchbar from "./components/Searchbar";

// helper fucntions

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="app">
        <div className="app__header">
          <Link to="/">
            <img alt="" className="app__logo" src={logo} />
          </Link>
          {currentUser ? (
            <div className="app__headerButtons">
              <Searchbar />

              <Link to="/home">
                <Button>Home</Button>
              </Link>
              <Link to="/account">
                <Button>account</Button>
              </Link>
            </div>
          ) : (
            <div className="app__authButtons">
              <Link to="/login">
                <button className="app__loginButton">Login</button>
              </Link>
              <Link to="/signup">
                <button className="app__singupButton">Signup</button>
              </Link>
            </div>
          )}
        </div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute path="/account" component={Account} />
          <PrivateRoute path="/cart" component={Cart} />
          <PrivateRoute path="/wishList" component={WishList} />
          <PrivateRoute path="/post" component={UserPost} />
          <PrivateRoute path="/editAccount" component={EditAccount} />
          <PrivateRoute path="/searchedUser/:id" component={SearchedUser} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
