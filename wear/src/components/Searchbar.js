import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Searchbar() {
  const [searchedUser, setSearchedUser] = useState("");

  return (
    <div>
      <input
        placeholder="search"
        onChange={(e) => setSearchedUser(e.target.value)}
      ></input>
      <Link to={"/searchedUser/" + searchedUser}>
        <button onClick={() => setSearchedUser("")}>Search</button>
      </Link>
    </div>
  );
}

export default Searchbar;
