import React, { useState, useEffect } from 'react';
import { fetchCourses } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ username }) {
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    avgEnrollmentPerCourse: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const coursesData = await fetchCourses();
      setCourses(coursesData);
      
      const totalEnrollments = coursesData.reduce((sum, course) => 
        sum + (course.enrolledStudents?.length || 0), 0
      );
      
      const uniqueStudents = new Set();
      coursesData.forEach(course => {
        course.enrolledStudents?.forEach(student => uniqueStudents.add(student));
      });

      setAnalytics({
        totalCourses: coursesData.length,
        totalStudents: uniqueStudents.size,
        totalEnrollments,
        avgEnrollmentPerCourse: coursesData.length > 0 ? 
          Math.round(totalEnrollments / coursesData.length) : 0
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const topCourses = courses
    .sort((a, b) => (b.enrolledStudents?.length || 0) - (a.enrolledStudents?.length || 0))
    .slice(0, 5);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your LMS platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card courses">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>{analytics.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>
        <div className="stat-card students">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{analytics.totalStudents}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stat-card enrollments">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{analytics.totalEnrollments}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>
        <div className="stat-card average">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{analytics.avgEnrollmentPerCourse}</h3>
            <p>Avg per Course</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="popular-courses">
          <h2>Most Popular Courses</h2>
          {topCourses.length > 0 ? (
            <div className="course-analytics">
              {topCourses.map(course => (
                <div key={course.id} className="course-analytics-item">
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p>{course.enrolledStudents?.length || 0} students enrolled</p>
                  </div>
                  <div className="course-actions">
                    <button onClick={() => navigate(`/enrolledstudents/${course.id}/${course.title}`)}>
                      View Students
                    </button>
                    <button onClick={() => navigate(`/content/${course.id}/${course.title}`)}>
                      Manage Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No courses available</p>
          )}
        </div>

        <div className="admin-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button onClick={() => navigate('/add')} className="action-btn primary">
              Add New Course
            </button>
            <button onClick={() => navigate('/courses')} className="action-btn">
              Manage All Courses
            </button>
          </div>
        </div>
      </div>

      <div className="enrollment-chart">
        <h2>Course Enrollment Overview</h2>
        <div className="chart-container">
          {courses.map(course => (
            <div key={course.id} className="chart-bar">
              <div className="bar-label">{course.title}</div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: `${Math.min((course.enrolledStudents?.length || 0) / Math.max(analytics.totalStudents, 1) * 100, 100)}%` 
                  }}
                ></div>
              </div>
              <div className="bar-value">{course.enrolledStudents?.length || 0}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}