import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

function PetEditor() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const subtitle = {
    color: "grey",
    fontSize: "0.9rem",
    fontWeight: "100",
    marginTop: "10px",
    marginBottom: "40px",
  };
  const dltBtn = {
    color: "#574e44",
    marginRight: "10px",
  };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
  };
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPets = async () => {
    try {
      const response = await axios.get("http://localhost:3001/pet");
      setPets(response.data);
    } catch (err) {
      setError("Failed to fetch pets");
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

  const handleAdoptClick = async (petId, currentStatus) => {
    try {
      await axios.put(`http://localhost:3001/pet/adopt/${petId}`, {
        isAdopted: !currentStatus,
      });
      fetchPets(); // Refresh the pet list after status update
    } catch (err) {
      console.error("Error updating pet status:", err);
    }
  };

  const handleDeleteClick = async (petId) => {
    // Show confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this pet?"
    );

    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/pet/${petId}`);
        fetchPets(); // Refresh the pet list after deletion
      } catch (err) {
        console.error("Error deleting pet:", err);
      }
    } else {
      // Action canceled by the user
      console.log("Pet deletion canceled");
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  if (loading) {
    return (
      <Container style={{ textAlign: "center", paddingTop: "5rem" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ textAlign: "center", paddingTop: "5rem" }}>
        {error}
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        style={{ marginBottom: "30px" }}
      >
        <Typography style={heading}>Pet Dashboard</Typography>
        <Link to="/pets" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={buttonStyle}>
            View
          </Button>
        </Link>
      </Grid>
      <Typography style={subtitle}>
        As an admin, <br />you have the ability to remove inappropriate pet listings,
        <br /> update the adoption status of any pet.
      </Typography>
      <Divider style={{ marginBottom: "2rem" }} />
      <Grid container spacing={2}>
        {pets.map((pet) => (
          <Grid item xs={12} sm={12} md={6} key={pet._id}>
            <Paper
              style={{
                padding: "1rem",
                textAlign: "center",
                height: "550px",
                overflow: "auto",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                {pet.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:3001/${image}`}
                    alt={pet.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
              {pet.isAdopted && (
                <Typography
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                  }}
                >
                  Adopted
                </Typography>
              )}
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {pet.name}
              </Typography>
              <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
              <Grid textAlign={"left"}>
                <Typography variant="body1">
                  <strong>Breed:</strong> {pet.breed}
                </Typography>
                <Typography variant="body1">
                  <strong>Size:</strong> {pet.size}
                </Typography>
                <Typography variant="body1">
                  <strong>Age:</strong> {pet.age}
                </Typography>
                <Typography variant="body1">
                  <strong>Gender:</strong> {pet.gender}
                </Typography>
                <Typography variant="body1">
                  <strong>Shelter:</strong> {pet.shelter}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong>{" "}
                  {truncateContent(pet.description, 150)}
                </Typography>
              </Grid>
              <Grid marginTop={"10px"}>
                <Button
                  onClick={() => handleAdoptClick(pet._id, pet.isAdopted)}
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    backgroundColor: "#453a2f",
                    borderRadius: "0.5rem",
                    color: "white",
                    margin: "10px",
                  }}
                >
                  {pet.isAdopted ? "Not Adopted" : "Adopted"}
                </Button>
                <IconButton
                  style={dltBtn}
                  onClick={() => handleDeleteClick(pet._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default PetEditor;
