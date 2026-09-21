import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import adoptMe from "../../assets/images/adoptMe.png";
import aboutUsImg from "../../assets/images/banner.png";

function Home() {
  const [spotlightPets, setSpotlightPets] = useState([]);
  const navigate = useNavigate();

  // Centralized styles
  const styles = {
    heading1: { fontSize: "2.5rem", fontWeight: "600" },
    heading2: { fontSize: "2.5rem", fontWeight: "600", textAlign: "center" },
    text: { fontSize: "1rem", fontWeight: "600", margin: "20px 0" },
    paper: {
      height: "auto",
      padding: "2rem",
      margin: "20px 0",
      textAlign: "center",
      borderRadius: "0.5rem",
      border: "1px solid grey",
      boxShadow: "2px 2px 2px grey",
    },
    button: {
      marginTop: "2rem",
      fontSize: "1.2rem",
      fontWeight: "700",
      backgroundColor: "#b99976",
      color: "white",
      borderRadius: "0.5rem",
    },
    petImage: { width: "100%", height: "200px", objectFit: "cover" },
    actionButton: {
      marginTop: "1rem",
      margin: "0.5rem",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "#453a2f",
      color: "white",
      borderRadius: "0.5rem",
    },
    aboutUsContainer: {
      backgroundImage: `url(${aboutUsImg})`, // Correct syntax
      backgroundSize: "cover",
      backgroundPosition: "center",
      margin: "60px 0",
      padding: "30px 20px",
      color: "white", // Optional, adjust text color if needed
    },
  };

  // Handlers
  const handlePetsPage = () => navigate("/pets");
  const handleVolunteer = () => navigate("/volunteer");
  const handleDonate = () => navigate("/donate");
  const handleSponsorship = () => navigate("/sponsor");

  // Fetch spotlight pets
  useEffect(() => {
    const fetchSpotlightPets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/pet/pets/spotlight"
        );
        setSpotlightPets(response.data);
      } catch (err) {
        console.error("Error fetching spotlight pets:", err);
        setSpotlightPets([]);
      }
    };

    fetchSpotlightPets();
  }, []);

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      {/* Hero Section */}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography style={styles.heading1}>
            Find Your <br />
            Furry Best Friend
          </Typography>
          <Button
            variant="contained"
            style={styles.button}
            onClick={handlePetsPage}
          >
            View Pets
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={adoptMe}
            alt="PawsWeb banner"
            style={{ marginTop: "5px", width: "100%", objectFit: "cover" }}
          />
        </Grid>
      </Grid>

      <Divider style={{ margin: "2rem 0" }} />

      {/* Spotlight Section */}
      <Typography style={styles.heading2}>Most Recent Pets</Typography>

      <Grid container spacing={2}>
        {spotlightPets.map((pet, index) => (
          <Grid item xs={12} sm={4} key={pet._id || index}>
            <Paper style={styles.paper}>
              <Typography
                style={{
                  marginBottom: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {pet.name}
              </Typography>
              {pet.images.length > 0 && (
                <img
                  src={`http://localhost:3001/${pet.images[0]}`} // Assuming each pet has at least one image
                  alt={pet.name}
                  style={styles.petImage}
                />
              )}
              <Typography variant="body1">
                <strong>Breed:</strong> {pet.breed}
              </Typography>
              <Typography variant="body1">
                <strong>Age:</strong> {pet.age}
              </Typography>
              <Typography variant="body1">
                <strong>Size:</strong> {pet.size}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Divider style={{ margin: "2rem 0" }} />

      <Grid container style={styles.aboutUsContainer} spacing={2}>
        <Grid item width={"50%"} justifyContent={"left"}>
          <Typography style={styles.heading1}>About Us</Typography>
          <Typography style={styles.text}>
            At PawsWeb, we're passionate about making the world a better place
            for pets in need. Our mission is simple yet profound: to connect
            animal shelters with loving homes and help reduce pet homelessness.{" "}
            <br />
            <br />
            Join us in our mission to give every pet a chance at a happy life.
            Explore our site, find your new furry friend, and be part of a
            community that cares.
          </Typography>

          {/* Action Buttons */}
          <Grid
            container
            spacing={2}
            justifyContent="left"
            style={{ marginTop: "1rem" }}
          >
            <Grid item>
              <Button
                variant="contained"
                style={styles.actionButton}
                onClick={handleVolunteer}
              >
                Volunteer
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={styles.actionButton}
                onClick={handleDonate}
              >
                Donate
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                style={styles.actionButton}
                onClick={handleSponsorship}
              >
                Sponsor
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
