import React from "react";
import "../styles/Footer.css";
import { FaLinkedin, FaCode, FaGithub } from "react-icons/fa"; // ✅ added missing icons

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>My Mentorship Site</h2>
          <p>Guiding your career, one step at a time.</p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="/about" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className="footer-link">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="footer-link">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="/contact" className="footer-link">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="footer-link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/help" className="footer-link">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Follow Us</h4>
            <ul className="social-links">
              <li>
                <a
                  href="https://leetcode.com/u/snehakoshta/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <FaCode size={18} style={{ marginRight: "8px" }} />
                  LeetCode
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/sneha-koshta-bb9895272?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <FaLinkedin size={18} style={{ marginRight: "8px" }} />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/snehakoshta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <FaGithub size={18} style={{ marginRight: "8px" }} />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} My Mentorship Site. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
