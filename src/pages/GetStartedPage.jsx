// src/pages/GetStartedPage.js
import React, { useState } from "react";
import "../styles/getstart.css";

export default function GetStartedPage() {
  const [formData, setFormData] = useState({ name: "", email: "", goal: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Comment Section
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/get-started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setFormData({ name: "", email: "", goal: "" });
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (err) {
      setMessage("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Comment Section Handlers
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    // save with name + text
    setComments([
      ...comments,
      { name: formData.name || "Anonymous", text: newComment },
    ]);
    setNewComment("");
  };

  return (
    <div className="get-started-container">
      <h1 className="page-title">🚀 Get Started With Your Career</h1>
      <p className="page-subtitle">
        Practical guidance on building projects, mastering DSA, and grabbing
        opportunities like DRDO internships.
      </p>

      {/* Form */}
      <div className="form-section fade-in">
        <h2>Join the Journey</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="goal"
            placeholder="Your Career Goal"
            value={formData.goal}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : "Submit"}
          </button>
        </form>
        {message && <p className="success-msg">{message}</p>}
      </div>

      {/* Guidance Section */}
      <div className="guidance-section fade-in">
        <h2>📌 Roadmap to Success</h2>

        <div className="guidance-card slide-up">
          <img
            src="https://le-de.cdn-website.com/7f48ffc680e943fdbcc425cdd116194d/dms3rep/multi/opt/lindomar-rodrigues_building-project_logo_full_colors-1920w.png"
            alt="projects"
          />
          <h3>💡 Build Projects</h3>
          <p>
            Start small—todo apps, blogs, or chat apps using MERN stack. Then
            move to advanced projects like AI chatbots, IoT automation, or
            social media analyzers. Showcase them on GitHub and LinkedIn.
          </p>
        </div>

        <div className="guidance-card slide-up">
          <img
            src="https://user-images.githubusercontent.com/104568275/186131673-9ffff84c-21b4-421b-b956-643aa0fa7dbd.png"
            alt="DSA"
          />
          <h3>📚 Prepare DSA</h3>
          <p>
            Master problem-solving patterns (sliding window, recursion, DP,
            graphs). Practice daily on LeetCode, Codeforces, and GeeksforGeeks.
            Track your progress with a roadmap and focus on time complexity.
          </p>
        </div>

        <div className="guidance-card slide-up">
          <img
            src="https://tse4.mm.bing.net/th/id/OIP.yAZmXWdEW9CZaPNvs-AKyQHaEj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="DRDO"
          />
          <h3>🎯 DRDO Internships</h3>
          <p>
            Apply via the{" "}
            <a href="https://www.drdo.gov.in" target="_blank" rel="noreferrer">
              DRDO Official Website
            </a>{" "}
            or university collaborations. Strong fundamentals in C/C++, Python,
            and research projects in AI, ML, or defense tech increase your
            chances.
          </p>
        </div>
      </div>

      {/* Comment Section */}
      <div className="comments-section fade-in">
        <h2>💬 Share Your Thoughts</h2>
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Post Comment
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first!</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="comment-card fade-in">
                <strong>{c.name}</strong>
                <p>{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
