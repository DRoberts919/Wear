import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, firebase } from "../firebase";
import "../styles/cart.css"

// material-ui
import { Button } from "@material-ui/core";

function Cart() {
  const [usersCart, setUsersCart] = useState([]);
  const { currentUser } = useAuth();

  //   useEffect to get all data from the users cart!
  useEffect(() => {
    const getCartData = db
      .collection("ShoppingCart")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUsersCart(doc.data().cart);
        } else {
          setUsersCart("No data Exists for this user");
        }
      });

    return getCartData;
  }, []);

  return (
    <div className="cart">
      <div className="cart__header">
        <h1>Cart</h1>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </div>

      <div className="cart__body">
        {usersCart.map((itemId) => (
          <CartItem id={itemId} />
        ))}
      </div>
    </div>
  );
}

export default Cart;

function CartItem({ id }) {
  const [price, setPrice] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");
  const [postId, setPostId] = useState("");
  const { currentUser } = useAuth();

  //   useEffect to get each individual item

  useEffect(() => {
    const getItem = db
      .collection("posts")
      .doc(id)
      .get()
      .then((doc) => {
        setPrice(doc.data().price);
        setImgUrl(doc.data().imageUrl);
        setTitle(doc.data().title);
        setPostId(id);
      });

    return getItem;
  }, []);

  return (
    <div className="cartItem">
      <img className="cartItem__img" src={imgUrl} />

      <h2>{title}</h2>
      <h3>$: {price}</h3>
    </div>
  );
}
