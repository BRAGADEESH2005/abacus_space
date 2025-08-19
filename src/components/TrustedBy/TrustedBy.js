import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaQuoteLeft, FaHandshake } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import "./TrustedBy.css";

const TrustedBy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);

  // Simplified client data
  const clients = [
    {
      id: 1,
      name: "Lenskart",
      logo: "https://tse3.mm.bing.net/th/id/OIP.PMnVKPwXasPphI_UTa2MQwHaHa?w=171&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
      industry: "Retail",
    },
    {
      id: 2,
      name: "Flipkart",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png",
      industry: "E-commerce",
    },
    {
      id: 3,
      name: "Microsoft",
      logo: "https://tse1.mm.bing.net/th/id/OIP.g-qzb46-Ic0JYI6nPZVSOgHaCu?w=350&h=128&c=7&r=0&o=7&pid=1.7&rm=3",
      industry: "Technology",
    },
    {
      id: 4,
      name: "Swiggy",
      logo: "https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Logo.png",
      industry: "Food Tech",
    },
  ];

  const testimonials = [
    {
      id: 1,
      quote:
        "Strategic locations helped us achieve 300% growth with perfect market positioning.",
      author: "Ramneek Khurana",
      position: "Co-founder & CEO",
      company: "Lenskart",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
    },
    {
      id: 2,
      quote:
        "Perfect warehouse solutions that scaled with our rapid logistics expansion needs.",
      author: "Kalyan K.",
      position: "CEO",
      company: "Flipkart",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
    },
  ];

  useEffect(() => {
    // Create floating particles - same as Hero
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="trusted-by-section" ref={sectionRef}>
      {/* Hero Background with Animated Orbs */}
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

      <div className="trusted-by-container">
        {/* Header */}
        <div
          className={`trusted-by-header ${
            isVisible ? "trusted-by-visible" : ""
          }`}
        >
          <div className="trusted-by-badge">
            <MdVerified />
            <span>Trusted Partnership</span>
          </div>
          <h2>Trusted by Industry Leaders</h2>
          <p>
            Join 150+ successful companies who chose us for their real estate
            needs
          </p>
        </div>

        {/* Main Content Grid */}
        <div
          className={`trusted-by-main ${isVisible ? "trusted-by-visible" : ""}`}
        >
          {/* Left: Testimonial */}
          <div className="trusted-by-left">
            <div className="trusted-by-testimonial">
              <div className="trusted-by-testimonial-content">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className={`trusted-by-testimonial-card ${
                      index === currentSlide ? "trusted-by-active" : ""
                    }`}
                  >
                    <div className="trusted-by-testimonial-inner">
                      <div className="trusted-by-testimonial-header">
                        <FaQuoteLeft className="trusted-by-quote-icon" />
                        <div className="trusted-by-author-image">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                          />
                        </div>
                      </div>

                      <p className="trusted-by-quote">"{testimonial.quote}"</p>

                      <div className="trusted-by-testimonial-footer">
                        <div className="trusted-by-author">
                          <h4>{testimonial.author}</h4>
                          <span className="trusted-by-position">
                            {testimonial.position}
                          </span>
                          <span className="trusted-by-company">
                            {testimonial.company}
                          </span>
                        </div>
                        <div className="trusted-by-rating">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="trusted-by-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`trusted-by-dot ${
                      index === currentSlide ? "trusted-by-active" : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Client Logos */}
          <div className="trusted-by-right">
            <h3>Our Esteemed Clients</h3>
            <div className="trusted-by-logos">
              {clients.map((client, index) => (
                <div
                  key={client.id}
                  className="trusted-by-logo-card"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="trusted-by-logo-container">
                    <img src={client.logo} alt={client.name} />
                  </div>
                  <div className="trusted-by-logo-info">
                    <h4>{client.name}</h4>
                    <p>{client.industry}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="trusted-by-cta-btn">
              <span>Partner With Us</span>
              <FaHandshake className="button-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
