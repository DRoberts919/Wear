import React from "react";
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
}) {
  const { currentUser } = useAuth();

  // fucntion to add this post to a users wishlist.
  const addTowishList = () => {
    var docRef = db.collection("WishList").doc(currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("document exists");
        docRef.update({
          postList: firebase.firestore.FieldValue.arrayUnion(postId),
        });
      } else {
        console.log("document does not exists creating now");
        docRef.set({
          postList: [postId],
        });
      }
    });
  };

  // function to add an item to a users shopping cart
  const addToShoppingCart = () => {
    var docRef = db.collection("ShoppingCart").doc(currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("document Exists");
        docRef.update({
          cart: firebase.firestore.FieldValue.arrayUnion(postId),
        });
      } else {
        console.log("document does not exists for thsi user creating now...");
        docRef.set({
          cart: [postId],
        });
      }
    });
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src={userPhoto}
        />
        <h3>{username}</h3>
      </div>
      {/* image */}
      <div className="post__dataBox">
        <img className="post__image" src={imageUrl} alt="" />
        <h4>{title}</h4>
        {/* username caption and price */}
        <h4 className="post__text">
          <strong>{username}:</strong> {caption}
          <AttachMoneyIcon />: {price}
        </h4>
        <div className="post__buttons">
          <Button onClick={addTowishList}>
            <StarIcon style={{ color: "yellow" }} />
          </Button>
          <Button onClick={addToShoppingCart}>
            <ShoppingCartIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Post;
