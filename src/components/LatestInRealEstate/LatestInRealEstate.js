import React, { useRef, useState, useEffect } from "react";
import { FaDownload, FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./LatestInRealEstate.css";

const LatestInRealEstate = () => {
  const [activeTab, setActiveTab] = useState("research");
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollInterval = useRef(null);

  // Dummy data for Research
  const researchData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500",
      date: "Mar 2026",
      category: "Market Analysis",
      title: "Q1 2026 Real Estate Market Trends and Investment Opportunities",
      downloadUrl: "#",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
      date: "Feb 2026",
      category: "Commercial Real Estate",
      title: "The Future of Office Spaces in Post-Pandemic Era",
      downloadUrl: "#",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
      date: "Jan 2026",
      category: "Residential Market",
      title: "Affordable Housing Development: Challenges and Solutions",
      downloadUrl: "#",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500",
      date: "Dec 2025",
      category: "Investment Report",
      title: "2025 Year-End Real Estate Investment Performance Review",
      downloadUrl: "#",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500",
      date: "Nov 2025",
      category: "Technology",
      title: "PropTech Revolution: How Technology is Transforming Real Estate",
      downloadUrl: "#",
    },
  ];

  // Dummy data for Blog
  const blogData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500",
      date: "Mar 2026",
      category: "Property Tips",
      title: "10 Essential Tips for First-Time Home Buyers in 2026",
      downloadUrl: "#",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=500",
      date: "Feb 2026",
      category: "Interior Design",
      title: "Sustainable Interior Design Trends for Modern Homes",
      downloadUrl: "#",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=500",
      date: "Feb 2026",
      category: "Property Management",
      title: "Effective Property Management Strategies for Landlords",
      downloadUrl: "#",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
      date: "Jan 2026",
      category: "Home Improvement",
      title: "Renovations That Add Value to Your Property",
      downloadUrl: "#",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=500",
      date: "Jan 2026",
      category: "Lifestyle",
      title: "Creating the Perfect Home Office Space",
      downloadUrl: "#",
    },
  ];

  // Dummy data for Updates
  const updatesData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500",
      date: "Mar 2026",
      category: "Policy Update",
      title: "New Real Estate Regulations: What Property Owners Need to Know",
      downloadUrl: "#",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551135049-22a0e2e8e69d?w=500",
      date: "Mar 2026",
      category: "Market News",
      title: "Commercial Property Prices Rise 15% in Major Metropolitan Areas",
      downloadUrl: "#",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500",
      date: "Feb 2026",
      category: "Industry News",
      title: "Green Building Certifications Become Mandatory for New Constructions",
      downloadUrl: "#",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1560221328-12fe60f83ab8?w=500",
      date: "Feb 2026",
      category: "Economic Impact",
      title: "Interest Rate Changes and Their Impact on Real Estate Market",
      downloadUrl: "#",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=500",
      date: "Jan 2026",
      category: "Development",
      title: "Major Infrastructure Projects Boosting Property Values",
      downloadUrl: "#",
    },
  ];

  const getActiveData = () => {
    switch (activeTab) {
      case "research":
        return researchData;
      case "blog":
        return blogData;
      case "updates":
        return updatesData;
      default:
        return researchData;
    }
  };

  // Auto scroll effect
  useEffect(() => {
    if (isAutoScrolling && scrollRef.current) {
      autoScrollInterval.current = setInterval(() => {
        if (scrollRef.current) {
          const container = scrollRef.current;
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          
          if (container.scrollLeft >= maxScrollLeft - 1) {
            // Reset to beginning when reaching the end
            container.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            // Scroll by 1 pixel for smooth effect
            container.scrollLeft += 1;
          }
        }
      }, 30); // Adjust speed: lower = faster, higher = slower
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isAutoScrolling, activeTab]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

  // Resume auto-scroll on mouse leave
  const handleMouseLeave = () => {
    setIsAutoScrolling(true);
  };

  const scroll = (direction) => {
    setIsAutoScrolling(false);
    const scrollAmount = 400;
    if (scrollRef.current) {
      const scrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
    // Resume auto-scroll after 3 seconds
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  const handleViewAll = () => {
    navigate("/insights-reports");
  };

  const renderCard = (item) => (
    <div key={item.id} className="estate-card">
      <div className="estate-card-image">
        <img src={item.image} alt={item.title} />
        <div className="estate-card-overlay">
          <a
            href={item.downloadUrl}
            className="download-btn"
            download
            onClick={(e) => e.preventDefault()}
          >
            <FaDownload />
            <span>Download</span>
          </a>
        </div>
      </div>
      <div className="estate-card-content">
        <div className="estate-card-meta">
          <span className="estate-card-date">{item.date}</span>
          <span className="estate-card-divider">•</span>
          <span className="estate-card-category">{item.category}</span>
        </div>
        <h3 className="estate-card-title">{item.title}</h3>
      </div>
    </div>
  );

  return (
    <div className="latest-estate-section">
      <div className="estate-container">
        <h2 className="estate-main-title">Latest in Real Estate</h2>

        {/* Tabs Navigation */}
        <div className="estate-tabs">
          <button
            className={`estate-tab ${activeTab === "research" ? "active" : ""}`}
            onClick={() => setActiveTab("research")}
          >
            Research
          </button>
          <button
            className={`estate-tab ${activeTab === "blog" ? "active" : ""}`}
            onClick={() => setActiveTab("blog")}
          >
            Blog
          </button>
          <button
            className={`estate-tab ${activeTab === "updates" ? "active" : ""}`}
            onClick={() => setActiveTab("updates")}
          >
            Updates
          </button>
        </div>

        {/* Content Section */}
        <div className="estate-content-wrapper">
          <button
            className="estate-scroll-btn estate-scroll-btn-left"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <FaChevronLeft />
          </button>

          <div 
            className="estate-cards-container" 
            ref={scrollRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {getActiveData().map(renderCard)}
          </div>

          <button
            className="estate-scroll-btn estate-scroll-btn-right"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <FaChevronRight />
          </button>
        </div>

        {/* View All Button */}
        <div className="estate-view-all-wrapper">
          <button className="estate-view-all-btn" onClick={handleViewAll}>
            <span>View All Reports</span>
            <FaArrowRight className="view-all-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestInRealEstate;