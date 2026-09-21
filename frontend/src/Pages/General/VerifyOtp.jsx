import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Typography, Grid, Paper } from "@mui/material";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const paperStyle = {
    height: "auto",
    padding: "2rem",
    margin: "150px auto",
    borderRadius: "0.5rem",
    border: "1px solid #453a2f",
    boxShadow: "10px 10px 10px #453a2f",
  };

  const heading = { fontSize: "1.3rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };

  const otpBtn = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };

  const backBtn = {
    marginTop: "1rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#f4e3d3",
    color: "#453a2f",
    borderRadius: "0.5rem",
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/auth/verify-otp", { email, otp })
      .then((result) => {
        if (result.status === 200) {
          console.log("OTP verified. Account activated.");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log("OTP verification failed:", err);
      });
  };

  return (
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
        <Typography style={heading}>
          Enter the OTP sent to your email
        </Typography>
        <form onSubmit={handleVerifyOtp}>
          <TextField
            style={row}
            label="OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <Button variant="contained" style={otpBtn} type="submit">
            Verify OTP
          </Button>
          <br/>
          <Button
            variant="contained"
            style={backBtn}
            onClick={() => navigate("/register")}
          >
            Back
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}

export default VerifyOtp;
