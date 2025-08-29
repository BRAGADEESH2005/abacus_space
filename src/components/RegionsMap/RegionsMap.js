import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCity,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { MdLocationOn, MdBusiness } from "react-icons/md";
import { BsShop } from "react-icons/bs";
import "leaflet/dist/leaflet.css";
import "./RegionsMap.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const RegionsMap = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({});
  const sectionRef = useRef(null);

  const regions = [
    {
      id: "tamil-nadu",
      name: "Tamil Nadu",
      capital: "Chennai",
      properties: 150,
      offices: 85,
      retail: 65,
      color: "#667eea",
      position: [13.0827, 80.2707],
      description:
        "Leading commercial hub with major IT parks and world-class retail centers",
      cities: ["Chennai", "Coimbatore", "Madurai", "Salem"],
      growth: "+25%",
      avgPrice: "₹8,500/sq ft",
      totalArea: "2.5M sq ft",
      phone: "+91 44 1234 5678",
      email: "chennai@abacusspaces.com",
    },
    {
      id: "kerala",
      name: "Kerala",
      capital: "Thiruvananthapuram",
      properties: 95,
      offices: 50,
      retail: 45,
      color: "#f093fb",
      position: [10.8505, 76.2711],
      description:
        "Emerging business ecosystem with sustainable commercial developments",
      cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
      growth: "+18%",
      avgPrice: "₹6,200/sq ft",
      totalArea: "1.8M sq ft",
      phone: "+91 484 9876 5432",
      email: "kerala@abacusspaces.com",
    },
    {
      id: "karnataka",
      name: "Karnataka",
      capital: "Bangalore",
      properties: 200,
      offices: 120,
      retail: 80,
      color: "#4facfe",
      position: [12.9716, 77.5946],
      description:
        "Silicon Valley of India with premium office spaces and luxury retail",
      cities: ["Bangalore", "Mysore", "Mangalore", "Hubli"],
      growth: "+32%",
      avgPrice: "₹12,800/sq ft",
      totalArea: "4.2M sq ft",
      phone: "+91 80 5555 7777",
      email: "bangalore@abacusspaces.com",
    },
    {
      id: "andhra-pradesh",
      name: "Andhra Pradesh",
      capital: "Amaravati",
      properties: 120,
      offices: 70,
      retail: 50,
      color: "#43e97b",
      position: [15.9129, 79.74],
      description:
        "Rapidly expanding commercial infrastructure with government support",
      cities: ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur"],
      growth: "+22%",
      avgPrice: "₹5,800/sq ft",
      totalArea: "2.1M sq ft",
      phone: "+91 891 3333 4444",
      email: "andhra@abacusspaces.com",
    },
  ];

  const totalStats = {
    properties: regions.reduce((sum, region) => sum + region.properties, 0),
    offices: regions.reduce((sum, region) => sum + region.offices, 0),
    retail: regions.reduce((sum, region) => sum + region.retail, 0),
    cities: regions.length,
  };

  // Create custom building icon for markers
  const createCustomIcon = (color) => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background: ${color};
          width: 35px;
          height: 35px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
          transform: rotate(-45deg);
          cursor: pointer;
        ">
          <span style="transform: rotate(45deg);">🏢</span>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 35],
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            animateNumbers();
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

  const animateNumbers = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      const progress = currentStep / steps;
      const easeProgress = easeOutCubic(progress);

      setAnimatedStats({
        properties: Math.floor(totalStats.properties * easeProgress),
        offices: Math.floor(totalStats.offices * easeProgress),
        retail: Math.floor(totalStats.retail * easeProgress),
        cities: Math.floor(totalStats.cities * easeProgress),
      });

      currentStep++;
      if (currentStep > steps) {
        clearInterval(interval);
        setAnimatedStats(totalStats);
      }
    }, stepDuration);
  };

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  return (
    <section className="regions-section" ref={sectionRef}>
      <div className="regions-container">
        {/* Compact Header */}
        <div className={`regions-header ${isVisible ? "regions-visible" : ""}`}>
          <div className="regions-badge">
            <FaMapMarkerAlt className="regions-badge-icon" />
            <span>Our Presence</span>
          </div>
          <h1>South India Coverage</h1>
          <p>Strategically positioned across major commercial hubs</p>
        </div>

        {/* Compact Stats */}
        <div
          className={`regions-stats-compact ${
            isVisible ? "regions-visible" : ""
          }`}
        >
          <div className="regions-stat-item">
            <div className="regions-stat-icon">
              <FaBuilding />
            </div>
            <div className="regions-stat-content">
              <span className="regions-stat-number">
                {animatedStats.properties || 0}+
              </span>
              <span className="regions-stat-label">Retail Spaces</span>
            </div>
          </div>

          <div className="regions-stat-item">
            <div className="regions-stat-icon">
              <MdBusiness />
            </div>
            <div className="regions-stat-content">
              <span className="regions-stat-number">
                {animatedStats.offices || 0}+
              </span>
              <span className="regions-stat-label">Office Spaces</span>
            </div>
          </div>

          <div className="regions-stat-item">
            <div className="regions-stat-icon">
              <BsShop />
            </div>
            <div className="regions-stat-content">
              <span className="regions-stat-number">
                {animatedStats.retail || 0}+
              </span>
              <span className="regions-stat-label">Co-Working Spaces</span>
            </div>
          </div>

          <div className="regions-stat-item">
            <div className="regions-stat-icon">
              <FaCity />
            </div>
            <div className="regions-stat-content">
              <span className="regions-stat-number">
                {animatedStats.cities || 0}
              </span>
              <span className="regions-stat-label">States</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div
          className={`regions-main-content ${
            isVisible ? "regions-visible" : ""
          }`}
        >
          {/* Interactive Map */}
          <div className="regions-map-container">
            <div className="regions-map-header">
              <h3>Interactive Map</h3>
              <div className="regions-map-legend">
                {regions.map((region) => (
                  <div key={region.id} className="regions-legend-item">
                    <div
                      className="regions-legend-dot"
                      style={{ background: region.color }}
                    ></div>
                    <span>{region.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="regions-map-wrapper">
              <MapContainer
                center={[12.5, 78]}
                zoom={6}
                className="regions-leaflet-map"
                scrollWheelZoom={true}
                attributionControl={false}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution=""
                />

                {regions.map((region) => (
                  <Marker
                    key={region.id}
                    position={region.position}
                    icon={createCustomIcon(region.color)}
                    eventHandlers={{
                      click: () => setActiveRegion(region.id),
                    }}
                  >
                    <Popup className="regions-custom-popup">
                      <div className="regions-popup-content">
                        <h4 style={{ color: region.color }}>{region.name}</h4>
                        <p>{region.capital}</p>
                        <div className="regions-popup-stats">
                          <span>
                            <FaBuilding /> {region.offices} Offices
                          </span>
                          <span>
                            <BsShop /> {region.retail} Retail
                          </span>
                        </div>
                        <div className="regions-popup-price">
                          <strong>{region.avgPrice}</strong>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Region Cards */}
          <div className="regions-cards-container">
            <h3>Region Details</h3>
            <div className="regions-cards-list">
              {regions.map((region, index) => (
                <div
                  key={region.id}
                  className={`regions-card ${
                    activeRegion === region.id ? "regions-active" : ""
                  }`}
                  style={{
                    "--region-color": region.color,
                    animationDelay: `${index * 0.1}s`,
                  }}
                  onClick={() =>
                    setActiveRegion(
                      activeRegion === region.id ? null : region.id
                    )
                  }
                >
                  <div className="regions-card-header">
                    <div className="regions-card-icon">
                      <MdLocationOn />
                    </div>
                    <div className="regions-card-info">
                      <h4>{region.name}</h4>
                      <p>{region.capital}</p>
                    </div>
                    <div className="regions-card-growth">
                      <span>{region.growth}</span>
                    </div>
                  </div>

                  <div className="regions-card-stats">
                    <div className="regions-card-stat">
                      <FaBuilding />
                      <span>{region.offices} Offices</span>
                    </div>
                    <div className="regions-card-stat">
                      <BsShop />
                      <span>{region.retail} Retail</span>
                    </div>
                  </div>

                  <div className="regions-card-price">
                    <span>
                      Avg: <strong>{region.avgPrice}</strong>
                    </span>
                    <span>
                      Area: <strong>{region.totalArea}</strong>
                    </span>
                  </div>

                  {activeRegion === region.id && (
                    <div className="regions-card-expanded">
                      <p>{region.description}</p>

                      <div className="regions-cities">
                        <span className="regions-cities-label">
                          Major Cities:
                        </span>
                        <div className="regions-cities-tags">
                          {region.cities.map((city, idx) => (
                            <span key={idx} className="regions-city-tag">
                              {city}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="regions-contact">
                        <div className="regions-contact-item">
                          <FaPhone />
                          <span>{region.phone}</span>
                        </div>
                        <div className="regions-contact-item">
                          <FaEnvelope />
                          <span>{region.email}</span>
                        </div>
                      </div>

                      <button className="regions-view-btn">
                        <span>View Properties</span>
                        <FaArrowRight />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegionsMap;
