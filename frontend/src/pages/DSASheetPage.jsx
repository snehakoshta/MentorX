import React, { useState, useEffect } from "react";
import "../styles/dsaSheet.css";
import paymentQR from "../assets/QR.jpg";

const topics = [
  { name: "Arrays", video: "https://www.youtube.com/embed/0oDAlMwTrLo" },
  { name: "Strings", video: "https://www.youtube.com/embed/ZphK_cm1Zfw" },
  { name: "Graphs", video: "https://www.youtube.com/embed/0dJr1xYhYlI" },
  {
    name: "Dynamic Programming (DP)",
    video: "https://www.youtube.com/embed/tyB0ztf0DNY",
  },
  { name: "Trees", video: "https://www.youtube.com/embed/_SiwrPXG9-g" },
  {
    name: "Recursion & Backtracking",
    video: "https://www.youtube.com/embed/KEEKn7Me-ms",
  },
  {
    name: "Searching & Sorting",
    video: "https://www.youtube.com/embed/Tl2vnY1A_Rw",
  },
  { name: "Stack & Queue", video: "https://www.youtube.com/embed/wjI1WNcIntg" },
  { name: "Linked List", video: "https://www.youtube.com/embed/q8gdBn9RPeI" },
];

export default function DSASheetPage() {
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const isPaid = localStorage.getItem("dsaPaid") === "true";
    setPaid(isPaid);
  }, []);

  const handleViewProblems = () => {
    if (paid) {
      window.location.href = "/problems"; // Redirect if paid
    } else {
      alert("🔒 Please pay ₹50 to unlock problems.");
    }
  };

  const handlePayment = async () => {
    try {
      // Open QR/payment gateway page
      window.open("https://your-payment-gateway.com/pay?amount=50", "_blank");

      // Simulate email submission after payment
      const email = prompt("Enter your email to receive confirmation:");
      const res = await fetch("/api/payment-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        alert("💳 Payment verified! Problems unlocked.");
        localStorage.setItem("dsaPaid", "true");
        setPaid(true);
        window.location.href = "/problems";
      } else {
        alert("❌ Payment verification failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong. Try again.");
    }
  };

  return (
    <section className="dsa-sheet-container">
      <h2 className="dsa-title animate-fade">📘 DSA Preparation Sheet</h2>
      <p className="dsa-subtitle animate-slide">
        Master Data Structures & Algorithms with topic-wise problems & videos 🚀
        to unlock the videos and problems below, please complete the payment.
      </p>

      <div className="topics-grid">
        {topics.map((topic, index) => (
          <div key={index} className="topic-card animate-zoom">
            <h3 className="topic-title">{topic.name}</h3>
            <div className="video-wrapper">
              <iframe
                src={topic.video}
                title={topic.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <button className="topic-btn" onClick={handleViewProblems}>
              {paid ? "📂 View Problems" : "🔒 Pay to Unlock"}
            </button>
          </div>
        ))}
      </div>

      {!paid && (
        <div className="payment-section animate-bounce">
          <p className="price-text">
            <strong>💰 Price: ₹50</strong>
          </p>
          <img
            src={paymentQR}
            alt="Payment QR Code"
            className="qr-code"
            onClick={handlePayment}
            style={{ cursor: "pointer" }}
          />
          <p className="payment-msg">
            Scan the QR or click it to unlock the full sheet & exclusive video
            solutions ✅
          </p>
        </div>
      )}
    </section>
  );
}
