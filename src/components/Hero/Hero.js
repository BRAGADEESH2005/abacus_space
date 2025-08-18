import React, { useEffect, useState, useRef } from "react";
import {
  FaBuilding,
  FaStore,
  FaUsers,
  FaRocket,
  FaStar,
  FaArrowRight,
  FaSearch,
  FaKey,
  FaHandshake,
} from "react-icons/fa";
import { MdLocationOn, MdVerified } from "react-icons/md";
import { HiCurrencyDollar } from "react-icons/hi";
import { BsLightningChargeFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import "./Hero.css";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
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

    // Trigger load animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    // Step progression
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4);
    }, 2500);

    // Mouse tracking
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      clearInterval(stepTimer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const processSteps = [
    {
      id: 1,
      icon: <FaSearch />,
      title: "Search",
      description: "Find Your Space",
      color: "#667eea",
      position: { top: "20%", left: "20%" },
    },
    {
      id: 2,
      icon: <MdLocationOn />,
      title: "Match",
      description: "Perfect Location",
      color: "#f093fb",
      position: { top: "25%", right: "25%" },
    },
    {
      id: 3,
      icon: <FaHandshake />,
      title: "Negotiate",
      description: "Best Deal",
      color: "#4facfe",
      position: { bottom: "30%", right: "20%" },
    },
    {
      id: 4,
      icon: <FaKey />,
      title: "Move In",
      description: "Start Business",
      color: "#43e97b",
      position: { bottom: "25%", left: "25%" },
    },
  ];

  return (
    <section className="hero" ref={heroRef}>
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
          <div className={`hero-badge ${isLoaded ? "animate-in" : ""}`}>
            <FaHandshake className="badge-icon" />
            <span>Your Success Partner • Zero Hidden Fees</span>
          </div>
          <h1 className={`hero-title ${isLoaded ? "animate-in" : ""}`}>
            <span className="title-line-1">Abacus –</span>
            <span className="title-line-2 highlight-text">
              Spaces That
              <span className="rotating-words">
                <span className="word active">Mean Business</span>
                <span className="word">Drive Success</span>
                <span className="word">Build Dreams</span>
              </span>
            </span>
          </h1>
          <p className={`hero-subtitle ${isLoaded ? "animate-in" : ""}`}>
            Office & Retail Leasing Across South India
            <br />
            <span className="typing-text">
              Where ambition meets opportunity...
            </span>
          </p>
          <div className={`hero-buttons ${isLoaded ? "animate-in" : ""}`}>
            <button className="cta-primary">
              <span>Find Your Space</span>
              <FaRocket className="button-icon" />
              <div className="button-ripple"></div>
            </button>
            <button className="cta-secondary">
              <span>Contact Us</span>
              <FaArrowRight className="button-icon" />
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

        {/* Right Visual - Space Journey Animation */}
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
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0" />
                    <stop offset="50%" stopColor="#667eea" stopOpacity="1" />
                    <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="gradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#f093fb" stopOpacity="0" />
                    <stop offset="50%" stopColor="#f093fb" stopOpacity="1" />
                    <stop offset="100%" stopColor="#f093fb" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="gradient3"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#4facfe" stopOpacity="0" />
                    <stop offset="50%" stopColor="#4facfe" stopOpacity="1" />
                    <stop offset="100%" stopColor="#4facfe" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient
                    id="gradient4"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#43e97b" stopOpacity="0" />
                    <stop offset="50%" stopColor="#43e97b" stopOpacity="1" />
                    <stop offset="100%" stopColor="#43e97b" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Floating Benefits */}
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
  );
};

export default Hero;
