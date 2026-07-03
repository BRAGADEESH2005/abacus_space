import React, { useRef, useState, useEffect } from "react";
import {
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LatestInRealEstate.css";

const LatestInRealEstate = () => {
  const [activeTab, setActiveTab] = useState("updates");
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const autoScrollInterval = useRef(null);
  const [allContentData, setAllContentData] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  // Fetch all content on initial load only
  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      const response = await api.get("/content", {
        params: {
          status: "Published",
          limit: 100, // Fetch more content to cover all tabs
          sort: "-date",
        },
      });

      if (response.data.success) {
        setAllContentData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setAllContentData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter content based on active tab
  const getFilteredContent = () => {
    if (!allContentData) return [];

    const contentTypeMap = {
      updates: "Industrial Update",
      research: "Research Report",
      blog: "Blog",
    };

    const selectedType = contentTypeMap[activeTab];
    return allContentData.filter((item) => item.type === selectedType);
  };

  const contentData = getFilteredContent();

  // Auto scroll effect
  useEffect(() => {
    if (isAutoScrolling && scrollRef.current && contentData.length > 0) {
      autoScrollInterval.current = setInterval(() => {
        if (scrollRef.current) {
          const container = scrollRef.current;
          const maxScrollLeft = container.scrollWidth - container.clientWidth;

          if (container.scrollLeft >= maxScrollLeft - 1) {
            container.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            container.scrollLeft += 1;
          }
        }
      }, 30);
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [isAutoScrolling, activeTab, contentData.length]);

  const handleMouseEnter = () => {
    setIsAutoScrolling(false);
  };

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
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  };

  const handleViewAll = () => {
    navigate("/insights-reports");
  };

  const handleCardClick = (slug) => {
    navigate(`/content/${slug}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const renderCard = (item) => (
    <div key={item._id} className="estate-card">
      <div className="estate-card-image">
        <img
          src={
            item.image?.url ||
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500"
          }
          alt={item.title}
        />
        <div className="estate-card-overlay">
          <button
            className="download-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(item.slug);
            }}
          >
            <FaDownload />
            <span>View Details</span>
          </button>
        </div>
      </div>
      <div
        className="estate-card-content"
        onClick={() => handleCardClick(item.slug)}
        style={{ cursor: "pointer" }}
      >
        <div className="estate-card-meta">
          <span className="estate-card-date">{formatDate(item.date)}</span>
          <span className="estate-card-divider">•</span>
          <span className="estate-card-category">
            {item.sector || item.type}
          </span>
        </div>
        <h3 className="estate-card-title">{item.title}</h3>
      </div>
    </div>
  );

  return (
    <div id="latest-estate" className="latest-estate-section">
      <div className="estate-container">
        <h2 className="estate-main-title">Latest in Real Estate</h2>

        {/* Tabs Navigation */}
        <div className="estate-tabs">
          <button
            className={`estate-tab ${activeTab === "updates" ? "active" : ""}`}
            onClick={() => setActiveTab("updates")}
          >
            Updates
          </button>
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

          {loading ? (
            <div className="estate-loading">
              <div className="estate-loader">
                <div className="estate-spinner"></div>
                <div className="estate-loading-text">
                  Loading content
                  <span className="estate-loading-dots">
                    <span className="estate-dot"></span>
                    <span className="estate-dot"></span>
                    <span className="estate-dot"></span>
                  </span>
                </div>
              </div>
            </div>
          ) : contentData.length === 0 ? (
            <div className="estate-no-content">No content available</div>
          ) : (
            <div
              className="estate-cards-container"
              ref={scrollRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {contentData.map(renderCard)}
            </div>
          )}

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
