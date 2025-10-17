import React, { useEffect, useState, useRef } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import {
  FaMapMarkerAlt,
  FaHandshake,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";
import "./WhyAbacus.css";

const WhyAbacus = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [particles, setParticles] = useState([]);

  const features = [
    {
      title: "Fast Closures",
      icon: <BsLightningChargeFill />,
      color: "#ddea66ff",
      delay: 0,
    },
    {
      title: "Local Insights",
      icon: <FaMapMarkerAlt />,
      color: "#f093fb",
      delay: 0.2,
    },
    {
      title: "Trusted Partnerships",
      icon: <FaHandshake />,
      color: "#4facfe",
      delay: 0.4,
    },
    {
      title: "Client-Centric Approach",
      icon: <FaHeart />,
      color: "#43e97b",
      delay: 0.6,
    },
  ];

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      speed: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-abacus" ref={sectionRef}>
      {/* Hero-style background */}
      <div className="why-background">
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

      <div className="why-container">
        <div className={`why-header ${isVisible ? "visible" : ""}`}>
          <h2>Why Abacus Spaces?</h2>
          <p>
            Our Excellence in every Transaction to your Success with every Partnership
          </p>
        </div>

        <div className={`why-grid ${isVisible ? "visible" : ""}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="why-item"
              style={{
                "--feature-color": feature.color,
                "--delay": `${feature.delay}s`,
              }}
            >
              <div className="why-icon-wrapper">
                <div className="icon-background"></div>
                <div className="why-icon">{feature.icon}</div>
                <div className="icon-ripple"></div>
              </div>
              <div className="why-content">
                <h3>{feature.title}</h3>
              </div>
              <div className="why-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAbacus;
