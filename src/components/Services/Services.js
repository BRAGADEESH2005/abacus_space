import React, { useEffect, useState, useRef } from 'react';
import { HiOfficeBuilding } from 'react-icons/hi';
import { FaStore, FaUsers, FaArrowRight } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import './Services.css';

const Services = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef(null);

  const services = [
    {
      title: "Office Space",
      description: "Find and secure the ideal office space based on team size, location preference, and growth plans.",
      icon: <HiOfficeBuilding />,
      color: "#667eea",
      delay: 0
    },
    {
      title: "Retail Space",
      description: "Prime retail locations that maximize visibility, footfall, and sales, with end-to-end landlord negotiations.",
      icon: <FaStore />,
      color: "#f093fb",
      delay: 200
    },
    {
      title: "Co-Working Spaces",
      description: "Fully managed, ready-to-use flexible spaces that enable hassle-free plug-and-play operations.",
      icon: <FaUsers />,
      color: "#4facfe",
      delay: 400
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            
            if (target.classList.contains('services-header')) {
              setTimeout(() => setHeaderVisible(true), 100);
            }
            
            if (target.classList.contains('service-card')) {
              const index = parseInt(target.getAttribute('data-index'));
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, services[index].delay);
            }
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = sectionRef.current?.querySelectorAll('.observe-animation');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="services" ref={sectionRef}>
      <div className="services-container">
        <div className={`services-header observe-animation ${headerVisible ? 'header-visible' : ''}`}>
          <div className="header-badge">
            <MdBusinessCenter className="badge-icon" />
            <span>Our Services</span>
          </div>
          <h2>What We Do</h2>
          <p>Services that drive your business forward</p>
          <div className="header-underline">
            <div className="underline-animated"></div>
          </div>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`service-card observe-animation ${visibleCards.includes(index) ? 'visible' : ''}`}
              style={{ '--service-color': service.color }}
            >
              <div className="card-glow"></div>
              <div className="service-icon-wrapper">
                <div className="icon-background"></div>
                <div className="service-icon">{service.icon}</div>
                <div className="icon-ripple"></div>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <div className="card-footer">
                <button className="learn-more-btn">
                  <span>Learn More</span>
                  <FaArrowRight className="arrow-icon" />
                </button>
              </div>
              <div className="service-hover-effect"></div>
              <div className="floating-particles">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;