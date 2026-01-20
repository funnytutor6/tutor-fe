import React from 'react';
import { Link } from 'react-router-dom';

const TeacherResources = () => {
    const resourceCategories = [
        {
            title: 'Teaching Guides',
            icon: 'bi-book',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            items: [
                'Effective Online Teaching Methods',
                'Student Engagement Strategies',
                'Lesson Planning Templates',
                'Assessment Best Practices'
            ]
        },
        {
            title: 'Tools & Software',
            icon: 'bi-laptop',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            items: [
                'Virtual Classroom Tools',
                'Interactive Whiteboard Apps',
                'Video Recording Software',
                'Screen Sharing Solutions'
            ]
        },
        {
            title: 'Professional Development',
            icon: 'bi-trophy',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            items: [
                'Teaching Certifications',
                'Webinar Series',
                'Expert Masterclasses',
                'Community Forums'
            ]
        },
        {
            title: 'Growth & Marketing',
            icon: 'bi-graph-up-arrow',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            items: [
                'Profile Optimization Tips',
                'Student Acquisition Strategies',
                'Pricing Guidelines',
                'Success Stories'
            ]
        }
    ];

    const tutorials = [
        {
            title: 'Getting Started as a Teacher',
            duration: '25 min',
            level: 'Beginner',
            icon: 'bi-play-circle',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: 'Creating Engaging Lessons',
            duration: '35 min',
            level: 'Intermediate',
            icon: 'bi-lightbulb',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            title: 'Building Your Student Base',
            duration: '30 min',
            level: 'Intermediate',
            icon: 'bi-people',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            title: 'Advanced Teaching Techniques',
            duration: '45 min',
            level: 'Advanced',
            icon: 'bi-mortarboard',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
    ];

    const tips = [
        {
            icon: 'bi-camera-video',
            title: 'Quality Video Setup',
            description: 'Invest in good lighting and a clear webcam for professional-looking lessons.'
        },
        {
            icon: 'bi-chat-dots',
            title: 'Active Communication',
            description: 'Respond promptly to student inquiries and maintain regular feedback loops.'
        },
        {
            icon: 'bi-calendar-check',
            title: 'Consistent Schedule',
            description: 'Maintain regular teaching hours to build trust and reliability with students.'
        },
        {
            icon: 'bi-star',
            title: 'Gather Reviews',
            description: 'Encourage satisfied students to leave reviews to boost your profile credibility.'
        }
    ];

    return (
        <div className="teacher-resources-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">
                                <i className="bi bi-easel me-3"></i>
                                Teacher Resources
                            </h1>
                            <p className="hero-description">
                                Everything you need to excel as an online tutor. Access tools, guides, and training to enhance your teaching career.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Tutorials */}
            <section className="tutorials-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">
                        <i className="bi bi-play-btn me-2"></i>
                        Video Tutorials
                    </h2>
                    <div className="row g-4">
                        {tutorials.map((tutorial, index) => (
                            <div key={index} className="col-md-6 col-lg-3">
                                <div className="tutorial-card">
                                    <div
                                        className="tutorial-icon"
                                        style={{ background: tutorial.gradient }}
                                    >
                                        <i className={`bi ${tutorial.icon}`}></i>
                                    </div>
                                    <h3 className="tutorial-title">{tutorial.title}</h3>
                                    <div className="tutorial-meta">
                                        <span className="duration">
                                            <i className="bi bi-clock me-1"></i>
                                            {tutorial.duration}
                                        </span>
                                        <span className={`level level-${tutorial.level.toLowerCase()}`}>
                                            {tutorial.level}
                                        </span>
                                    </div>
                                    <button className="watch-btn">
                                        <i className="bi bi-play-fill me-2"></i>
                                        Watch Now
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
                        Essential Resources
                    </h2>
                    <div className="row g-4">
                        {resourceCategories.map((category, index) => (
                            <div key={index} className="col-md-6 col-lg-3">
                                <div className="resource-category-card">
                                    <div
                                        className="category-icon"
                                        style={{ background: category.gradient }}
                                    >
                                        <i className={`bi ${category.icon}`}></i>
                                    </div>
                                    <h3 className="category-title">{category.title}</h3>
                                    <ul className="resource-list">
                                        {category.items.map((item, idx) => (
                                            <li key={idx} className="resource-list-item">
                                                <i className="bi bi-check-circle-fill me-2"></i>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Tips */}
            <section className="tips-section">
                <div className="container">
                    <h2 className="section-title text-center mb-5">
                        <i className="bi bi-lightbulb me-2"></i>
                        Quick Tips for Success
                    </h2>
                    <div className="row g-4">
                        {tips.map((tip, index) => (
                            <div key={index} className="col-md-6">
                                <div className="tip-card">
                                    <div className="tip-icon">
                                        <i className={`bi ${tip.icon}`}></i>
                                    </div>
                                    <div className="tip-content">
                                        <h3 className="tip-title">{tip.title}</h3>
                                        <p className="tip-description">{tip.description}</p>
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
                        <h2 className="cta-title">Ready to Start Teaching?</h2>
                        <p className="cta-description">
                            Join our community of expert teachers and start making an impact today!
                        </p>
                        <Link to="/register/teacher" className="cta-btn">
                            <i className="bi bi-person-plus me-2"></i>
                            Create Teacher Profile
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .teacher-resources-page {
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

        .tutorials-section,
        .categories-section,
        .tips-section {
          padding: 4rem 0;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .tutorial-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .tutorial-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .tutorial-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 2.5rem;
        }

        .tutorial-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          min-height: 60px;
        }

        .tutorial-meta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .duration {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .level {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .level-beginner {
          background: #d1fae5;
          color: #065f46;
        }

        .level-intermediate {
          background: #fef3c7;
          color: #92400e;
        }

        .level-advanced {
          background: #fee2e2;
          color: #991b1b;
        }

        .watch-btn {
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

        .watch-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .resource-category-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .resource-category-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .category-icon {
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

        .category-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .resource-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .resource-list-item {
          color: #64748b;
          padding: 0.5rem 0;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }

        .resource-list-item:hover {
          color: #667eea;
        }

        .resource-list-item i {
          color: #667eea;
          font-size: 0.85rem;
        }

        .tip-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .tip-card:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          transform: translateX(5px);
        }

        .tip-icon {
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

        .tip-content {
          flex: 1;
        }

        .tip-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .tip-description {
          color: #64748b;
          margin: 0;
          line-height: 1.6;
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

          .tip-card {
            flex-direction: column;
            text-align: center;
          }

          .tip-icon {
            margin: 0 auto;
          }
        }
      `}</style>
        </div>
    );
};

export default TeacherResources;
