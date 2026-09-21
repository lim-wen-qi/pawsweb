import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Grid,
  Typography,
  Container,
  Button,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Material UI icon for expand

function Faq() {
  const { userRole } = useContext(UserContext);
  const [faqs, setFaqs] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState({});
  const paperStyle = {
    height: "auto",
    padding: "5px 10px",
    margin: "10px 0",
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

  const faqContainerStyle = {
    marginBottom: "2.5rem",
    overflowWrap: "break-word",
  };

  const questionStyle = {
    fontWeight: "600",
    overflowWrap: "break-word",
  };

  const answerStyle = {
    marginBottom: "1rem",
    overflowWrap: "break-word",
  };

  const handleExpandClick = (blogId, questionId) => {
    setExpandedQuestion(
      (prev) =>
        prev === `${blogId}-${questionId}` ? null : `${blogId}-${questionId}` // Toggle current question
    );
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/faq")
      .then((response) => setFaqs(response.data))
      .catch((error) => console.error("Error fetching FAQs:", error));
  }, []);

  return (
    <Container style={{ paddingTop: "5rem", width: "80%" }}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography style={heading}>FAQ</Typography>
        </Grid>
        {userRole === "admin" && (
          <Grid item>
            <Link to="/admin/faq" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                FAQ Dashboard
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
      <Typography style={subtitle}>
        Welcome to our FAQ section! Here, we've compiled a range of helpful
        questions and answers to assist pet caregivers in finding quick
        solutions and understanding essential topics about pet care. Whether
        you're a seasoned pet parent or new to the world of pets, you'll find
        practical tips and advice to ensure your furry, feathered, or scaly
        friends are happy and healthy! <br/><br/>
        Click on the down arrow to see the answer.
      </Typography>
      {faqs.length === 0 ? (
        <Typography variant="h6" align="center">
          No FAQs available.
        </Typography>
      ) : (
        faqs.map((faq) => (
          <div key={faq._id} style={faqContainerStyle}>
            <Typography
              variant="h5"
              align="left"
              margin="5px 0"
              color={"black"}
              style={{
                fontWeight: "600",
                textTransform: "uppercase",
                overflowWrap: "break-word",
              }}
            >
              {faq.blogTitle}
            </Typography>
            {faq.questions.map((q) => (
              <Paper key={q._id} style={paperStyle}>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={11}>
                    <Typography variant="h6" style={questionStyle}>
                      {q.question}
                    </Typography>
                  </Grid>
                  <Grid>
                    <IconButton
                      onClick={() => handleExpandClick(faq._id, q._id)}
                    >
                      <ExpandMoreIcon
                        style={{
                          transform:
                            expandedQuestion === `${faq._id}-${q._id}`
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
                {expandedQuestion === `${faq._id}-${q._id}` && (
                  <Typography variant="body1" style={answerStyle}>
                    {q.answer}
                  </Typography>
                )}
              </Paper>
            ))}
            <Divider style={{ margin: "1rem 0" }} />
          </div>
        ))
      )}
    </Container>
  );
}

export default Faq;
