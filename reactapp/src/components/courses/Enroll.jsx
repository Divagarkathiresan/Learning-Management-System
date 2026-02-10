import React, { useEffect, useState } from "react";
import { enrollInCourse } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../api/config";
import "./Enroll.css";

export default function Enroll() {
  const { id, title } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setUsername(data.username);
    } catch (error) {
      console.error("Profile error:", error);
      alert("Session expired. Please login again.");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();

    try {
      await enrollInCourse(id, username);
      alert(`Successfully enrolled in ${title}`);
      navigate("/courses");
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Failed to enroll in course");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="enroll-container">
      <h2>Enroll to {title}</h2>

      <form onSubmit={handleEnroll} className="enroll-form">
        <input value={username} disabled />
        <button type="submit">Confirm Enrollment</button>
      </form>
    </div>
  );
}
