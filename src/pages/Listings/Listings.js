import React, { useState, useEffect, useRef } from "react";
import {  FaMapMarkerAlt, FaRupeeSign, FaSearch, FaFilter, FaEye, FaHeart } from "react-icons/fa";
import { MdSpaceDashboard, MdLocationCity, MdKeyboardArrowDown } from "react-icons/md";
import { BiFilterAlt } from "react-icons/bi";
import "./Listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Mock listings data - moved inside useEffect to avoid dependency
    const mockListings = [
      {
        id: 1,
        title: "Premium Office Space in Cyber City",
        type: "Office",
        location: "Gurgaon",
        area: "2500 sq ft",
        price: "₹1,50,000/month",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
        features: ["Furnished", "Parking", "Security", "AC"],
        rating: 4.8,
        views: 245
      },
      {
        id: 2,
        title: "Retail Shop in Select City Walk",
        type: "Retail",
        location: "Delhi",
        area: "800 sq ft",
        price: "₹80,000/month",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        features: ["High Footfall", "Corner Unit", "Display Windows"],
        rating: 4.6,
        views: 189
      },
      {
        id: 3,
        title: "Co-Working Space in Koramangala",
        type: "Co-Working",
        location: "Bangalore",
        area: "50 seats",
        price: "₹8,000/seat",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
        features: ["24/7 Access", "Meeting Rooms", "Cafeteria", "WiFi"],
        rating: 4.9,
        views: 324
      },
      {
        id: 4,
        title: "Corporate Office in BKC",
        type: "Office",
        location: "Mumbai",
        area: "5000 sq ft",
        price: "₹3,50,000/month",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
        features: ["Sea View", "Conference Room", "Reception", "Parking"],
        rating: 4.7,
        views: 412
      },
      {
        id: 5,
        title: "Restaurant Space in Khan Market",
        type: "Retail",
        location: "Delhi",
        area: "1200 sq ft",
        price: "₹1,20,000/month",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        features: ["Kitchen Setup", "Terrace", "Prime Location", "License Ready"],
        rating: 4.5,
        views: 156
      },
      {
        id: 6,
        title: "Tech Hub Co-Working in Whitefield",
        type: "Co-Working",
        location: "Bangalore",
        area: "100 seats",
        price: "₹7,500/seat",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
        features: ["Tech Setup", "Event Space", "Gaming Zone", "Gym"],
        rating: 4.8,
        views: 298
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setListings(mockListings);
      setFilteredListings(mockListings);
      setIsLoading(false);
    }, 1000);
  }, []); // Empty dependency array is now correct

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            
            if (target.classList.contains('listings-header')) {
              setTimeout(() => setHeaderVisible(true), 100);
            }
            
            if (target.classList.contains('listings-filters')) {
              setTimeout(() => setFiltersVisible(true), 200);
            }
            
            if (target.classList.contains('listing-card')) {
              const index = parseInt(target.getAttribute('data-index'));
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 100);
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
  }, [filteredListings]);

  useEffect(() => {
    let filtered = listings;

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter(listing => listing.type === selectedType);
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(listing => listing.location === selectedLocation);
    }

    setFilteredListings(filtered);
    setVisibleCards([]); // Reset visible cards when filters change
  }, [searchTerm, selectedType, selectedLocation, listings]);

  return (
    <div className="listings-page" ref={sectionRef}>
      {/* Loading Screen */}
      {isLoading && (
        <div className="listings-loading">
          <div className="loading-spinner"></div>
          <p>Loading amazing properties for you...</p>
        </div>
      )}

      {/* Header */}
      <div className={`listings-header observe-animation ${headerVisible ? 'visible' : ''}`}>
        <div className="listings-container">
          <div className="header-content">
            <h1>Find Your Perfect Workspace</h1>
            <p>Discover premium commercial spaces tailored to your business needs</p>
          </div>
        </div>
      </div>

      <div className="listings-container">
        {/* Enhanced Filters */}
        <div className={`listings-filters observe-animation ${filtersVisible ? 'visible' : ''}`}>
          <div className="filters-header">
            <div className="filters-title">
              <BiFilterAlt className="filters-icon" />
              <span>Filter Properties</span>
            </div>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by location, property name..."
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
                  <option value="Office">Office Space</option>
                  <option value="Retail">Retail Space</option>
                  <option value="Co-Working">Co-Working</option>
                </select>
                <MdKeyboardArrowDown className="select-arrow" />
              </div>
            </div>

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
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Gurgaon">Gurgaon</option>
                </select>
                <MdKeyboardArrowDown className="select-arrow" />
              </div>
            </div>

            <button className="reset-filters" onClick={() => {
              setSearchTerm("");
              setSelectedType("all");
              setSelectedLocation("all");
            }}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <div className="results-count">
            <span className="count-number">{filteredListings.length}</span>
            <span className="count-text">
              {filteredListings.length === 1 ? 'property' : 'properties'} found
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

        {/* Listings Grid */}
        <div className="listings-grid">
          {filteredListings.map((listing, index) => (
            <div 
              key={listing.id} 
              data-index={index}
              className={`listing-card observe-animation ${visibleCards.includes(index) ? 'visible' : ''}`}
            >
              <div className="listing-image">
                <img src={listing.image} alt={listing.title} loading="lazy" />
                <div className="image-overlay">
                  <div className="overlay-actions">
                    <button className="action-btn favorite">
                      <FaHeart />
                    </button>
                    <button className="action-btn view">
                      <FaEye />
                    </button>
                  </div>
                </div>
                <div className="listing-type">{listing.type}</div>
                <div className="listing-rating">
                  <span>★ {listing.rating}</span>
                </div>
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
                  {listing.features.map((feature, idx) => (
                    <span key={idx} className="feature-tag">{feature}</span>
                  ))}
                </div>

                <div className="listing-footer">
                  <div className="listing-meta">
                    <span className="views-count">
                      <FaEye /> {listing.views} views
                    </span>
                  </div>
                  <div className="listing-actions">
                    <button className="btn-secondary">Contact</button>
                    <button className="btn-primary">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredListings.length === 0 && !isLoading && (
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