import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Paper,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function EducationalEditor() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const title = { fontSize: "2rem", fontWeight: "600", marginBottom: "1.5rem" };
  const row = { display: "flex", marginTop: "1.5rem" };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
  };

  const publishTopicBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#453a2f",
    borderRadius: "0.5rem",
    marginLeft: "1rem",
  };

  const addQsBtn = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#987554",
    borderRadius: "0.5rem",
  };

  const editDltBtn = {
    color: "#574e44",
  };

  const [topics, setTopics] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [titles, setTitles] = useState([{ title: "", content: "" }]);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editTitles, setEditTitles] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = () => {
    axios
      .get("http://localhost:3001/educational")
      .then((response) => setTopics(response.data))
      .catch((error) => console.error(error));
  };

  const handlePublishTopic = () => {
    const formData = new FormData();
    formData.append("topic", newTopicTitle);
    formData.append("titles", JSON.stringify(titles)); // Convert titles to a JSON string
    if (image) {
      formData.append("image", image); // Append the image file
    }

    axios
      .post("http://localhost:3001/educational", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setNewTopicTitle("");
        setTitles([{ title: "", content: "" }]);
        setImage(null);
        setImagePreview("");
        fetchTopics();
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteTopic = (topicId) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      axios
        .delete(`http://localhost:3001/educational/${topicId}`)
        .then(() => fetchTopics())
        .catch((error) => console.error(error));
    }
  };

  const handleEditTopic = (topic) => {
    setEditingTopic(topic._id);
    setEditTitles(topic.titles);
  };

  const handleSaveEdit = (topicId) => {
    const formData = new FormData();
    formData.append("titles", JSON.stringify(editTitles)); // Convert editTitles to a JSON string
    if (image) {
      formData.append("image", image); // Append the image file if changed
    }

    axios
      .put(`http://localhost:3001/educational/${topicId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setEditingTopic(null);
        setEditTitles([]);
        setImage(null);
        setImagePreview("");
        fetchTopics();
      })
      .catch((error) => console.error(error));
  };

  const handleAddTitle = () => {
    setTitles([...titles, { title: "", content: "" }]);
  };

  const handleRemoveTitle = (index) => {
    if (window.confirm("Are you sure you want to delete this title?")) {
      const newTitles = [...titles];
      newTitles.splice(index, 1);
      setTitles(newTitles);
    }
  };

  const handleTitleChange = (index, event) => {
    const newTitles = [...titles];
    newTitles[index][event.target.name] = event.target.value;
    setTitles(newTitles);
  };

  const handleEditTitleChange = (index, event) => {
    const newTitles = [...editTitles];
    newTitles[index][event.target.name] = event.target.value;
    setEditTitles(newTitles);
  };

  const handleRemoveEditTitle = (index) => {
    if (window.confirm("Are you sure you want to delete this title?")) {
      const newTitles = [...editTitles];
      newTitles.splice(index, 1);
      setEditTitles(newTitles);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Generate a preview of the selected image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setImage(null);
  };

  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography style={heading}>Educational Dashboard</Typography>
        <Link to="/educational" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={buttonStyle}>
            View
          </Button>
        </Link>
      </Grid>
      <Divider style={{ margin: "2rem 0" }} />
      <Typography style={title}>ADD NEW TOPIC</Typography>
      {imagePreview && (
        <div style={{ marginBottom: "1rem" }}>
          <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%" }} />
        </div>
      )}
      <div style={{ marginBottom: "1rem" }}>
        <TextField
          type="file"
          fullWidth
          style={{ marginBottom: "1rem" }}
          inputProps={{ accept: "image/*" }}
          onChange={handleImageChange}
        />
      </div>
      <TextField
        InputProps={{
          style: { fontWeight: "bold" },
        }}
        label="New Topic Title"
        value={newTopicTitle}
        onChange={(e) => setNewTopicTitle(e.target.value)}
        fullWidth
      />
      {titles.map((q, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <TextField
            label="Title"
            name="title"
            value={q.title}
            onChange={(e) => handleTitleChange(index, e)}
            style={row}
            InputProps={{
              style: { fontWeight: "bold" },
            }}
            fullWidth
          />
          <TextField
            label="Content"
            name="content"
            value={q.content}
            onChange={(e) => handleTitleChange(index, e)}
            style={row}
            fullWidth
            multiline
            rows={10}
            inputProps={{ style: { overflowWrap: "break-word" } }}
          />
          <IconButton onClick={() => handleRemoveTitle(index)}>
            <DeleteIcon variant="contained" style={editDltBtn} />
          </IconButton>
        </div>
      ))}
      <Button
        onClick={handleAddTitle}
        variant="contained"
        startIcon={<AddIcon />}
        style={addQsBtn}
      >
        Title
      </Button>
      <Button
        onClick={handlePublishTopic}
        variant="contained"
        color="primary"
        style={publishTopicBtn}
      >
        Publish
      </Button>
      <Divider style={{ margin: "3rem 0" }} />
      <Typography style={title}>EXISTING TOPICS</Typography>
      {topics.map((topic) => (
        <Paper
          key={topic._id}
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            overflowWrap: "break-word",
          }}
        >
          {topic.image && (
            <img
              src={`http://localhost:3001/${topic.image}`}
              alt={topic.title}
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          )}
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              overflowWrap: "break-word",
              textTransform: "uppercase",
            }}
          >
            {topic.topic}
          </Typography>
          {editingTopic === topic._id ? (
            <div>
              {imagePreview && (
                <div style={{ marginBottom: "1rem" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                  <IconButton onClick={handleDeleteImage}>
                    <DeleteIcon variant="contained" style={editDltBtn} />
                  </IconButton>
                </div>
              )}
              <div style={{ marginBottom: "1rem" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginBottom: "1rem" }}
                />
              </div>
              {editTitles.map((q, index) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <TextField
                    label="Title"
                    name="title"
                    value={q.title}
                    onChange={(e) => handleEditTitleChange(index, e)}
                    style={row}
                    InputProps={{
                      style: {
                        fontWeight: "bold",
                        overflowWrap: "break-word",
                      },
                    }}
                    fullWidth
                  />
                  <TextField
                    label="Content"
                    name="content"
                    value={q.content}
                    onChange={(e) => handleEditTitleChange(index, e)}
                    style={row}
                    InputProps={{ style: { overflowWrap: "break-word" } }}
                    multiline
                    rows={10}
                    fullWidth
                  />
                  <IconButton onClick={() => handleRemoveEditTitle(index)}>
                    <DeleteIcon variant="contained" style={editDltBtn} />
                  </IconButton>
                </div>
              ))}
              <Button
                onClick={() =>
                  setEditTitles([...editTitles, { title: "", content: "" }])
                }
                variant="contained"
                style={addQsBtn}
                startIcon={<AddIcon />}
              >
                Title
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSaveEdit(topic._id)}
                style={publishTopicBtn}
              >
                Save
              </Button>
            </div>
          ) : (
            <div>
              {topic.titles.map((q, index) => (
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
                    {truncateContent(q.content, 300)}
                  </Typography>
                </div>
              ))}
              <IconButton onClick={() => handleEditTopic(topic)}>
                <EditIcon variant="contained" style={editDltBtn} />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteTopic(topic._id)}
                style={{ marginLeft: "0.5rem" }}
              >
                <DeleteIcon variant="contained" style={editDltBtn} />
              </IconButton>
            </div>
          )}
        </Paper>
      ))}
    </Container>
  );
}

export default EducationalEditor;
