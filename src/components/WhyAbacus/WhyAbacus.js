import React, { useEffect, useState } from 'react';
import './WhyAbacus.css';

const WhyAbacus = () => {
  const [visibleItems, setVisibleItems] = useState([]);

  const features = [
    {
      title: "Fast Closures",
      description: "Quick and efficient property deals",
      icon: "⚡",
      delay: 0
    },
    {
      title: "Local Insights",
      description: "Deep knowledge of South Indian markets",
      icon: "🎯",
      delay: 200
    },
    {
      title: "Trusted Partnerships",
      description: "Strong relationships with property owners",
      icon: "🤝",
      delay: 400
    },
    {
      title: "Client-Centric Approach",
      description: "Your success is our priority",
      icon: "❤️",
      delay: 600
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index'));
            setTimeout(() => {
              setVisibleItems(prev => [...prev, index]);
            }, features[index].delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll('.why-item');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-abacus">
      <div className="why-container">
        <div className="why-header">
          <h2 className="animate-fadeInUp">Why Abacus?</h2>
          <p className="animate-fadeInUp">Trust + Results = Success</p>
        </div>
        <div className="why-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              data-index={index}
              className={`why-item ${visibleItems.includes(index) ? 'visible' : ''}`}
            >
              <div className="why-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="pulse-effect"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAbacus;