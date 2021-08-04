import React, { useEffect, useState } from "react";

import "../styles/home.css";
import Post from "../components/Posts";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
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
        {posts.map(({ id, post }, index) => {
          if (post.itemSold == true) {
            posts.pop(post);
          } else {
            return (
              <Post
                key={index}
                index={index}
                title={post.title}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
                price={post.price}
                postId={id}
                userPhoto={post.userImg}
                isSold={post.itemSold}
                postList={posts}
              />
            );
          }
        })}
      </div>
      {/* user Nave bar div with component */}
      <div className="home__userNav">
        <UserNav />
      </div>
    </div>
  );
}

export default Home;

// <Post
// key={id}
// title={post.title}
// username={post.username}
// caption={post.caption}
// imageUrl={post.imageUrl}
// price={post.price}
// postId={id}
// userPhoto={post.userImg}
// isSold ={post.itemSold}
// />

function UserNav() {
  // get the current user
  const { currentUser } = useAuth();

  return (
    <div className="UserNav">
      <div className="userNav__header">
        <Avatar
          src={currentUser.photoURL}
          alt={currentUser.displayName}
          sizes="large"
        />
        <h1>{currentUser.displayName}</h1>
      </div>

      <hr />

      <div className="userNav__buttonContainer">
        <Link className="link userNav__button" to={`/account`}>
          <div className="userNav__button userNav__myAcount">
            <PersonIcon style={{ fontSize: 35 }} className="userNav__icon" />
            <p>My Account</p>
          </div>
        </Link>

        <Link className="link userNav__button" to={`/wishList`}>
          <div className="userNav__button userNav__wishList">
            <StarIcon style={{ fontSize: 35 }} className="userNav__icon" />
            <p>Wish List</p>
          </div>
        </Link>

        <Link to={`/cart`} className="link userNav__button">
          <div className="userNav__button">
            <ShoppingCartIcon
              style={{ fontSize: 35 }}
              className="userNav__icon"
            />
            <p>Cart</p>
          </div>
        </Link>

        <Link to={`/post`} className="link userNav__button">
          <div className="userNav__button ">
            <AddIcon style={{ fontSize: 35 }} className="userNav__icon" />
            <p>Post</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
