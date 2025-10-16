// ✅ src/pages/BookNowPage.jsx
import React, { useState } from "react";
import "../styles/booknow.css";
import { useParams } from "react-router-dom";

export default function BookNowPage() {
  const { serviceName } = useParams();

  // 🟦 Form States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(serviceName || "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

  // 🟦 Booking Handler
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email || !service || !date || !timeSlot) {
      setMessage("⚠️ Please fill all the fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BASE_API_URL}/api/booking/book-slot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          service,
          date,
          time: timeSlot,
          timeSlot,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("🎉 " + (data.message || "Booking successful!"));
        setName("");
        setPhone("");
        setEmail("");
        setService(serviceName || "");
        setDate("");
        setTimeSlot("");
      } else {
        setMessage("❌ " + (data.message || "Booking failed!"));
      }
    } catch (err) {
      console.error("Booking Error:", err);
      setMessage("❌ Something went wrong while booking the slot.");
    }

    setLoading(false);
  };

  return (
    <div className="booknow-wrapper">
      <div className="booknow-card">
        <h2 className="booknow-title">Book Your Slot</h2>
        <form onSubmit={handleBooking} className="booknow-form">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">Select Service</option>
            <option value="Technical Training">Technical Training</option>
            <option value="Career Guidance">Career Guidance</option>
            <option value="DSA">DSA</option>
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
          >
            <option value="">Select Time Slot</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="12:00 PM">12:00 PM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Slot"}
          </button>
        </form>
        {message && <p className="booking-message">{message}</p>}
      </div>
    </div>
  );
} 