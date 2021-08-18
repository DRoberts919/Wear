import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import "../styles/editAccount.css";
import { useHistory } from "react-router";

// maaterial-ui
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

function EditAccount() {
  const { currentUser } = useAuth();
  const [userName, setUsername] = useState(currentUser.displayName);
  const [userImg, setUserImg] = useState();
  const [description, setDescription] = useState("");
  const history = useHistory();

  const setImage = (e) => {
    if (e.target.value[0]) {
      setUserImg(e.target.files[0]);
    }
  };

  const updateProfile = (evt) => {
    evt.preventDefault();

    try {
      if (
        userName !== currentUser.displayName &&
        userImg !== null &&
        description !== ""
      ) {
        // if user chooses to update all data
        updateAllData();
      } else if (userImg == null && description === "") {
        // if no data provided for userImg or description user updates only username
        updateUsername();
      } else if (description !== "") {
        // update the description only
        updateDescription();
      } else if (userImg !== null) {
        // update user profile
        updatePhoto();
      } else if (userImg !== null && description === "") {
        // update image and description
        updatePhoto();
        updateDescription();
      } else if (description !== "" && userName !== "") {
        // update description and name
        updateDescription();
        updateUsername();
      } else if (userImg !== null && userName !== "") {
        // user updates both username and photo
        updatePhotoAndUsername();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePhoto = () => {
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
            db.collection("posts")
              .where("userId", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                console.log("updating user photo");
                queryData.forEach((doc) => {
                  db.collection("posts").doc(doc.id).update({
                    userImg: url,
                  });
                });
              });

            db.collection("userCollection")
              .where("uid", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                queryData.forEach((item) => {
                  db.collection("userCollection").doc(item.id).update({
                    userImage: url,
                  });
                });
              });
          });
        history.push("/account");
      }
    );
  };

  const updatePhotoAndUsername = () => {
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
            db.collection("posts")
              .where("userId", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                queryData.forEach((doc) => {
                  db.collection("posts").doc(doc.id).update({
                    userImg: url,
                  });
                });
              });

            db.collection("userCollection")
              .where("uid", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                queryData.forEach((item) => {
                  db.collection("userCollection").doc(item.id).update({
                    userImage: url,
                  });
                });
              });
          });

        db.collection("posts")
          .where("userId", "==", currentUser.uid)
          .get()
          .then((queryData) => {
            queryData.forEach((doc) => {
              db.collection("posts").doc(doc.id).update({
                username: userName,
              });
            });
          });
      }
    );
  };

  const updateDescription = () => {
    console.log("update Descrition in progress...");
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
  };

  const updateUsername = () => {
    currentUser.updateProfile({
      displayName: userName,
    });

    db.collection("posts")
      .where("userId", "==", currentUser.uid)
      .get()
      .then((queryData) => {
        queryData.forEach((doc) => {
          db.collection("posts").doc(doc.id).update({
            username: userName,
          });
        });
      });
    history.push("/account");
  };

  const updateAllData = () => {
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

            db.collection("posts")
              .where("userId", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                queryData.forEach((doc) => {
                  db.collection("posts").doc(doc.id).update({
                    userImg: url,
                  });
                });
              });

            db.collection("userCollection")
              .where("uid", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                queryData.forEach((doc) => {
                  db.collection("userCollection").doc(doc.id).update({
                    description: description,
                    userImage: url,
                  });
                });
              });
          })
          .then(() => {
            history.push("/account");
          })
          .then(() => {
            db.collection("posts")
              .where("userId", "==", currentUser.uid)
              .get()
              .then((queryData) => {
                queryData.forEach((doc) => {
                  db.collection("posts").doc(doc.id).update({
                    username: userName,
                  });
                });
              });
          });
      }
    );
  };
  return (
    <div className="editAccount">
      <h1>Edit Account</h1>
      <form className="editAccount__form" onSubmit={updateProfile}>
        <h3>username</h3>
        <Input
          type="text"
          // value={currentUser.displayName}
          placeholder={currentUser.displayName}
          onChange={(e) => setUsername(e.target.value)}
        />

        <h3>Description</h3>
        <textarea
          type="text"
          cols="40"
          rows="5"
          placeholder="type your new description here"
          className="editAccount__description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <h3 style={{ marginTop: "20px", marginBotom: "15px" }}>
          Profile Image
        </h3>
        <input className="editAcount__IMGButton" type="file" onChange={setImage}></input>

        <button className="editAcount__button" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EditAccount;
