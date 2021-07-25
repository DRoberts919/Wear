import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, firebase } from "../firebase";
import "../styles/cart.css";

// material-ui
import { Button } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

// paypal
const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

function Cart() {
  const [usersCart, setUsersCart] = useState([]);
  const [total, setTotal] = useState("0");
  const { currentUser } = useAuth();

  console.log("carts");

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
  }, [currentUser, usersCart]);

  // paypal funcitons
  const onApprove = (data, actions) => {
    usersCart.map((id) => {
      db.collection("posts")
        .doc(id)
        .get()
        .then((doc) => {
          console.log(doc.data().price);
          setTotal(total + doc.data().price);
        });
    });

    console.log("total");
    return actions.order.capture();
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "0.01",
          },
        },
      ],
    });
  };

  const test = () => {};

  return (
    <div className="cart" onClick={test}>
      <div className="cart__header">
        <h1>Cart</h1>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </div>
      <div className="cart__paypal">
        <PayPalButton
          createOrder={(data, actions) => createOrder(data, actions)}
          onApprove={(data, actions) => onApprove(data, actions)}
        />
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
  const [updater, setUpdater] = useState(1);
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
  }, [id, updater]);

  const removeItem = () => {
    db.collection("ShoppingCart")
      .doc(currentUser.uid)
      .update({
        cart: firebase.firestore.FieldValue.arrayRemove(postId),
      })
      .then(() => {
        setUpdater(updater + 1);
      });
  };

  return (
    <div className="cartItem">
      <img className="cartItem__img" src={imgUrl} alt="" />

      <h2>{title}</h2>
      <h3>$: {price}</h3>

      <Button onClick={removeItem}>
        <HighlightOffIcon style={{ fill: "red" }} />
      </Button>
    </div>
  );
}
