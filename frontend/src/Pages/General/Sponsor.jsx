import React, { useState } from "react";
import { Container, Typography, TextField, Button, InputAdornment } from "@mui/material";
import axios from "axios";

function Sponsor() {
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
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Replace with your backend endpoint
      await axios.post("http://localhost:3001/sponsor", {
        name,
        email,
        phone,
        message,
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting sponsorship:", error);
      setSuccess(false);
    }
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Typography style={heading}>Sponsorship</Typography>
      <Typography style={subtitle}>
        By becoming a sponsor, you play a vital role in the ongoing care and
        support of our pets. Your sponsorship helps provide essential resources
        and regular updates about the pets you support. Join us in making a
        lasting impact on their lives. Thank you for your commitment!
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
          label="Phone Number"
          variant="outlined"
          fullWidth
          type="number"
          value={phone}
          style={row}
          onChange={(e) => setPhone(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">+65</InputAdornment>,
          }}
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
          Submit
        </Button>
      </form>
      {success && (
        <Typography variant="body1" color="green">
          We received your request and will get back to you as soon as possible!
        </Typography>
      )}
    </Container>
  );
}

export default Sponsor;
