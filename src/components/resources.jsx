import React from 'react';
import { Link } from 'react-router-dom';

const Resources = () => {
    const resourceCategories = [
        {
            title: 'Study Guides',
            icon: 'bi-journal-text',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            resources: [
                { name: 'Exam Preparation Tips', type: 'PDF', size: '2.3 MB' },
                { name: 'Note-Taking Strategies', type: 'PDF', size: '1.8 MB' },
                { name: 'Time Management Guide', type: 'PDF', size: '1.5 MB' },
                { name: 'Memory Techniques', type: 'PDF', size: '2.1 MB' }
            ]
        },
        {
            title: 'Video Tutorials',
            icon: 'bi-camera-video',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            resources: [
                { name: 'Effective Study Methods', type: 'Video', duration: '15 min' },
                { name: 'Online Learning Best Practices', type: 'Video', duration: '12 min' },
                { name: 'Goal Setting for Students', type: 'Video', duration: '10 min' },
                { name: 'Stress Management Tips', type: 'Video', duration: '8 min' }
            ]
        },
        {
            title: 'Templates & Tools',
            icon: 'bi-tools',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            resources: [
                { name: 'Study Schedule Template', type: 'XLSX', size: '45 KB' },
                { name: 'Goal Tracker', type: 'XLSX', size: '38 KB' },
                { name: 'Assignment Planner', type: 'PDF', size: '850 KB' },
                { name: 'Progress Report Template', type: 'DOCX', size: '120 KB' }
            ]
        },
        {
            title: 'Learning Materials',
            icon: 'bi-book',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            resources: [
                { name: 'Subject-wise Syllabus', type: 'PDF', size: '3.2 MB' },
                { name: 'Practice Questions Bank', type: 'PDF', size: '5.8 MB' },
                { name: 'Reference Books List', type: 'PDF', size: '980 KB' },
                { name: 'Online Resources Guide', type: 'PDF', size: '1.2 MB' }
            ]
        }
    ];

    const featuredResources = [
        {
            title: 'Ultimate Study Guide 2026',
            description: 'Comprehensive guide covering all major subjects with proven study techniques',
            image: 'bi-mortarboard',
            downloads: '15.2K',
            rating: 4.9
        },
        {
            title: 'Interactive Learning Toolkit',
            description: 'Collection of interactive tools and exercises for enhanced learning',
            image: 'bi-puzzle',
            downloads: '12.8K',
            rating: 4.8
        },
        {
            title: 'Exam Success Blueprint',
            description: 'Step-by-step blueprint to ace your exams with confidence',
            image: 'bi-award',
            downloads: '18.5K',
            rating: 4.9
        }
    ];

    return (
        <div className="resources-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">
                                <i className="bi bi-collection me-3"></i>
                                Learning Resources
                            </h1>
                            <p className="hero-description">
                                Access our comprehensive collection of study materials, guides, and tools to enhance your learning experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Resources */}
            <section className="featured-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">
                        <i className="bi bi-star-fill me-2"></i>
                        Featured Resources
                    </h2>
                    <div className="row g-4">
                        {featuredResources.map((resource, index) => (
                            <div key={index} className="col-md-4">
                                <div className="featured-card">
                                    <div className="featured-icon">
                                        <i className={`bi ${resource.image}`}></i>
                                    </div>
                                    <h3 className="featured-title">{resource.title}</h3>
                                    <p className="featured-description">{resource.description}</p>
                                    <div className="featured-stats">
                                        <span className="stat">
                                            <i className="bi bi-download me-1"></i>
                                            {resource.downloads}
                                        </span>
                                        <span className="stat">
                                            <i className="bi bi-star-fill me-1"></i>
                                            {resource.rating}
                                        </span>
                                    </div>
                                    <button className="download-btn">
                                        <i className="bi bi-download me-2"></i>
                                        Download Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resource Categories */}
            <section className="categories-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">
                        Browse by Category
                    </h2>
                    <div className="row g-4">
                        {resourceCategories.map((category, index) => (
                            <div key={index} className="col-lg-6">
                                <div className="category-card">
                                    <div className="category-header">
                                        <div
                                            className="category-icon-wrapper"
                                            style={{ background: category.gradient }}
                                        >
                                            <i className={`bi ${category.icon}`}></i>
                                        </div>
                                        <h3 className="category-title">{category.title}</h3>
                                    </div>
                                    <div className="resources-list">
                                        {category.resources.map((resource, idx) => (
                                            <div key={idx} className="resource-item">
                                                <div className="resource-info">
                                                    <i className="bi bi-file-earmark-text me-2"></i>
                                                    <span className="resource-name">{resource.name}</span>
                                                </div>
                                                <div className="resource-meta">
                                                    <span className="resource-type">{resource.type}</span>
                                                    <span className="resource-size">
                                                        {resource.size || resource.duration}
                                                    </span>
                                                    <button className="download-icon-btn">
                                                        <i className="bi bi-download"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                        <h2 className="cta-title">Looking for Personalized Learning?</h2>
                        <p className="cta-description">
                            Connect with expert teachers for one-on-one guidance and customized learning plans.
                        </p>
                        <Link to="/find-teachers" className="cta-btn">
                            <i className="bi bi-person-plus me-2"></i>
                            Find a Teacher
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .resources-page {
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

        .featured-section {
          padding: 4rem 0 3rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .featured-card {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          height: 100%;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .featured-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .featured-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 3rem;
        }

        .featured-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .featured-description {
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .featured-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .stat {
          color: #667eea;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .download-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .categories-section {
          padding: 3rem 0;
        }

        .category-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .category-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .category-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.75rem;
        }

        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .resources-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .resource-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .resource-item:hover {
          background: #e2e8f0;
          transform: translateX(5px);
        }

        .resource-info {
          display: flex;
          align-items: center;
          color: #2c3e50;
          font-weight: 500;
        }

        .resource-name {
          font-size: 0.95rem;
        }

        .resource-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .resource-type {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .resource-size {
          color: #64748b;
          font-size: 0.875rem;
        }

        .download-icon-btn {
          background: transparent;
          border: none;
          color: #667eea;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .download-icon-btn:hover {
          color: #764ba2;
          transform: scale(1.2);
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

          .resource-meta {
            flex-direction: column;
            align-items: flex-end;
            gap: 0.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Resources;
