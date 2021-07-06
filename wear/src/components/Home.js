import React, { useEffect ,useState} from "react";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AthContext";
import { useHistory } from "react-router-dom";

function Home() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("failed to logout");
    }
  }

  useEffect(() => {
    console.log("home page works");
  }, []);

  return (
    <div className="Home">
      <h1>Home Page</h1>
      <p>
        this is all of the things that i would really like to say to you if you
        do not mind
      </p>
      <div className="w-100 text-center mt-2">
        <Button type="link" onClick={handleLogout}>
          logout
        </Button>
      </div>
    </div>
  );
}

export default Home;
