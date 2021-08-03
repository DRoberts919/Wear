import React, { useState, useEffect } from "react";
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
  postList,
}) {
  const [sizeSelected, setSizeSelected] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [clickedOption, setClickedOption] = useState("post__sizeOption");
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [itemArray, setItemArray] = useState(postList);
  const { currentUser } = useAuth();

  useEffect(() => {
    let tempArray = [];
    let max = itemArray.length;

    for (let i = 0; i < 3; i++) {
      let index = Math.floor(Math.random() * (max - 0) + 0);
      tempArray.push(itemArray[index]);
      itemArray.splice(max, 1);
    }

    setSuggestedItems(tempArray);
  }, [itemArray]);

  const select = (id) => {
    var s = document.getElementById("S");
    var m = document.getElementById("M");
    var l = document.getElementById("L");
    var xl = document.getElementById("XL");
    if (id === "S") {
      s.classList.add("post__sizeOptionClicked");
      m.classList.remove("post__sizeOptionClicked");
      l.classList.remove("post__sizeOptionClicked");
      xl.classList.remove("post__sizeOptionClicked");
    } else if (id === "M") {
      m.classList.add("post__sizeOptionClicked");
      s.classList.remove("post__sizeOptionClicked");
      l.classList.remove("post__sizeOptionClicked");
      xl.classList.remove("post__sizeOptionClicked");
    } else if (id === "L") {
      l.classList.add("post__sizeOptionClicked");
      s.classList.remove("post__sizeOptionClicked");
      m.classList.remove("post__sizeOptionClicked");
      xl.classList.remove("post__sizeOptionClicked");
    } else if (id === "XL") {
      xl.classList.add("post__sizeOptionClicked");
      s.classList.remove("post__sizeOptionClicked");
      m.classList.remove("post__sizeOptionClicked");
      l.classList.remove("post__sizeOptionClicked");
    }
  };

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
      if (doc.exists && selectedSize !== "") {
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
    <div className="post" id={postId}>
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
            <h5 className="post__sizesTitle">Sizes :</h5>
            <div className="post__sizeContainer">
              <div
                className="post__sizeOption "
                id="S"
                onClick={() => {
                  setSelectedSize("Small");
                  select("S");
                }}
              >
                <p className="post__sizeTitle">S</p>
              </div>
              <div
                className={clickedOption}
                id="M"
                onClick={() => {
                  setSelectedSize("Medium");
                  select("M");
                }}
              >
                <p className="post__sizeTitle">M</p>
              </div>
              <div
                className={clickedOption}
                id="L"
                onClick={() => {
                  setSelectedSize("Large");
                  select("L");
                }}
              >
                <p className="post__sizeTitle">L</p>
              </div>
              <div
                className={clickedOption}
                id="XL"
                onClick={() => {
                  setSelectedSize("XL");
                  select("XL");
                }}
              >
                <p className="post__sizeTitle">XL</p>
              </div>
              <h5>selected Size: {selectedSize}</h5>
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
          <div className="post__suggestedItemContainer">
            <p>Suggested Items</p>
            {suggestedItems.map((item) => (
              <a href={"#" + item.id}>
                <img
                  alt=""
                  className="post__suggestedItemPicture"
                  src={item.post.imageUrl}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
