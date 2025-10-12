import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/remove background future.png";
import "../styles/Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [warning, setWarning] = useState("");
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Block navigation if not logged in
  const handleProtectedNav = (e, path) => {
    if (!user) {
      e.preventDefault(); // stop navigation
      setWarning("⚠️ Please login first to access this page.");
      setTimeout(() => setWarning(""), 3000); // auto-hide after 3s
    } else {
      navigate(path);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" onClick={(e) => handleProtectedNav(e, "/")}>
            <img src={logo} alt="MentorX Logo" className="logo-img" />
            {/* <span style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
             
            </span> */}
          </Link>
        </div>

        <nav className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={(e) => handleProtectedNav(e, "/")}>
            Home
          </Link>
          <Link
            to="/services"
            onClick={(e) => handleProtectedNav(e, "/services")}
          >
            Book Slots
          </Link>
          <Link to="/about" onClick={(e) => handleProtectedNav(e, "/about")}>
            About
          </Link>
          <Link
            to="/placement-notes"
            onClick={(e) => handleProtectedNav(e, "/placement-notes")}
          >
            Placement Notes
          </Link>
          <Link
            to="/contact"
            onClick={(e) => handleProtectedNav(e, "/contact")}
          >
            Contact
          </Link>

          {user ? (
            <div className="user-dropdown">
              <div
                className="user-info"
                style={{ color: "black", fontWeight: "bold" }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img
                  src={user.profilePic || "https://via.placeholder.com/32"}
                  alt="Profile"
                  className="profile-pic"
                />
                <span>{user.name} ▾</span>
              </div>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to="/profile" onClick={() => setShowDropdown(false)}>
                    Change Profile Image
                  </Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>

        <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Warning Message */}
      {warning && <div className="navbar-warning">{warning}</div>}
    </header>
  );
}
