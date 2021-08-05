import { DesktopAccessDisabledTwoTone } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

import { Link } from "react-router-dom";

import { Avatar } from "@material-ui/core";
import { Button } from "@material-ui/core";

import soldItem from "../images/soldItem.png";

function SearchedUser() {
  const [userPhoto, setUserPhoto] = useState();
  const [userId, setUserId] = useState();
  const [check, setCheck] = useState(false);
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");

  const [userPost, setUserPosts] = useState([]);

  let { id } = useParams();

  const getUserData = async () => {
    await db
      .collection("userCollection")
      .where("username", "==", id)
      .get()
      .then((data) => {
        data.forEach((item) => {
          if (item.exists) {
            setUserId(item.data().uid);
            setDescription(item.data().description);
            setUsername(item.data().username);
            setUserPhoto(item.data().imageUrl);
          } else {
            console.log("error");
          }
        });
      });
  };

  const getUserPosts = async () => {
    let posts = [];
    try {
      await db
        .collection("posts")
        .where("userId", "==", userId)
        .get()
        .then((docdata) => {
          docdata.forEach((item) => {
            if (item.exists) {
              posts.push(item.data());
            } else {
              console.log("no items");
            }
          });
          setUserPosts(posts);
        });
    } catch (error) {
      console.log("user has no post ");
    }
  };

  useEffect(() => {
    getUserData();
    getUserPosts();
  }, []);

  return (
    <div className="account">
      {/* user header 
              the user header has a description, avatar icon, and name! */}
      <div className="account__header">
        {/* users image */}
        <Avatar alt="currentUser" src={userPhoto}></Avatar>
        {/* users display name */}
        <h1 className="account__userName">{username}</h1>
        {/* users dectiption */}
        <h5>{description}</h5>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </div>
      <hr></hr>
      <div className="account__posts">
        {check ? (
          <h1>no posts</h1>
        ) : (
          userPost.map((imgData) => <UserImg data={imgData} />)
        )}
      </div>
    </div>
  );
}

export default SearchedUser;

function UserImg({ data }) {
  return (
    <div className="userImg">
      <img
        src={soldItem}
        style={data.itemSold ? { display: "block" } : { display: "none" }}
        className="userImg__soldItem"
      />
      <img className="userImg__image" src={data.imageUrl} />
    </div>
  );
}
