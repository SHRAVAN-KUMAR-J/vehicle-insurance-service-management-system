import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const [sectionsVisible, setSectionsVisible] = useState({});

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setSectionsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }, index * 200); // Staggered delay of 200ms per section
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.anim-section');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-container">
      {/* Hero Section */}
    <section
  id="hero"
  className={`hero-section anim-section ${sectionsVisible.hero ? 'visible' : ''}`}
  style={{
    backgroundImage: "url('https://wallpaperaccess.com/full/7180286.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    position: "relative"
  }}
>
  {/* Dark overlay for readability */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)"
    }}
  ></div>

  <div className="hero-content" style={{ position: "relative", zIndex: 2 }}>
    <h1>Vehicle Insurance Service Management Portal</h1>
    <p>Streamlining vehicle insurance management with seamless digital solutions</p>
    <Link to="/register" className="cta-button">Get Started</Link>
  </div>
</section>


      {/* Section 1: Introduction */}
      <section id="intro" className={`content-section anim-section ${sectionsVisible.intro ? 'visible' : ''}`}>
        <div className="section-content">
          <div className="image-container">
            <img
              src="https://news.leavitt.com/wp-content/uploads/2025/08/Vehicle-Insurance_web750.jpg"
              alt="Vehicle Insurance Management"
              className="section-image"
            />
          </div>
          <div className="text-container">
            <h2>Comprehensive Vehicle Insurance Management</h2>
            <p>
              Our Vehicle Insurance Service Management Portal revolutionizes how customers,
              staff, and administrators interact and manage vehicle insurance processes.
              This robust platform provides a seamless digital experience for all stakeholders
              involved in the insurance lifecycle.
            </p>
            <p>
              From vehicle registration to insurance approval and renewal reminders,
              our system ensures transparency, efficiency, and excellent customer service
              at every step of the journey.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Customer Features */}
      <section id="customer" className={`content-section alternate anim-section ${sectionsVisible.customer ? 'visible' : ''}`}>
        <div className="section-content">
          <div className="text-container">
            <h2>Customer Portal - Your Insurance Hub</h2>
            <p>
              As a customer, you have complete control over your vehicle insurance management.
              Register your vehicles with detailed information including registration number,
              chassis number, model, and specifications. Track the status of your insurance
              applications in real-time.
            </p>
            <ul className="feature-list">
              <li><span className="feature-icon">🚗</span> Add and manage multiple vehicles</li>
              <li><span className="feature-icon">📊</span> Track insurance application status</li>
              <li><span className="feature-icon">📥</span> Download approved insurance PDFs</li>
              <li><span className="feature-icon">🔔</span> Receive timely notifications</li>
              <li><span className="feature-icon">💬</span> Live chat support with staff</li>
              <li><span className="feature-icon">📋</span> View service history and details</li>
            </ul>
          </div>
          <div className="image-container">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/071/532/252/small/businessman-uses-fingerprint-login-for-secure-access-on-father-s-day-photo.jpeg"
              alt="Customer Portal Features"
              className="section-image"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Staff Workflow */}
      <section id="staff" className={`content-section anim-section ${sectionsVisible.staff ? 'visible' : ''}`}>
        <div className="section-content">
          <div className="image-container">
            <img
              src="https://media.istockphoto.com/id/1482410292/photo/staff-showing-id-staff-card-on-scanning-access-system-for-identity-verification-to-attendance.jpg?s=612x612&w=0&k=20&c=a8sPxrWJNXrnpKLlxSHDNImcMUfzTnULLw47yOUWQLk="
              alt="Staff Verification Process"
              className="section-image"
            />
          </div>
          <div className="text-container">
            <h2>Staff Verification & Processing</h2>
            <p>
              Our staff members play a crucial role in ensuring the authenticity and validity
              of insurance applications. When a customer registers a vehicle, our staff
              verifies the information against official government databases and insurance
              payment records.
            </p>
            <p>
              Staff members can upload insurance PDF documents linked to specific vehicle
              registration numbers, set insurance validity periods, and provide real-time
              support to customers through our integrated chat system.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Admin Oversight */}
      <section id="admin" className={`content-section alternate anim-section ${sectionsVisible.admin ? 'visible' : ''}`}>
        <div className="section-content">
          <div className="text-container">
            <h2>Administrative Control & Approval</h2>
            <p>
              Administrators maintain complete oversight of the insurance management process.
              They review uploaded insurance documents, approve valid applications, or reject
              problematic submissions with detailed reasons for transparency.
            </p>
            <p>
              Additional administrative capabilities include:
            </p>
            <ul className="feature-list">
              <li><span className="feature-icon">🔧</span> Create and manage insurance services</li>
              <li><span className="feature-icon">📊</span> Monitor system-wide activities</li>
              <li><span className="feature-icon">✅</span> Final approval authority for insurance documents</li>
              <li><span className="feature-icon">📝</span> Provide rejection reasons for transparency</li>
              <li><span className="feature-icon">👥</span> Manage user accounts and permissions</li>
            </ul>
          </div>
          <div className="image-container">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Admin Dashboard"
              className="section-image"
            />
          </div>
        </div>
      </section>

      {/* Section 5: Notification System */}
      <section id="notification" className={`content-section anim-section ${sectionsVisible.notification ? 'visible' : ''}`}>
        <div className="section-content">
          <div className="image-container">
            <img
              src="https://img.freepik.com/premium-vector/email-message-smartphone-message-notification-icondigital-marketing-concept_123447-4898.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Notification System"
              className="section-image"
            />
          </div>
          <div className="text-container">
            <h2>Smart Notification System</h2>
            <p>
              Stay informed with our comprehensive notification system that keeps all
              parties updated throughout the insurance lifecycle. Customers receive
              timely alerts for:
            </p>
            <ul className="feature-list">
              <li><span className="feature-icon">🔔</span> Payment status updates</li>
              <li><span className="feature-icon">✅</span> Insurance approval notifications</li>
              <li><span className="feature-icon">📅</span> Insurance date setting confirmations</li>
              <li><span className="feature-icon">⏰</span> Renewal reminders before expiry</li>
              <li><span className="feature-icon">❌</span> Application rejection with reasons</li>
            </ul>
            <p>
              Never miss important deadlines with our proactive reminder system that
              ensures continuous insurance coverage.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Live Chat Support */}
      <section id="chat" className={`content-section alternate anim-section ${sectionsVisible.chat ? 'visible' : ''}`}>
        <div className="section-content">
          <div className="text-container">
            <h2>Real-time Chat Support</h2>
            <p>
              Our integrated live chat system bridges the communication gap between
              customers and staff members. Customers can instantly connect with
              support staff to:
            </p>
            <ul className="feature-list">
              <li><span className="feature-icon">💬</span> Clear doubts about insurance procedures</li>
              <li><span className="feature-icon">🔍</span> Get assistance with document submission</li>
              <li><span className="feature-icon">📋</span> Understand insurance terms and conditions</li>
              <li><span className="feature-icon">⚡</span> Receive immediate responses to queries</li>
              <li><span className="feature-icon">🛠️</span> Troubleshoot technical issues</li>
            </ul>
            <p>
              This real-time communication ensures that customers receive prompt
              assistance and guidance throughout their insurance journey.
            </p>
          </div>
          <div className="image-container">
            <img
              src="https://media.gettyimages.com/id/1467438291/photo/connecting-with-social-media-network-via-smartphone.jpg?s=612x612&w=gi&k=20&c=bXExfgQMoOy4n24olgG1LgC8ROVF8wci3LNUp-Hm1Dc="
              alt="Live Chat Support"
              className="section-image"
            />
          </div>
        </div>
      </section>

      {/* Section 7: Workflow Summary */}
      <section id="workflow" className={`content-section anim-section ${sectionsVisible.workflow ? 'visible' : ''}`}>
        <div className="section-content">
          <div className="image-container">
            <img
              src="https://www.cflowapps.com/wp-content/uploads/2020/07/workflow-automation-examples.png"
              alt="Insurance Workflow"
              className="section-image"
            />
          </div>
          <div className="text-container">
            <h2>Seamless Workflow Process</h2>
            <div className="workflow-steps">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h4>Vehicle Registration</h4>
                  <p>Customer adds vehicle details including registration number, chassis number, and model specifications</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h4>Staff Verification</h4>
                  <p>Staff verifies vehicle details and insurance payment status through official channels</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h4>Document Upload</h4>
                  <p>Staff uploads insurance PDF documents linked to vehicle registration numbers</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">4</span>
                <div className="step-content">
                  <h4>Admin Approval</h4>
                  <p>Administrator reviews and approves/rejects documents with proper reasoning</p>
                </div>
              </div>
              <div className="step">
                <span className="step-number">5</span>
                <div className="step-content">
                  <h4>Customer Access</h4>
                  <p>Customer receives notifications and can download approved insurance documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className={`cta-section anim-section ${sectionsVisible.cta ? 'visible' : ''}`}>
        <div className="cta-content">
          <h2>Ready to Manage Your Vehicle Insurance?</h2>
          <p>Join thousands of satisfied customers using our comprehensive insurance management platform</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Sign Up Now</Link>
            <Link to="/login" className="cta-button secondary">Login to Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;