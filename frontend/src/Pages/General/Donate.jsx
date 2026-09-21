import React, { useState } from "react";
import { Container, Typography, TextField, Button, Grid } from "@mui/material";
import axios from "axios";

function Donate() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const subtitle = {
    color: "grey",
    fontSize: "0.9rem",
    fontWeight: "100",
    marginBottom: "40px",
  };
  const row = { display: "flex", marginTop: "1.5rem" };
  const sendBtn = {
    margin: "2rem 0",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Replace with your backend endpoint
      await axios.post("http://localhost:3001/donate", {
        name,
        email,
        amount,
        message,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setAmount("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting donation:", error);
      setSuccess(false);
    }
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Typography style={heading}>Donation</Typography>
      <Typography style={subtitle}>
        Your generous donation helps us provide essential care, shelter, and
        love to pets in need. Every contribution, big or small, makes a
        significant difference in their lives. Join us in giving these animals a
        second chance at happiness and health. Thank you for your support!
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          style={row}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          style={row}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Donation Amount"
          variant="outlined"
          fullWidth
          type="number"
          value={amount}
          style={row}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <TextField
          label="Message (Optional)"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={message}
          style={row}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button
          style={sendBtn}
          variant="contained"
          color="primary"
          type="submit"
        >
          Donate
        </Button>
      </form>
      {success && (
        <Typography variant="body1" color="green">
          Thank you for your donation!
        </Typography>
      )}
    </Container>
  );
}

export default Donate;
