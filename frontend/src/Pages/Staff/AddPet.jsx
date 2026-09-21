import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { UserContext } from "../../App";

const AddPet = () => {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
    marginTop: "10px",
  };

  const { userName } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    size: "",
    age: "",
    gender: "",
    shelter: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages(files);
    if (files && files[0]) {
      // Preview the first image
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(files[0]);
    } else {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) =>
      formDataObj.append(key, formData[key])
    );
    formDataObj.append("uploadedBy", userName);
    for (let i = 0; i < images.length; i++) {
      formDataObj.append("images", images[i]);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/pet",
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Pet added successfully!");
        setOpenSnackbar(true);
        setFormData({
          name: "",
          type: "",
          breed: "",
          size: "",
          age: "",
          ageUnit: "",
          gender: "",
          shelter: "",
          description: "",
        });
        setImages([]);
        setImagePreview("");
        document.querySelector('input[type="file"]').value = ""; // Reset file input
        setTimeout(() => navigate("/staff/pets"), 2000);
      }
    } catch (err) {
      setError("Failed to add pet. Please check input fields again.");
      setOpenSnackbar(true);
      console.error(
        "Error adding pet:",
        err.response ? err.response.data : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" style={{ paddingTop: "5rem", width: "80%" }}>
      <Typography style={heading}>Add New Pet</Typography>
      <Divider style={{ margin: "2rem 0" }} />
        <form onSubmit={handleSubmit}>
          {imagePreview && (
            <div style={{ marginBottom: "1rem" }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: "100%" }}
              />
            </div>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="file"
                name="images"
                onChange={handleImageChange}
                multiple
                required
                style={{ width: "100%" }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
              <MenuItem value="Dog">Dog</MenuItem>
              <MenuItem value="Cat">Cat</MenuItem>
              <MenuItem value="Rabbit">Rabbit</MenuItem>
              <MenuItem value="Hamster">Hamster</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                select
                label="Age Unit"
                name="ageUnit"
                value={formData.ageUnit}
                onChange={handleChange}
                required
              >
                <MenuItem value="Week(s)">Week(s)</MenuItem>
                <MenuItem value="Month(s)">Month(s)</MenuItem>
                <MenuItem value="Year(s)">Year(s)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Shelter"
                name="shelter"
                value={formData.shelter}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description (including backstory, personality, health status, and more of the pet)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" style={buttonStyle}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {success || error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddPet;
