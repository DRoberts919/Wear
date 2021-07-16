import React, { useEffect, useState } from "react";
// import from context
import { useAuth } from "../context/AuthContext";

// firebase helper methods
import { db } from "../firebase";

// css import
import "../styles/account.css";

// material-ui
import { Avatar } from "@material-ui/core";

function Account() {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState("");
  const [usersImg, setUsersImg] = useState([]);

  // useEffect to get the users description

  useEffect(() => {
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

    var getPosts = db
      .collection("posts")
      .get()
      .then((queryData) => {
        queryData.forEach((data) => {
          if (data.data().userId === currentUser.uid) {
            console.log(data.data());
            setUsersImg(data.data());
          }
        });
      });

    console.log(usersImg);

    return getDescription, getPosts;
  }, []);

  return (
    <div className="account">
      {/* user header 
              the user header has a description, avatar icon, and name! */}
      <div className="account__header">
        {/* users image */}
        <Avatar alt="currentUser" src={currentUser.photoUrl}></Avatar>
        {/* users display name */}
        <h1 className="account__userName">{currentUser.displayName}</h1>
        {/* users dectiption */}
        <h5>{description}</h5>
      </div>
      <hr></hr>
      <div className="account__posts">
        {/* {usersImg.map((imgData) => (
          <UserImg data={imgData} />
        ))} */}
      </div>
    </div>
  );
}

export default Account;

function UserImg({ data }) {
  console.log(data);

  return <div></div>;
}
