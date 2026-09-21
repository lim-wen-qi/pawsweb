import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
  alpha,
} from "@mui/material";
import logo from "../../assets/images/logo.png";
import ReorderIcon from "@mui/icons-material/Reorder";
import LogoutIcon from "@mui/icons-material/Logout";

// Define styles
const navBtnStyle = {
  backgroundColor: "transparent",
  color: "#000",
  marginRight: "10px",
  fontSize: "16px",
  fontWeight: "700",
  padding: "0.1rem 1.0rem",
};

const reorderBtnStyle = {
  backgroundColor: "transparent",
  color: "#000",
  marginRight: "10px",
};

const logoutBtn = {
  color: "#987554",
};

const nameStyle = {
  color: "#000",
  fontSize: "14px",
  marginRight: "10px",
};

// Styled Menu
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function StaffNavbar({ userName }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenuItems = () =>
    ["Home", "Pets", "Educational", "FAQ", "Contact"].map((text) => (
      <MenuItem
        key={text}
        onClick={handleMenuClose}
        style={{ fontWeight: "600" }}
        component={Link}
        to={`/${text.toLowerCase()}`}
      >
        {text}
      </MenuItem>
    ));

  return (
    <AppBar sx={{ bgcolor: "white", height: "100px" }}>
      <Toolbar>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link to="/">
            <img
              src={logo}
              alt="PawsWeb Logo"
              style={{ marginTop: "5px", width: "150px" }}
            />
          </Link>

          {!isSmallScreen && (
            <Box
              sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}
            >
              {["Home", "Pets", "Educational", "FAQ", "Contact"].map((text) => (
                <Button
                  key={text}
                  variant="text"
                  style={navBtnStyle}
                  component={Link}
                  to={`/${text.toLowerCase()}`}
                >
                  {text}
                </Button>
              ))}
            </Box>
          )}

          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
          >
            {isSmallScreen && (
              <>
                <IconButton
                  style={reorderBtnStyle}
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <ReorderIcon />
                </IconButton>
                <StyledMenu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  {renderMenuItems()}
                </StyledMenu>
              </>
            )}
            <Typography style={nameStyle}>{userName}</Typography>
            <Link to="/logout" style={{ textDecoration: "none" }}>
              <IconButton aria-label="Logout" style={logoutBtn}>
                <LogoutIcon />
              </IconButton>
            </Link>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default StaffNavbar;
