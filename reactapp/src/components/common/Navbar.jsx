// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.email?.endsWith('@lms.ac.in'));
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
  };

  return (
    <nav>
      <ul className="navbar">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        {isAdmin && <li><Link to="/add">Add Course</Link></li>}
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
      </ul>
    </nav>
  );
}
