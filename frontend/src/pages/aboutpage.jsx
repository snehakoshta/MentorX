// src/pages/AboutPage.js
import React, { useState, useEffect } from "react";
import "../styles/about.css";
import profileIcon from "../assets/profile.png";
import paymentQR from "../assets/QR..png";
import { FaLinkedin } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { SiLeetcode } from "react-icons/si";

export default function AboutPage() {
  const [timer, setTimer] = useState(0);
  const [showQR, setShowQR] = useState(true);
  const [notified, setNotified] = useState(false);
  const [showSheetLink, setShowSheetLink] = useState(false);
  const BASE_API_URL = process.env.BASE_API_URL;

  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/7089185009?text=Hi%20Sneha!%20I%20have%20completed%20the%20payment%20and%20want%20access%20to%20your%20LeetCode%20DSA%20sheet.",
      "_blank"
    );
  };

  // ✅ Countdown logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setShowQR(false);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleNotify = async () => {
    const name = prompt("Enter your name");
    const email = prompt("Enter your email");

    if (!name || !email) return alert("Name and email are required!");

    try {
      const res = await fetch(`${BASE_API_URL}/notify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      alert(data.message);

      setShowSheetLink(true);
      setNotified(true);
      handleWhatsAppClick();
    } catch (err) {
      console.error(err);
      alert("Error sending notification. Try again.");
    }
  };

  return (
    <div className="about-container">
      {/* --- Header Section --- */}
      <div className="about-header">
        <img src={profileIcon} alt="Profile" className="profile-icon" />
        <div className="intro-text">
          <h1>Sneha Koshta</h1>

          <h3 className="typing-text">
            <Typewriter
              words={[
                "MERN Stack Developer",
                "DSA Enthusiast",
                "Solved 450+ LeetCode Problems ",
                "Crack Internship to DRDO",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </h3>

          <p>
            Passionate learner & tech enthusiast with a focus on Machine
            Learning, Competitive Programming, and Software Development.
          </p>

          {/* --- Social Buttons --- */}
          <div className="button-group">
            <a
              href="https://www.linkedin.com/in/sneha-koshta-bb9895272"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-button"
            >
              <FaLinkedin size={20} style={{ marginRight: "8px" }} />
              View LinkedIn Profile
            </a>

            <a
              href="https://leetcode.com/u/sneha_koshta/"
              target="_blank"
              rel="noopener noreferrer"
              className="leetcode-button"
              style={{ marginLeft: "10px" }}
            >
              <SiLeetcode size={20} style={{ marginRight: "8px" }} /> View My
              LeetCode Profile
            </a>
          </div>
        </div>
      </div>

      {/* --- Achievements Section --- */}
      <div className="achievements-section fade-in">
        <h2>Achievements & Experiences</h2>
        <ul>
          <li>
            <strong>DRDO Internship:</strong> Hands-on research internship in
            defense technology projects.
          </li>
          <li>
            <strong>Google Student Ambassador:</strong> Represented Google in
            college, organized events & mentored peers.
          </li>
          <li>
            <strong>LeetCode:</strong> Solved 400+ competitive programming
            problems.
            <div className="promo-text">
              💥 <b>Get my curated LeetCode DSA Sheet for just ₹50!</b> 💥
              <br />
              🎯 Shortcut to placement success & campus prep 🚀
            </div>
          </li>
        </ul>

        {/* --- Payment Section --- */}
        <div className="payment-qr-container">
          <h3>Pay to Megha Kosta</h3>
          Get Access to DSA Sheet 👇
          {showQR && !timer ? (
            <div>
              <p className="scan-pay-text">⚡ Scan & Pay ⚡</p>

              <img
                src={paymentQR}
                alt="Payment QR Code"
                className="payment-qr glow-border"
                onClick={() => setTimer(10)} // start countdown
                style={{ cursor: "pointer" }}
              />

              <p>Click QR to scan & pay securely 👇</p>
            </div>
          ) : timer > 0 ? (
            <div>
              <img
                src={paymentQR}
                alt="Payment QR Code"
                className="payment-qr"
              />
              <p>⏳ Time left: {timer}s</p>
            </div>
          ) : (
            !notified && (
              <button className="leetcode-button" onClick={handleNotify}>
                📩 Notify on WhatsApp & Email
              </button>
            )
          )}
          {showSheetLink && (
            <div className="sheet-link-container">
              <a
                href="YOUR_LEETCODE_SHEET_LINK_HERE"
                target="_blank"
                rel="noopener noreferrer"
                className="leetcode-button"
              >
                📘 View My LeetCode DSA Sheet
              </a>
            </div>
          )}
        </div>
      </div>

      {/* --- Skills Section --- */}
      <div className="skills-section slide-in">
        <h2>Skills</h2>
        <p>
          Machine Learning | Python | Data Analysis | React | JavaScript |
          Problem Solving | HTML/CSS | Node.js | Express | MongoDB | Competitive
          Programming | Git & GitHub | Docker | RESTful APIs | SQL | Agile
          Methodologies
        </p>
      </div>
    </div>
  );
}
