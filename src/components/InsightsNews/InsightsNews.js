import React, { useState, useEffect, useRef } from 'react';
import { 
  FaArrowRight, 
  FaCalendarAlt, 
  FaClock, 
  FaEye,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { MdInsights } from 'react-icons/md';
import './InsightsNews.css';

const InsightsNews = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef(null);

  const insights = [
    {
      id: 1,
      title: 'Office Leasing Trends in 2025: The Future of Workspace',
      excerpt: 'Discover the emerging patterns in commercial real estate as businesses adapt to hybrid work models and sustainable practices.',
      author: 'Abacus Spaces',
      date: '2025-01-15',
      readTime: '8 min read',
      views: '2.4k',
      category: 'Market Analysis'
    },
    {
      id: 2,
      title: 'Why South India is the Next Retail Hotspot',
      excerpt: 'Exploring the economic factors driving retail expansion in Chennai, Bangalore, and Hyderabad markets.',
      author: 'Market Research Team',
      date: '2025-01-12',
      readTime: '6 min read',
      views: '1.8k',
      category: 'Retail Insights'
    },
    {
      id: 3,
      title: 'Industrial Warehouse Demand Surge in Tier-2 Cities',
      excerpt: 'How e-commerce growth is reshaping warehouse requirements across emerging Indian markets.',
      author: 'Industrial Division',
      date: '2025-01-10',
      readTime: '5 min read',
      views: '1.2k',
      category: 'Industrial Analysis'
    },
    {
      id: 4,
      title: 'Real Estate Investment Opportunities in 2025',
      excerpt: 'Expert analysis on emerging investment opportunities and market predictions for the upcoming year.',
      author: 'Investment Team',
      date: '2025-01-08',
      readTime: '7 min read',
      views: '3.1k',
      category: 'Investment Guide'
    },
    {
      id: 5,
      title: 'Co-working Spaces: Evolution in Post-Pandemic Era',
      excerpt: 'Case study analysis of successful co-working models and their adaptation strategies.',
      author: 'Strategy Team',
      date: '2025-01-05',
      readTime: '6 min read',
      views: '1.6k',
      category: 'Market Trends'
    },
    {
      id: 6,
      title: 'Sustainable Retail Spaces: Green Building Trends',
      excerpt: 'How environmental consciousness is driving new standards in retail space development.',
      author: 'Sustainability Team',
      date: '2025-01-03',
      readTime: '5 min read',
      views: '2.0k',
      category: 'Sustainability'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % insights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [insights.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % insights.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + insights.length) % insights.length);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <section className="insights-news-section" ref={sectionRef}>
      <div className="insights-container">
        {/* Header */}
        <div className={`insights-header ${isVisible ? 'insights-visible' : ''}`}>
          <div className="insights-badge">
            <MdInsights className="insights-badge-icon" />
            <span>Industry Insights</span>
          </div>
          <h1>Latest Market Intelligence & Trends</h1>
          <p>Expert analysis and thought leadership in real estate markets</p>
        </div>

        {/* Carousel */}
        <div className={`insights-carousel ${isVisible ? 'insights-visible' : ''}`}>
          <div className="insights-carousel-container">
            <button className="insights-nav-btn insights-prev" onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            
            <div className="insights-carousel-wrapper">
              <div 
                className="insights-carousel-track"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {insights.map((insight, index) => (
                  <div key={insight.id} className="insights-slide">
                    <div className="insights-card">
                      <div className="insights-card-header">
                        <span className="insights-category">{insight.category}</span>
                        <div className="insights-stats">
                          <span><FaEye /> {insight.views}</span>
                          <span><FaClock /> {insight.readTime}</span>
                        </div>
                      </div>
                      
                      <h3>{insight.title}</h3>
                      <p>{insight.excerpt}</p>
                      
                      <div className="insights-card-footer">
                        <div className="insights-author-info">
                          <span className="insights-author">{insight.author}</span>
                          <span className="insights-date">
                            <FaCalendarAlt /> {formatDate(insight.date)}
                          </span>
                        </div>
                        <button className="insights-read-btn">
                          Read More <FaArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="insights-nav-btn insights-next" onClick={nextSlide}>
              <FaChevronRight />
            </button>
          </div>
          
          {/* Dots Indicator */}
          <div className="insights-dots">
            {insights.map((_, index) => (
              <button
                key={index}
                className={`insights-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightsNews;