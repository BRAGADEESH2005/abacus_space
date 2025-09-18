import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaTimes,
  FaChevronRight,
  FaCalculator,
} from "react-icons/fa";
import { MdViewList } from "react-icons/md";
import "./Navbar.css";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <img
              src="/logo_abacus.png"
              alt="Abacus Logo"
              className="brand-logo"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="navbar-menu">
            <Link
              to="/"
              className={`navbar-link ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <FaHome className="link-icon" />
              <span>Home</span>
              <div className="link-underline"></div>
            </Link>

            <Link
              to="/listings"
              className={`navbar-link ${
                location.pathname === "/listings" ? "active" : ""
              }`}
            >
              <MdViewList className="link-icon" />
              <span>Listings</span>
              <div className="link-underline"></div>
            </Link>

            <Link
              to="/space-calculator"
              className={`navbar-link ${
                location.pathname === "/space-calculator" ? "active" : ""
              }`}
            >
              <FaCalculator className="link-icon" />
              <span>Space Calculator</span>
              <div className="link-underline"></div>
            </Link>

            <Link
              to="/aboutus"
              className={`navbar-link ${
                location.pathname === "/aboutus" ? "active" : ""
              }`}
            >
              <FaInfoCircle className="link-icon" />
              <span>About Us</span>
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
            to="/listings"
            className={`mobile-nav-link ${
              location.pathname === "/listings" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.2s" }}
          >
            <MdViewList className="mobile-link-icon" />
            <span className="mobile-link-text">Listings</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/space-calculator"
            className={`mobile-nav-link ${
              location.pathname === "/space-calculator" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.3s" }}
          >
            <FaCalculator className="mobile-link-icon" />
            <span className="mobile-link-text">Space Calculator</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/aboutus"
            className={`mobile-nav-link ${
              location.pathname === "/aboutus" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.4s" }}
          >
            <FaInfoCircle className="mobile-link-icon" />
            <span className="mobile-link-text">About Us</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>

          <Link
            to="/contact"
            className={`mobile-nav-link ${
              location.pathname === "/contact" ? "active" : ""
            }`}
            onClick={closeMobileMenu}
            style={{ animationDelay: "0.5s" }}
          >
            <FaEnvelope className="mobile-link-icon" />
            <span className="mobile-link-text">Contact</span>
            <FaChevronRight className="mobile-link-arrow" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;