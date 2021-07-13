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
  const [list, setList] = useState([]);
  const [change, setChange] = useState(1);
  const { currentUser } = useAuth();

  //   useEffect to get all the users current wishilist items and sets it

  useEffect(() => {
    let newList = [];
    // access the WishList database
    const getData = db
      .collection("WishList")
      // get the data that corresponds with the users id
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setList(doc.data().postList);
          // console.log(doc.data().postList);
          setChange(change + 1);
        } else {
          setUsersWishList("no data exists for this user");
        }
      })
      .then(
        list.map((postsId) => {
          // console.log(postsId);
          // console.log(newList);
          newList.push(postsId);
          // console.log(newList);
          setUsersWishList(newList);
        })
      );

    return getData;
  }, [change]);

  // console.log(usersWishList);

  return (
    <div className="wishList">
      <div className="wishList__header">
        <h1>Wish List</h1>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </div>
      <div className="wishList__body">
        {usersWishList.map((itemId) => (
          <WishListItem id={itemId} />
        ))}
      </div>
    </div>
  );
}

export default WishList;

function WishListItem({ id }) {
  const { currentUser } = useAuth();
  const [list, setList] = useState(null);
  const [price, setPrice] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");
  const [postId, setPostId] = useState("");

  // useEffect to get the certain list item
  useEffect(async () => {
    const getPost = db
      .collection("posts")
      .doc(id)
      .get()
      .then((doc) => {
        setPrice(doc.data().price);
        setImgUrl(doc.data().imageUrl);
        setTitle(doc.data().title);
        setPostId(id);
      });

    return getPost;
  }, [list]);

  const addToCart = () => {
    var docRef = db.collection("ShoppingCart").doc(currentUser.uid);

    docRef
      .get()
      .then((doc) => {
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
      })
      .then(
        db
          .collection("WishList")
          .doc(currentUser.uid)
          .update({
            postList: firebase.firestore.FieldValue.arrayRemove(postId),
          })
      );
  };

  return (
    <div className="wishListItem">
      <img className="wishListItem__img" src={imgUrl} />

      <h2>{title}</h2>
      <h3>$: {price}</h3>
      <Button onClick={addToCart}>
        <ShoppingCartIcon />
      </Button>
    </div>
  );
}
