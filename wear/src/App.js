import "./styles/App.css";
import logo from "./images/w-logo.png";

import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// components
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Account from "./components/Account";
import Cart from "./components/Cart.js";
import WishList from "./components/WishList";
import UserPost from "./components/UserPost";
import PrivateRoute from "./components/PrivateRoute";
import EditAccount from "./components/EditAccount";
import LandingPage from "./components/LandingPage";
import SearchedUser from "./components/SearchedUser";
import Searchbar from "./components/Searchbar";
import Avatar from "@material-ui/core/Avatar";

// helper fucntions

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="app">
        <div className="app__header">
          <div className="app__logo">
            <Link to="/">
              <img alt="" className="app__logo" src={logo} />
            </Link>
            <h2 className="app__EAR">EAR</h2>
          </div>
          {currentUser ? (
            <div className="app__headerButtons">
              <Searchbar />
              <div className="app__userHeader">
                <Avatar
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  sizes="large"
                  style={{
                    marginLeft: "15px",
                    marginTop: "10px",
                    height: "50px",
                    width: "50px",
                  }}
                />
                <h5 className="userNav__username">{currentUser.displayName}</h5>
              </div>
            </div>
          ) : (
            <div className="app__authButtons">
              <Link to="/login">
                <button className="app__Button">Login</button>
              </Link>
              <Link to="/signup">
                <button className="app__Button">Signup</button>
              </Link>
            </div>
          )}
        </div>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute path="/account" component={Account} />
          <PrivateRoute path="/cart" component={Cart} />
          <PrivateRoute path="/wishList" component={WishList} />
          <PrivateRoute path="/post" component={UserPost} />
          <PrivateRoute path="/editAccount" component={EditAccount} />
          <PrivateRoute path="/searchedUser/:id" component={SearchedUser} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
