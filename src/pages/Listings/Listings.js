import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaSearch,
  FaFilter,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaTimes,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import {
  MdSpaceDashboard,
  MdLocationCity,
  MdKeyboardArrowDown,
  MdEmail,
  MdPhone,
  MdPerson,
  MdBusiness,
} from "react-icons/md";
import { BiFilterAlt } from "react-icons/bi";
import { FaBuilding } from "react-icons/fa";
import "./Listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [listingViews, setListingViews] = useState({});
  const [isFiltering, setIsFiltering] = useState(false);

  // New states for report popup
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmissionSuccess, setReportSubmissionSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    company: "",
    designation: "",
    phone: "",
    email: "",
  });
  const [reportErrors, setReportErrors] = useState({});

  const sectionRef = useRef(null);
  const imageIntervals = useRef({});
  const popupRef = useRef(null);

  // Get base URL from environment variables
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

  // Configure axios instance
  const api = axios.create({
    baseURL: `${API_BASE_URL}`,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Generate random views from viewsRange
  const generateRandomViews = (viewsRange) => {
    if (!viewsRange || viewsRange.length !== 2) {
      return Math.floor(Math.random() * 200) + 100; // Default fallback
    }
    const [min, max] = viewsRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Fetch listings from backend
  const fetchListings = async (
    page = 1,
    filters = {},
    showFilterLoader = false
  ) => {
    try {
      if (showFilterLoader) {
        setIsFiltering(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const params = {
        page,
        limit: 50,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === "all") {
          delete params[key];
        }
      });

      const response = await api.get("/listings", { params });

      if (response.data.success) {
        console.log("Fetched listings----:", response.data.data);
        const listingsData = response.data.data;

        // Initialize image indexes and random views for new listings
        const initialIndexes = {};
        const initialViews = {};

        listingsData.forEach((listing) => {
          initialIndexes[listing._id] = 0;
          // Generate random views from the listing's viewsRange
          initialViews[listing._id] = generateRandomViews(listing.viewsRange);
        });

        setCurrentImageIndexes((prev) => ({ ...prev, ...initialIndexes }));
        setListingViews((prev) => ({ ...prev, ...initialViews }));

        setListings(listingsData);
        setFilteredListings(listingsData);
        setPagination(response.data.pagination);
        setCurrentPage(page);
      } else {
        throw new Error(response.data.message || "Failed to fetch listings");
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load properties"
      );
      setListings([]);
      setFilteredListings([]);
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  };

  // Fetch available locations
  const fetchLocations = async () => {
    try {
      const response = await api.get("/listings/locations");
      if (response.data.success) {
        setAvailableLocations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // Fetch available property types
  const fetchPropertyTypes = async () => {
    try {
      const response = await api.get("/listings/types");
      if (response.data.success) {
        setAvailableTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching property types:", error);
    }
  };

  // Handle Get Report button click
  const handleGetReport = (listing) => {
    setSelectedListing(listing);
    setShowReportPopup(true);
    setReportSubmissionSuccess(false);
    setReportErrors({});
    // Reset form
    setUserInfo({
      name: "",
      company: "",
      designation: "",
      phone: "",
      email: "",
    });
  };

  // Close popup
  const closeReportPopup = () => {
    setShowReportPopup(false);
    setSelectedListing(null);
    setReportSubmissionSuccess(false);
    setReportErrors({});
    setUserInfo({
      name: "",
      company: "",
      designation: "",
      phone: "",
      email: "",
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!userInfo.name.trim()) newErrors.name = "Name is required";
    if (!userInfo.company.trim())
      newErrors.company = "Company name is required";
    if (!userInfo.designation.trim())
      newErrors.designation = "Designation is required";
    if (!userInfo.phone.trim()) newErrors.phone = "Phone number is required";
    if (!userInfo.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(userInfo.email))
      newErrors.email = "Email is invalid";

    setReportErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit report request using existing backend API
  const submitReportRequest = async () => {
    if (!validateForm()) return;

    setIsSubmittingReport(true);
    setReportErrors({});

    try {
      // Prepare data in the format expected by the existing leads API
      const requestData = {
        userInfo,
        propertyDetails: {
          propertyId: selectedListing._id,
          propertyCode: selectedListing.propertyCode,
          title: selectedListing.title,
          location: selectedListing.location,
          area: selectedListing.area,
          price: selectedListing.price,
          type: selectedListing.type,
          features: selectedListing.features,
        },
        source: "propertyreport", // Different source to identify report requests
        requestType: "property_report",
      };

      console.log("Submitting report request:", requestData);

      const response = await api.post("/leads", requestData);

      if (response.data.success) {
        console.log(
          "Report request submitted successfully:",
          response.data.data
        );
        setReportSubmissionSuccess(true);

        // Auto-close popup after 3 seconds
        setTimeout(() => {
          closeReportPopup();
        }, 3000);
      } else {
        setReportErrors({
          submit: response.data.message || "Failed to submit request",
        });
      }
    } catch (error) {
      console.error("Error submitting report request:", error);

      let errorMessage = "Unable to connect to server. Please try again later.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage =
          "No response from server. Please check your internet connection.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      }

      setReportErrors({ submit: errorMessage });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closeReportPopup();
      }
    };

    if (showReportPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showReportPopup]);

  // Initial data fetch
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        fetchListings(),
        fetchLocations(),
        fetchPropertyTypes(),
      ]);
    };

    initializeData();
  }, []);

  // Auto-scroll images
  useEffect(() => {
    filteredListings.forEach((listing) => {
      if (listing.images && listing.images.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndexes((prev) => ({
            ...prev,
            [listing._id]: (prev[listing._id] + 1) % listing.images.length,
          }));
        }, 3000);

        imageIntervals.current[listing._id] = interval;
      }
    });

    return () => {
      Object.values(imageIntervals.current).forEach((interval) => {
        clearInterval(interval);
      });
      imageIntervals.current = {};
    };
  }, [filteredListings]);

  const nextImage = (listingId, imageCount) => {
    clearInterval(imageIntervals.current[listingId]);
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [listingId]: (prev[listingId] + 1) % imageCount,
    }));

    setTimeout(() => {
      if (imageCount > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndexes((prev) => ({
            ...prev,
            [listingId]: (prev[listingId] + 1) % imageCount,
          }));
        }, 3000);
        imageIntervals.current[listingId] = interval;
      }
    }, 5000);
  };

  const prevImage = (listingId, imageCount) => {
    clearInterval(imageIntervals.current[listingId]);
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [listingId]: prev[listingId] === 0 ? imageCount - 1 : prev[listingId] - 1,
    }));

    setTimeout(() => {
      if (imageCount > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndexes((prev) => ({
            ...prev,
            [listingId]: (prev[listingId] + 1) % imageCount,
          }));
        }, 3000);
        imageIntervals.current[listingId] = interval;
      }
    }, 5000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;

            if (target.classList.contains("listings-header")) {
              setTimeout(() => setHeaderVisible(true), 100);
            }

            if (target.classList.contains("listings-filters")) {
              setTimeout(() => setFiltersVisible(true), 200);
            }

            if (target.classList.contains("listing-card")) {
              const index = parseInt(target.getAttribute("data-index"));
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 100);
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const elements = sectionRef.current?.querySelectorAll(".observe-animation");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredListings]);

  // Handle filters - now refetch from backend
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const filters = {};

      if (searchTerm) {
        filters.search = searchTerm;
      }

      if (selectedType !== "all") {
        filters.type = selectedType;
      }

      if (selectedLocation !== "all") {
        filters.location = selectedLocation;
      }

      fetchListings(1, filters, true); // true = show filter loader
      setVisibleCards([]);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedType, selectedLocation]);

  // Handle view listing (increment views)
  const handleViewListing = async (listingId) => {
    try {
      setListingViews((prev) => ({
        ...prev,
        [listingId]: (prev[listingId] || 0) + 1,
      }));

      await api.get(`/listings/${listingId}`);
    } catch (error) {
      console.error("Error viewing listing:", error);
    }
  };

  return (
    <div className="listings-page" ref={sectionRef}>
      {/* Initial Page Loading */}
      {isLoading && listings.length === 0 && (
        <div className="page-loading">
          <div className="loading-content">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h3>Finding Amazing Properties</h3>
            <p>Discovering the perfect workspace for your business...</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Error Screen */}
      {error && !isLoading && listings.length === 0 && (
        <div className="listings-error">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={() => fetchListings()}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className={`listings-header observe-animation ${
          headerVisible ? "visible" : ""
        }`}
      >
        <div className="listings-container">
          <div className="header-content">
            <h1>Find Your Perfect Workspace</h1>
            <p>
              Discover premium commercial spaces tailored to your business needs
            </p>
          </div>
        </div>
      </div>

      <div className="listings-container">
        {/* Enhanced Filters */}
        <div
          className={`listings-filters observe-animation ${
            filtersVisible ? "visible" : ""
          }`}
        >
          <div className="filters-header">
            <div className="filters-title">
              <BiFilterAlt className="filters-icon" />
              <span>Filter Properties</span>
              {isFiltering && (
                <div className="filter-loading">
                  <FaSpinner className="filter-spinner" />
                  <span>Filtering...</span>
                </div>
              )}
            </div>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by location, property name, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="location-filter">
                <FaMapMarkerAlt className="filter-icon" />
                Location
              </label>
              <div className="select-wrapper">
                <select
                  id="location-filter"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="all">All Locations</option>
                  {availableLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <MdKeyboardArrowDown className="select-arrow" />
              </div>
            </div>
            <div className="filter-group">
              <label htmlFor="type-filter">
                <FaFilter className="filter-icon" />
                Property Type
              </label>
              <div className="select-wrapper">
                <select
                  id="type-filter"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "Co-Working" ? "Co-Working" : `${type} Space`}
                    </option>
                  ))}
                </select>
                <MdKeyboardArrowDown className="select-arrow" />
              </div>
            </div>

            <button
              className="reset-filters"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedLocation("all");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <div className="results-count">
            <span className="count-number">{filteredListings.length}</span>
            <span className="count-text">
              {filteredListings.length === 1 ? "property" : "properties"} found
            </span>
          </div>
          <div className="sort-options">
            <span>Sort by:</span>
            <select className="sort-select">
              <option>Most Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        {/* Filter Loading Overlay for Grid */}
        {isFiltering && (
          <div className="grid-loading-overlay">
            <div className="grid-loading-content">
              <div className="pulse-loader">
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
                <div className="pulse-dot"></div>
              </div>
              <p>Updating results...</p>
            </div>
          </div>
        )}

        {/* Listings Grid */}
        <div className={`listings-grid ${isFiltering ? "filtering" : ""}`}>
          {filteredListings.map((listing, index) => (
            <div
              key={listing._id}
              data-index={index}
              className={`listing-card observe-animation ${
                visibleCards.includes(index) ? "visible" : ""
              }`}
            >
              <div className="listing-image">
                <div className="image-carousel">
                  <img
                    src={
                      listing.images && listing.images.length > 0
                        ? listing.images[currentImageIndexes[listing._id] || 0]
                        : "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"
                    }
                    alt={listing.title}
                    loading="lazy"
                  />
                  {listing.images && listing.images.length > 1 && (
                    <>
                      <button
                        className="carousel-btn prev-btn"
                        onClick={() =>
                          prevImage(listing._id, listing.images.length)
                        }
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        className="carousel-btn next-btn"
                        onClick={() =>
                          nextImage(listing._id, listing.images.length)
                        }
                      >
                        <FaChevronRight />
                      </button>
                      <div className="image-indicators">
                        {listing.images.map((_, imgIndex) => (
                          <span
                            key={imgIndex}
                            className={`indicator ${
                              imgIndex ===
                              (currentImageIndexes[listing._id] || 0)
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              clearInterval(
                                imageIntervals.current[listing._id]
                              );
                              setCurrentImageIndexes((prev) => ({
                                ...prev,
                                [listing._id]: imgIndex,
                              }));
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="listing-type">{listing.type}</div>
                <div className="property-code">{listing.propertyCode}</div>
              </div>

              <div className="listing-content">
                <h3>{listing.title}</h3>

                <div className="listing-details">
                  <div className="detail-item">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="detail-item">
                    <MdSpaceDashboard className="detail-icon" />
                    <span>{listing.area}</span>
                  </div>
                  <div className="detail-item price">
                    <FaRupeeSign className="detail-icon" />
                    <span>{listing.price}</span>
                  </div>
                </div>

                <div className="listing-features">
                  {listing.features &&
                    listing.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                </div>

                <div className="listing-footer">
                  <div className="listing-meta">
                    <span className="views-count">
                      <FaEye />{" "}
                      {listingViews[listing._id] ||
                        generateRandomViews(listing.viewsRange)}{" "}
                      views
                    </span>
                  </div>
                  <div className="listing-actions">
                    <button
                      className="btn-primary get-report-btn"
                      onClick={() => handleGetReport(listing)}
                    >
                      <FaFileAlt />
                      Get Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredListings.length === 0 &&
          !isLoading &&
          !error &&
          !isFiltering && (
            <div className="no-results">
              <div className="no-results-icon">
                <MdLocationCity />
              </div>
              <h3>No properties found</h3>
              <p>Try adjusting your search criteria or browse all properties</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedLocation("all");
                }}
              >
                Show All Properties
              </button>
            </div>
          )}
      </div>

      {/* Report Request Popup */}
      {showReportPopup && (
        <div className="listings-popup-overlay">
          <div className="listings-popup-container" ref={popupRef}>
            <div className="listings-popup-header">
              <h3>
                <FaFileAlt
                  style={{ marginRight: "0.5rem", color: "#23c6a4" }}
                />
                Get Property Report
              </h3>
              <button
                className="listings-popup-close"
                onClick={closeReportPopup}
              >
                <FaTimes />
              </button>
            </div>

            <div className="listings-popup-content">
              {selectedListing && (
                <div className="listings-popup-property-summary">
                  <h4>{selectedListing.title}</h4>
                  <p>
                    <FaMapMarkerAlt style={{ marginRight: "0.3rem" }} />
                    {selectedListing.location} • {selectedListing.area} •{" "}
                    {selectedListing.price}
                  </p>
                  <p className="listings-popup-property-code">
                    Property Code: {selectedListing.propertyCode}
                  </p>
                </div>
              )}

              {!reportSubmissionSuccess ? (
                <>
                  <p className="listings-popup-description">
                    Please provide your details to receive a comprehensive
                    property report. Our team will contact you with detailed
                    information about this property.
                  </p>

                  {reportErrors.submit && (
                    <div className="listings-popup-error-banner">
                      <span className="listings-popup-error-icon">⚠️</span>
                      {reportErrors.submit}
                    </div>
                  )}

                  <div className="listings-popup-form">
                    <div className="listings-popup-form-grid">
                      <div
                        className={`listings-popup-form-group ${
                          reportErrors.name ? "listings-popup-error" : ""
                        }`}
                      >
                        <label>
                          <MdPerson className="listings-popup-form-icon" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={userInfo.name}
                          onChange={(e) =>
                            setUserInfo((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter your full name"
                          disabled={isSubmittingReport}
                        />
                        {reportErrors.name && (
                          <span className="listings-popup-error-message">
                            {reportErrors.name}
                          </span>
                        )}
                      </div>

                      <div
                        className={`listings-popup-form-group ${
                          reportErrors.company ? "listings-popup-error" : ""
                        }`}
                      >
                        <label>
                          <MdBusiness className="listings-popup-form-icon" />
                          Company Name *
                        </label>
                        <input
                          type="text"
                          value={userInfo.company}
                          onChange={(e) =>
                            setUserInfo((prev) => ({
                              ...prev,
                              company: e.target.value,
                            }))
                          }
                          placeholder="Enter your company name"
                          disabled={isSubmittingReport}
                        />
                        {reportErrors.company && (
                          <span className="listings-popup-error-message">
                            {reportErrors.company}
                          </span>
                        )}
                      </div>

                      <div
                        className={`listings-popup-form-group ${
                          reportErrors.designation ? "listings-popup-error" : ""
                        }`}
                      >
                        <label>
                          <FaBuilding className="listings-popup-form-icon" />
                          Designation *
                        </label>
                        <input
                          type="text"
                          value={userInfo.designation}
                          onChange={(e) =>
                            setUserInfo((prev) => ({
                              ...prev,
                              designation: e.target.value,
                            }))
                          }
                          placeholder="Enter your designation"
                          disabled={isSubmittingReport}
                        />
                        {reportErrors.designation && (
                          <span className="listings-popup-error-message">
                            {reportErrors.designation}
                          </span>
                        )}
                      </div>

                      <div
                        className={`listings-popup-form-group ${
                          reportErrors.phone ? "listings-popup-error" : ""
                        }`}
                      >
                        <label>
                          <MdPhone className="listings-popup-form-icon" />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={userInfo.phone}
                          onChange={(e) =>
                            setUserInfo((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="Enter your phone number"
                          disabled={isSubmittingReport}
                        />
                        {reportErrors.phone && (
                          <span className="listings-popup-error-message">
                            {reportErrors.phone}
                          </span>
                        )}
                      </div>

                      <div
                        className={`listings-popup-form-group listings-popup-full-width ${
                          reportErrors.email ? "listings-popup-error" : ""
                        }`}
                      >
                        <label>
                          <MdEmail className="listings-popup-form-icon" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={userInfo.email}
                          onChange={(e) =>
                            setUserInfo((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          placeholder="Enter your email address"
                          disabled={isSubmittingReport}
                        />
                        {reportErrors.email && (
                          <span className="listings-popup-error-message">
                            {reportErrors.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="listings-popup-actions">
                    <button
                      className="listings-popup-btn-secondary"
                      onClick={closeReportPopup}
                      disabled={isSubmittingReport}
                    >
                      Cancel
                    </button>
                    <button
                      className="listings-popup-btn-primary"
                      onClick={submitReportRequest}
                      disabled={isSubmittingReport}
                    >
                      {isSubmittingReport ? (
                        <>
                          <FaSpinner className="listings-popup-loading-spinner" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaFileAlt />
                          Request Report
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="listings-popup-success-content">
                  <div className="listings-popup-success-icon">
                    <FaCheckCircle />
                  </div>
                  <h4>Request Submitted Successfully!</h4>
                  <p>
                    Thank you for your interest in this property. Our team will
                    connect with you soon with a detailed property report and
                    all the information you need.
                  </p>
                  <p className="listings-popup-success-note">
                    You will also receive a confirmation email shortly.
                  </p>
                  <button
                    className="listings-popup-btn-primary"
                    onClick={closeReportPopup}
                  >
                    Got It
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listings;
