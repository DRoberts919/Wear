import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAkbaNhcHq9kvG8jQBJhBfG-XcE-9j0VSQ",
  authDomain: "wear-f749e.firebaseapp.com",
  projectId: "wear-f749e",
  storageBucket: "wear-f749e.appspot.com",
  messagingSenderId: "968715703903",
  appId: "1:968715703903:web:66a35d72ff06a8172b2dea",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage, firebaseApp };
