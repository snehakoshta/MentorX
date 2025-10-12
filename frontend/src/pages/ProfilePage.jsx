import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";
const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

export default function ProfilePage() {
  const { user, setUser } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.profilePic);

  const navigate = useNavigate(); // <-- initialize navigate

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Select image first!");

    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const res = await fetch(`${BASE_API_URL}/api/profile/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUser((prev) => ({ ...prev, profilePic: data.profileImage }));
        alert("Profile updated!");
        navigate("/"); // <-- redirect after successful upload
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      <img
        className="profile-img"
        src={preview || "https://via.placeholder.com/120"}
        alt="Profile"
      />
      <input
        className="profile-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button className="profile-btn" onClick={handleUpload}>
        Update Profile
      </button>
    </div>
  );
}
