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
  const [check, setCheck] = useState(false);
  const [updater, setUpdater] = useState(1);

  //   useEffect to get all data from the users cart!
  useEffect(() => {
    getCartData();
  }, [updater, total]);

  const getCartData = async () => {
    await db
      .collection("ShoppingCart")
      .doc(currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setUsersCart(doc.data().cart);
          setCheck(false);
        } else {
          setUsersCart("No data Exists for this user");
          setCheck(true);
        }
      })
      .then(() => {
        addPrices();
      });

    // addPrices();
  };

  // function to subtract from the the collections of sizes to simulate
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
  const addPrices = () => {
    let price = 0;

    if (usersCart.length !== 0) {
      usersCart.forEach((item) => {
        price += Number(item.price);
      });
      setTotal(price);
    } else {
      setTotal(0);
    }
  };

  console.log(total);

  const removeItem = (item) => {
    db.collection("ShoppingCart")
      .doc(currentUser.uid)
      .update({
        cart: firebase.firestore.FieldValue.arrayRemove(item),
      })
      .then(() => {
        setUpdater(updater + 1);
      });
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
        <Link
          to="/home"
          className="cart__homeLink"
          style={{ textDecoration: "none" }}
        >
          <Button style={{ fontSize: "25px", textDecoration: "none" }}>
            Go Back
          </Button>
        </Link>
        <h1 className="cart__title">Cart</h1>
      </div>
      {paidFor ? (
        <div>
          <h1>Congrats, you just bought some great stuff!</h1>
        </div>
      ) : (
        <div className="cart__body">
          <div className="cart__items">
            {check ? (
              <div>
                <h2>no Items in your cart</h2>
                <h3>Sorry</h3>
              </div>
            ) : (
              usersCart.map((item, index) => (
                <div className="cartItem" key={index}>
                  <img className="cartItem__img" src={item.imageUrl} alt="" />

                  <h2 className="cartItem__title">{item.title}</h2>
                  <h3 className="cartItem__price">${item.price}</h3>
                  <h3 className="cartItem__size">Size: {item.size}</h3>

                  <Button onClick={() => removeItem(item)}>
                    <HighlightOffIcon style={{ fill: "red" }} />
                  </Button>
                </div>
              ))
            )}
          </div>
          <div className="cart__totalDiv">
            <h2 className="cart__total">Total: ${total}</h2>
          </div>
          <hr></hr>
          <div className="cart__paypal" id="cart__paypal">
            {usersCart.length == 0 ? (
              <div></div>
            ) : (
              <PayPalButton
                createOrder={(data, actions) => createOrder(data, actions)}
                onApprove={(data, actions) => onApprove(data, actions)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
