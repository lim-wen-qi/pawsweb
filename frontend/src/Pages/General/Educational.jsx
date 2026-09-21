import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Container, Paper, Typography, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";

function Educational() {
  const paperStyle = {
    height: "auto",
    padding: "1rem",
    marginBottom: "1.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #453a2f",
    boxShadow: "2px 2px 2px #453a2f",
  };

  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const subtitle = {
    color: "grey",
    fontSize: "0.9rem",
    fontWeight: "100",
    marginTop: "10px",
    marginBottom: "40px",
  };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
  };

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { userRole } = useContext(UserContext); // Use context to get user role

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = () => {
    axios
      .get("http://localhost:3001/educational")
      .then((response) => setTopics(response.data))
      .catch((error) => console.error(error));
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography style={heading}>Educational</Typography>
        </Grid>
        {userRole === "admin" && (
          <Grid item>
            <Link to="/admin/educational" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                Educational Dashboard
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
      <Typography style={subtitle}>
        Explore our Educational page to find essential tips and resources for
        pet care, behavior, and adoption. Whether you're preparing to welcome a
        new pet or looking to enhance your knowledge, you'll discover everything
        you need to ensure a happy and healthy life for your furry friend. <br/><br/>
        Click on the box to see the details of the educational topic.
      </Typography>

      {selectedTopic ? (
        <div>
          <Button
            onClick={handleBackToTopics}
            variant="contained"
            style={buttonStyle}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
          <div>
            {selectedTopic.image && (
              <Grid container justifyContent="center">
                <img
                  src={`http://localhost:3001/${selectedTopic.image}`}
                  alt={selectedTopic.title}
                  style={{ width: "80%", margin: "10px 0" }}
                />
              </Grid>
            )}
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
                overflowWrap: "break-word",
                textTransform: "uppercase",
              }}
            >
              {selectedTopic.topic}
            </Typography>
            {selectedTopic.titles.map((q, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", overflowWrap: "break-word" }}
                >
                  {q.title}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ overflowWrap: "break-word" }}
                >
                  {q.content}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      ) : (
        topics.map((topic) => (
          <Paper
            key={topic._id}
            style={paperStyle}
            onClick={() => handleTopicClick(topic)}
          >
            {topic.image && (
              <Grid container justifyContent="center">
                <img
                  src={`http://localhost:3001/${topic.image}`}
                  alt={topic.title}
                  style={{ maxWidth: "50%", margin: "10px 0", borderRadius: "8px", }}
                />
              </Grid>
            )}
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
                overflowWrap: "break-word",
                textTransform: "uppercase",
                textAlign: "center"
              }}
            >
              {topic.topic}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
}

export default Educational;