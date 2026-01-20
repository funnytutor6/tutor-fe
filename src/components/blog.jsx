import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const featuredPost = {
        title: 'The Future of Online Education: Trends to Watch in 2026',
        excerpt: 'As technology continues to evolve, so does the landscape of online education. Discover the key trends shaping the future of learning.',
        author: 'Sarah Johnson',
        date: 'January 15, 2026',
        readTime: '8 min read',
        category: 'Education Tech',
        image: 'bi-rocket-takeoff'
    };

    const blogPosts = [
        {
            title: '10 Effective Study Techniques Backed by Science',
            excerpt: 'Learn evidence-based strategies that can transform your study sessions and improve retention.',
            author: 'Dr. Michael Chen',
            date: 'January 12, 2026',
            readTime: '6 min read',
            category: 'Study Tips',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            title: 'How to Choose the Right Online Tutor',
            excerpt: 'A comprehensive guide to finding the perfect tutor for your learning needs and goals.',
            author: 'Emily Rodriguez',
            date: 'January 10, 2026',
            readTime: '5 min read',
            category: 'For Students',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            title: 'Building a Successful Online Teaching Business',
            excerpt: 'Essential tips for teachers looking to grow their online tutoring practice.',
            author: 'James Parker',
            date: 'January 8, 2026',
            readTime: '7 min read',
            category: 'For Teachers',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            title: 'The Psychology of Motivation in Learning',
            excerpt: 'Understanding what drives students and how to maintain learning momentum.',
            author: 'Dr. Lisa Anderson',
            date: 'January 5, 2026',
            readTime: '9 min read',
            category: 'Psychology',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            title: 'Gamification in Education: Does It Really Work?',
            excerpt: 'Exploring the effectiveness of game-based learning in modern education.',
            author: 'Alex Thompson',
            date: 'January 3, 2026',
            readTime: '6 min read',
            category: 'Education Tech',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            title: 'Time Management Strategies for Busy Students',
            excerpt: 'Practical tips to balance studies, extracurriculars, and personal life.',
            author: 'Maria Garcia',
            date: 'December 30, 2025',
            readTime: '5 min read',
            category: 'Study Tips',
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        }
    ];

    const categories = ['All', 'Study Tips', 'For Students', 'For Teachers', 'Education Tech', 'Psychology'];

    return (
        <div className="blog-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">
                                <i className="bi bi-newspaper me-3"></i>
                                Our Blog
                            </h1>
                            <p className="hero-description">
                                Insights, tips, and stories about education, learning, and personal growth from our team and community.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="featured-section">
                <div className="container">
                    <div className="featured-post">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-6">
                                <div className="featured-icon-wrapper">
                                    <i className={`bi ${featuredPost.image}`}></i>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="featured-badge">Featured Post</div>
                                <h2 className="featured-title">{featuredPost.title}</h2>
                                <p className="featured-excerpt">{featuredPost.excerpt}</p>
                                <div className="post-meta">
                                    <span className="meta-item">
                                        <i className="bi bi-person me-1"></i>
                                        {featuredPost.author}
                                    </span>
                                    <span className="meta-item">
                                        <i className="bi bi-calendar me-1"></i>
                                        {featuredPost.date}
                                    </span>
                                    <span className="meta-item">
                                        <i className="bi bi-clock me-1"></i>
                                        {featuredPost.readTime}
                                    </span>
                                </div>
                                <button className="read-more-btn">
                                    Read Article
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="filter-section">
                <div className="container">
                    <div className="category-filter">
                        {categories.map((category, index) => (
                            <button key={index} className={`category-btn ${index === 0 ? 'active' : ''}`}>
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="blog-grid-section">
                <div className="container">
                    <div className="row g-4">
                        {blogPosts.map((post, index) => (
                            <div key={index} className="col-md-6 col-lg-4">
                                <div className="blog-card">
                                    <div
                                        className="blog-card-header"
                                        style={{ background: post.gradient }}
                                    >
                                        <span className="category-badge">{post.category}</span>
                                    </div>
                                    <div className="blog-card-body">
                                        <h3 className="blog-card-title">{post.title}</h3>
                                        <p className="blog-card-excerpt">{post.excerpt}</p>
                                        <div className="blog-card-meta">
                                            <div className="author-info">
                                                <i className="bi bi-person-circle me-2"></i>
                                                <span>{post.author}</span>
                                            </div>
                                            <div className="date-info">
                                                <i className="bi bi-calendar3 me-1"></i>
                                                {post.date}
                                            </div>
                                            <div className="read-time">
                                                <i className="bi bi-clock me-1"></i>
                                                {post.readTime}
                                            </div>
                                        </div>
                                        <button className="read-article-btn">
                                            Read More
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="newsletter-cta-section">
                <div className="container">
                    <div className="newsletter-cta">
                        <h2 className="cta-title">Never Miss a Post</h2>
                        <p className="cta-description">
                            Subscribe to our newsletter and get the latest articles delivered straight to your inbox.
                        </p>
                        <Link to="/" className="cta-btn">
                            <i className="bi bi-envelope me-2"></i>
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .blog-page {
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

        .featured-post {
          background: white;
          border-radius: 25px;
          padding: 3rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .featured-icon-wrapper {
          width: 100%;
          height: 300px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 8rem;
        }

        .featured-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .featured-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .featured-excerpt {
          font-size: 1.125rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .post-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
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

        .read-more-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .read-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .filter-section {
          padding: 2rem 0;
        }

        .category-filter {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .category-btn {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 50px;
          color: #64748b;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-btn:hover,
        .category-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .blog-grid-section {
          padding: 2rem 0 3rem;
        }

        .blog-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .blog-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .blog-card-header {
          height: 150px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 1.5rem;
        }

        .category-badge {
          background: rgba(255, 255, 255, 0.9);
          color: #667eea;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .blog-card-body {
          padding: 2rem;
        }

        .blog-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1rem;
          line-height: 1.4;
          min-height: 60px;
        }

        .blog-card-excerpt {
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .blog-card-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .author-info,
        .date-info,
        .read-time {
          color: #64748b;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
        }

        .author-info i,
        .date-info i,
        .read-time i {
          color: #667eea;
        }

        .read-article-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .read-article-btn:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
        }

        .newsletter-cta-section {
          padding: 2rem 0 4rem;
        }

        .newsletter-cta {
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

          .featured-title {
            font-size: 1.5rem;
          }

          .cta-title {
            font-size: 1.75rem;
          }

          .featured-icon-wrapper {
            height: 200px;
            font-size: 5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default Blog;
