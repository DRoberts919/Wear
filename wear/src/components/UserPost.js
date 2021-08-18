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


function UserPost() {
  const [caption, setCaption] = useState("");
  const [style, setStyle] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState(null);
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

  // check all data points and set up error handling
  const dataCheck = (e) => {
    e.preventDefault();
    if (title !== "") {
      if (caption !== "") {
        if (image !== null) {
          if (price !== null) {
            if (style !== "") {
              if (color !== "") {
                if (smallAmount !== null) {
                  if (mediumAmount !== null) {
                    if (largeAmount !== null) {
                      if (xlargeAmount !== null) {
                        handleUpload();
                      } else {
                        setError(
                          "You must enter an amount or set it to zero (0) for no stock"
                        );
                      }
                    } else {
                      setError(
                        "You must enter an amount or set it to zero (0) for no stock"
                      );
                    }
                  } else {
                    setError(
                      "You must enter an amount or set it to zero (0) for no stock"
                    );
                  }
                } else {
                  setError(
                    "You must enter an amount or set it to zero (0) for no stock"
                  );
                }
              } else {
                setError("You must add a color for filtering and searches");
              }
            } else {
              setError(
                "you must add a style to your item for backend purposes"
              );
            }
          } else {
            setError("You must add a price to your item to sell");
          }
        } else {
          setError("upload a photo to show off you cool item!");
        }
      } else {
        setError("you need to fill out the caption area");
      }
    } else {
      setError("Your title cannot be blank");
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
      console.log(error);
      setError(error);
    }
  };

  return (
    <div className="userPost">
      <h1 style={{ textAlign: "center" }}>Post!</h1>
      <hr />

      <div className="postBox">
        <div className="userPost__formDiv">
          <form className="userPost__form" onSubmit={dataCheck}>
            <input
              className="userPost__fileInput"
              type="file"
              size="40px"
              color="#e2ebe4"
              placeholder="Choose a file"
              onChange={changeImage}
            />

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
              value={color}
              onChange={(e) => setColor(e.target.value)}
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
              <Button className="imageUpload__button" type="submit">
                Upload
              </Button>
            </>
          </form>
          <progress
            value={progress}
            style={{ height: "30px", width: "75%", margin: "0 auto" }}
            max="100"
          />
        </div>
        <hr style={{ height: "600px", marginTop: "15px" }}></hr>
        <div className="userPost__tempBox">
          <img src={tempFile} className="userPost__displayImg" />
          <div className="userPost__tempData">
            <h4 className="userPost__temptitle">{title}</h4>
            <h5 className="userPost__tempdescription">{caption}</h5>
            <h5 className="userPost__moneyData">${price}</h5>
            <h5 className="userPost__filterOption">Style: {style}</h5>
            <h5 className="userPost__filterOption">Color: {color}</h5>
            <div className="userPost__sizeCounts">
              <h3>S: {smallAmount}</h3>
              <h3>M: {mediumAmount}</h3>
              <h3>L: {largeAmount}</h3>
              <h3>XL: {xlargeAmount}</h3>
            </div>

            {error}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPost;
