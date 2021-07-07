import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";

import Posts from "../components/Posts";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";
import logo from "../images/w-logo.png";

// material-ui Imports
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import StarIcon from "@material-ui/icons/Star";
import PersonIcon from "@material-ui/icons/Person";
import { Avatar } from "@material-ui/core";

function Home() {
  return (
    <div className="Home">
      {/* Post Feed div with post component 
                {component that loads all posts}
      */}

      <div className="home__posts">
        <Posts />
      </div>
      {/* user Nave bar div with component */}
      <div className="home__userNav">
        <UserNav />
      </div>

      {/* <div className="w-100 text-center mt-2">
        <Button type="link" onClick={handleLogout}>
          logout
        </Button>
      </div> */}
    </div>
  );
}

export default Home;

function UserNav() {
  const { currentUser } = useAuth();

  return (
    <div className="UserNav">
      <div className="userNav__header">
        <Avatar src={logo} alt={currentUser.displayName} sizes="large" />
        <h1>{currentUser.displayName}</h1>
      </div>

      <div className="userNav__buttonContainer">
        <Button>
          <div className="userNav__button userNav__myAcount">
            <p>My Account</p>
            <PersonIcon />
          </div>
        </Button>
        <Button>
          <div className="userNav__button userNav__wishList">
            <p>Wish List</p>
            <StarIcon />
          </div>
        </Button>
        <Button>
          <div className="userNav__button userNav__Cart">
            <p>Cart</p>
            <ShoppingCartIcon />
          </div>
        </Button>
      </div>
    </div>
  );
}
