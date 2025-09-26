import React, { useState, useEffect, useRef } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import "./TrustedBy.css";

const TrustedBy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [particles, setParticles] = useState([]);
  const sectionRef = useRef(null);

  // Complete testimonials data including Ramneek Khurana
  const testimonials = [
    {
      quote:
        "Abacus helped us find the perfect office space in Gurgaon. Their team understood our requirements and delivered exceptional results within our timeline and budget.",
      author: "Ramneek Khurana",
      position: "Co-founder & CEO",
      company: "Lenskart",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    },
    {
      quote:
        "Professional service and deep market knowledge. They secured us an excellent retail location in Mumbai with favorable lease terms.",
      author: "Priya Sharma",
      position: "Head of Operations",
      company: "FreshMart Retail",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&auto=format",
    },
    {
      quote:
        "Outstanding support in finding our co-working space solution. Abacus made the entire process seamless and stress-free.",
      author: "Arjun Mehta",
      position: "Founder",
      company: "TechStart Solutions",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
    },
  ];

  // Client logos data
  const clients = [
    {
      name: "Lenskart",
      sector: "E-commerce",
      logo: "https://tse1.mm.bing.net/th/id/OIP.IXIzDvLoAGCriB-eu8Dp5gHaGL?w=210&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
    },
    {
      name: "FreshMart",
      sector: "Retail",
      logo: "https://tse3.mm.bing.net/th/id/OIP.It--2QHaTWr8Zwm7ywFLtwAAAA?w=165&h=176&c=7&r=0&o=7&pid=1.7&rm=3",
    },
    {
      name: "TechStart",
      sector: "Technology",
      logo: "https://tse3.mm.bing.net/th/id/OIP.B8yIjlnsFx1QAyb9lrNsfQAAAA?w=149&h=150&c=7&r=0&o=7&pid=1.7&rm=3",
    },
    {
      name: "GrowthCorp",
      sector: "Consulting",
      logo: "https://tse1.mm.bing.net/th/id/OIP.mKKjuY2xp6qzAeskCxSlngHaEc?w=258&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
    },
  ];

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 3 + 2,
      delay: Math.random() * 3,
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="trusted-by-section" ref={sectionRef}>
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
              animationDuration: `${particle.speed + 2}s`,
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
            <span>Trusted Partners</span>
          </div>
          <h2>What Our Clients Say</h2>
          <p>Real experiences from satisfied customers</p>
        </div>

        {/* Main Content */}
        <div
          className={`trusted-by-main ${isVisible ? "trusted-by-visible" : ""}`}
        >
          {/* Left Side - Testimonials */}
          <div className="trusted-by-left">
            <div className="trusted-by-testimonial">
              <div className="trusted-by-testimonial-content">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`trusted-by-testimonial-card ${
                      index === currentSlide ? "trusted-by-active" : ""
                    }`}
                  >
                    <div className="trusted-by-testimonial-inner">
                      {/* Header with Quote Icon and Author Image */}
                      <div className="trusted-by-testimonial-header">
                        <FaQuoteLeft className="trusted-by-quote-icon" />
                        <div className="trusted-by-author-image">
                          <img
                            src={testimonial.image}
                            alt={testimonial.author}
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Quote */}
                      <div className="trusted-by-quote">
                        "{testimonial.quote}"
                      </div>

                      {/* Footer with Author Info and Rating */}
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
                          {Array.from(
                            { length: testimonial.rating },
                            (_, i) => (
                              <FaStar key={i} />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots Navigation */}
              <div className="trusted-by-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`trusted-by-dot ${
                      index === currentSlide ? "trusted-by-active" : ""
                    }`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Client Logos */}
          <div className="trusted-by-right">
            <h3>Trusted by Leading Companies</h3>
            <div className="trusted-by-logos">
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="trusted-by-logo-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="trusted-by-logo-container">
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      loading="lazy"
                    />
                  </div>
                  <div className="trusted-by-logo-info">
                    <h4>{client.name}</h4>
                    <p>{client.sector}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
