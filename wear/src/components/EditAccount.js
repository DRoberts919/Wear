import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import "../styles/editAccount.css";

function EditAccount() {
  const [userName, setUsername] = useState("");
  const [userImg, setUserImg] = useState(null);
  const [description, setDescription] = useState("");
  const { currentUser } = useAuth();

  console.log(currentUser);

  const updateProfile = (evt) => {
    evt.preventDefault();
    const uploadTask = storage
      .ref(`profile-picture/${userImg.image}`)
      .put(userImg);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => {
        // alert user of error
        alert(err);
      },
      () => {
        storage
          .ref("profile-picture")
          .child(userImg.name)
          .getDownloadURL()
          .then((url) => {
            currentUser.updateProfile({
              displayName: userName,
              photoUrl: url,
            });
          });
      }
    );
  };

  db.collection("userCollection")
    .get()
    .then((queryData) => {
      console.log(queryData);
      queryData.forEach((collection) => {
        console.log(collection.data());
      });
    });

  return (
    <div className="editAccount">
      <h1>Here you can edit your account</h1>
      <form onSubmit={updateProfile}>
        <h3>username</h3>
        <input
          type="text"
          placeholder={currentUser.displayName}
          onChange={(e) => setUsername(e.target.value)}
        />

        <h3>Description</h3>
        <textarea
          type="text"
          cols="40"
          rows="5"
          className="userPost__captionInput"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <h3>Profile Image</h3>
        <input
          type="file"
          onChange={(e) => setUserImg(e.target.files[0])}
        ></input>
      </form>
    </div>
  );
}

export default EditAccount;
