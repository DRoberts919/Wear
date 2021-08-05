import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import from context
import { useAuth } from "../context/AuthContext";

// firebase helper methods
import { db, auth } from "../firebase";

// css import
import "../styles/account.css";

// image import
import soldItem from "../images/soldItem.png";

// material-ui
import { Avatar, Button } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

function Account() {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState("");
  const [usersImg, setUsersImg] = useState([]);

  // useEffect to get the users description
  useEffect(() => {
    var postList = [];

    var getDescription = db
      .collection("userCollection")
      .get()
      .then((queryData) => {
        queryData.forEach((doc) => {
          if (doc.data().uid === currentUser.uid) {
            setDescription(doc.data().description);
          }
        });
      });
    // api call to get all posts connected to a users
    var getPosts = db
      .collection("posts")
      .get()
      .then((queryData) => {
        queryData.forEach((data) => {
          if (data.data().userId === currentUser.uid) {
            postList.push(data.data());
          }
        });
        setUsersImg(postList);
      });

    return getDescription, getPosts;
  }, [currentUser]);

  return (
    <div className="account">
      {/* user header 
              the user header has a description, avatar icon, and name! */}
      <div className="account__header">
        {/* users image */}
        <Avatar
          alt="currentUser"
          src={currentUser.photoURL}
          style={{ height: "120px", width: "120px" }}
        ></Avatar>
        {/* users display name */}
        <div className="account__headerInfo">
          <h1 className="account__userName">{currentUser.displayName}</h1>
          {/* users dectiption */}
          <h5>{description}</h5>
          <Button>
            <Link to="/editAccount">
              <SettingsIcon />
            </Link>
          </Button>
          <Button
            onClick={() => {
              auth.signOut();
              console.log("user signed out");
            }}
          >
            Log out
          </Button>
        </div>
      </div>
      <hr></hr>
      <div className="account__posts">
        {usersImg.map((imgData) => (
          <UserImg data={imgData} />
        ))}
      </div>
    </div>
  );
}

export default Account;

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
