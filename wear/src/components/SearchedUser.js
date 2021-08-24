import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

import { Link } from "react-router-dom";

import { Avatar } from "@material-ui/core";


import soldItem from "../images/soldItem.png";

function SearchedUser() {
  const [userPhoto, setUserPhoto] = useState();
  const [userId, setUserId] = useState(null);
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");
  const [checkUser, setCheckUser] = useState(false);

  const [userPost, setUserPosts] = useState([]);

  let { id } = useParams();

  useEffect(() => {
    let posts = [];
    var getUserData = db
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
            setCheckUser(true);
          } else {
            console.log("error");
            setCheckUser(false);
          }
        });
      });

    var getPosts = db
      .collection("posts")
      .where("userId", "==", userId)
      .get()
      .then((docdata) => {
        docdata.forEach((item) => {
          posts.push(item.data());
        });
        setUserPosts(posts);
      });

    return { getUserData, getPosts };
  }, [id, checkUser]);

  return (
    <div className="account">
      {checkUser ? (
        <>
          <div className="account__header">
            {/* users image */}
            <Avatar
              alt="currentUser"
              src={userPhoto}
              style={{ height: "120px", width: "120px" }}
            ></Avatar>

            <div className="account__headerInfo">
              <div className="account__headerInfoUser">
                <h1 className="account__userName">{username}</h1>
                <Link to="/home">
                  <button className="account__logoutButton">Home</button>
                </Link>
              </div>
              <div className="account__userDescription">
                <h5>{description}</h5>
              </div>
            </div>
          </div>
          <hr></hr>
          <div className="account__posts">
            {!checkUser ? (
              <h1>no posts</h1>
            ) : (
              userPost.map((imgData, index) => (
                <UserImg key={index} data={imgData} />
              ))
            )}
          </div>
        </>
      ) : (
        <h1>User does not exist</h1>
      )}
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
        alt="userImg"
      />
      <img className="userImg__image" alt="" src={data.imageUrl} />
    </div>
  );
}
