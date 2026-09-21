import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import {
  Container,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FilterComponent from "../../Components/FilterComponent";

function Pets() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
    color: "white",
  };
  const likeBtn = {
    color: "#b99976",
    marginTop: "20px",
  };
  const subtitle = {
    color: "grey",
    fontSize: "0.9rem",
    fontWeight: "100",
    marginBottom: "20px",
  };
  const backBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
    color: "white",
    margin: "20px 0",
  };

  const { userRole, userName } = useContext(UserContext);

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [likedPets, setLikedPets] = useState(new Set());
  const [filteredPets, setFilteredPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:3001/pet");
        setPets(response.data);

        // Sort pets to push adopted ones to the end
        const sortedPets = response.data.sort((a, b) => (a.isAdopted ? 1 : -1));
        setPets(sortedPets);
      } catch (err) {
        setError("Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Apply the filters to the pets list
  const handleFilterChange = (filters) => {
    let filtered = pets;

    if (filters.type !== "All") {
      filtered = filtered.filter((pet) => pet.type === filters.type);
    }
    if (filters.breed !== "All") {
      filtered = filtered.filter((pet) =>
        pet.breed.toLowerCase().includes(filters.breed.toLowerCase())
      );
    }
    if (filters.size !== "All") {
      filtered = filtered.filter((pet) => pet.size === filters.size);
    }
    if (filters.gender !== "All") {
      filtered = filtered.filter((pet) => pet.gender === filters.gender);
    }

    setFilteredPets(filtered);
  };

  useEffect(() => {
    const fetchLikedPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/pet/liked-pets/${userName}`
        );
        setLikedPets(new Set(response.data.map((pet) => pet._id)));
      } catch (err) {
        console.error("Error fetching liked pets:", err);
      }
    };

    fetchLikedPets();
  }, [userName]);

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
  };

  const handleBackToPets = () => {
    setSelectedPet(null);
  };

  const handleLikeToggle = async (petId) => {
    try {
      const action = likedPets.has(petId) ? "unlike" : "like";
      await axios.post(
        `http://localhost:3001/pet/${action}/${userName}/${petId}`
      );
      setLikedPets((prevLikedPets) => {
        const updatedLikes = new Set(prevLikedPets);
        if (updatedLikes.has(petId)) {
          updatedLikes.delete(petId);
        } else {
          updatedLikes.add(petId);
        }
        return updatedLikes;
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

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
                      width: "50%",
                      height: "auto",
                      objectFit: "contain",
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
              <Typography style={subtitle}>{selectedPet.type}</Typography>
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
          <Typography style={heading}>Our Pets</Typography>
        </Grid>
        {userRole === "adopter" && (
          <Grid item>
            <Link to="/adopter/liked-pets" style={{ textDecoration: "none" }}>
              <IconButton variant="contained" style={buttonStyle}>
                <FavoriteIcon />
              </IconButton>
            </Link>
          </Grid>
        )}

        {userRole === "staff" && (
          <Grid item>
            <Link to="/staff/pets" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                Your Pets
              </Button>
            </Link>
          </Grid>
        )}

        {userRole === "admin" && (
          <Grid item>
            <Link to="/admin/pets" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                Pets Dashboard
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
      <Typography style={subtitle}>
        Click on the Pet's Image for more details.
        <br /> Login as 'adopter' to view liked pets.
      </Typography>
      <Divider style={{ margin: "2rem 0" }} />

      {/* Filter Section */}
      <FilterComponent onFilterChange={handleFilterChange} />

      {/* Pet Listings */}
      <Grid container spacing={2}>
        {filteredPets.length > 0 ? (
          filteredPets.map((pet, index) => (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <Paper
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  height: "600px",
                  overflow: "auto",
                  position: "relative",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  {pet.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:3001/${image}`}
                      onClick={() => handlePetClick(pet)}
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
                <Typography style={subtitle}>{pet.type}</Typography>
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
                  {userRole === "adopter" && (
                    <IconButton
                      onClick={() => handleLikeToggle(pet._id)}
                      style={likeBtn}
                    >
                      {likedPets.has(pet._id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  )}
                </Grid>
              </Paper>
            </Grid>
          ))
        ) : (
          <Typography style={{ margin: "2rem auto" }}>
            No pets available.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}

export default Pets;
