import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import profileIcon from "../assets/career.png"; // Hero image
import jobIcon from "../assets/OIP.jpg"; // Job portal image

export default function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/get-started");
  };

  const handleAccessDSASheet = () => {
    navigate("/dsa-sheet");
  };

  const handleChatWithMentor = () => {
    navigate("/chat");
  };

  const handleExploreJobs = () => {
    navigate("/jobs");
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <div className="home-container">
        <div className="home-left">
          <h1 className="home-title">Career Guidance Mentorship</h1>
          <p className="home-subtitle">
            Helping students and professionals achieve their goals with guidance, resources, and one-on-one mentorship.
          </p>

          <div className="home-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="btn-secondary" onClick={handleAccessDSASheet}>
              DSA Sheet Access with Solutions
            </button>
          </div>

          <div className="chat-container">
            <button className="chat-btn" onClick={handleChatWithMentor}>
              Chat with Mentor
            </button>
          </div>
        </div>

        <div className="home-right">
          <img src={profileIcon} alt="Mentorship Icon" className="home-image" />
        </div>
      </div>

      {/* Job Portal Section */}
      <div className="video-section">
        <div className="video-left">
          <img src={jobIcon} alt="Job Portal" className="promo-video" />
        </div>
        <div className="video-right">
          <h2 className="video-title">Explore Job Opportunities</h2>
          <p className="video-desc">
            Access hundreds of real job openings from top companies. Filter by role, company, or location and apply directly using official links.
          </p>
          <ul className="video-points">
            <li>✅ 50+ top companies listed with official application links</li>
            <li>✅ Search by role, company, or location</li>
            <li>✅ Apply directly and track your applications</li>
          </ul>
          <button className="btn-primary" onClick={handleExploreJobs}>
            Explore Jobs
          </button>
        </div>
      </div>

      {/* Footer Upper Section */}
      <div className="footer-upper-section">
        <h2 className="footer-upper-title">Join Our Community</h2>
        <p className="footer-upper-desc">
          Subscribe to our newsletter to get the latest mentorship tips, job updates, and career guidance directly in your inbox.
        </p>
        <div className="footer-upper-input">
          <input type="email" placeholder="Enter your email" />
          <button className="btn-primary">Subscribe</button>
        </div>
      </div>
    </div>
  );
}
