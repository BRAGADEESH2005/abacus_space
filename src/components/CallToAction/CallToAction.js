import React, { useState, useEffect, useRef } from "react";
import {
  FaArrowRight,
  FaBuilding,
  FaHandshake,
  FaUsers,
} from "react-icons/fa";
import { MdCall, MdLocationOn } from "react-icons/md";
import "./CallToAction.css";

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Create floating particles - same as TrustedBy
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cta-section" ref={sectionRef}>
      {/* Hero Background with Animated Orbs - Same as TrustedBy */}
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

      <div className="cta-container">
        {/* Main Content */}
        <div className={`cta-content ${isVisible ? "cta-visible" : ""}`}>
          {/* Badge */}
          <div className="cta-badge">
            <FaHandshake />
            <span>Ready to Get Started?</span>
          </div>

          {/* Main Headline */}
          <h1 className="cta-headline">Looking to Expand Your Business?</h1>

          {/* Supporting Text */}
          <p className="cta-description">
            Connect with our expert team to find the perfect commercial space
            that matches your Needs, we’ll cater to it !
          </p>

          {/* Action Buttons */}
          <div className="cta-buttons">
            <button className="cta-btn cta-primary">
              <MdCall className="btn-icon" />
              <span>Talk to Us</span>
              <FaArrowRight className="btn-arrow" />
            </button>

            <button className="cta-btn cta-secondary">
              <FaBuilding className="btn-icon" />
              <span>View Properties</span>
              <FaArrowRight className="btn-arrow" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="cta-stats">
            <div className="cta-stat">
              <div className="cta-stat-icon">
                <FaBuilding />
              </div>
              <div className="cta-stat-content">
                <span className="cta-stat-number">500+</span>
                <span className="cta-stat-label">Properties</span>
              </div>
            </div>

            <div className="cta-stat">
              <div className="cta-stat-icon">
                <FaUsers />
              </div>
              <div className="cta-stat-content">
                <span className="cta-stat-number">150+</span>
                <span className="cta-stat-label">Happy Clients</span>
              </div>
            </div>

            <div className="cta-stat">
              <div className="cta-stat-icon">
                <MdLocationOn />
              </div>
              <div className="cta-stat-content">
                <span className="cta-stat-number">12+</span>
                <span className="cta-stat-label">Cities</span>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
