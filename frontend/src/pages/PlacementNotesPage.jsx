// src/pages/PlacementNotesPage.jsx
import React, { useState, useEffect } from "react";
import "../styles/placementNotes.css";

import {
  FaDownload,
  FaCopy,
  FaLock,
  FaTimes,
  FaEye,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import QRImage from "../assets/QR.jpg";
const BASE_API_URL = process.env.BASE_API_URL;
const notesData = [
  {
    title: "DSA Patterns",
    content: "Arrays, Linked List, Sliding Window, DP shortcuts.",
    pdfLink: "F:/DSA Sheet For Paid Student.pdf",
  },
  {
    title: "Aptitude Tricks",
    content: "Time & Work, Probability, Permutation & Combination shortcuts.",
    pdfLink: "F:/Aptitude Formulas Questions.pdf",
  },
  {
    title: "Reasoning Tricks",
    content: "Blood Relations, Syllogism, Puzzles shortcuts,Direction.",
    pdfLink: "F:/Reasoning.pdf",
  },
  {
    title: "Verbal Ability",
    content: "Synonyms, Antonyms, One word substitution, Idioms & Phrases.",
    pdfLink: "F:/Verbal Ability.pdf",
  },
  {
    title: "Interview Questions",
    content: "HR Questions, Behavioral tips, STAR method examples.",
    pdfLink: "F:/HR INTERVIEW QUESTIONS.pdf",
  },
  {
    title: "Company Specific Notes",
    content:
      "TCS CodeVita patterns, Infosys coding rounds, Flipkart GRiD tips.",
    pdfLink: "F:/Tcs Infosys Flipkart Pdf.pdf",
  },
];

export default function PlacementNotesPage() {
  const [paid, setPaid] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${BASE_API_URL}/api/payment-status`, {
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .then((data) => setPaid(data.hasPaid))
        .catch((err) => console.error("Error fetching payment status:", err));
    }
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handlePayment = () => {
    setShowQR(true);

    // Simulate payment detection after QR scan (e.g., 5 seconds)
    setTimeout(async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${BASE_API_URL}/api/payment-success`, {
          method: "POST",
          headers: { Authorization: token },
        });
        const data = await res.json();

        if (data.hasPaid) {
          setPaid(true);
          setShowQR(false);
          setShowThanks(true);

          // Auto redirect after showing success
          setTimeout(() => {
            setShowThanks(false);
            navigate("/placement-notes");
            window.location.reload();
          }, 2000);
        }
      } catch (err) {
        console.error("Payment error:", err);
      }
    }, 5000); // simulate 5 sec delay for user to scan QR
  };

  return (
    <div className="placement-notes-container">
      <h1>📌 Placement Important & Useful Notes</h1>

      <div className="notes-grid">
        {notesData.map((note, index) => (
          <div
            key={index}
            className={`note-card ${paid ? "flipped" : ""}`}
            style={{ "--index": index }}
          >
            <div className="card-front">
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <div className="note-actions">
                <button onClick={() => handleCopy(note.content)}>
                  <FaCopy /> Copy
                </button>
                {!paid && (
                  <button onClick={handlePayment} className="locked-btn">
                    <FaLock /> Pay to Unlock
                  </button>
                )}
              </div>
            </div>

            {paid && (
              <div className="card-back">
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <div className="note-actions">
                  <a href={note.pdfLink} download className="download-btn">
                    <FaDownload /> Download
                  </a>
                  <button
                    onClick={() => window.open(note.pdfLink, "_blank")}
                    className="view-btn"
                  >
                    <FaEye /> View
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="payment-overlay">
          <div className="payment-modal">
            <button className="close-btn" onClick={() => setShowQR(false)}>
              <FaTimes />
            </button>
            <h2>Scan QR to Pay</h2>
            <img src={QRImage} alt="PhonePe QR Code" className="qr-image" />
            <p className="animated-text">
              Scan QR code to pay. Payment will be detected automatically.
            </p>
          </div>
        </div>
      )}

      {/* Thanks Popup */}
      {showThanks && (
        <div className="thanks-overlay">
          <div className="thanks-popup">
            <div className="success-animation">
              <div className="checkmark-circle">
                <div className="background"></div>
                <div className="checkmark draw"></div>
              </div>
            </div>
            <h2>Thanks for your payment!</h2>
            <p>Your notes are now unlocked 🎉</p>
            <a
              href="https://chat.whatsapp.com/YOUR_GROUP_LINK"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-link"
            >
              <FaWhatsapp /> Join our WhatsApp Group
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
