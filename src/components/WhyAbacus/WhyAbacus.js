import React, { useEffect, useState, useRef } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import {
  FaMapMarkerAlt,
  FaHandshake,
  FaHeart,
  FaChartLine,
} from "react-icons/fa";
import "./WhyAbacus.css";

const WhyAbacus = () => {
  const [animatedPillars, setAnimatedPillars] = useState([]);
  const [animatedLines, setAnimatedLines] = useState([]);
  const sectionRef = useRef(null);

  const features = [
    {
      title: "Fast Closures",
      description: "Quick & efficient transactions",
      icon: <BsLightningChargeFill />,
    },
    {
      title: "Local Insights",
      description: "Deep market knowledge",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "Trusted Partners",
      description: "Building relationships",
      icon: <FaHandshake />,
    },
    {
      title: "Client-Centric",
      description: "Your success matters",
      icon: <FaHeart />,
    },
    {
      title: "Market Excellence",
      description: "Leading performance",
      icon: <FaChartLine />,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && animatedPillars.length === 0) {
            animateSequence();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animatedPillars]);

  const animateSequence = () => {
    features.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedPillars((prev) => [...prev, index]);
        
        if (index < features.length - 1) {
          setTimeout(() => {
            setAnimatedLines((prev) => [...prev, index]);
          }, 600);
        }
      }, index * 1200);
    });
  };

  return (
    <section className="why-abacus" ref={sectionRef}>
      <div className="why-container">
        <div className="why-header">
          <span className="why-badge">
            <BsLightningChargeFill />
            Excellence in Real Estate
          </span>
          <h2>Why Choose Abacus Spaces</h2>
        </div>

        <div className="pillars-section">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              {/* Pillar */}
              <div
                className={`pillar-item ${
                  animatedPillars.includes(index) ? "animate-in" : ""
                }`}
              >
                <div className="pillar-column">
                  <div className="pillar-top"></div>
                  <div className="pillar-body">
                    <div className="pillar-icon">{feature.icon}</div>
                    <h3 className="pillar-title">{feature.title}</h3>
                    <p className="pillar-description">{feature.description}</p>
                  </div>
                  <div className="pillar-bottom"></div>
                </div>
              </div>

              {/* Connecting Line */}
              {index < features.length - 1 && (
                <div
                  className={`connecting-line ${
                    animatedLines.includes(index) ? "animate-line" : ""
                  }`}
                >
                  <div className="line-inner"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAbacus;