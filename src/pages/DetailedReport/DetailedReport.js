import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendar,
  FaUser,
  FaEye,
  FaTag,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";
import "./DetailedReport.css";

const DetailedReport = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedContent, setRelatedContent] = useState([]);

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  useEffect(() => {
    fetchContentBySlug();
  }, [slug]);

  useEffect(() => {
    if (content) {
      fetchRelatedContent();
    }
  }, [content]);

  const fetchContentBySlug = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/content/slug/${slug}`);
      if (response.data.success) {
        setContent(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedContent = async () => {
    try {
      const response = await api.get("/content", {
        params: {
          type: content.type,
          status: "Published",
          limit: 3,
        },
      });
      if (response.data.success) {
        // Filter out current content
        const filtered = response.data.data.filter(
          (item) => item._id !== content._id,
        );
        setRelatedContent(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching related content:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRelatedClick = (relatedSlug) => {
    navigate(`/content/${relatedSlug}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="detailed-report-loading">
        <div className="loading-spinner"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="detailed-report-error">
        <h2>Content Not Found</h2>
        <p>The content you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="detailed-report-page">
      {/* Hero Section */}
      <div className="report-hero">
        <div className="report-hero-overlay">
          <div className="report-hero-content">
            <span className="report-type-badge">{content.type}</span>
            <h1 className="report-title">{content.title}</h1>
            <div className="report-meta">
              <span className="meta-item">
                <FaCalendar /> {formatDate(content.date)}
              </span>
              <span className="meta-divider">•</span>
              <span className="meta-item">
                <FaUser /> {content.author}
              </span>
              <span className="meta-divider">•</span>
              <span className="meta-item">
                <FaEye /> {content.views} views
              </span>
            </div>
          </div>
        </div>
        {content.image?.url && (
          <img
            src={content.image.url}
            alt={content.title}
            className="report-hero-image"
          />
        )}
      </div>

      {/* Main Content */}
      <div className="report-container">
        <div className="report-main-content">
          {/* Tags */}
          {content.tags && content.tags.length > 0 && (
            <div className="report-tags">
              <FaTag className="tag-icon" />
              {content.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Sector Badge */}
          {content.sector && (
            <div className="report-sector">
              <strong>Sector:</strong> {content.sector}
            </div>
          )}
          {/* Text Content */}
          {/* Text Content */}
          <div
            className="report-text-content"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
          >
            {content.text}
          </div>
          {/* Download Section
          <div className="report-download-section">
            <button className="download-report-btn">
              <FaDownload /> Download Full Report
            </button>
          </div> */}
        </div>

        {/* Sidebar - Related Content */}
        {relatedContent.length > 0 && (
          <aside className="report-sidebar">
            <h3 className="sidebar-title">Related Content</h3>
            <div className="related-content-list">
              {relatedContent.map((item) => (
                <div
                  key={item._id}
                  className="related-content-card"
                  onClick={() => handleRelatedClick(item.slug)}
                >
                  {item.image?.url && (
                    <img
                      src={item.image.url}
                      alt={item.title}
                      className="related-card-image"
                    />
                  )}
                  <div className="related-card-content">
                    <span className="related-card-type">{item.type}</span>
                    <h4 className="related-card-title">{item.title}</h4>
                    <span className="related-card-date">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default DetailedReport;
