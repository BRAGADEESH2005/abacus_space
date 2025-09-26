import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaRocket,
  FaArrowRight,
  FaSearch,
  FaKey,
  FaHandshake,
  FaCalculator,
} from "react-icons/fa";
import { MdLocationOn, MdVerified } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi";
import { BsLightningChargeFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import "./Hero.css";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState("entering");
  const [currentStep, setCurrentStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const [particles, setParticles] = useState([]);
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

    // Step progression (starts after intro)
    const stepTimer = setTimeout(() => {
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % 4);
      }, 2500);

      return () => clearInterval(stepInterval);
    }, 4000);

    // Mouse tracking
    const handleMouseMove = (e) => {
      if (heroRef.current && !showIntro) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(stepTimer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [showIntro]);

  // Navigation functions
  const handleFindSpace = () => {
    navigate("/listings");
  };

  const handleSpaceCalculator = () => {
    navigate("/space-calculator");
  };

  const processSteps = [
    {
      id: 1,
      icon: <FaSearch />,
      title: "Search",
      description: "Find Your Space",
      color: "#23c6a4",
      position: { top: "20%", left: "20%" },
    },
    {
      id: 2,
      icon: <MdLocationOn />,
      title: "Match",
      description: "Perfect Location",
      color: "#1a2f5c",
      position: { top: "25%", right: "25%" },
    },
    {
      id: 3,
      icon: <FaHandshake />,
      title: "Negotiate",
      description: "Best Deal",
      color: "#4fd1c7",
      position: { bottom: "30%", right: "20%" },
    },
    {
      id: 4,
      icon: <FaKey />,
      title: "Move In",
      description: "Start Business",
      color: "#2dd4bf",
      position: { bottom: "25%", left: "25%" },
    },
  ];

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
              Commercial Leasing across South India <br />
              <span className="typing-text">
                Spaces for Ambitious Businesses...
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
                    <span>Space Calculator</span>
                  </div>
                </div>
                <div className="btn-subtitle">
                  Calculate your ideal office space for free
                </div>
                <FaArrowRight className="arrow-icon" />
              </button>
            </div>

            <div className={`hero-stats ${isLoaded ? "animate-in" : ""}`}>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Properties</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Cities</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hero-visual">
            <div className="visual-container">
              {/* Central Space Portal */}
              <div className={`space-portal ${isLoaded ? "animate-in" : ""}`}>
                <div className="portal-rings">
                  <div className="ring ring-outer"></div>
                  <div className="ring ring-middle"></div>
                  <div className="ring ring-inner"></div>
                </div>
                <div className="portal-core">
                  <div className="core-energy"></div>
                  <div className="space-icon">
                    <FaBuilding />
                  </div>
                </div>
              </div>

              {/* Process Flow */}
              <div className="process-flow">
                {processSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`process-step step-${index + 1} ${
                      currentStep === index ? "active" : ""
                    } ${isLoaded ? "animate-in" : ""}`}
                    style={{
                      ...step.position,
                      "--step-color": step.color,
                      animationDelay: `${0.5 + index * 0.3}s`,
                      transform: `translate(${mousePosition.x * 0.03}px, ${
                        mousePosition.y * 0.03
                      }px)`,
                    }}
                  >
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                    <div className="step-number">{step.id}</div>
                    <div className="step-wave"></div>
                  </div>
                ))}
              </div>

              {/* Connection Lines */}
              <div className="connection-lines">
                <svg className="connection-svg" viewBox="0 0 400 400">
                  <path
                    className={`connection-path path-1 ${
                      currentStep >= 0 ? "active" : ""
                    }`}
                    d="M 100 100 Q 200 50 300 120"
                    stroke="url(#gradient1)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    className={`connection-path path-2 ${
                      currentStep >= 1 ? "active" : ""
                    }`}
                    d="M 300 120 Q 350 200 320 280"
                    stroke="url(#gradient2)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    className={`connection-path path-3 ${
                      currentStep >= 2 ? "active" : ""
                    }`}
                    d="M 320 280 Q 200 350 100 300"
                    stroke="url(#gradient3)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    className={`connection-path path-4 ${
                      currentStep >= 3 ? "active" : ""
                    }`}
                    d="M 100 300 Q 50 200 100 100"
                    stroke="url(#gradient4)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#23c6a4" stopOpacity="0" />
                      <stop offset="50%" stopColor="#23c6a4" stopOpacity="1" />
                      <stop offset="100%" stopColor="#23c6a4" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="gradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#1a2f5c" stopOpacity="0" />
                      <stop offset="50%" stopColor="#1a2f5c" stopOpacity="1" />
                      <stop offset="100%" stopColor="#1a2f5c" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="gradient3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#4fd1c7" stopOpacity="0" />
                      <stop offset="50%" stopColor="#4fd1c7" stopOpacity="1" />
                      <stop offset="100%" stopColor="#4fd1c7" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="gradient4"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
                      <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
                      <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Enhanced Floating Benefits */}
              <div className="floating-benefits">
                <div className="benefit benefit-1">
                  <BsLightningChargeFill />
                  <span>Fast</span>
                </div>
                <div className="benefit benefit-2">
                  <MdVerified />
                  <span>Verified</span>
                </div>
                <div className="benefit benefit-3">
                  <HiCurrencyDollar />
                  <span>Best Price</span>
                </div>
                <div className="benefit benefit-4">
                  <AiFillCheckCircle />
                  <span>Guaranteed</span>
                </div>
                <div className="benefit benefit-5">
                  <FaCalculator />
                  <span>Free Calculator</span>
                </div>
              </div>

              {/* Success Animation */}
              <div
                className={`success-explosion ${
                  currentStep === 3 ? "active" : ""
                }`}
              >
                <div className="explosion-particle particle-1"></div>
                <div className="explosion-particle particle-2"></div>
                <div className="explosion-particle particle-3"></div>
                <div className="explosion-particle particle-4"></div>
                <div className="explosion-particle particle-5"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
