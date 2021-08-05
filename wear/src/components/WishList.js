import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, firebase } from "../firebase";
import "../styles/wishList.css";

// material-ui
import { Button } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

function WishList() {
  // variable for storing all users current wishlist items
  const [usersWishList, setUsersWishList] = useState([]);
  const [check, setCheck] = useState(false);
  const { currentUser } = useAuth();

  //   useEffect to get all the users current wishilist items and sets it

  useEffect(() => {
    // access the WishList database
    const getData = db
      .collection("WishList")
      // get the data that corresponds with the users id
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUsersWishList(doc.data().postList);
          setCheck(false);
        } else {
          setCheck(true);
          setUsersWishList("no data exits");
        }
      });

    console.log(usersWishList);
    return getData;
  }, [usersWishList, currentUser]);

  return (
    <div className="wishList">
      <div className="wishList__header">
        <h1>Wish List</h1>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </div>
      <div className="wishList__body">
        {check ? (
          <div>
            <h2>No items in your list</h2>
            <h3>sorry</h3>
          </div>
        ) : (
          usersWishList.map((item,index) => <WishListItem key={index} item={item} />)
        )}
      </div>
    </div>
  );
}

export default WishList;

function WishListItem({ item }) {
  const { currentUser } = useAuth();
  const [price, setPrice] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");
  const [postId, setPostId] = useState("");
  const [updater, setUpdater] = useState(1);

  // useEffect to get the certain list item
  useEffect(() => {
    const getPost = db
      .collection("posts")
      .doc(item.id)
      .get()
      .then((doc) => {
        setPrice(doc.data().price);
        setImgUrl(doc.data().imageUrl);
        setTitle(doc.data().title);
        setPostId(item.id);
      });

    return getPost;
  }, [item, updater]);

  const addToCart = () => {
    var docRef = db.collection("ShoppingCart").doc(currentUser.uid);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("document Exists");
          docRef.update({
            cart: firebase.firestore.FieldValue.arrayUnion(item),
          });
        } else {
          console.log("document does not exists for thsi user creating now...");
          docRef.set({
            cart: [item],
          });
        }
      })
      .then(
        db
          .collection("WishList")
          .doc(currentUser.uid)
          .update({
            postList: firebase.firestore.FieldValue.arrayRemove(item),
          }),
        setUpdater(updater + 1)
      );
  };

  return (
    <div className="wishListItem">
      <img className="wishListItem__img" src={imgUrl} alt="" />

      <h2>{title}</h2>
      <h3>$: {price}</h3>
      <h3>Size: {item.size}</h3>
      <Button onClick={addToCart}>
        <ShoppingCartIcon />
      </Button>
    </div>
  );
}
