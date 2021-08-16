import React, { useState, useEffect } from "react";
import { storage, db } from "../firebase";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import { useAuth } from "../context/AuthContext";
import { useHistory } from "react-router-dom";

// css import
import "../styles/userPost.css";

// material-ui
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import { Description } from "@material-ui/icons";

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
  const [smallAmount, setSmallAmount] = useState(null);
  const [mediumAmount, setMediumAmount] = useState(null);
  const [largeAmount, setLargeAmount] = useState(null);
  const [xlargeAmount, setXlargeAmount] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();
  const history = useHistory();

  // data for the drop downs
  const styles = [
    "Long Sleeve",
    "Sweater",
    "Crewneck",
    "Flanel",
    "Button Up",
    "Pants",
    ,
    "Jeans",
    "Slacks",
    "Dress pants",
    "Sweats",
    "Shorts",
    "Athletic Shorts",
  ];

  const colors = [
    "Black",
    "White",
    "Grey",
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Pink",
  ];

  //   use effect to setUser data for each post.
  useEffect(() => {
    setUserId(currentUser.uid);
    setDisplayname(currentUser.displayName);
  }, [currentUser]);

  //   helper funciton for setting image url
  const changeImage = (e) => {
    if (e.target.value[0]) {
      setImage(e.target.files[0]);
      setTempFile(URL.createObjectURL(e.target.files[0]));
    }
  };

  //   function to upload image to firebase storage and database
  const handleUpload = () => {
    try {
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
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="userPost">
      <h1 style={{ textAlign: "center" }}>Post Image</h1>
      <hr />

      <div className="postBox">
        <div className="userPost__formDiv">
          <form className="userPost__form">
            <Input
              className="userPost__title"
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <Input
              className="userPost__Description"
              type="text"
              cols="40"
              rows="5"
              multiline
              className="userPost__captionInput"
              value={caption}
              placeholder="caption"
              onChange={(event) => setCaption(event.target.value)}
            />

            <input
              className="userPost__fileInput"
              type="file"
              size="40px"
              color="#e2ebe4"
              placeholder="Choose a file"
              onChange={changeImage}
            />

            <Input
              className="userPost__price"
              type="number"
              placeholder="Price $$$"
              onChange={(event) => setPrice(event.target.value)}
            />

            <TextField
              className="userPost__optionList"
              select
              label="Styles"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              helperText="Please select your style of item"
              margin="normal"
            >
              {styles.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              className="userPost__optionList"
              select
              label="Color"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              helperText="Please select Color of your item"
              margin="normal"
            >
              {colors.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>

            <div className="userPost__sizes">
              <h5>How many sizes will you have of this item?</h5>
              <TextField
                className="userPost__sizeCount"
                type="number"
                label="Small"
                margin="dense"
                onChange={(e) => setSmallAmount(e.target.value)}
              />
              <TextField
                className="userPost__sizeCount"
                type="number"
                label="Medium"
                margin="dense"
                onChange={(e) => setMediumAmount(e.target.value)}
              />
              <TextField
                className="userPost__sizeCount"
                type="number"
                label="Large"
                margin="dense"
                onChange={(e) => setLargeAmount(e.target.value)}
              />
              <TextField
                className="userPost__sizeCount"
                type="number"
                label="XLarge"
                margin="dense"
                onChange={(e) => setXlargeAmount(e.target.value)}
              />
            </div>

            <>
              <Button className="imageUpload__button" onClick={handleUpload}>
                Upload
              </Button>
            </>
          </form>
          <progress
            value={progress}
            style={{ height: "30px", width: "75%" }}
            max="100"
          />
        </div>
        <div className="userPostImg">
          <img src={tempFile} className="userPost__displayImg" />
          <h5>Title:{title}</h5>
          <h5>Description:{caption}</h5>
          <h5>Price: {price}</h5>
          <h5>Style: {style}</h5>
          <h5>Color: {color}</h5>
          <div className="userPost__sizeCounts">
            <h5>Small: {smallAmount}</h5>
            <h5>Medium: {mediumAmount}</h5>
            <h5>Large: {largeAmount}</h5>
            <h5>XLarge: {xlargeAmount}</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost;
