import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import GeneralNavbar from "./Components/Navbar/GeneralNavbar";
import AdminNavbar from "./Components/Navbar/AdminNavbar";
import StaffNavbar from "./Components/Navbar/StaffNavbar";
import AdopterNavbar from "./Components/Navbar/AdopterNavbar";
import Footer from "./Components/Footer/Footer";

import Home from "./Pages/General/Home";
import Login from "./Pages/General/Login";
import Logout from "./Pages/General/Logout";
import Register from "./Pages/General/Register";
import VerifyOtp from "./Pages/General/VerifyOtp";
import Pets from "./Pages/General/Pets";
import PetEditor from "./Pages/Admin/PetEditor";
import LikedPets from "./Pages/Adopter/LikedPets";
import StaffPets from "./Pages/Staff/StaffPets";
import AddPet from "./Pages/Staff/AddPet";
import Educational from "./Pages/General/Educational";
import EducationalEditor from "./Pages/Admin/EducationalEditor";
import Faq from "./Pages/General/Faq";
import FaqEditor from "./Pages/Admin/FaqEditor";
import Contact from "./Pages/General/Contact";
import Volunteer from "./Pages/General/Volunteer";
import Donate from "./Pages/General/Donate";
import Sponsor from "./Pages/General/Sponsor";

export const IsLoggedInContext = createContext();
export const SetIsLoggedInContext = createContext();
export const UserContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/user", { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setIsLoggedIn(true);
          setUserRole(response.data.user.role);
          setUserName(response.data.user.name);
          setUserEmail(response.data.user.email);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
          setUserName("");
          setUserEmail("");
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName("");
        setUserEmail("");
      });
  }, []);

  const renderNavbar = () => {
    switch (userRole) {
      case "admin":
        return <AdminNavbar userName={userName} />;
      case "staff":
        return <StaffNavbar userName={userName} />;
      case "adopter":
        return <AdopterNavbar userName={userName} />;
      default:
        return <GeneralNavbar />;
    }
  };

  return (
    <IsLoggedInContext.Provider value={isLoggedIn}>
      <SetIsLoggedInContext.Provider value={setIsLoggedIn}>
        <UserContext.Provider
          value={{
            userRole,
            setUserRole,
            userName,
            setUserName,
            userEmail,
            setUserEmail,
          }}
        >
          <Router>
            {renderNavbar()}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/educational" element={<Educational />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/volunteer" element={<Volunteer />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/sponsor" element={<Sponsor />} />

              <Route path="/admin/pets" element={<PetEditor />} />
              <Route path="/adopter/liked-pets" element={<LikedPets />} />
              <Route path="/staff/pets" element={<StaffPets />} />
              <Route path="/add-pet" element={<AddPet />} />

              <Route
                path="/admin/educational"
                element={<EducationalEditor />}
              />

              <Route path="/admin/faq" element={<FaqEditor />} />
            </Routes>
            <Footer />
          </Router>
        </UserContext.Provider>
      </SetIsLoggedInContext.Provider>
    </IsLoggedInContext.Provider>
  );
}

export default App;
