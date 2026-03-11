import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add your subscribe logic here
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content - 4 Columns */}
        <div className="footer-columns">
          {/* Column 1 - Logo & Social Media & Subscribe */}
          <div className="footer-column">
            <Link to="/" className="footer-brand">
              <img
                src="/logo_abacus.png"
                alt="Abacus Spaces Logo"
                className="footer-brand-logo"
              />
            </Link>

            {/* Social Media */}
            <div className="footer-social">
              <a
                href="https://linkedin.com/company/abacus-spaces"
                className="footer-social-link"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/abacus_spaces?igsh=b3VrM290NGRyMGx6"
                className="footer-social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com/abacus_spaces"
                className="footer-social-link"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
            </div>

            {/* Subscribe Section */}
            <div className="footer-subscribe">
              <p className="footer-subscribe-text">Subscribe now to stay updated</p>
              <form onSubmit={handleSubscribe} className="footer-subscribe-form">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="footer-subscribe-input"
                  required
                />
                <button type="submit" className="footer-subscribe-btn">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div className="footer-column">
            <h3 className="footer-column-title">Services</h3>
            <ul className="footer-links">
              <li><Link to="/services/retail">Retail</Link></li>
              <li><Link to="/services/office-space">Office Space</Link></li>
              <li><Link to="/services/bts">BTS</Link></li>
              <li><Link to="/services/managed-office">Managed Office Setup</Link></li>
              <li><Link to="/services/hospitality">Hospitality</Link></li>
            </ul>
          </div>

          {/* Column 3 - Technology & Projects */}
          <div className="footer-column">
            <h3 className="footer-column-title">Technology</h3>
            <ul className="footer-links">
              <li><Link to="/space-calculator">Space Calculator</Link></li>
            </ul>
            
            <h3 className="footer-column-title">Projects</h3>
            <ul className="footer-links">
              <li><Link to="/projects/retail">Retail Space</Link></li>
              <li><Link to="/projects/office">Office Space</Link></li>
              <li><Link to="/projects/hospitality">Hospitality</Link></li>
              <li><Link to="/projects/healthcare">Healthcare Space</Link></li>
            </ul>
          </div>

          {/* Column 4 - Insights & Media */}
          <div className="footer-column">
            <h3 className="footer-column-title">Insights</h3>
            <ul className="footer-links">
              <li><Link to="/insights/research-report">Research Report</Link></li>
              <li><Link to="/insights/blogs">Blogs</Link></li>
              <li><Link to="/insights/industrial-update">Industrial Update</Link></li>
            </ul>
            
            <h3 className="footer-column-title">Media</h3>
            <ul className="footer-links">
              <li><Link to="/media/news">In The News</Link></li>
            </ul>
          </div>
        </div>

        {/* Diversity Statement */}
        <div className="footer-diversity">
          <p>
            We value diversity within Abacus Spaces and are committed to offering equal opportunities in employment. 
            We do not discriminate against any team member or applicant for employment on the basis of nationality, 
            race, colour, religion, caste, gender identity/expression, sexual orientation, disability, social origin 
            and status, indigenous status, political opinion, age, marital status or any other personal characteristics 
            or status. Abacus Spaces values all talent and will do its utmost to hire, nurture, and grow them.
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Abacus Spaces. All Rights Reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="footer-separator">|</span>
            <Link to="/terms-of-service">Terms of Use</Link>
            <span className="footer-separator">|</span>
            <Link to="/rera-registration">RERA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;