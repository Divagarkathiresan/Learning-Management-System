import React, { useState, useEffect } from 'react';
import { fetchCourses } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard({ username }) {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    inProgress: 0,
    quizzesTaken: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [username]);

  const loadDashboardData = async () => {
    try {
      const coursesData = await fetchCourses();
      setCourses(coursesData);
      
      const enrolledCourses = coursesData.filter(course => 
        course.enrolledStudents?.includes(username)
      );
      
      setStats({
        enrolled: enrolledCourses.length,
        completed: Math.floor(enrolledCourses.length * 0.6),
        inProgress: Math.floor(enrolledCourses.length * 0.4),
        quizzesTaken: Math.floor(enrolledCourses.length * 0.8)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const enrolledCourses = courses.filter(course => 
    course.enrolledStudents?.includes(username)
  ).slice(0, 5);

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {username}!</h1>
        <p>Continue your learning journey</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card enrolled">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.enrolled}</h3>
            <p>Enrolled Courses</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card progress">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card quizzes">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.quizzesTaken}</h3>
            <p>Quizzes Taken</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-courses">
          <h2>Your Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="course-cards">
              {enrolledCourses.map(course => (
                <div key={course.id} className="course-card">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-actions">
                    <button onClick={() => navigate(`/content/${course.id}/${course.title}`)}>
                      Continue
                    </button>
                    <button onClick={() => navigate(`/attendQuiz/${course.id}/${course.title}`)}>
                      Take Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-courses">
              <p>You haven't enrolled in any courses yet.</p>
              <button onClick={() => navigate('/courses')}>Browse Courses</button>
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/courses')} className="action-btn">
              Browse All Courses
            </button>
            <button onClick={() => navigate('/profile')} className="action-btn">
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}