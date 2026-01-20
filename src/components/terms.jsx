import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
    const sections = [
        {
            title: 'Acceptance of Terms',
            icon: 'bi-check-circle',
            content: [
                {
                    subtitle: 'Agreement to Terms',
                    text: 'By accessing or using Funny Study Learning Academy, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.'
                },
                {
                    subtitle: 'Changes to Terms',
                    text: 'We reserve the right to modify these terms at any time. Your continued use of the platform after such changes constitutes acceptance of the new terms.'
                }
            ]
        },
        {
            title: 'User Accounts',
            icon: 'bi-person-circle',
            content: [
                {
                    subtitle: 'Account Creation',
                    text: 'To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.'
                },
                {
                    subtitle: 'Account Security',
                    text: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.'
                },
                {
                    subtitle: 'Account Termination',
                    text: 'We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our sole discretion.'
                }
            ]
        },
        {
            title: 'User Responsibilities',
            icon: 'bi-clipboard-check',
            content: [
                {
                    subtitle: 'Prohibited Conduct',
                    text: 'You agree not to: (a) violate any laws or regulations; (b) infringe upon others\' intellectual property rights; (c) transmit harmful code or viruses; (d) harass or abuse other users; (e) engage in fraudulent activities; or (f) interfere with the platform\'s operation.'
                },
                {
                    subtitle: 'Content Standards',
                    text: 'Any content you submit must be accurate, not confidential, and not violate any third-party rights. You retain ownership of your content but grant us a license to use it to provide our services.'
                },
                {
                    subtitle: 'Teacher Obligations',
                    text: 'Teachers must provide accurate credentials, deliver quality instruction, maintain professional conduct, and comply with all applicable regulations regarding education services.'
                }
            ]
        },
        {
            title: 'Payment Terms',
            icon: 'bi-credit-card',
            content: [
                {
                    subtitle: 'Fees and Billing',
                    text: 'Certain services require payment. You agree to pay all fees associated with your use of paid services. All fees are non-refundable unless otherwise stated.'
                },
                {
                    subtitle: 'Subscription Services',
                    text: 'Subscription fees are billed in advance on a recurring basis. You authorize us to charge your payment method periodically. You may cancel your subscription at any time.'
                },
                {
                    subtitle: 'Payment Processing',
                    text: 'We use third-party payment processors. By providing payment information, you agree to the terms and privacy policies of these processors.'
                },
                {
                    subtitle: 'Teacher Payments',
                    text: 'Teachers will receive payment for their services according to agreed-upon rates. We may deduct platform fees and applicable taxes from teacher earnings.'
                }
            ]
        },
        {
            title: 'Intellectual Property',
            icon: 'bi-shield-check',
            content: [
                {
                    subtitle: 'Platform Ownership',
                    text: 'All content, features, and functionality of the platform are owned by Funny Study Learning Academy and are protected by copyright, trademark, and other intellectual property laws.'
                },
                {
                    subtitle: 'Limited License',
                    text: 'We grant you a limited, non-exclusive, non-transferable license to access and use the platform for personal, non-commercial purposes in accordance with these terms.'
                },
                {
                    subtitle: 'User Content License',
                    text: 'By posting content, you grant us a worldwide, royalty-free license to use, reproduce, modify, and display such content in connection with operating and promoting the platform.'
                }
            ]
        },
        {
            title: 'Disclaimers',
            icon: 'bi-exclamation-triangle',
            content: [
                {
                    subtitle: 'Service "As Is"',
                    text: 'The platform is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability or fitness for a particular purpose.'
                },
                {
                    subtitle: 'Educational Results',
                    text: 'We do not guarantee any specific educational outcomes or results. Success depends on many factors including student effort, teacher quality, and individual circumstances.'
                },
                {
                    subtitle: 'Third-Party Content',
                    text: 'We are not responsible for the accuracy, completeness, or reliability of content provided by teachers or other third parties on the platform.'
                }
            ]
        },
        {
            title: 'Limitation of Liability',
            icon: 'bi-shield-exclamation',
            content: [
                {
                    subtitle: 'Liability Cap',
                    text: 'To the maximum extent permitted by law, our total liability for any claims arising from your use of the platform shall not exceed the amount you paid us in the past 12 months.'
                },
                {
                    subtitle: 'Excluded Damages',
                    text: 'We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses.'
                }
            ]
        },
        {
            title: 'Indemnification',
            icon: 'bi-shield-fill-check',
            content: [
                {
                    subtitle: 'User Indemnity',
                    text: 'You agree to indemnify and hold harmless Funny Study Learning Academy from any claims, damages, or expenses arising from your use of the platform, your violation of these terms, or your violation of any rights of another party.'
                }
            ]
        },
        {
            title: 'Dispute Resolution',
            icon: 'bi-balance',
            content: [
                {
                    subtitle: 'Governing Law',
                    text: 'These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to conflict of law principles.'
                },
                {
                    subtitle: 'Arbitration',
                    text: 'Any disputes arising from these terms or your use of the platform shall be resolved through binding arbitration rather than in court, except where prohibited by law.'
                },
                {
                    subtitle: 'Class Action Waiver',
                    text: 'You agree that disputes will be resolved on an individual basis and waive your right to participate in class actions or class arbitrations.'
                }
            ]
        },
        {
            title: 'General Provisions',
            icon: 'bi-file-text',
            content: [
                {
                    subtitle: 'Severability',
                    text: 'If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.'
                },
                {
                    subtitle: 'Entire Agreement',
                    text: 'These terms constitute the entire agreement between you and Funny Study Learning Academy regarding the use of the platform.'
                },
                {
                    subtitle: 'No Waiver',
                    text: 'Our failure to enforce any right or provision of these terms will not be deemed a waiver of such right or provision.'
                }
            ]
        }
    ];

    return (
        <div className="terms-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8 mx-auto text-center">
                            <h1 className="hero-title">
                                <i className="bi bi-file-text me-3"></i>
                                Terms of Service
                            </h1>
                            <p className="hero-description">
                                Please read these terms carefully before using our platform. These terms govern your use of Funny Study Learning Academy.
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
                            Welcome to Funny Study Learning Academy ("we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our website, mobile applications, and services (collectively, the "Platform").
                        </p>
                        <p className="intro-text">
                            By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Platform.
                        </p>
                    </div>
                </div>
            </section>

            {/* Terms Sections */}
            <section className="sections-area">
                <div className="container">
                    {sections.map((section, index) => (
                        <div key={index} className="terms-section">
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
                        <h2 className="contact-title">Questions About These Terms?</h2>
                        <p className="contact-description">
                            If you have any questions or concerns about these Terms of Service, please don't hesitate to contact us.
                        </p>
                        <div className="contact-info">
                            <div className="contact-item">
                                <i className="bi bi-envelope"></i>
                                <span>legal@funnystudy.com</span>
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
        .terms-page {
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

        .terms-section {
          background: white;
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .terms-section:hover {
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

export default Terms;
