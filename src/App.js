import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Import Pages
import Home from "./pages/Home/Home";
import Listings from "./pages/Listings/Listings";
import AboutUs from "./pages/AboutUs/AboutUs";
import Contact from "./pages/Contact/Contact";
import SpaceCalculator from "./pages/SpaceCalculator/SpaceCalculator";
import Admin from "./pages/Admin/Admin";
import RERARegistration from "./pages/RERA/RERARegistration";
import LeadsManagement from "./pages/Admin/LeadsManagement/LeadsManagement";
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/space-calculator" element={<SpaceCalculator />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/rera-registration" element={<RERARegistration />} />
          <Route path="/admin/leads" element={<LeadsManagement />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
