import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaTimes,
  FaChevronRight,
  FaCalculator,
  FaSearch,
  FaPhotoVideo,
  FaBriefcase,
  FaLightbulb,
  FaUsers,
} from "react-icons/fa";
import { MdViewList } from "react-icons/md";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Handle scroll to services section
  useEffect(() => {
    if (location.hash === "#services") {
      setTimeout(() => {
        const servicesSection = document.getElementById("services");
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality here
  };

  const handleServicesClick = (e) => {
    e.preventDefault();
    closeMobileMenu();

    if (location.pathname === "/") {
      // Already on home page, just scroll
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page with hash
      navigate("/#services");
    }
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Left Section */}
          <div className="navbar-left">
            <div className="navbar-left-row">
              <Link
                to="/insights-reports"
                className={`navbar-link ${
                  location.pathname === "/insights-reports" ? "active" : ""
                }`}
              >
                <FaPhotoVideo className="link-icon" />
                <span>Media</span>
                <div className="link-underline"></div>
              </Link>

              <Link
                to="/contact"
                className={`navbar-link ${
                  location.pathname === "/contact" ? "active" : ""
                }`}
              >
                <FaEnvelope className="link-icon" />
                <span>Contact</span>
                <div className="link-underline"></div>
              </Link>
            </div>

            <div className="navbar-left-row">
              <a
                href="/#services"
                className={`navbar-link ${
                  location.hash === "#services" ? "active" : ""
                }`}
                onClick={handleServicesClick}
              >
                <span>Services</span>
                <div className="link-underline"></div>
              </a>

              <Link
                to="/listings"
                className={`navbar-link ${
                  location.pathname === "/listings" ? "active" : ""
                }`}
              >
                <span>Projects</span>
                <div className="link-underline"></div>
              </Link>

              <Link
                to="/space-calculator"
                className={`navbar-link ${
                  location.pathname === "/space-calculator" ? "active" : ""
                }`}
              >
                <span>Space Calculator</span>
                <div className="link-underline"></div>
              </Link>
            </div>
          </div>

          {/* Center Section - Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <img
              src="/logo_abacus.png"
              alt="Abacus Logo"
              className="brand-logo"
            />
          </Link>

          {/* Right Section */}
          <div className="navbar-right">
            <div className="navbar-right-row">
              <form className="search-bar" onSubmit={handleSearch}>
                <span className="search-label">Looking for</span>
                <input
                  type="text"
                  placeholder="office, commercial, hospitality"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button
                  type="submit"
                  className="search-button"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            <div className="navbar-right-row">
              <Link
                to="/aboutus"
                className={`navbar-link ${
                  location.pathname === "/aboutus" ? "active" : ""
                }`}
              >
                <span>About Us</span>
                <div className="link-underline"></div>
              </Link>

              <Link
                to="/insights"
                className={`navbar-link ${
                  location.pathname === "/insights" ? "active" : ""
                }`}
              >
                <span>Insights</span>
                <div className="link-underline"></div>
              </Link>

              <Link
                to="/careers"
                className={`navbar-link ${
                  location.pathname === "/careers" ? "active" : ""
                }`}
              >
                <span>Careers</span>
                <div className="link-underline"></div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Blur Background */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-blur" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu Panel */}
      <div className={`mobile-menu-panel ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Mobile Menu Header */}
        <div className="mobile-menu-header">
          <div className="mobile-brand">
            <img
              src="/logo_abacus.png"
              alt="Abacus Logo"
              className="mobile-brand-logo"
            />
          </div>
          <button
            className="mobile-close"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mobile-search-container">
          <form className="mobile-search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Looking for"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-search-input"
            />
            <button
              type="submit"
              className="mobile-search-button"
              aria-label="Search"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Mobile Menu Items */}
        <div className="mobile-menu-items">
          <Link
            to="/"
            className={`mobile-nav-link ${
              location.pathname === "/" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.1s" }}
          >
            <FaHome className="mobile-link-icon" />
            <span className="mobile-link-text">Home</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/insights-reports"
            className={`mobile-nav-link ${
              location.pathname === "/insights-reports" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.2s" }}
          >
            <FaPhotoVideo className="mobile-link-icon" />
            <span className="mobile-link-text">Media</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/contact"
            className={`mobile-nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.3s" }}
          >
            <FaEnvelope className="mobile-link-icon" />
            <span className="mobile-link-text">Contact</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <a
            href="/#services"
            className={`mobile-nav-link ${
              location.hash === "#services" ? "active" : ""
            }`}
            onClick={handleServicesClick}
            style={{ animationDelay: "0.4s" }}
          >
            <FaBriefcase className="mobile-link-icon" />
            <span className="mobile-link-text">Services</span>
            <FaChevronRight className="mobile-link-arrow" />
          </a>

          <Link
            to="/listings"
            className={`mobile-nav-link ${
              location.pathname === "/listings" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.5s" }}
          >
            <MdViewList className="mobile-link-icon" />
            <span className="mobile-link-text">Projects</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/technology"
            className={`mobile-nav-link ${
              location.pathname === "/technology" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.6s" }}
          >
            <FaCalculator className="mobile-link-icon" />
            <span className="mobile-link-text">Technology</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/aboutus"
            className={`mobile-nav-link ${
              location.pathname === "/aboutus" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.7s" }}
          >
            <FaInfoCircle className="mobile-link-icon" />
            <span className="mobile-link-text">About Us</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/insights"
            className={`mobile-nav-link ${
              location.pathname === "/insights" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.8s" }}
          >
            <FaLightbulb className="mobile-link-icon" />
            <span className="mobile-link-text">Insights</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/careers"
            className={`mobile-nav-link ${
              location.pathname === "/careers" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.9s" }}
          >
            <FaUsers className="mobile-link-icon" />
            <span className="mobile-link-text">Careers</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
