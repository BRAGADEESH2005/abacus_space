import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaRocket,
  FaArrowRight,
  FaCalculator,
} from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi";
import { AiFillCheckCircle } from "react-icons/ai";
import VideoAnimation from "../VideoAnimation/VideoAnimation";
import "./Hero.css";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState("entering");
  const [particles, setParticles] = useState([]);
  const heroRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simple intro animation sequence
    const introSequence = async () => {
      // Phase 1: Show intro logo (entering)
      setTimeout(() => {
        setIntroPhase("visible");
      }, 200);

      // Phase 2: Keep intro visible for 2.5 seconds
      setTimeout(() => {
        setIntroPhase("exiting");
      }, 1800);

      // Phase 3: Hide intro and show hero
      setTimeout(() => {
        setShowIntro(false);
        setIsLoaded(true);
      }, 2500);
    };

    introSequence();

    // Create floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
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
      {/* Logo Intro Overlay */}
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

      {/* Main Hero Section */}
      <section
        className={`hero ${!showIntro ? "hero-visible" : ""}`}
        ref={heroRef}
      >
        {/* Animated Background */}
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>

          {/* Floating Particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="floating-particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.speed + 3}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-container">
          {/* Left Content */}
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
                <div className="btn-subtitle">
                  Calculate your ideal office space for free
                </div>
                <FaArrowRight className="arrow-icon" />
              </button>
            </div>
            <div className={`hero-achievement ${isLoaded ? "animate-in" : ""}`}>
              <div className="achievement-content">
                <div className="achievement-text">
                  <span className="achievement-highlight">
                    Transaction close to
                  </span>
                  <span className="achievement-number">1,00,000 sq.ft.</span>
                  <span className="achievement-description">
                    of Commercial space in 2025
                  </span>
                </div>
              </div>
              <div className="achievement-glow"></div>
            </div>
          </div>

          {/* Right Visual - New Video Animation Component */}
          <div className="hero-visual">
            <div className="visual-container">
              <VideoAnimation />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
