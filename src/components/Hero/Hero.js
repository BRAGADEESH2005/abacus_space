import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaCalculator, FaArrowRight } from "react-icons/fa";
import "./Hero.css";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState("entering");
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Intro animation sequence
    const enterTimer = setTimeout(() => {
      setIntroPhase("visible");
    }, 100);

    const exitTimer = setTimeout(() => {
      setIntroPhase("exiting");
    }, 2500);

    const hideTimer = setTimeout(() => {
      setShowIntro(false);
      setIsLoaded(true);
    }, 3300);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Navigation functions
  const handleFindSpace = () => {
    navigate("/listings");
  };

  const handleSpaceCalculator = () => {
    navigate("/space-calculator");
  };

  return (
    <>
      {showIntro && (
        <div className={`intro-overlay ${introPhase}`}>
          <div className="intro-background">
            <div className="animated-gradient"></div>
          </div>
          <div className="intro-content">
            <div className="intro-logo-container">
              <img
                src="/logo_abacus.png"
                alt="Abacus Logo"
                className="intro-logo"
              />
              <div className="intro-logo-glow"></div>
            </div>
          </div>
        </div>
      )}

      <section
        className={`hero ${!showIntro ? "hero-visible" : ""}`}
        ref={heroRef}
      >
        {/* Background Video */}
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/aigen_vid_dark.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay for text visibility */}
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <div className="hero-content">
            <h1 className={`hero-title ${isLoaded ? "animate-in" : ""}`}>
              <span className="title-line-1">ABACUS</span>
              <span className="title-line-2 highlight-text">
                Spaces That Mean Business
              </span>
            </h1>
            <p className={`hero-subtitle ${isLoaded ? "animate-in" : ""}`}>
              <span className="typing-text">
                We Help Ambitious Businesses Lease Commercial Spaces
              </span>
            </p>
            <div className={`hero-buttons ${isLoaded ? "animate-in" : ""}`}>
              <button className="cta-primary" onClick={handleFindSpace}>
                <span>Find Your Space</span>
                <FaRocket className="button-icon" />
                <div className="button-ripple"></div>
              </button>
              <button
                className="cta-secondary calculator-btn"
                onClick={handleSpaceCalculator}
              >
                <div className="btn-content">
                  <div className="btn-main">
                    <FaCalculator className="button-icon" />
                    <span>Office Space Calculator</span>
                  </div>
                </div>
                <FaArrowRight className="arrow-icon" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
