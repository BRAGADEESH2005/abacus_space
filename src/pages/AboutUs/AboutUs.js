import React, { useState, useEffect, useRef } from 'react';
import { 
  FaHandshake, 
  FaLightbulb,
  FaAward,
  FaUserTie
} from 'react-icons/fa';
import './AboutUs.css';

const AboutUs = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.getAttribute('data-section');
            setTimeout(() => {
              setVisibleSections(prev => ({
                ...prev,
                [sectionName]: true
              }));
            }, 100);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: <FaHandshake />,
      title: 'Trust & Transparency',
      description: 'We believe in building relationships based on trust and complete transparency in all our dealings.'
    },
    {
      icon: <FaLightbulb />,
      title: 'Innovation',
      description: 'Constantly evolving our services and adopting new technologies to serve our clients better.'
    },
    {
      icon: <FaAward />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, ensuring the highest quality of service.'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'CEO & Founder',
      initials: 'RK',
      description: '15+ years in real estate with expertise in commercial properties and business development.'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Sales',
      initials: 'PS',
      description: 'Strategic sales leader with proven track record in luxury commercial real estate.'
    },
    {
      name: 'Amit Patel',
      role: 'Operations Manager',
      initials: 'AP',
      description: 'Operations expert ensuring smooth transactions and exceptional client experiences.'
    },
    {
      name: 'Sneha Gupta',
      role: 'Property Consultant',
      initials: 'SG',
      description: 'Specialized in helping businesses find their perfect workspace solutions.'
    }
  ];

  return (
    <div className="about-page">
      {/* Header */}
      <div 
        className={`about-header ${visibleSections.header ? 'visible' : ''}`}
        data-section="header"
        ref={el => sectionRefs.current.header = el}
      >
        <div className="about-container">
          <h1>About Abacus Real Estate</h1>
          <p>Your trusted partner in finding the perfect commercial spaces across India</p>
        </div>
      </div>

      <div className="about-container">
        <div className="about-content">
          {/* Story Section */}
          <section 
            className={`story-section ${visibleSections.story ? 'visible' : ''}`}
            data-section="story"
            ref={el => sectionRefs.current.story = el}
          >
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                Founded in 2015, Abacus Real Estate has emerged as one of India's leading 
                commercial property consultants. We started with a simple vision: to make 
                commercial real estate accessible, transparent, and hassle-free for businesses 
                of all sizes.
              </p>
              <p>
                Over the years, we have successfully helped thousands of businesses find their 
                ideal workspace, from startups looking for co-working spaces to multinational 
                corporations seeking premium office complexes. Our deep understanding of the 
                Indian commercial real estate market sets us apart.
              </p>
              <p>
                Today, we operate across major business hubs in India, offering comprehensive 
                real estate solutions that go beyond just property transactions. We are your 
                partners in business growth.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" 
                alt="Modern office building"
              />
            </div>
          </section>

          {/* Values Section */}
          <section 
            className={`values-section ${visibleSections.values ? 'visible' : ''}`}
            data-section="values"
            ref={el => sectionRefs.current.values = el}
          >
            <h2>Our Values</h2>
            <p>The principles that guide everything we do</p>
            <div className="values-grid">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className={`value-card ${visibleSections.values ? 'animate' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="value-icon">
                    {value.icon}
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section 
            className={`team-section ${visibleSections.team ? 'visible' : ''}`}
            data-section="team"
            ref={el => sectionRefs.current.team = el}
          >
            <h2>Meet Our Team</h2>
            <p>Experienced professionals dedicated to your success</p>
            <div className="team-grid">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className={`team-card ${visibleSections.team ? 'animate' : ''}`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="team-avatar">
                    {member.initials}
                  </div>
                  <h4>{member.name}</h4>
                  <div className="role">{member.role}</div>
                  <p>{member.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Mission Section */}
          <section 
            className={`mission-section ${visibleSections.mission ? 'visible' : ''}`}
            data-section="mission"
            ref={el => sectionRefs.current.mission = el}
          >
            <div className="mission-content">
              <div className="mission-text">
                <h2>Our Mission</h2>
                <p>
                  To revolutionize the commercial real estate industry in India by providing 
                  innovative, transparent, and client-centric solutions that empower businesses 
                  to thrive in their ideal workspaces.
                </p>
                <p>
                  We are committed to building long-term relationships with our clients, 
                  understanding their unique needs, and delivering exceptional value through 
                  our expertise and dedication.
                </p>
              </div>
              <div className="mission-stats">
                <div className="mission-stat">
                  <FaHandshake className="mission-icon" />
                  <div>
                    <h3>Premium Properties</h3>
                    <p>Curated selection of top-tier commercial spaces</p>
                  </div>
                </div>
                <div className="mission-stat">
                  <FaLightbulb className="mission-icon" />
                  <div>
                    <h3>Expert Guidance</h3>
                    <p>Professional consultation at every step</p>
                  </div>
                </div>
                <div className="mission-stat">
                  <FaUserTie className="mission-icon" />
                  <div>
                    <h3>Personalized Service</h3>
                    <p>Tailored solutions for your business needs</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;