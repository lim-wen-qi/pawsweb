import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  IconButton,
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { UserContext } from "../../App";

function StaffPets() {
  // Styles for various elements
  const styles = {
    heading: { fontSize: "2.5rem", fontWeight: "600" },
    row: { display: "flex", marginTop: "1.5rem" },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      textTransform: "uppercase",
      margin: "20px 0",
    },
    petName: {
      fontSize: "1.5rem",
      fontWeight: "600",
      textTransform: "uppercase",
    },
    typeName: {
      fontSize: "1.2rem",
      fontWeight: "100",
      color: "grey",
    },
    editDltBtn: {
      color: "#574e44",
      marginRight: "10px",
    },
    buttonStyle: {
      fontSize: "1rem",
      fontWeight: "700",
      backgroundColor: "#b99976",
      borderRadius: "0.5rem",
      marginRight: "10px",
    },
    addBtn: {
      fontSize: "1rem",
      fontWeight: "700",
      backgroundColor: "#987554",
      borderRadius: "0.5rem",
      margin: "20px 0",
    },
    adoptBtn: {
      fontSize: "0.8rem",
      fontWeight: "600",
      backgroundColor: "#453a2f",
      borderRadius: "0.5rem",
      margin: "20px 10px",
    },
    saveBtn: {
      fontSize: "1rem",
      fontWeight: "600",
      backgroundColor: "#453a2f",
      borderRadius: "0.5rem",
    },
  };

  // State variables
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPet, setEditingPet] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();
  const { userName } = useContext(UserContext);

  // Fetch pets from the server
  const fetchPets = async () => {
    if (userName) {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/pet/staff/${userName}`
        );
        setPets(response.data);
      } catch (err) {
        console.error("Failed to fetch pets:", err);
        setError("Failed to fetch pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch pets when the component mounts or userName changes
  useEffect(() => {
    fetchPets();
  }, [userName]);

  // Handle pet editing
  const handleEditPet = (pet) => {
    setEditingPet(pet._id);
    setEditFormData({ ...pet });
  };

  // Handle changes in edit form
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  // Save the edited pet details
  const handleSaveEdit = (petId) => {
    const formData = new FormData();

    // Append all form data fields
    Object.keys(editFormData).forEach((key) => {
      if (editFormData[key]) {
        formData.append(key, editFormData[key]);
      }
    });

    // Append image if present
    if (image) {
      formData.append("image", image);
    }

    axios
      .put(`http://localhost:3001/pet/${petId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        // Reset state after successful update
        setEditingPet(null);
        setImage(null);
        setImagePreview("");
        setEditFormData({});

        // Fetch pets again to update the list
        fetchPets();
      })
      .catch((error) => {
        console.error("Failed to update pet:", error);
        setError("Failed to update pet. Please try again.");
      });
  };

  // Delete a pet
  const handleDeletePet = (petId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this pet?"
    );
    if (isConfirmed) {
      axios
        .delete(`http://localhost:3001/pet/${petId}`, {
          data: { uploadedBy: userName },
        })
        .then(() => {
          setPets(pets.filter((pet) => pet._id !== petId));
        })
        .catch((err) => {
          console.error("Failed to delete pet:", err);
          setError("Failed to delete pet. Please try again.");
        });
    }
  };

  // Navigate to add pet page
  const handleAddPet = () => {
    navigate("/add-pet");
  };

  // Mark a pet as adopted
  const handleAdoptPet = (petId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this pet as adopted?"
    );

    if (isConfirmed) {
      axios
        .put(`http://localhost:3001/pet/adopt/${petId}`, { isAdopted: true })
        .then(() => {
          setPets(
            pets.map((pet) =>
              pet._id === petId ? { ...pet, isAdopted: true } : pet
            )
          );
        })
        .catch((err) => {
          console.error("Failed to mark pet as adopted:", err);
          setError("Failed to mark pet as adopted. Please try again.");
        });
    }
  };

  const handleNotAdoptPet = (petId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to mark this pet available for adoption?"
    );

    if (isConfirmed) {
      axios
        .put(`http://localhost:3001/pet/adopt/${petId}`, { isAdopted: false })
        .then(() => {
          setPets(
            pets.map((pet) =>
              pet._id === petId ? { ...pet, isAdopted: false } : pet
            )
          );
        })
        .catch((err) => {
          console.error("Failed to mark pet available for adoption:", err);
          setError(
            "Failed to mark pet as available for adoption. Please try again."
          );
        });
    }
  };

  // Truncate pet description to a certain length
  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

  // Separate pets into adopted and available
  const adoptedPets = pets.filter((pet) => pet.isAdopted);
  const availablePets = pets.filter((pet) => !pet.isAdopted);

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      {/* Header and Add Pet Button */}
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography style={styles.heading}>Your Pets</Typography>
        <Link to="/pets" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={styles.buttonStyle}>
            View
          </Button>
        </Link>
      </Grid>
      <Divider style={{ margin: "1rem 0" }} />
      <Button
        variant="contained"
        style={styles.addBtn}
        onClick={handleAddPet}
        startIcon={<AddIcon />}
      >
        Add Pet
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {availablePets.length === 0 && adoptedPets.length === 0 ? (
        <Typography>No pets uploaded yet.</Typography>
      ) : (
        <>
          {/* Available Pets Section */}
          <Grid container alignItems="center" justifyContent="space-between">
            <Typography style={styles.title}>Available Pets</Typography>
          </Grid>
          <Grid container spacing={2}>
            {availablePets.map((pet) => (
              <Grid item xs={12} md={6} lg={4} key={pet._id}>
                <Paper
                  style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    height: "650px",
                    overflow: "auto",
                  }}
                >
                  {pet.images && pet.images.length > 0 && (
                    <Grid
                      container
                      justifyContent="center"
                      style={{ marginBottom: "1rem" }}
                    >
                      {pet.images.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:3001/${image}`}
                          alt={`${pet.name} ${index}`}
                          style={{
                            maxWidth: "100%",
                            objectFit: "cover",
                            height: "300px",
                          }}
                        />
                      ))}
                    </Grid>
                  )}
                  {editingPet === pet._id ? (
                    // Edit Form
                    <Grid>
                      <Grid style={styles.row}>
                        <TextField
                          fullWidth
                          label="Name"
                          name="name"
                          style={{ marginRight: "20px" }}
                          value={editFormData.name || ""}
                          onChange={handleEditChange}
                        />
                        <TextField
                          fullWidth
                          label="Type"
                          name="type"
                          value={editFormData.type || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={styles.row}>
                        <TextField
                          fullWidth
                          label="Breed"
                          name="breed"
                          value={editFormData.breed || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={styles.row}>
                        <TextField
                          fullWidth
                          label="Age"
                          name="age"
                          style={{ marginRight: "20px" }}
                          type="number"
                          value={editFormData.age || ""}
                          onChange={handleEditChange}
                        />
                        <TextField
                          fullWidth
                          select
                          label="Age Unit"
                          name="ageUnit"
                          style={{ marginRight: "20px" }}
                          type="number"
                          value={editFormData.ageUnit || ""}
                          onChange={handleEditChange}
                        >
                          <MenuItem value="Week(s)">Week(s)</MenuItem>
                          <MenuItem value="Month(s)">Month(s)</MenuItem>
                          <MenuItem value="Year(s)">Year(s)</MenuItem>
                        </TextField>
                        <TextField
                          fullWidth
                          select
                          label="Gender"
                          name="gender"
                          value={editFormData.gender || ""}
                          onChange={handleEditChange}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                        </TextField>
                      </Grid>
                      <Grid style={styles.row}>
                        <TextField
                          fullWidth
                          label="Shelter"
                          name="shelter"
                          value={editFormData.shelter || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={styles.row}>
                        <TextField
                          fullWidth
                          multiline
                          rows={10}
                          label="Description"
                          name="description"
                          value={editFormData.description || ""}
                          onChange={handleEditChange}
                        />
                      </Grid>
                      <Grid style={styles.row}>
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: "200px", marginTop: "10px" }}
                          />
                        )}
                      </Grid>
                      <Grid style={styles.row}>
                        <Button
                          variant="contained"
                          style={styles.addBtn}
                          component="label"
                        >
                          {image ? "Change Image" : "Upload Image"}
                          <input
                            type="file"
                            hidden
                            onChange={handleImageChange}
                          />
                        </Button>
                      </Grid>
                      <Grid style={styles.row}>
                        <Button
                          variant="contained"
                          color="primary"
                          style={styles.saveBtn}
                          onClick={() => handleSaveEdit(pet._id)}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    // Pet Details
                    <>
                      <Typography style={styles.petName}>{pet.name}</Typography>
                      <Typography style={styles.typeName}>
                        {pet.type}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Breed: </strong> {pet.breed}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Age: </strong> {pet.age} {pet.ageUnit}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Gender: </strong> {pet.gender}
                      </Typography>
                      <Typography>
                        <strong>Description: </strong>{" "}
                        {truncateContent(pet.description, 150)}
                      </Typography>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <IconButton
                            variant="contained"
                            style={styles.editDltBtn}
                            onClick={() => handleEditPet(pet)}
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            variant="contained"
                            style={styles.editDltBtn}
                            onClick={() => handleDeletePet(pet._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            style={styles.adoptBtn}
                            onClick={() => handleAdoptPet(pet._id)}
                          >
                            Adopted
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Divider style={{ margin: "2rem 0" }} />
          {adoptedPets.length > 0 && (
            <>
              {/* Adopted Pets Section */}
              <Typography style={styles.title}>Adopted Pets</Typography>
              <Grid container spacing={2}>
                {adoptedPets.map((pet) => (
                  <Grid item xs={12} md={6} lg={4} key={pet._id}>
                    <Paper
                      style={{
                        padding: "1rem",
                        marginBottom: "1rem",
                        height: "650px",
                        overflow: "auto",
                      }}
                    >
                      {pet.images && pet.images.length > 0 && (
                        <Grid
                          container
                          justifyContent="center"
                          style={{ marginBottom: "1rem" }}
                        >
                          {pet.images.map((image, index) => (
                            <img
                              key={index}
                              src={`http://localhost:3001/${image}`}
                              alt={`${pet.name} ${index}`}
                              style={{
                                maxWidth: "100%",
                                objectFit: "cover",
                                height: "300px",
                              }}
                            />
                          ))}
                        </Grid>
                      )}
                      <Typography style={styles.title}>{pet.name}</Typography>
                      <Typography style={styles.typeName}>
                        {pet.type}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Breed: </strong> {pet.breed}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Age: </strong> {pet.age} {pet.ageUnit}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Gender: </strong> {pet.gender}
                      </Typography>
                      <Typography>
                        <strong>Description: </strong>
                        {truncateContent(pet.description, 150)}
                      </Typography>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Grid item>
                          <IconButton
                            variant="contained"
                            style={styles.editDltBtn}
                            onClick={() => handleDeletePet(pet._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            style={styles.adoptBtn}
                            onClick={() => handleNotAdoptPet(pet._id)}
                          >
                            Not Adopted
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default StaffPets;
