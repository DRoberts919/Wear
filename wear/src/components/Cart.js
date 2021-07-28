import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db, firebase } from "../firebase";
import "../styles/cart.css";

// material-ui
import { Button } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

function Cart() {
  const { currentUser } = useAuth();
  const [usersCart, setUsersCart] = useState([]);
  const [total, setTotal] = useState();
  const [paidFor, setPaidFor] = useState(false);

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
  }, [currentUser, usersCart, paidFor]);

  // useEffect for paypal sdk and injecting scripts
  useEffect(() => {
    var prices = [];

    console.log(usersCart);

    if (usersCart == null) {
      console.log("no items in list");
    } else {
      usersCart.map((id) => {
        db.collection("posts")
          .doc(id)
          .get()
          .then((doc) => {
            prices.push(Number(doc.data().price));

            setTotal(() => addPrices(prices));
          });
      });
    }
  }, [paidFor, usersCart]);

  // method to add all prices up
  const addPrices = (prices) => {
    // takes in an array of numbers and
    var total = 0;

    for (let i = 0; i < prices.length; i++) {
      total += prices[i];
    }

    return total;
  };

  const createOrder = (data, actions) => {
    console.log(total);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total,
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    const order = actions.order.capture();

    db.collection("ShoppingCart").doc(currentUser.uid).update({
      cart: firebase.firestore.FieldValue.delete(),
    });

    setPaidFor(true);
    console.log(order);
  };
  return (
    <div className="cart">
      <div className="cart__header">
        <h1>Cart</h1>
        <Link to="/home">
          <Button>Home</Button>
        </Link>
      </div>
      {paidFor ? (
        <div>
          <h1>Congrats, you just bought some great stuff!</h1>
        </div>
      ) : (
        <div className="cart__body">
          <div className="cart__items">
            {usersCart == null || usersCart.length <= 0 ? (
              <h2>no Items in your cart</h2>
            ) : (
              usersCart.map((itemId) => <CartItem id={itemId} />)
            )}
          </div>
          <div className="cart__paypal" id="cart__paypal">
            <PayPalButton
              createOrder={(data, actions) => createOrder(data, actions)}
              onApprove={(data, actions) => onApprove(data, actions)}
            />
          </div>
        </div>
      )}
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
