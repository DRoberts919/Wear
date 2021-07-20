import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import "../styles/editAccount.css";
import { useHistory } from "react-router";

// maaterial-ui
import { Button } from "@material-ui/core";

function EditAccount() {
  const { currentUser } = useAuth();
  const [userName, setUsername] = useState(currentUser.displayName);
  const [userImg, setUserImg] = useState();
  const [description, setDescription] = useState("");
  const history = useHistory();

  const setImage = (e) => {
    if (e.target.value[0]) {
      console.log(e.target.files[0]);
      setUserImg(e.target.files[0]);
      console.log(userImg);
    }
  };

  const updateProfile = (evt) => {
    evt.preventDefault();

    const uploadTask = storage
      .ref(`profile-picture/${userImg.name}`)
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
            console.log(url);
            currentUser.updateProfile({
              displayName: userName,
              photoURL: url,
            });
          })
          .then(() => {
            db.collection("userCollection")
              .where("uid", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                queryData.forEach((doc) => {
                  db.collection("userCollection").doc(doc.id).update({
                    description: description,
                  });
                });
              });

            history.push("/account");
          });
      }
    );
  };

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
        <input type="file" onChange={setImage}></input>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default EditAccount;
