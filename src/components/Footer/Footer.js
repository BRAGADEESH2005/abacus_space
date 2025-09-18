import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { MdCopyright } from "react-icons/md";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-company">
            {/* Brand Logo */}
            <Link to="/" className="footer-brand">
              <img
                src="/logo_abacus.png"
                alt="Abacus Logo"
                className="footer-brand-logo"
              />
            </Link>
            <p className="footer-tagline">
              "Abacus – Spaces That Mean Business."
            </p>

            {/* Contact Info */}
            <div className="footer-contact">
              <div className="footer-contact-item">
                <FaPhone />
                <span>+91 9876543210</span>
              </div>
              <div className="footer-contact-item">
                <FaEnvelope />
                <span>info@abacuspaces.com</span>
              </div>
            </div>

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
                href="https://twitter.com/abacusspaces"
                className="footer-social-link"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a
                href="https://facebook.com/abacusspaces"
                className="footer-social-link"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://instagram.com/abacusspaces"
                className="footer-social-link"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <MdCopyright />
            <span>{currentYear} Abacus Spaces. All rights reserved.</span>
          </div>

          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/terms-of-service">Terms</Link>
            <span>•</span>
            <Link to="/rera-registration">RERA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
