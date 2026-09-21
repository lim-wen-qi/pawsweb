import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "20px 0",
        borderTop: "1px solid #e7e7e7",
        mt: 20,
      }}
    >
      <Grid container justifyContent="center">
        <Typography variant="body2" color="textSecondary" align="center">
          © 2024 PawsWeb. All rights reserved.
        </Typography>
      </Grid>
    </Box>
  );
};

export default Footer;
