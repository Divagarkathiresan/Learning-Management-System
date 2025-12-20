import React, { useState, useEffect } from 'react';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
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
        data.isAdmin = data.email?.endsWith('@lms.ac.in') || false;
        setProfile(data);
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
      </div>
      
      <div className="profile-info">
        <div className="info-card">
          <h2>Personal Information</h2>
          <div className="info-item">
            <label>Username:</label>
            <span>{profile?.username}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{profile?.email || 'Not provided'}</span>
          </div>
        </div>

        <div className="courses-card">
          {profile?.isAdmin ? (
            <>
              <h2>Admin Dashboard</h2>
              <div className="admin-stats">
                <div className="stat-card">
                  <h3>Role</h3>
                  <p>Administrator</p>
                </div>
                <div className="stat-card">
                  <h3>Permissions</h3>
                  <p>Create & Manage Courses</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2>Enrolled Courses ({profile?.enrolledCourses?.length || 0})</h2>
              {profile?.enrolledCourses?.length > 0 ? (
                <div className="courses-list">
                  {profile.enrolledCourses.map(course => (
                    <div key={course.id} className="course-item">
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="course-stats">
                        <h4>Progress: {course.progress?.[profile.username] || 0}%</h4>
                        <h4>Questions: {course.quizQuestions?.length || 0}</h4>
                        <h4>Score: {course.scores?.[profile.username] !== undefined ? `${course.scores[profile.username]}/${course.quizQuestions?.length || 0}` : 'Not attempted'}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-courses">You haven't enrolled in any courses yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}