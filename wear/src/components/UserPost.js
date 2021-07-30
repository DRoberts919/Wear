import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

// css import
import "../styles/userPost.css";

// material-ui
import { TextField } from "@material-ui/core";

function UserPost() {
  const [caption, setCaption] = useState("");
  const [style, setStyle] = useState("Shirt");
  const [color, setColor] = useState("Black");
  const [price, setPrice] = useState();
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [smallAmount, setSmallAmount] = useState(0);
  const [mediumAmount, setMediumAmount] = useState(0);
  const [largeAmount, setLargeAmount] = useState(0);
  const [xlargeAmount, setXlargeAmount] = useState(0);
  const { currentUser } = useAuth();
  const history = useHistory();

  //   use effect to setUser data for each post.
  useEffect(() => {
    setUserId(currentUser.uid);
    setDisplayname(currentUser.displayName);
  }, [currentUser]);

  //   helper funciton for setting image url
  const changeImage = (e) => {
    if (e.target.value[0]) {
      setImage(e.target.files[0]);
    }
  };

  //   function to upload image to firebase storage and database
  const handleUpload = () => {
    // access the firebase storage and add the photo to it
    const uploadTask = storage.ref(`image/${image.name}`).put(image);

    // on upload of image this activates
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
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
            db.collection("posts")
              .add({
                userId: userId,
                username: displayname,
                caption: caption,
                title: title,
                imageUrl: url,
                userImg: currentUser.photoURL,
                price: price,
                sizes: {
                  smallAmount: Number(smallAmount),
                  mediumAmount: Number(mediumAmount),
                  largeAmount: Number(largeAmount),
                  xlargeAmount: Number(xlargeAmount),
                },
                color: color,
                style: style,
                itemSold: false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              })
              .catch((error) => {
                alert(error);
              });
            setProgress(0);
            setImage(null);
            setCaption("");
            setPrice(0);
            setColor("");
            setStyle("");
            setSmallAmount(0);
            setMediumAmount(0);
            setLargeAmount(0);
            setXlargeAmount(0);
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
        <h3>Title</h3>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        ></input>
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
        <select
          value={style}
          name="selectList"
          onChange={(e) => setStyle(e.target.value)}
        >
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
        <select
          value={color}
          name="selectList"
          onChange={(e) => setColor(e.target.value)}
        >
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

        <div className="userPost__sizes">
          <h5>How many sizes will you have of this item?</h5>
          <TextField
            label="Small"
            onChange={(e) => setSmallAmount(e.target.value)}
          />
          <TextField
            label="Medium"
            onChange={(e) => setMediumAmount(e.target.value)}
          />
          <TextField
            label="Large"
            onChange={(e) => setLargeAmount(e.target.value)}
          />
          <TextField
            label="XLarge"
            onChange={(e) => setXlargeAmount(e.target.value)}
          />
        </div>

        <>
          <progress value={progress} max="100" />

          <Button className="imageUpload__button" onClick={handleUpload}>
            Upload
          </Button>
        </>
      </form>
    </div>
  );
}

export default UserPost;
