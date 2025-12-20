import React, { useState, useEffect } from 'react';
import { fetchCourses } from '../../api';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css';

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
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
        setIsAdmin(data.email?.endsWith('@lms.ac.in') || false);
        setUsername(data.username || '');
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {isAdmin ? (
        <AdminDashboard username={username} />
      ) : (
        <StudentDashboard username={username} />
      )}
    </div>
  );
}