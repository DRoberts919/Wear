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

    if (usersCart == null) {
      console.log("no items in list");
    } else {
      usersCart.map((cartItem) => {
        db.collection("posts")
          .doc(cartItem.id)
          .get()
          .then((doc) => {
            // console.log(doc.data().sizes);
            prices.push(Number(doc.data().price));

            setTotal(() => addPrices(prices));
          });
      });
    }
  }, [paidFor, usersCart]);

  // fucntion to subtract from the the collections of sizes to simulate
  // an item being removed from the sellers stock
  const removeSizeItemCounter = () => {
    usersCart.forEach((item) => {
      var docRef = db.collection("posts").doc(item.id);
      if (item.size === "Small") {
        docRef.update({
          "sizes.smallAmount": firebase.firestore.FieldValue.increment(-1),
        });
      } else if (item.size === "Medium") {
        docRef.update({
          "sizes.mediumAmount": firebase.firestore.FieldValue.increment(-1),
        });
      } else if (item.size === "Large") {
        docRef.update({
          "sizes.largeAmount": firebase.firestore.FieldValue.increment(-1),
        });
      } else if (item.size === "XL") {
        docRef.update({
          "sizes.xlargeAmount": firebase.firestore.FieldValue.increment(-1),
        });
      }
    });
  };

  // check if an item is all sold out and sets soldOut field to true
  const checkItemStock = () => {
    usersCart.forEach((item) => {
      var docRef = db.collection("posts").doc(item.id);

      docRef.get().then((doc) => {
        var sizeObject = doc.data().sizes;
        if (
          sizeObject.smallAmount <= 0 &&
          sizeObject.mediumAmount <= 0 &&
          sizeObject.largeAmount <= 0 &&
          sizeObject.xlargeAmount <= 0
        ) {
          docRef.update({
            itemSold: true,
          });
        } else {
          console.log("item still available");
        }
      });
    });
  };

  // method to add all prices up
  const addPrices = (prices) => {
    // takes in an array of numbers and
    var total = 0;

    for (let i = 0; i < prices.length; i++) {
      total += prices[i];
    }

    return total;
  };

  // here we create the paypal order and give it all its needed data
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

  // this is executed when paypal transaction is succesful
  const onApprove = (data, actions) => {
    const order = actions.order.capture();

    removeSizeItemCounter();
    checkItemStock();

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
              usersCart.map((item) => <CartItem item={item} />)
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

function CartItem({ item }) {
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
      .doc(item.id)
      .get()
      .then((doc) => {
        setPrice(doc.data().price);
        setImgUrl(doc.data().imageUrl);
        setTitle(doc.data().title);
        setPostId(item.id);
      });

    return getItem;
  }, [item, updater]);

  const removeItem = () => {
    db.collection("ShoppingCart")
      .doc(currentUser.uid)
      .update({
        cart: firebase.firestore.FieldValue.arrayRemove(item),
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
      <h3>Size: {item.size}</h3>

      <Button onClick={removeItem}>
        <HighlightOffIcon style={{ fill: "red" }} />
      </Button>
    </div>
  );
}
