import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MenuItem,
  Button,
  Paper,
  Grid,
  TextField,
} from "@mui/material";

function FilterComponent({ onFilterChange }) {
  const paperStyle = {
    padding: "20px",
    margin: "20px 0",
  };
  const resetBtn = {
    marginTop: "10px",
    fontSize: "0.8rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    color: "white",
    borderRadius: "0.5rem",
  };

  const [filters, setFilters] = useState({
    type: "All",
    breed: "All",
    size: "All",
    gender: "All",
  });
  const [allTypes, setAllTypes] = useState([]);
  const [allBreeds, setAllBreeds] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [allGenders, setAllGenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Assuming you have separate endpoints for filter options
        const [typesResponse, breedsResponse, sizesResponse, gendersResponse] = await Promise.all([
          axios.get('http://localhost:3001/filter/types'),
          axios.get('http://localhost:3001/filter/breeds'),
          axios.get('http://localhost:3001/filter/sizes'),
          axios.get('http://localhost:3001/filter/genders'),
        ]);

        setAllTypes(typesResponse.data);
        setAllBreeds(breedsResponse.data);
        setAllSizes(sizesResponse.data);
        setAllGenders(gendersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleResetFilters = () => {
    const resetFilters = {
      type: "All",
      breed: "All",
      size: "All",
      gender: "All",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  if (loading) return <p>Loading filter options...</p>;

  return (
    <Paper style={paperStyle}>
      <Grid container spacing={3} justifyContent={"center"}>
        <Grid item>
          <TextField
            select
            label="Type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            style={{width:"120px"}}
          >
            <MenuItem value="All">All</MenuItem>
            {allTypes.map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Breed"
            name="breed"
            value={filters.breed}
            onChange={handleChange}
            style={{width:"120px"}}
          >
            <MenuItem value="All">All</MenuItem>
            {allBreeds.map((breed, index) => (
              <MenuItem key={index} value={breed}>{breed}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Size"
            name="size"
            value={filters.size}
            onChange={handleChange}
            style={{width:"120px"}}
          >
            <MenuItem value="All">All</MenuItem>
            {allSizes.map((size, index) => (
              <MenuItem key={index} value={size}>{size}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Gender"
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            style={{width:"120px"}}
          >
            <MenuItem value="All">All</MenuItem>
            {allGenders.map((gender, index) => (
              <MenuItem key={index} value={gender}>{gender}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleResetFilters}
            style={resetBtn}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FilterComponent;
