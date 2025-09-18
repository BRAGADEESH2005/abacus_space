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
} from "react-icons/fa";
import {
  MdSpaceDashboard,
  MdLocationCity,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { BiFilterAlt } from "react-icons/bi";
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
  const [isFiltering, setIsFiltering] = useState(false); // New state for filter loading
  const sectionRef = useRef(null);
  const imageIntervals = useRef({});

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
  const fetchListings = async (page = 1, filters = {}, showFilterLoader = false) => {
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
        <div className={`listings-grid ${isFiltering ? 'filtering' : ''}`}>
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
                      <FaEye /> {listingViews[listing._id] || generateRandomViews(listing.viewsRange)} views
                    </span>
                  </div>
                  <div className="listing-actions">
                    <button className="btn-secondary">Contact</button>
                    <button
                      className="btn-primary"
                      onClick={() => handleViewListing(listing._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredListings.length === 0 && !isLoading && !error && !isFiltering && (
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
    </div>
  );
};

export default Listings;