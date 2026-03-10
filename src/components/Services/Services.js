import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStore,
  FaBuilding,
  FaHospital,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import "./Services.css";

const Services = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const services = useMemo(
    () => [
      {
        title: "Retail",
        subtitle:
          "Strategic commercial spaces designed to enhance brand visibility and drive customer engagement across diverse retail environments.",

        icon: <FaStore />,
        color: "#23c6a4",
        delay: 0,
        image:
          "https://i.pinimg.com/736x/1d/ea/bf/1deabf56ead86762ab1293481096adc8.jpg",
        features: [
          "Malls",
          "High Street Stores",
          "Experience Centres",
          "Restaurants & QSR Spaces",
        ],
      },
      {
        title: "Office",
        subtitle:
          "Innovative workspace solutions tailored for modern businesses, fostering productivity and collaboration in premium locations.",

        icon: <FaBuilding />,
        color: "#1a2f5c",
        delay: 200,
        image:
          "https://i.pinimg.com/1200x/94/52/14/94521417be896fbd8b5ed984da3ad244.jpg",
        features: [
          "GCC",
          "Co-Working & Flex Spaces",
          "Tech & SEZ Parks",
          "Standalone Office Space",
          "Research Centres",
        ],
      },
      {
        title: "Hospitality & Healthcare",
        subtitle:
          "Purpose-built facilities combining comfort, wellness, and care to create nurturing environments for living and healing.",

        icon: <FaHospital />,
        color: "#4fd1c7",
        delay: 400,
        image:
          "https://i.pinimg.com/1200x/5a/54/ff/5a54ff359b4ab9d4a8d986150554144a.jpg",
        features: [
          "Senior Living Homes",
          "Co Living Homes",
          "Pre Schools",
          "Clinics & Hospitals",
          "Rehabilitation Centers",
        ],
      },
    ],
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;

            if (target.classList.contains("services-header")) {
              setTimeout(() => setHeaderVisible(true), 100);
            }

            if (target.classList.contains("services-card")) {
              const index = parseInt(target.getAttribute("data-index"));
              if (index < services.length) {
                setTimeout(() => {
                  setVisibleCards((prev) => [...prev, index]);
                }, services[index].delay);
              }
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const elements = sectionRef.current?.querySelectorAll(
      ".services-observe-animation",
    );
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [services]);

  const handleExploreMore = () => {
    navigate("/listings");
  };

  return (
    <section className="services" ref={sectionRef}>
      <div className="services-container">
        <div
          className={`services-header services-observe-animation ${
            headerVisible ? "services-header-visible" : ""
          }`}
        >
          <h2>What We Do</h2>
          <p>Our Services to Drive your Business Forward</p>
          <div className="services-header-underline">
            <div className="services-underline-animated"></div>
          </div>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`services-card services-observe-animation ${
                visibleCards.includes(index) ? "services-visible" : ""
              }`}
              style={{ "--service-color": service.color }}
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
              </div>

              {/* Service Content - Always Visible (Bottom) */}
              <div className="services-content">
                <div className="services-preview">
                  <h3>{service.title}</h3>
                  <p className="services-subtitle">{service.subtitle}</p>
                </div>

                {/* Hidden Content - Slides Up on Hover */}
                <div className="services-detailed-content">
                  {/* <p className="services-description">{service.description}</p> */}

                  {/* Service Features - With Vertical Highlight Animation */}
                  <div className="services-features">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="services-feature-tag"
                        style={{ "--feature-index": idx }}
                      >
                        <FaCheckCircle className="services-feature-check-icon" />
                        <span className="services-feature-text">{feature}</span>
                        <div className="services-feature-highlight-bar"></div>
                      </span>
                    ))}
                  </div>

                  <div className="services-card-footer">
                    <button
                      className="services-learn-more-btn"
                      onClick={handleExploreMore}
                    >
                      <span>Explore More</span>
                      <FaArrowRight className="services-arrow-icon" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="services-hover-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
