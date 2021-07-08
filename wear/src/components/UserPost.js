import React, { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

import "../styles/userPost.css";

function UserPost() {
  const [caption, setCaption] = useState("");
  const [style, setStyle] = useState("Shirt");
  const [color, setColor] = useState("Black");
  const [price, setPrice] = useState();
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState("");
  const [displayname, setDisplayname] = useState("");
  const { currentUser } = useAuth();
  const history = useHistory();

  //   use effect to setUser data for each post.
  useEffect(() => {
    setUserId(currentUser.uid);
    setDisplayname(currentUser.displayName);
  }, []);

  // helper function to set style
  const changeStyle = (e) => {
    console.log(e.target.value);
    setStyle(e.target.value);
  };

  // helper function to set Color

  const changeColor = (e) => {
    console.log(e.target.value);
    setColor(e.target.value);
  };

  //   helper funciton for setting image url

  const changeImage = (e) => {
    if (e.target.value[0]) {
      setImage(e.target.files[0]);
    }
  };

  //   function to upload image to firebase storage and database

  const handleUpload = () => {
    const uploadTask = storage.ref(`image/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
        setProgress(progress);
      },
      (err) => {
        // error function
        alert(err);
      },
      () => {
        // upload to database and storage function
        storage
          .ref("image")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image to DB
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              price: price,
              username: displayname,
              userId: userId,
            });
            setProgress(0);
            setImage(null);
            setCaption("");
            setPrice(0);
            setColor("");
            setStyle("");
            history.push("/home");
          });
      }
    );
  };

  return (
    <div className="userPost">
      <h1>Post Image</h1>
      <hr />

      <form className="userPost__form">
        <h3>Caption</h3>
        <textarea
          type="text"
          cols="40"
          rows="5"
          className="userPost__captionInput"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />

        <h3>Image</h3>
        <input type="file" onChange={changeImage}></input>

        <h3>price: $</h3>
        <input
          type="number"
          onChange={(event) => setPrice(event.target.value)}
        />

        <h3>Styles</h3>
        <select value={style} name="selectList" onChange={changeStyle}>
          {/* shirts and others */}  <option value="Shirt">Shirt</option>
          <option value="Long Sleeve">Long Sleeve</option>
          <option value="Sweater">Sweater</option>
          <option value="Crewneck">Crewneck</option>
          <option value="Flanel">Flanel</option>
          <option value="Button Up">Button Up</option>
          {/* pants */}
          <option value="Pants">Pants</option>
          <option value="Jeans">Jeans</option>
          <option value="Slacks">Slacks</option>
          <option value="Dress pants">Dress pants</option>
          <option value="Sweats">Sweats</option>
          <option value="Shorts">Shorts</option>
          <option value="Athletic Shorts">Athletic Shorts</option>
        </select>

        <h3>Color</h3>
        <select value={color} name="selectList" onChange={changeColor}>
          {/* shirts and others */}  <option value="Black">Black</option>
          <option value="White">White</option>
          <option value="Grey">Grey</option>
          <option value="Red">Red</option>
          <option value="Orange">Orange</option>
          <option value="Yellow">Yellow</option>
          <option value="Green">Green</option>
          {/* pants */}
          <option value="Blue">Blue</option>
          <option value="Purple">Purple</option>
          <option value="Pink">Pink</option>
        </select>
        <progress value={progress} max="100" />

        <Button className="imageUpload__button" onClick={handleUpload}>
          Upload
        </Button>
      </form>
    </div>
  );
}

export default UserPost;
