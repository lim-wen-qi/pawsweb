import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import axios from "axios";

function Contact() {
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
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/contact", { name, email, subject, message })
      .then((response) => {
        if (response.status === 200) {
          setSuccessMessage("Your message has been sent successfully!");
          setName("");
          setEmail("");
          setSubject("");
          setMessage("");
        }
      })
      .catch((error) => {
        setErrorMessage("Failed to send your message. Please try again later.");
        console.error(error);
      });
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Typography style={heading}>Contact Us</Typography>
      <Typography style={subtitle}>
        Your questions and feedback are incredibly important to us. Whether you
        need assistance or just want to share your thoughts, we’re here and
        eager to listen. Reach out to us anytime, and we’ll make sure you get
        the answers you need!
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          style={row}
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          style={row}
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          style={row}
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <TextField
          style={row}
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <Button
          style={sendBtn}
          variant="contained"
          color="primary"
          type="submit"
        >
          Send Message
        </Button>
      </form>
      {successMessage && (
        <Typography variant="body1" color="success" style={row}>
          {successMessage}
        </Typography>
      )}
      {errorMessage && (
        <Typography variant="body1" color="error" style={row}>
          {errorMessage}
        </Typography>
      )}
    </Container>
  );
}

export default Contact;
