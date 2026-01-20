import React from 'react';
import { Link } from 'react-router-dom';

const Subjects = () => {
    const subjects = [
        {
            category: 'Mathematics',
            icon: 'bi-calculator',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            topics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry']
        },
        {
            category: 'Science',
            icon: 'bi-flask',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            topics: ['Physics', 'Chemistry', 'Biology', 'Environmental Science', 'Astronomy']
        },
        {
            category: 'Languages',
            icon: 'bi-translate',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            topics: ['English', 'Spanish', 'French', 'Mandarin', 'German']
        },
        {
            category: 'Computer Science',
            icon: 'bi-code-slash',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            topics: ['Programming', 'Web Development', 'Data Science', 'AI & ML', 'Cybersecurity']
        },
        {
            category: 'Arts & Humanities',
            icon: 'bi-palette',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            topics: ['History', 'Literature', 'Philosophy', 'Art History', 'Music Theory']
        },
        {
            category: 'Business',
            icon: 'bi-briefcase',
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            topics: ['Economics', 'Accounting', 'Marketing', 'Management', 'Finance']
        },
        {
            category: 'Social Sciences',
            icon: 'bi-people',
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            topics: ['Psychology', 'Sociology', 'Anthropology', 'Political Science', 'Geography']
        },
        {
            category: 'Engineering',
            icon: 'bi-gear',
            gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            topics: ['Mechanical', 'Electrical', 'Civil', 'Chemical', 'Software Engineering']
        }
    ];

    return (
        <div className="subjects-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">
                                <i className="bi bi-book me-3"></i>
                                Explore Subjects
                            </h1>
                            <p className="hero-description">
                                Discover a wide range of subjects taught by expert teachers. From mathematics to music, find the perfect tutor for your learning journey.
                            </p>
                            <div className="search-box">
                                <i className="bi bi-search search-icon"></i>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search for subjects, topics, or courses..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subjects Grid */}
            <section className="subjects-section">
                <div className="container">
                    <div className="row g-4">
                        {subjects.map((subject, index) => (
                            <div key={index} className="col-md-6 col-lg-3">
                                <div className="subject-card">
                                    <div
                                        className="subject-icon-wrapper"
                                        style={{ background: subject.gradient }}
                                    >
                                        <i className={`bi ${subject.icon} subject-icon`}></i>
                                    </div>
                                    <h3 className="subject-title">{subject.category}</h3>
                                    <ul className="topic-list">
                                        {subject.topics.map((topic, idx) => (
                                            <li key={idx} className="topic-item">
                                                <i className="bi bi-check-circle-fill me-2"></i>
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/find-teachers" className="explore-btn">
                                        Find Teachers
                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </Link>
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
                        <h2 className="cta-title">Can't Find Your Subject?</h2>
                        <p className="cta-description">
                            We're constantly expanding our subject offerings. Let us know what you're looking for!
                        </p>
                        <Link to="/contact" className="cta-btn">
                            <i className="bi bi-chat-dots me-2"></i>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .subjects-page {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
          margin-bottom: 2rem;
          opacity: 0.95;
          animation: fadeInUp 0.8s ease-out;
        }

        .search-box {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeInUp 1s ease-out;
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.25rem;
          color: #667eea;
        }

        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.5rem;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }

        .subjects-section {
          padding: 4rem 0;
        }

        .subject-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .subject-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .subject-icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          transition: transform 0.3s ease;
        }

        .subject-card:hover .subject-icon-wrapper {
          transform: rotate(-5deg) scale(1.1);
        }

        .subject-icon {
          font-size: 2.5rem;
          color: white;
        }

        .subject-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .topic-list {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }

        .topic-item {
          color: #64748b;
          padding: 0.4rem 0;
          font-size: 0.95rem;
          transition: color 0.2s ease;
        }

        .topic-item:hover {
          color: #667eea;
        }

        .topic-item i {
          color: #667eea;
          font-size: 0.85rem;
        }

        .explore-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .explore-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          color: white;
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

          .hero-description {
            font-size: 1rem;
          }

          .cta-title {
            font-size: 1.75rem;
          }

          .cta-description {
            font-size: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Subjects;
