import React from 'react';
import { Link } from 'react-router-dom';

const Press = () => {
  const pressReleases = [
    {
      title: 'Funny Study Reaches 50,000 Active Users Milestone',
      date: 'January 10, 2026',
      excerpt: 'The online education platform celebrates significant growth in student and Tutor Tutorent.',
      icon: 'bi-trophy'
    },
    {
      title: 'New AI-Powered Matching Algorithm Launched',
      date: 'December 15, 2025',
      excerpt: 'Revolutionary technology helps students find their perfect tutor match in seconds.',
      icon: 'bi-robot'
    },
    {
      title: 'Partnership with Leading Universities Announced',
      date: 'November 20, 2025',
      excerpt: 'Collaboration aims to provide certified courses and professional development programs.',
      icon: 'bi-building'
    }
  ];

  const mediaKit = [
    {
      title: 'Brand Guidelines',
      description: 'Official logos, colors, and typography',
      icon: 'bi-palette',
      type: 'PDF'
    },
    {
      title: 'Company Fact Sheet',
      description: 'Key statistics and company information',
      icon: 'bi-file-text',
      type: 'PDF'
    },
    {
      title: 'Press Photos',
      description: 'High-resolution images and screenshots',
      icon: 'bi-images',
      type: 'ZIP'
    },
    {
      title: 'Executive Bios',
      description: 'Leadership team biographies',
      icon: 'bi-person-badge',
      type: 'PDF'
    }
  ];

  const coverage = [
    {
      outlet: 'TechCrunch',
      title: 'How Funny Study is Revolutionizing Online Education',
      date: 'December 2025',
      logo: 'bi-newspaper'
    },
    {
      outlet: 'EdTech Magazine',
      title: 'Top 10 EdTech Platforms to Watch in 2026',
      date: 'November 2025',
      logo: 'bi-journal-text'
    },
    {
      outlet: 'Forbes',
      title: 'The Future of Remote Learning',
      date: 'October 2025',
      logo: 'bi-trophy'
    }
  ];

  return (
    <div className="press-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="hero-title">
                <i className="bi bi-megaphone me-3"></i>
                Press & Media
              </h1>
              <p className="hero-description">
                Latest news, press releases, and media resources about Funny Study Learning Academy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="press-releases-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">
            <i className="bi bi-newspaper me-2"></i>
            Recent Press Releases
          </h2>
          <div className="row g-4">
            {pressReleases.map((release, index) => (
              <div key={index} className="col-lg-12">
                <div className="press-release-card">
                  <div className="press-icon">
                    <i className={`bi ${release.icon}`}></i>
                  </div>
                  <div className="press-content">
                    <div className="press-date">{release.date}</div>
                    <h3 className="press-title">{release.title}</h3>
                    <p className="press-excerpt">{release.excerpt}</p>
                    <button className="read-more-link">
                      Read Full Release
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="coverage-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">
            <i className="bi bi-broadcast me-2"></i>
            In the News
          </h2>
          <div className="row g-4">
            {coverage.map((item, index) => (
              <div key={index} className="col-md-4">
                <div className="coverage-card">
                  <div className="coverage-logo">
                    <i className={`bi ${item.logo}`}></i>
                  </div>
                  <div className="coverage-outlet">{item.outlet}</div>
                  <h3 className="coverage-title">{item.title}</h3>
                  <div className="coverage-date">{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="media-kit-section">
        <div className="container">
          <h2 className="section-title text-center mb-5">
            <i className="bi bi-folder me-2"></i>
            Media Kit
          </h2>
          <div className="row g-4">
            {mediaKit.map((item, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="media-kit-card">
                  <div className="kit-icon">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h3 className="kit-title">{item.title}</h3>
                  <p className="kit-description">{item.description}</p>
                  <button className="download-btn">
                    <i className="bi bi-download me-2"></i>
                    Download {item.type}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-card">
            <h2 className="contact-title">Media Inquiries</h2>
            <p className="contact-description">
              For press inquiries, interviews, or additional information, please contact our media relations team.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <i className="bi bi-envelope"></i>
                <span>press@funnystudy.com</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-telephone"></i>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            <Link to="/contact" className="contact-btn">
              <i className="bi bi-chat-dots me-2"></i>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .press-page {
          background: #f5f7fa;
          min-height: 100vh;
          padding-bottom: 4rem;
        }

        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 5rem 0 4rem;
          color: white;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.6s ease-out;
        }

        .hero-description {
          font-size: 1.25rem;
          opacity: 0.95;
          animation: fadeInUp 0.8s ease-out;
        }

        .press-releases-section,
        .coverage-section,
        .media-kit-section {
          padding: 4rem 0;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .press-release-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          display: flex;
          gap: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .press-release-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          transform: translateY(-5px);
        }

        .press-icon {
          width: 80px;
          height: 80px;
          min-width: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 2.5rem;
        }

        .press-content {
          flex: 1;
        }

        .press-date {
          color: #667eea;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .press-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .press-excerpt {
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .read-more-link {
          display: inline-flex;
          align-items: center;
          color: #667eea;
          font-weight: 600;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-more-link:hover {
          color: #764ba2;
          transform: translateX(5px);
        }

        .coverage-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          height: 100%;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .coverage-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .coverage-logo {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 2rem;
        }

        .coverage-outlet {
          color: #667eea;
          font-weight: 700;
          font-size: 1.125rem;
          margin-bottom: 1rem;
        }

        .coverage-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .coverage-date {
          color: #64748b;
          font-size: 0.9rem;
        }

        .media-kit-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .media-kit-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .kit-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 2rem;
        }

        .kit-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.75rem;
        }

        .kit-description {
          color: #64748b;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .download-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          width: 100%;
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .contact-section {
          padding: 2rem 0 4rem;
        }

        .contact-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 30px;
          padding: 4rem 2rem;
          text-align: center;
          color: white;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
        }

        .contact-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .contact-description {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          opacity: 0.95;
        }

        .contact-info {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.125rem;
          font-weight: 500;
        }

        .contact-item i {
          font-size: 1.5rem;
        }

        .contact-btn {
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

        .contact-btn:hover {
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

          .contact-title {
            font-size: 1.75rem;
          }

          .press-release-card {
            flex-direction: column;
            text-align: center;
          }

          .press-icon {
            margin: 0 auto;
          }

          .contact-info {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Press;
