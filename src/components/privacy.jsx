import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
    // Helper function to convert section title to ID
    const titleToId = (title) => {
        return title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // Smooth scroll function
    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const tableOfContents = [
        'WHAT INFORMATION DO WE COLLECT?',
        'HOW DO WE PROCESS YOUR INFORMATION?',
        'WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?',
        'WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
        'DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
        'HOW LONG DO WE KEEP YOUR INFORMATION?',
        'HOW DO WE KEEP YOUR INFORMATION SAFE?',
        'WHAT ARE YOUR PRIVACY RIGHTS?',
        'CONTROLS FOR DO-NOT-TRACK FEATURES',
        'DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?',
        'DO WE MAKE UPDATES TO THIS NOTICE?',
        'HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
        'HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?'
    ];

    const sections = [
        {
            title: 'WHAT INFORMATION DO WE COLLECT?',
            icon: 'bi-collection',
            content: [
                {
                    subtitle: 'Personal information you disclose to us',
                    text: 'In Short: We collect personal information that you provide to us. We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us. Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following: names, phone numbers, email addresses, usernames. Sensitive Information. We do not process sensitive information. Payment Data. We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by Stripe. You may find their privacy notice link(s) here: https://stripe.com/privacy. All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.'
                }
            ]
        },
        {
            title: 'HOW DO WE PROCESS YOUR INFORMATION?',
            icon: 'bi-gear',
            content: [
                {
                    text: 'In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your personal information for a variety of reasons, depending on how you interact with our Services, including: To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order. To protect our Services. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention. To save or protect an individual\'s vital interest. We may process your information when necessary to save or protect an individual\'s vital interest, such as to prevent harm.'
                }
            ]
        },
        {
            title: 'WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?',
            icon: 'bi-balance',
            content: [
                {
                    text: 'In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests. The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information: Consent. We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about withdrawing your consent. Legitimate Interests. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to: Diagnose problems and/or prevent fraudulent activities. Legal Obligations. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved. Vital Interests. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person. In legal terms, we are generally the "data controller" under European data protection laws of the personal information described in this Privacy Notice, since we determine the means and/or purposes of the data processing we perform. This Privacy Notice does not apply to the personal information we process as a "data processor" on behalf of our customers. In those situations, the customer that we provide services to and with whom we have entered into a data processing agreement is the "data controller" responsible for your personal information, and we merely process your information on their behalf in accordance with your instructions. If you want to know more about our customers\' privacy practices, you should read their privacy policies and direct any questions you have to them.'
                }
            ]
        },
        {
            title: 'WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?',
            icon: 'bi-share',
            content: [
                {
                    text: 'In Short: We may share information in specific situations described in this section and/or with the following third parties. We may need to share your personal information in the following situations: Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.'
                }
            ]
        },
        {
            title: 'DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
            icon: 'bi-cookie',
            content: [
                {
                    text: 'In Short: We may use cookies and other tracking technologies to collect and store your information. We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions. We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice. Google Analytics: We may share your information with Google Analytics to track and analyze the use of the Services. The Google Analytics Advertising Features that we may use include: Remarketing with Google Analytics. To opt out of being tracked by Google Analytics across the Services, visit https://tools.google.com/dlpage/gaoptout. You can opt out of Google Analytics Advertising Features through Ads Settings and Ad Settings for mobile apps. Other opt out means include http://optout.networkadvertising.org/ and http://www.networkadvertising.org/mobile-choice. For more information on the privacy practices of Google, please visit the Google Privacy & Terms page.'
                }
            ]
        },
        {
            title: 'HOW LONG DO WE KEEP YOUR INFORMATION?',
            icon: 'bi-clock-history',
            content: [
                {
                    text: 'In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law. We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.'
                }
            ]
        },
        {
            title: 'HOW DO WE KEEP YOUR INFORMATION SAFE?',
            icon: 'bi-shield-check',
            content: [
                {
                    text: 'In Short: We aim to protect your personal information through a system of organizational and technical security measures. We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.'
                }
            ]
        },
        {
            title: 'WHAT ARE YOUR PRIVACY RIGHTS?',
            icon: 'bi-person-check',
            content: [
                {
                    text: 'In Short: In some regions, such as the European Economic Area (EEA), United Kingdom (UK), and Switzerland, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence. In some regions (like the EEA, UK, and Switzerland), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below. We will consider and act upon any request in accordance with applicable data protection laws. If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your Member State data protection authority or UK data protection authority. If you are located in Switzerland, you may contact the Federal Data Protection and Information Commissioner. Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below or updating your preferences. However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent. Account Information: If you would at any time like to review or change the information in your account or terminate your account, you can: Log in to your account settings and update your user account. Contact us using the contact information provided. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements. If you have questions or comments about your privacy rights, you may email us at info@funnystudylearning.com.'
                }
            ]
        },
        {
            title: 'CONTROLS FOR DO-NOT-TRACK FEATURES',
            icon: 'bi-eye-slash',
            content: [
                {
                    text: 'Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.'
                }
            ]
        },
        {
            title: 'DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS?',
            icon: 'bi-globe',
            content: [
                {
                    subtitle: 'In Short',
                    text: 'You may have additional rights based on the country you reside in.'
                },
                {
                    subtitle: 'Australia and New Zealand',
                    text: 'We collect and process your personal information under the obligations and conditions set by Australia\'s Privacy Act 1988 and New Zealand\'s Privacy Act 2020 (Privacy Act). This Privacy Notice satisfies the notice requirements defined in both Privacy Acts, in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information. If you do not wish to provide the personal information necessary to fulfill their applicable purpose, it may affect our ability to provide our services, in particular: offer you the products or services that you want, respond to or help with your requests, manage your account with us, confirm your identity and protect your account. At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?" If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the Office of the Australian Information Commissioner and a breach of New Zealand\'s Privacy Principles to the Office of New Zealand Privacy Commissioner.'
                },
                {
                    subtitle: 'Republic of South Africa',
                    text: 'At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?" If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are: The Information Regulator (South Africa) General enquiries: enquiries@inforegulator.org.za Complaints (complete POPIA/PAIA form 5): PAIAComplaints@inforegulator.org.za & POPIAComplaints@inforegulator.org.za'
                }
            ]
        },
        {
            title: 'DO WE MAKE UPDATES TO THIS NOTICE?',
            icon: 'bi-arrow-repeat',
            content: [
                {
                    text: 'In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws. We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.'
                }
            ]
        },
        {
            title: 'HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
            icon: 'bi-envelope',
            content: [
                {
                    text: 'If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO) by email at info@funnystudylearning.com, by phone at +447949053333, or contact us by post at: Funny Study Learning Academy, Data Protection Officer, 1, Beechwood Road, Dudley, West Midlands DY2 7QA, United Kingdom. If you are a resident in the European Economic Area, we are the "data controller" of your personal information. We have appointed Ms Nadeera to be our representative in the EEA. You can contact them directly regarding our processing of your information, by email at info@funnystudylearning.com, by visiting info@funnystudylearning.com, by phone at +447949053333, or by post to: https://www.funnystudylearning.com/contact, 1, Beechwood Road, Dudley, West Midlands DY2 7QA, United Kingdom. If you are a resident in the United Kingdom, we are the "data controller" of your personal information. We have appointed Ms Nadeera to be our representative in the UK. You can contact them directly regarding our processing of your information, by email at info@funnystudylearning.com, by visiting https://www.funnystudylearning.com/contact, by phone at +447949053333, or by post to: 1, Beechwood Road, Dudley, West Midlands DY2 7QA, England.'
                }
            ]
        },
        {
            title: 'HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?',
            icon: 'bi-file-earmark-check',
            content: [
                {
                    text: 'Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please visit: https://www.funnystudylearning.com/contact.'
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
                                PRIVACY POLICY
                            </h1>
                            <div className="last-updated">
                                Last updated January 21, 2026
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
                            This Privacy Notice for Funny Study Learning Academy ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
                        </p>
                        <ul className="intro-list">
                            <li>Visit our website at https://www.funnystudylearning.com or any website of ours that links to this Privacy Notice</li>
                            <li>Use Learning Academy. We're on a mission to transform education by connecting passionate teachers with motivated students worldwide.</li>
                            <li>Engage with us in other related ways, including any marketing or events</li>
                        </ul>
                        <p className="intro-text">
                            Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at info@funnystudylearning.com.
                        </p>
                    </div>
                </div>
            </section>

            {/* Summary Section */}
            <section className="summary-section">
                <div className="container">
                    <div className="summary-card">
                        <h2 className="summary-title">SUMMARY OF KEY POINTS</h2>
                        <p className="summary-intro">
                            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
                        </p>
                        <div className="summary-points">
                            <div className="summary-point">
                                <strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. <a href="#what-information-do-we-collect">Learn more about personal information you disclose to us.</a>
                            </div>
                            <div className="summary-point">
                                <strong>Do we process any sensitive personal information?</strong> Some of the information may be considered "special" or "sensitive" in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.
                            </div>
                            <div className="summary-point">
                                <strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.
                            </div>
                            <div className="summary-point">
                                <strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. <a href="#how-do-we-process-your-information">Learn more about how we process your information.</a>
                            </div>
                            <div className="summary-point">
                                <strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties. <a href="#when-and-with-whom-do-we-share-your-personal-information">Learn more about when and with whom we share your personal information.</a>
                            </div>
                            <div className="summary-point">
                                <strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. <a href="#how-do-we-keep-your-information-safe">Learn more about how we keep your information safe.</a>
                            </div>
                            <div className="summary-point">
                                <strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. <a href="#what-are-your-privacy-rights">Learn more about your privacy rights.</a>
                            </div>
                            <div className="summary-point">
                                <strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by visiting <a href="https://www.funnystudylearning.com/contact">https://www.funnystudylearning.com/contact</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
                            </div>
                            <div className="summary-point">
                                <strong>Want to learn more about what we do with any information we collect?</strong> <a href="#table-of-contents">Review the Privacy Notice in full.</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="toc-section">
                <div className="container">
                    <div className="toc-card">
                        <h2 className="toc-title" id="table-of-contents">TABLE OF CONTENTS</h2>
                        <ol className="toc-list">
                            {tableOfContents.map((item, index) => {
                                const sectionId = titleToId(item);
                                return (
                                    <li key={index} className="toc-item">
                                        <a 
                                            href={`#${sectionId}`}
                                            onClick={(e) => scrollToSection(e, sectionId)}
                                            className="toc-link"
                                        >
                                            {index + 1}. {item}
                                        </a>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>
            </section>

            {/* Policy Sections */}
            <section className="sections-area">
                <div className="container">
                    {sections.map((section, index) => {
                        const sectionId = titleToId(section.title);
                        return (
                            <div key={index} id={sectionId} className="policy-section">
                                <div className="section-header">
                                    <div className="section-icon">
                                        <i className={`bi ${section.icon}`}></i>
                                    </div>
                                    <h2 className="section-title">{section.title}</h2>
                                </div>
                                <div className="section-content">
                                    {section.content.map((item, idx) => (
                                        <div key={idx} className="content-block">
                                            {item.subtitle && <h3 className="content-subtitle">{item.subtitle}</h3>}
                                            <p className="content-text">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
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

        .intro-list {
          list-style: none;
          padding-left: 0;
          margin: 1.5rem 0;
        }

        .intro-list li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: #2c3e50;
          line-height: 1.8;
        }

        .intro-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
          font-size: 1.5rem;
        }

        .summary-section {
          padding: 2rem 0;
        }

        .summary-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .summary-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }

        .summary-intro {
          font-size: 1.125rem;
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .summary-points {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .summary-point {
          font-size: 1rem;
          color: #2c3e50;
          line-height: 1.8;
          padding: 1rem;
          background: #f8f9fa;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .summary-point strong {
          color: #2c3e50;
          display: block;
          margin-bottom: 0.5rem;
        }

        .summary-point a {
          color: #667eea;
          text-decoration: none;
        }

        .summary-point a:hover {
          text-decoration: underline;
        }

        .toc-section {
          padding: 2rem 0;
        }

        .toc-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .toc-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        .toc-list {
          list-style: none;
          counter-reset: toc-counter;
          padding: 0;
          margin: 0;
        }

        .toc-item {
          counter-increment: toc-counter;
          padding: 0.75rem 0;
          padding-left: 2rem;
          position: relative;
          font-size: 1rem;
          line-height: 1.6;
        }

        .toc-item::before {
          content: counter(toc-counter) ". ";
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #667eea;
        }

        .toc-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.3s ease;
          display: block;
        }

        .toc-link:hover {
          color: #667eea;
          cursor: pointer;
        }

        .toc-item:hover .toc-link {
          color: #667eea;
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
          scroll-margin-top: 100px;
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
          scroll-margin-top: 100px;
        }

        .contact-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
        }

        .contact-footer {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
          font-style: italic;
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
