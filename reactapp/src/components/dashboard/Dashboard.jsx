import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../api/config';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import './Dashboard.css';

export default function Dashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const data = await response.json();
      setIsAdmin(data.email?.endsWith('@lms.ac.in') || false);
      setUsername(data.username || '');
    } catch (err) {
      console.error('Error checking user role:', err);
      navigate('/login');
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
        <AdminDashboard />
      ) : (
        <StudentDashboard username={username} />
      )}
    </div>
  );
}