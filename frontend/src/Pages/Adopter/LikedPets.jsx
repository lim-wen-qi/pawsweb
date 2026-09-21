import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../App";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function LikedPets() {
  const { userName, userEmail, userRole } = useContext(UserContext); // Destructure userEmail

  const [likedPets, setLikedPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null); // New state for selected pet

  const backBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
    color: "white",
    margin: "20px 0",
  };

  const adoptBtn = {
    fontSize: "0.9rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
    color: "white",
    margin: "10px 0",
  };

  const allPetsBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
    color: "white",
    marginBottom: "2rem",
  };
  const likeBtn = {
    color: "#b99976",
    marginTop: "20px"
  };
  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
  };

  const handleBackToPets = () => {
    setSelectedPet(null);
  };

  const handleAdoptClick = async (petId) => {
    const message = "I'm interested in adopting this pet";

    try {
      await axios.post(`http://localhost:3001/pet/adopt/${petId}`, {
        userName,
        userEmail,
        message,
      });

      alert(
        "Your message has been sent to the shelter. Please wait for further arrangements."
      );
    } catch (error) {
      console.error("Error sending adoption request:", error);
      alert("Failed to send adoption request. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchLikedPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/pet/liked-pets/${userName}`
        );
        setLikedPets(response.data);
      } catch (err) {
        setError("Failed to fetch liked pets");
        console.error("Error fetching liked pets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPets();
  }, [userName]);

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

  if (selectedPet) {
    return (
      <Container style={{ paddingTop: "5rem", width: "80%" }}>
        <Button onClick={handleBackToPets} style={backBtn}>
          Back
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper
              style={{
                padding: "1rem",
                textAlign: "center",
                height: "auto",
                overflow: "auto",
                position: "relative",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                {selectedPet.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={`http://localhost:3001/${image}`}
                    alt={selectedPet.name}
                    style={{
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
              {selectedPet.isAdopted && (
                <Typography
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    position: "center",
                    margin: "10px 0",
                  }}
                >
                  Adopted
                </Typography>
              )}
              <Typography
                variant="h6"
                style={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                {selectedPet.name}
              </Typography>
              <Divider style={{ marginTop: "1rem", marginBottom: "1rem" }} />
              <Grid textAlign={"left"}>
                <Typography variant="body1">
                  <strong>Breed:</strong> {selectedPet.breed}
                </Typography>
                <Typography variant="body1">
                  <strong>Size:</strong> {selectedPet.size}
                </Typography>
                <Typography variant="body1">
                  <strong>Age:</strong> {selectedPet.age}
                </Typography>
                <Typography variant="body1">
                  <strong>Gender:</strong> {selectedPet.gender}
                </Typography>
                <Typography variant="body1">
                  <strong>Shelter:</strong> {selectedPet.shelter}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {selectedPet.description}
                </Typography>
                {userRole === "adopter" && (
                    <IconButton
                      onClick={() => handleLikeToggle(selectedPet._id)}
                      style={likeBtn}
                    >
                      {likedPets.has(selectedPet._id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography
            variant="h4"
            style={{ fontWeight: "600", marginBottom: "2rem" }}
          >
            Liked Pets
          </Typography>
        </Grid>
        <Grid item>
          <Link to="/pets" style={{ textDecoration: "none" }}>
            <Button variant="contained" style={allPetsBtn}>
              All Pets
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Divider style={{ marginBottom: "2rem" }} />
      {likedPets.length > 0 ? (
        <Grid container spacing={2}>
          {likedPets.map((pet, index) => (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <Paper
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  height: "600px",
                  overflow: "auto",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  {pet.images.map((image, idx) => (
                    <img
                      key={idx}
                      onClick={() => handlePetClick(pet)}
                      src={`http://localhost:3001/${image}`}
                      alt={pet.name}
                      style={{
                        width: "100%",
                        height: "250px",
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
                      position: "center",
                      margin: "10px 0",
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
                    {truncateContent(pet.description, 100)}
                  </Typography>
                  {!pet.isAdopted && (
                    <Button
                      onClick={() => handleAdoptClick(pet._id)}
                      style={adoptBtn}
                    >
                      Adopt Now
                    </Button>
                  )}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography style={{ margin: "2rem auto" }}>No liked pets.</Typography>
      )}
    </Container>
  );
}

export default LikedPets;
