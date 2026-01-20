import React from 'react';
import { Link } from 'react-router-dom';

const Careers = () => {
    const positions = [];

    const benefits = [
        {
            icon: 'bi-house-heart',
            title: 'Remote-First Culture',
            description: 'Work from anywhere in the world with flexible hours'
        },
        {
            icon: 'bi-heart-pulse',
            title: 'Health & Wellness',
            description: 'Comprehensive health insurance and wellness programs'
        },
        {
            icon: 'bi-piggy-bank',
            title: 'Competitive Salary',
            description: 'Industry-leading compensation and equity packages'
        },
        {
            icon: 'bi-mortarboard',
            title: 'Learning Budget',
            description: 'Annual budget for courses, conferences, and books'
        },
        {
            icon: 'bi-calendar-check',
            title: 'Unlimited PTO',
            description: 'Take time off when you need it, no questions asked'
        },
        {
            icon: 'bi-people',
            title: 'Team Activities',
            description: 'Regular team retreats and virtual social events'
        }
    ];

    const values = [
        {
            emoji: '🎯',
            title: 'Student-Centric',
            description: 'We put learners first in everything we do'
        },
        {
            emoji: '💡',
            title: 'Innovation',
            description: 'We embrace new ideas and creative solutions'
        },
        {
            emoji: '🤝',
            title: 'Collaboration',
            description: 'We work together to achieve great things'
        },
        {
            emoji: '🌟',
            title: 'Excellence',
            description: 'We strive for quality in every detail'
        }
    ];

    return (
        <div className="careers-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">
                                Join Our Mission to Transform Education
                            </h1>
                            <p className="hero-description">
                                We're building the future of online learning. Come make an impact with a team that values creativity, collaboration, and continuous growth.
                            </p>
                            <a href="#openings" className="hero-btn">
                                <i className="bi bi-briefcase me-2"></i>
                                View Open Positions
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="values-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">Our Core Values</h2>
                    <div className="row g-4">
                        {values.map((value, index) => (
                            <div key={index} className="col-md-6 col-lg-3">
                                <div className="value-card">
                                    <div className="value-emoji">{value.emoji}</div>
                                    <h3 className="value-title">{value.title}</h3>
                                    <p className="value-description">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="benefits-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">
                        <i className="bi bi-star me-2"></i>
                        Why Work With Us
                    </h2>
                    <div className="row g-4">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="col-md-6 col-lg-4">
                                <div className="benefit-card">
                                    <div className="benefit-icon">
                                        <i className={`bi ${benefit.icon}`}></i>
                                    </div>
                                    <h3 className="benefit-title">{benefit.title}</h3>
                                    <p className="benefit-description">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section id="openings" className="positions-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">{positions?.length > 0 ? "Open Positions" : "No Openings"}</h2>
                    <div className="row g-4">
                        {positions.map((position, index) => (
                            <div key={index} className="col-md-6 col-lg-4">
                                <div className="position-card">
                                    <div
                                        className="position-icon"
                                        style={{ background: position.gradient }}
                                    >
                                        <i className={`bi ${position.icon}`}></i>
                                    </div>
                                    <h3 className="position-title">{position.title}</h3>
                                    <div className="position-meta">
                                        <span className="meta-item">
                                            <i className="bi bi-building me-1"></i>
                                            {position.department}
                                        </span>
                                        <span className="meta-item">
                                            <i className="bi bi-geo-alt me-1"></i>
                                            {position.location}
                                        </span>
                                        <span className="meta-item">
                                            <i className="bi bi-clock me-1"></i>
                                            {position.type}
                                        </span>
                                    </div>
                                    <button className="apply-btn">
                                        Apply Now
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2 className="cta-title">Don't See the Right Role?</h2>
                        <p className="cta-description">
                            We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
                        </p>
                        <Link to="/contact" className="cta-btn">
                            <i className="bi bi-envelope me-2"></i>
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .careers-page {
          background: #f5f7fa;
          min-height: 100vh;
          padding-bottom: 4rem;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 6rem 0;
          color: white;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.6s ease-out;
        }

        .hero-description {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          padding: 1rem 2.5rem;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 1s ease-out;
        }

        .hero-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          color: #667eea;
        }

        .values-section,
        .benefits-section,
        .positions-section {
          padding: 4rem 0;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .value-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem 2rem;
          height: 100%;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .value-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .value-emoji {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .value-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.75rem;
        }

        .value-description {
          color: #64748b;
          margin: 0;
        }

        .benefit-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          display: flex;
          gap: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .benefit-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          transform: translateX(5px);
        }

        .benefit-icon {
          width: 60px;
          height: 60px;
          min-width: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.75rem;
        }

        .benefit-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .benefit-description {
          color: #64748b;
          margin: 0;
          line-height: 1.6;
        }

        .position-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .position-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .position-icon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: white;
          font-size: 2rem;
        }

        .position-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .position-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          color: #64748b;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .meta-item i {
          color: #667eea;
        }

        .apply-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          width: 100%;
          justify-content: center;
        }

        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .cta-section {
          padding: 2rem 0 4rem;
        }

        .cta-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 30px;
          padding: 4rem 2rem;
          text-align: center;
          color: white;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .cta-description {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          padding: 1rem 2.5rem;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          color: #667eea;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .cta-title {
            font-size: 1.75rem;
          }

          .benefit-card {
            flex-direction: column;
            text-align: center;
          }

          .benefit-icon {
            margin: 0 auto;
          }
        }
      `}</style>
        </div>
    );
};

export default Careers;
