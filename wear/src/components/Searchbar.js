import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Fuse from "fuse.js";

// material-ui
import { Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

// css
import "../styles/searchBar.css";

function Searchbar() {
  const [searchedUser, setSearchedUser] = useState("");
  const [users, setUsers] = useState([]);

  // fuse is used to fuzzy search all users
  const fuse = new Fuse(users, {
    keys: ["username"],
  });

  // these fuse variables help find the searched user
  const results = fuse.search(searchedUser);
  const userResults = results.map((results) => results.item);

  useEffect(() => {
    let dummyArray = [];
    db.collection("userCollection")
      .get()
      .then((queryData) => {
        queryData.forEach((doc) => {
          dummyArray.push(doc.data());
        });
        setUsers(dummyArray);
      });
  }, [searchedUser]);

  return (
    <div className="searchBar">
      <input
        className="searchBar__input"
        placeholder="search"
        value={searchedUser}
        onChange={(e) => setSearchedUser(e.target.value)}
      ></input>
      <Link to={"/searchedUser/" + searchedUser}>
        <Button
          className="searchBar__button"
          onClick={() => setSearchedUser("")}
        >
          <SearchIcon />
        </Button>
      </Link>
      <div className="searchBar__searchedUsers">
        {userResults.map((user, index) => (
          <div
            key={index}
            className="searchBar__searchedResult"
            onClick={() => setSearchedUser(user.username)}
          >
            <p>{user.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Searchbar;
