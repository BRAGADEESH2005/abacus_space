import React, { useState, useEffect, useRef } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section');
            if (sectionName) {
              setTimeout(() => {
                setVisibleSections(prev => ({
                  ...prev,
                  [sectionName]: true
                }));
              }, 100);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all sections
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSubmitStatus("");
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: "Phone",
      details: "+91 98765 43210",
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: "info@abacus.com",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Address",
      details: "123 Business District, Gurgaon, Haryana 122001",
    },
    {
      icon: <FaClock />,
      title: "Working Hours",
      details: "Mon - Fri: 9:00 AM - 6:00 PM",
    },
  ];

  return (
    <div className="contact-page">
      {/* Header */}
      <div 
        className={`contact-header ${visibleSections.header ? 'visible' : ''}`}
        data-section="header"
        ref={el => sectionRefs.current.header = el}
      >
        <div className="contact-container">
          <h1>Contact Us</h1>
          <p>Get in touch with us for any inquiries about our properties</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          {/* Contact Form */}
          <div 
            className={`contact-form-section ${visibleSections.form ? 'visible' : ''}`}
            data-section="form"
            ref={el => sectionRefs.current.form = el}
          >
            <h2>Send us a Message</h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className={`form-group ${visibleSections.form ? 'animate' : ''}`} style={{ animationDelay: '0.3s' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={`form-group ${visibleSections.form ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className={`form-group ${visibleSections.form ? 'animate' : ''}`} style={{ animationDelay: '0.5s' }}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={`form-group ${visibleSections.form ? 'animate' : ''}`} style={{ animationDelay: '0.6s' }}>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={`form-group ${visibleSections.form ? 'animate' : ''}`} style={{ animationDelay: '0.7s' }}>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? "submitting" : ""} ${visibleSections.form ? 'animate-btn' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="submit-spinner"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </button>

              {submitStatus === "success" && (
                <div className="success-message animate-success">
                  ✓ Message sent successfully! We'll get back to you soon.
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div 
            className={`contact-info-section ${visibleSections.info ? 'visible' : ''}`}
            data-section="info"
            ref={el => sectionRefs.current.info = el}
          >
            <h2 className={visibleSections.info ? 'animate-title' : ''}>Get in Touch</h2>

            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div 
                  key={index} 
                  className={`info-card ${visibleSections.info ? 'animate' : ''}`}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <div className="info-icon">{info.icon}</div>
                  <div className="info-content">
                    <h3>{info.title}</h3>
                    <p>{info.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;