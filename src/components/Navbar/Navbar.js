import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaHome, FaUsers, FaEnvelope, FaBuilding, FaTimes } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Active section detection
      const sections = ['home', 'services', 'about', 'listings', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <FaHome /> },
    { id: 'services', label: 'Services', icon: <MdBusinessCenter /> },
    { id: 'about', label: 'About Us', icon: <FaUsers /> },
    { id: 'listings', label: 'Listings', icon: <FaBuilding /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope /> }
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo Only */}
        <div className="navbar-brand" onClick={() => handleNavClick('home')}>
          <img
            src="/logo_abacus.png"
            alt="Abacus Logo"
            className="brand-logo"
          />
        </div>

        {/* Desktop Menu */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`navbar-link ${activeSection === item.id ? 'active' : ''}`}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-text">{item.label}</span>
              <div className="link-underline"></div>
            </button>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="hamburger-box">
            <div className="hamburger-inner"></div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
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
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="mobile-menu-items">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="mobile-link-icon">{item.icon}</span>
                <span className="mobile-link-text">{item.label}</span>
                <div className="mobile-link-arrow">
                  <FaMapMarkerAlt />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;