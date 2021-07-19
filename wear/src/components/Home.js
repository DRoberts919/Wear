import React, { useEffect, useState } from "react";

import "../styles/home.css";
import Post from "../components/Posts";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../images/w-logo.png";

import { db } from "../firebase";

// material-ui Imports
import Button from "@material-ui/core/Button";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import StarIcon from "@material-ui/icons/Star";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import { Avatar } from "@material-ui/core";

function Home() {
  const [posts, setPosts] = useState([]);

  // useEffect to get all posts
  useEffect(() => {
    // access my posts database
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // onSnapShot will update this component when new data is provided
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]);

  return (
    <div className="landing">
      <div className="home__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            title={post.title}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
            price={post.price}
            postId={id}
          />
        ))}
      </div>
      {/* user Nave bar div with component */}
      <div className="home__userNav">
        <UserNav />
      </div>
    </div>
  );
}

export default Home;

function UserNav() {
  // get the current user
  const { currentUser } = useAuth();

  return (
    <div className="UserNav">
      <div className="userNav__header">
        <Avatar src={logo} alt={currentUser.displayName} sizes="large" />
        <h1>{currentUser.displayName}</h1>
      </div>

      <hr />

      <div className="userNav__buttonContainer">
        <Button>
          <Link className="link" to={`/account`}>
            <div className="userNav__button userNav__myAcount">
              <p>My Account</p>
              <PersonIcon />
            </div>
          </Link>
        </Button>

        <Button>
          <Link className="link" to={`/wishList`}>
            <div className="userNav__button userNav__wishList">
              <p>Wish List</p>
              <StarIcon />
            </div>
          </Link>
        </Button>
        <Button>
          <Link to={`/cart`} className="link">
            <div className="userNav__button userNav__Cart">
              <p>Cart</p>
              <ShoppingCartIcon />
            </div>
          </Link>
        </Button>
        <Button>
          <Link to={`/post`} className="link">
            <div className="userNav__button userNav__Post">
              <p>Post</p>
              <AddIcon />
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
