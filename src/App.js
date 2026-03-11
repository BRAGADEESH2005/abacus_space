import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import UserInfoPopup from "./components/UserInfoPopup/UserInfoPopup";

// Import Pages
import Home from "./pages/Home/Home";
import Listings from "./pages/Listings/Listings";
import AboutUs from "./pages/AboutUs/AboutUs";
import Contact from "./pages/Contact/Contact";
import SpaceCalculator from "./pages/SpaceCalculator/SpaceCalculator";
import Admin from "./pages/Admin/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import RERARegistration from "./pages/RERA/RERARegistration";
import LeadsManagement from "./pages/Admin/LeadsManagement/LeadsManagement";
import ContentManagementPage from "./pages/Admin/ContentManagement/ContentManagementPage"; // Add this import
import DetailedReport from "./pages/DetailedReport/DetailedReport";

function App() {
  return (
    <div className="App">
      <Router>
        <UserInfoPopup delay={10000} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/space-calculator" element={<SpaceCalculator />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/content/:slug" element={<DetailedReport />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/rera-registration" element={<RERARegistration />} />
          <Route path="/admin/leads" element={<LeadsManagement />} />
          <Route
            path="/admin/content"
            element={<ContentManagementPage />}
          />{" "}
          {/* Add this route */}
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
