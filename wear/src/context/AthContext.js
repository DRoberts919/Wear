import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  function signUp(email, password,username) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((authuser) => {
        return authuser.user.updateProfile({
          displayName: username,
        });
      });
  }

  function login(email,password){
      return auth.signInWithEmailAndPassword(email,password).then((authUser) => console.log(authUser))

  }
  function logout(){
      auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signUp,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
