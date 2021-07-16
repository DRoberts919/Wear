import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, firebase } from "../firebase";
import "../styles/wishList.css";

// material-ui
import { Button } from "@material-ui/core";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

function WishList() {
  // variable for storing all users current wishlist items
  const [usersWishList, setUsersWishList] = useState([]);
  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    // console.log(currentUser);

    if (currentUser) {
      history.push("/wishlist");
    }
  }, [currentUser, history]);
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
        } else {
          setUsersWishList("no data exits");
        }
      });

    return getData;
  }, [currentUser, usersWishList]);

  return (
    <div className="wishList">
      <div className="wishList__header">
        <h1>Wish List</h1>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </div>
      <div className="wishList__body">
        {/* {usersWishList.map(({ id, post }) => {
          return post.map((id) => <WishListItem id={id} />);
        })} */}

        {usersWishList.map((itemid) => (
          <WishListItem id={itemid} />
        ))}
      </div>
    </div>
  );
}

export default WishList;

function WishListItem({ id }) {
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
      .doc(id)
      .get()
      .then((doc) => {
        setPrice(doc.data().price);
        setImgUrl(doc.data().imageUrl);
        setTitle(doc.data().title);
        setPostId(id);
      });

    return getPost;
  }, [id, updater]);

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
          }),
        setUpdater(updater + 1)
      );
  };

  return (
    <div className="wishListItem">
      <img className="wishListItem__img" src={imgUrl} alt="" />

      <h2>{title}</h2>
      <h3>$: {price}</h3>
      <Button onClick={addToCart}>
        <ShoppingCartIcon />
      </Button>
    </div>
  );
}

function WishListItems({ list }) {
  const [price, setPrice] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");
  const [postId, setPostId] = useState("");
  const [tempList, setTempList] = useState([]);

  useEffect(() => {
    let holder = [];
    const test = list.map((id) => {
      console.log(id);
      db.collection("posts")
        .doc(id)
        .get()
        .then((doc) => {
          // console.log(doc.data());
          holder.push(doc.data());
          // console.log(holder);
          setTempList(holder);
        });
      // console.log(holder);
      // console.log(tempList);
    });

    // setTempList(holder);
    // console.log(tempList);

    return test;
  }, [list]);

  console.log(tempList);

  return (
    <div className="wishlistItem">
      {tempList.map((item, index) => (
        <div className="wishListItem" key={index}>
          {console.log(item)}
          <img className="wishListItem__img" src={item.imgUrl} alt="" />

          <h2>{item.title}</h2>
          <h3>$: {item.price}</h3>
          <Button>
            <ShoppingCartIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}
