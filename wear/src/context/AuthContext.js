import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";

// my created context
const AuthContext = React.createContext();

// funciton to use all my context functions
export function useAuth() {
  return useContext(AuthContext);
}

// setting my auth Provider so i can share user data across whole project
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  // function to sign up a user taking in a few params.
  function signUp(email, password, username) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        db.collection("userCollection").add({
          uid: authuser.user.uid,
          description: "Welcome to my account!",
          username: username,
          userImage: "",
        });
        return authuser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        alert(error);
        console.log(error);
      });
  }
  // function to help login user
  function login(email, password) {
    return auth
      .signInWithEmailAndPassword(email, password)
      .then((authUser) => console.log(authUser));
  }
  // function to logout user
  function logout() {
    auth.signOut();
  }

  // useeffect to get the current user evertime via authStateChange api from firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, [currentUser]);

  // values i can pull througout the application
  const value = {
    currentUser,
    signUp,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
