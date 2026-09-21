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

function FaqEditor() {
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const title = { fontSize: "2rem", fontWeight: "600", marginBottom: "1.5rem" };
  const row = { display: "flex", marginTop: "1.5rem" };
  const buttonStyle = {
    fontSize: "1rem",
    fontWeight: "700",
    backgroundColor: "#b99976",
    borderRadius: "0.5rem",
  };

  const publishBlogBtn = {
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

  const [blogs, setBlogs] = useState([]);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editQuestions, setEditQuestions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/faq")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handlePublishBlog = () => {
    axios
      .post("http://localhost:3001/faq", {
        blogTitle: newBlogTitle,
        questions,
      })
      .then(() => {
        setNewBlogTitle("");
        setQuestions([{ question: "", answer: "" }]);
        fetchBlogs();
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteBlog = (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      axios
        .delete(`http://localhost:3001/faq/${blogId}`)
        .then(() => fetchBlogs())
        .catch((error) => console.error(error));
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog._id);
    setEditQuestions(blog.questions);
  };

  const handleSaveEdit = (blogId) => {
    axios
      .put(`http://localhost:3001/faq/${blogId}`, { questions: editQuestions })
      .then(() => {
        setEditingBlog(null);
        fetchBlogs();
      })
      .catch((error) => console.error(error));
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleRemoveQuestion = (index) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleEditQuestionChange = (index, event) => {
    const newQuestions = [...editQuestions];
    newQuestions[index][event.target.name] = event.target.value;
    setEditQuestions(newQuestions);
  };

  const handleRemoveEditQuestion = (index) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      const newQuestions = [...editQuestions];
      newQuestions.splice(index, 1);
      setEditQuestions(newQuestions);
    }
  };

  const fetchBlogs = () => {
    axios
      .get("http://localhost:3001/faq")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error(error));
  };

  const truncateContent = (content, charLimit) => {
    if (content.length <= charLimit) return content;
    return content.slice(0, charLimit) + "...";
  };

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Typography style={heading}>FAQ Dashboard</Typography>
        <Link to="/faq" style={{ textDecoration: "none" }}>
          <Button variant="contained" style={buttonStyle}>
            View
          </Button>
        </Link>
      </Grid>
      <Divider style={{ margin: "2rem 0" }} />
      <Typography style={title}>ADD NEW BLOG</Typography>
      <TextField
        InputProps={{
          style: { fontWeight: "bold" },
        }}
        label="New Blog Title"
        value={newBlogTitle}
        onChange={(e) => setNewBlogTitle(e.target.value)}
        fullWidth
      />
      {questions.map((q, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <TextField
            label="Question"
            name="question"
            value={q.question}
            onChange={(e) => handleQuestionChange(index, e)}
            style={row}
            InputProps={{
              style: { fontWeight: "bold" },
            }}
            fullWidth
          />
          <TextField
            label="Answer"
            name="answer"
            value={q.answer}
            onChange={(e) => handleQuestionChange(index, e)}
            style={row}
            fullWidth
            multiline
            rows={10}
            inputProps={{ style: { overflowWrap: "break-word" } }}
          />
          <IconButton onClick={() => handleRemoveQuestion(index)}>
            <DeleteIcon variant="contained" style={editDltBtn} />
          </IconButton>
        </div>
      ))}
      <Button
        onClick={handleAddQuestion}
        variant="contained"
        startIcon={<AddIcon />}
        style={addQsBtn}
      >
        Question
      </Button>
      <Button
        onClick={handlePublishBlog}
        variant="contained"
        color="primary"
        style={publishBlogBtn}
      >
        Publish
      </Button>
      <Divider style={{ margin: "3rem 0" }} />
      <Typography style={title}>EXISTING BLOGS</Typography>
      {blogs.map((blog) => (
        <Paper
          key={blog._id}
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            overflowWrap: "break-word",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              overflowWrap: "break-word",
              textTransform: "uppercase",
            }}
          >
            {blog.blogTitle}
          </Typography>
          {editingBlog === blog._id ? (
            <div>
              {editQuestions.map((q, index) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <TextField
                    label="Question"
                    name="question"
                    value={q.question}
                    onChange={(e) => handleEditQuestionChange(index, e)}
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
                    label="Answer"
                    name="answer"
                    value={q.answer}
                    onChange={(e) => handleEditQuestionChange(index, e)}
                    style={row}
                    InputProps={{ style: { overflowWrap: "break-word" } }}
                    multiline
                    rows={10}
                    fullWidth
                  />
                  <IconButton onClick={() => handleRemoveEditQuestion(index)}>
                    <DeleteIcon variant="contained" style={editDltBtn} />
                  </IconButton>
                </div>
              ))}
              <Button
                onClick={() =>
                  setEditQuestions([
                    ...editQuestions,
                    { question: "", answer: "" },
                  ])
                }
                variant="contained"
                style={addQsBtn}
                startIcon={<AddIcon />}
              >
                Question
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSaveEdit(blog._id)}
                style={publishBlogBtn}
              >
                Save
              </Button>
            </div>
          ) : (
            <div>
              {blog.questions.map((q, index) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "bold", overflowWrap: "break-word" }}
                  >
                    {q.question}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ overflowWrap: "break-word" }}
                  >
                    {truncateContent(q.answer, 300)}
                  </Typography>
                </div>
              ))}
              <IconButton onClick={() => handleEditBlog(blog)}>
                <EditIcon variant="contained" style={editDltBtn} />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteBlog(blog._id)}
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

export default FaqEditor;
