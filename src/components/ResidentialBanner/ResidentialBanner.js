import React from "react";
import { useNavigate } from "react-router-dom";
import "./ResidentialBanner.css";

const ResidentialBanner = () => {
  const navigate = useNavigate();

  const handleBrowse = () => {
    navigate("/listings");
  };

  return (
    <section className="residential-banner">
      <div className="residential-banner-overlay"></div>
      <div className="residential-banner-content">
        <h2 className="residential-banner-title">
          Searching for your perfect home?
        </h2>
        <p className="residential-banner-subtitle">
          Discover our exclusive residential projects.
        </p>
        <button 
          className="residential-banner-btn" 
          onClick={handleBrowse}
          aria-label="Browse Properties"
        >
          Browse Properties
        </button>
      </div>
    </section>
  );
};

export default ResidentialBanner;