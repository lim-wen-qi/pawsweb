import React, { useState, useContext } from "react";
import axios from "axios";
import { Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { SetIsLoggedInContext, UserContext } from "../../App";

function Login() {
  const setIsLoggedIn = useContext(SetIsLoggedInContext);
  const { setUserRole } = useContext(UserContext);

  const paperStyle = {
    height: "auto",
    padding: "2rem",
    margin: "150px auto",
    borderRadius: "0.5rem",
    border: "1px solid #453a2f",
    boxShadow: "10px 10px 10px #453a2f",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const text = { marginTop: "2rem", fontSize: "1.0rem", fontWeight: "300" };
  const row = { display: "flex", marginTop: "2rem" };
  const loginBtn = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };
  const registerBtn = {
    marginBottom: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#f4e3d3",
    color: "#453a2f",
    borderRadius: "0.5rem",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3001/auth/login",
        { email, password },
        { withCredentials: true }
      )
      .then((result) => {
        if (result.data === "Success") {
          axios
            .get("http://localhost:3001/auth/user", { withCredentials: true })
            .then((response) => {
              if (response.data.user) {
                setIsLoggedIn(true);
                setUserRole(response.data.user.role);
                navigate("/home", { state: { user: response.data.user } });
              }
            });
        } else {
          alert("Login failed: User does not exists.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Grid align="center">
        <Paper
          style={paperStyle}
          sx={{
            width: {
              xs: "80vw",
              sm: "50vw",
              md: "40vw",
              lg: "30vw",
              xl: "20vw",
            },
            height: "60vh",
          }}
        >
          <Typography style={heading}>Login</Typography>
          <form onSubmit={handleLogin}>
            <TextField
              style={row}
              onChange={(e) => setEmail(e.target.value)}
              label="Enter Email"
              type="email"
              name="email"
              required
            ></TextField>
            <TextField
              style={row}
              onChange={(e) => setPassword(e.target.value)}
              label="Enter Password"
              type="password"
              name="password"
              required
            ></TextField>
            <Button variant="contained" style={loginBtn} type="submit">
              Login
            </Button>
            <Typography style={text}>
              No Account yet? Register for free now!
            </Typography>
            <Button
              variant="contained"
              style={registerBtn}
              component={Link}
              to="/register"
            >
              Register
            </Button>
          </form>
        </Paper>
      </Grid>
    </>
  );
}

export default Login;
