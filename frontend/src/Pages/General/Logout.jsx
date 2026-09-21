import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SetIsLoggedInContext, UserContext } from "../../App";

function Logout() {
  const setIsLoggedIn = useContext(SetIsLoggedInContext);
  const { setUserRole } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post("http://localhost:3001/auth/logout", {}, { withCredentials: true })
      .then(() => {
        console.log("Logout successful, redirecting...");
        setIsLoggedIn(false);
        setUserRole(null);

        navigate("/login");
      })
      .catch((err) => console.log("Logout failed:", err));
  }, [navigate, setIsLoggedIn, setUserRole]);

  return <p>Logging out...</p>;
}

export default Logout;
