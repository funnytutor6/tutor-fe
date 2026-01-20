import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    const sections = [
        {
            title: 'Information We Collect',
            icon: 'bi-collection',
            content: [
                {
                    subtitle: 'Personal Information',
                    text: 'We collect information you provide directly to us, such as your name, email address, profile information, and payment details when you register for an account, subscribe to our services, or communicate with us.'
                },
                {
                    subtitle: 'Usage Information',
                    text: 'We automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.'
                },
                {
                    subtitle: 'Educational Data',
                    text: 'For teachers and students, we collect information related to courses, lessons, progress tracking, and learning outcomes to provide and improve our educational services.'
                }
            ]
        },
        {
            title: 'How We Use Your Information',
            icon: 'bi-gear',
            content: [
                {
                    subtitle: 'Service Delivery',
                    text: 'We use your information to provide, maintain, and improve our services, process transactions, send notifications, and provide customer support.'
                },
                {
                    subtitle: 'Personalization',
                    text: 'To personalize your experience, recommend relevant content and teachers, and customize our services to your preferences and learning needs.'
                },
                {
                    subtitle: 'Communication',
                    text: 'To send you technical notices, updates, security alerts, support messages, and marketing communications (which you can opt out of at any time).'
                },
                {
                    subtitle: 'Analytics & Improvement',
                    text: 'To analyze usage patterns, track performance, conduct research, and improve our platform\'s functionality and user experience.'
                }
            ]
        },
        {
            title: 'Information Sharing',
            icon: 'bi-share',
            content: [
                {
                    subtitle: 'With Other Users',
                    text: 'Your profile information may be visible to other users to facilitate connections between students and teachers. You control what information is displayed in your profile settings.'
                },
                {
                    subtitle: 'Service Providers',
                    text: 'We share information with third-party service providers who perform services on our behalf, such as payment processing, data analytics, email delivery, and hosting services.'
                },
                {
                    subtitle: 'Legal Requirements',
                    text: 'We may disclose your information if required by law, in response to legal requests, or to protect our rights, privacy, safety, or property.'
                },
                {
                    subtitle: 'Business Transfers',
                    text: 'In connection with any merger, sale of company assets, financing, or acquisition, your information may be transferred to the acquiring entity.'
                }
            ]
        },
        {
            title: 'Data Security',
            icon: 'bi-shield-check',
            content: [
                {
                    subtitle: 'Security Measures',
                    text: 'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.'
                },
                {
                    subtitle: 'Encryption',
                    text: 'All sensitive data, including payment information, is transmitted using SSL encryption. We store passwords using secure hashing algorithms.'
                },
                {
                    subtitle: 'Access Controls',
                    text: 'We limit access to personal information to employees, contractors, and agents who need that information to operate, develop, or improve our services.'
                }
            ]
        },
        {
            title: 'Your Rights & Choices',
            icon: 'bi-person-check',
            content: [
                {
                    subtitle: 'Access & Update',
                    text: 'You can access and update your personal information through your account settings at any time.'
                },
                {
                    subtitle: 'Data Deletion',
                    text: 'You have the right to request deletion of your personal data. Contact us at privacy@funnystudy.com to submit a deletion request.'
                },
                {
                    subtitle: 'Marketing Opt-Out',
                    text: 'You can opt out of receiving promotional emails by clicking the "unsubscribe" link in any marketing email or adjusting your notification preferences.'
                },
                {
                    subtitle: 'Cookies',
                    text: 'Most web browsers allow you to control cookies through their settings. Note that disabling cookies may limit your ability to use certain features of our platform.'
                }
            ]
        },
        {
            title: 'Children\'s Privacy',
            icon: 'bi-people',
            content: [
                {
                    subtitle: 'Age Requirements',
                    text: 'Our services are not intended for children under 13. If we learn we have collected personal information from a child under 13, we will delete that information as quickly as possible.'
                },
                {
                    subtitle: 'Parental Consent',
                    text: 'For users between 13 and 18, we require parental or guardian consent before collecting any personal information.'
                }
            ]
        },
        {
            title: 'International Data Transfers',
            icon: 'bi-globe',
            content: [
                {
                    subtitle: 'Cross-Border Transfers',
                    text: 'Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.'
                }
            ]
        },
        {
            title: 'Changes to This Policy',
            icon: 'bi-arrow-repeat',
            content: [
                {
                    subtitle: 'Policy Updates',
                    text: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.'
                }
            ]
        }
    ];

    return (
        <div className="privacy-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">
                                <i className="bi bi-shield-lock me-3"></i>
                                Privacy Policy
                            </h1>
                            <p className="hero-description">
                                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                            </p>
                            <div className="last-updated">
                                Last Updated: January 1, 2026
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="intro-section">
                <div className="container">
                    <div className="intro-card">
                        <p className="intro-text">
                            Welcome to Funny Study Learning Academy. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy describes how we collect, use, share, and safeguard information when you use our platform and services.
                        </p>
                        <p className="intro-text">
                            By accessing or using our services, you agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
                        </p>
                    </div>
                </div>
            </section>

            {/* Policy Sections */}
            <section className="sections-area">
                <div className="container">
                    {sections.map((section, index) => (
                        <div key={index} className="policy-section">
                            <div className="section-header">
                                <div className="section-icon">
                                    <i className={`bi ${section.icon}`}></i>
                                </div>
                                <h2 className="section-title">{section.title}</h2>
                            </div>
                            <div className="section-content">
                                {section.content.map((item, idx) => (
                                    <div key={idx} className="content-block">
                                        <h3 className="content-subtitle">{item.subtitle}</h3>
                                        <p className="content-text">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="container">
                    <div className="contact-card">
                        <h2 className="contact-title">Questions About Privacy?</h2>
                        <p className="contact-description">
                            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us.
                        </p>
                        <div className="contact-info">
                            <div className="contact-item">
                                <i className="bi bi-envelope"></i>
                                <span>privacy@funnystudy.com</span>
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
        .privacy-page {
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
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .last-updated {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          animation: fadeInUp 1s ease-out;
        }

        .intro-section {
          padding: 4rem 0 2rem;
        }

        .intro-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .intro-text {
          font-size: 1.125rem;
          color: #2c3e50;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .intro-text:last-child {
          margin-bottom: 0;
        }

        .sections-area {
          padding: 2rem 0;
        }

        .policy-section {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .policy-section:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .section-icon {
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

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0;
        }

        .section-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .content-block {
          padding-left: 1rem;
          border-left: 3px solid #667eea;
        }

        .content-subtitle {
          font-size: 1.125rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.75rem;
        }

        .content-text {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
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

          .contact-title {
            font-size: 1.75rem;
          }

          .section-header {
            flex-direction: column;
            text-align: center;
          }

          .section-icon {
            margin: 0 auto;
          }
        }
      `}</style>
        </div>
    );
};

export default Privacy;
