import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";

import Posts from "../components/Posts";
import { useAuth } from "../context/AuthContext";

import "../styles/home.css";

// material-ui Imports
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
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
      <Avatar
        src="/static/images/avatr/1.jpg"
        alt={currentUser.displayName}
      />
      <h1>{currentUser.displayName}</h1>

      <div className="userNav__buttonContainer">
        <Button>
          <div className="userNav__myAcount">
            <a>My Account</a>
          </div>
        </Button>
        <Button>
          <div className="userNav__wishList">
            <a>Wish List</a>
          </div>
        </Button>
        <Button>
          <div className="userNav__Cart">
            <a>Cart</a>
            <ShoppingCartIcon />
          </div>
        </Button>
      </div>
    </div>
  );
}
