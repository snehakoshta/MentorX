// src/pages/ServicesPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/services.css";

export default function ServicesPage() {
  const navigate = useNavigate();

  const services = [
    {
      title: "Career Guidance",
      description:
        "Personalized mentorship sessions to help you plan your career path.",
    },
    {
      title: "Technical Training",
      description:
        "Hands-on coding and DSA sessions tailored to your learning goals.",
    },
    {
      title: "Interview Prep",
      description:
        "Mock interviews and practice questions to boost your confidence.",
    },
  ];

  const handleBookNow = (service) => {
    navigate(`/book-now/${encodeURIComponent(service)}`);
  };

  return (
    <section className="services-wrapper">
      <div className="services-container">
        <h2 className="services-title">Our Services</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="card-content">
                <div className="text-section">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <button
                    className="book-btn"
                    onClick={() => handleBookNow(service.title)}
                  >
                    Book Now
                  </button>
                </div>
                {/* Removed image section */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
