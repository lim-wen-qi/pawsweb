import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";

function Volunteer() {
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
  const [surrenderAsked, setSurrenderAsked] = useState("");
  const [surrenderReason, setSurrenderReason] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Replace with your backend endpoint
      await axios.post("http://localhost:3001/volunteer", {
        name,
        email,
        phone,
        message,
        surrenderAsked,
        surrenderReason: surrenderAsked === "Yes" ? surrenderReason : "",
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSurrenderAsked("");
      setSurrenderReason("");
    } catch (error) {
      console.error("Error submitting volunteer form:", error);
      setSuccess(false);
    }
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Typography style={heading}>Volunteer</Typography>
      <Typography style={subtitle}>
        Your time and effort are invaluable to us! As a volunteer, you help
        provide care, support, and love to our pets. Whether you’re helping at
        events, fostering animals, or assisting with daily tasks, your
        contribution makes a big difference. Join us and be a part of our
        mission to improve the lives of pets in need. Thank you for your
        dedication!
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
          type="tel"
          value={phone}
          style={row}
          onChange={(e) => setPhone(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">+65</InputAdornment>
            ),
          }}
          required
        />
        <FormControl component="fieldset" style={row}>
          <Typography variant="body1">Have you ever been asked to surrender an animal for any reason?</Typography>
          <RadioGroup
            value={surrenderAsked}
            onChange={(e) => setSurrenderAsked(e.target.value)}
            row
          >
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
          {surrenderAsked === "Yes" && (
            <TextField
              label="Please explain why"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={surrenderReason}
              style={row}
              onChange={(e) => setSurrenderReason(e.target.value)}
            />
          )}
        </FormControl>
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

export default Volunteer;
