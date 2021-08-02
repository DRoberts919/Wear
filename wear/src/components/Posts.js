import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import { useAuth } from "../context/AuthContext";
import { db, firebase } from "../firebase";

import "../styles/posts.css";

// materialUI items
import Button from "@material-ui/core/Button";
import StarIcon from "@material-ui/icons/Star";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";

function Post({
  username,
  caption,
  imageUrl,
  price,
  postId,
  title,
  userPhoto,
  isSold,
}) {
  const [sizeSelected, setSizeSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const { currentUser } = useAuth();

  // fucntion to add this post to a users wishlist.
  const addTowishList = () => {
    var docRef = db.collection("WishList").doc(currentUser.uid);
    var wishItem = {
      id: postId,
      size: selectedSize,
    };

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("document exists");
        docRef.update({
          postList: firebase.firestore.FieldValue.arrayUnion(wishItem),
        });
      } else {
        console.log("document does not exists creating now");
        docRef.set({
          postList: [wishItem],
        });
      }
    });
  };

  // function to add an item to a users shopping cart
  const addToShoppingCart = () => {
    var docRef = db.collection("ShoppingCart").doc(currentUser.uid);

    var cartItem = {
      id: postId,
      size: selectedSize,
    };

    docRef.get().then((doc) => {
      if (doc.exists && selectedSize != "") {
        console.log("document Exists");
        docRef.update({
          cart: firebase.firestore.FieldValue.arrayUnion(cartItem),
        });
      } else {
        console.log("document does not exists for thsi user creating now...");
        docRef.set({
          cart: [cartItem],
        });
      }
    });
  };

  return (
    <div
      className="post"
      style={
        isSold
          ? { display: "none", visibility: "hidden" }
          : { display: "block" }
      }
    >
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src={userPhoto} />
        <h3>{username}</h3>
      </div>
      {/* image */}
      <div className="post__dataBox">
        <img className="post__image" src={imageUrl} alt="" />
        <div className="post__data">
          <h4>{title}</h4>
          {/* username caption and price */}
          <h4 className="post__text">
            <strong>{username}:</strong> {caption}
          </h4>
          <div className="post__moneyData">
            <AttachMoneyIcon />: {price}
          </div>
          <div className="post__sizes">
            <h5 className="post__sizesTitle">Select Size</h5>
            <div className="post__sizeContainer">
              <div
                className="post__sizeOption"
                onClick={() => {
                  setSelectedSize("Small");
                  setSizeSelected(true);
                }}
              >
                <h6>Small</h6>
              </div>
              <div
                className="post__sizeOption"
                onClick={() => {
                  setSelectedSize("Medium");
                  setSizeSelected(true);
                }}
              >
                <h6>Medium</h6>
              </div>
              <div
                className="post__sizeOption"
                onClick={() => {
                  setSelectedSize("Large");
                  setSizeSelected(true);
                }}
              >
                <h6>Large</h6>
              </div>
              <div
                className="post__sizeOption"
                onClick={() => {
                  setSelectedSize("XL");
                  setSizeSelected(true);
                }}
              >
                <h6>Xlarge</h6>
              </div>
            </div>
          </div>
          <div className="post__buttons">
            <Button
              onClick={addTowishList}
              style={
                sizeSelected
                  ? { pointerEvents: "all" }
                  : { pointerEvents: "none" }
              }
            >
              <StarIcon style={{ color: "yellow" }} />
            </Button>
            <Button
              onClick={addToShoppingCart}
              style={
                sizeSelected
                  ? { pointerEvents: "all" }
                  : { pointerEvents: "none" }
              }
            >
              <ShoppingCartIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
