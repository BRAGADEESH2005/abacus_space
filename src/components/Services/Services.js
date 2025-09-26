import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOfficeBuilding } from 'react-icons/hi';
import { FaStore, FaUsers, FaArrowRight } from 'react-icons/fa';
import './Services.css';

const Services = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const services = useMemo(() => [
    {
      title: "Office Space",
      description: "Find and secure the ideal office space based on team size, location preference, and growth plans.",
      icon: <HiOfficeBuilding />,
      color: "#23c6a4",
      delay: 0,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format",
      features: ["Prime Locations", "Flexible Terms", "End-to-End Support"]
    },
    {
      title: "Retail Space",
      description: "Prime retail locations that maximize visibility, footfall, and sales, with end-to-end landlord negotiations.",
      icon: <FaStore />,
      color: "#1a2f5c",
      delay: 200,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format",
      features: ["High Footfall Areas", "Competitive Rates", "Marketing Support"]
    },
    {
      title: "Co-Working Spaces",
      description: "Fully managed, ready-to-use flexible spaces that enable hassle-free plug-and-play operations.",
      icon: <FaUsers />,
      color: "#4fd1c7",
      delay: 400,
      image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop&auto=format",
      features: ["Plug & Play", "Community Access", "Flexible Memberships"]
    }
  ], []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            
            if (target.classList.contains('services-header')) {
              setTimeout(() => setHeaderVisible(true), 100);
            }
            
            if (target.classList.contains('services-card')) {
              const index = parseInt(target.getAttribute('data-index'));
              if (index < services.length) {
                setTimeout(() => {
                  setVisibleCards(prev => [...prev, index]);
                }, services[index].delay);
              }
            }
          }
        });
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = sectionRef.current?.querySelectorAll('.services-observe-animation');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [services]);

  const handleExploreMore = () => {
    navigate('/listings');
  };

  return (
    <section className="services" ref={sectionRef}>
      <div className="services-container">
        <div className={`services-header services-observe-animation ${headerVisible ? 'services-header-visible' : ''}`}>
         
          <h2>What We Do</h2>
          <p>Services that drive your business forward</p>
          <div className="services-header-underline">
            <div className="services-underline-animated"></div>
          </div>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`services-card services-observe-animation ${visibleCards.includes(index) ? 'services-visible' : ''}`}
              style={{ '--service-color': service.color }}
            >
              <div className="services-card-glow"></div>
              
              {/* Service Image */}
              <div className="services-image-wrapper">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="services-image"
                  loading="lazy"
                />
                <div className="services-image-overlay"></div>
                <div className="services-icon-wrapper">
                  <div className="services-icon-background"></div>
                  <div className="services-icon">{service.icon}</div>
                  <div className="services-icon-ripple"></div>
                </div>
              </div>

              {/* Service Content */}
              <div className="services-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                
                {/* Service Features */}
                <div className="services-features">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="services-feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="services-card-footer">
                  <button className="services-learn-more-btn" onClick={handleExploreMore}>
                    <span>Explore More</span>
                    <FaArrowRight className="services-arrow-icon" />
                  </button>
                </div>
              </div>
              
              <div className="services-hover-effect"></div>
              <div className="services-floating-particles">
                <div className="services-particle services-particle-1"></div>
                <div className="services-particle services-particle-2"></div>
                <div className="services-particle services-particle-3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;