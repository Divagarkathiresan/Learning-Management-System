import React, { useState, useEffect } from "react";
import { fetchCourses } from "../../api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalEnrollments: 0,
    avgEnrollmentPerCourse: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    verifyAdminAndLoad();
  }, []);

  const verifyAdminAndLoad = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const coursesData = await fetchCourses();
      calculateAnalytics(coursesData);
      setCourses(coursesData);
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
      setError("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (coursesData) => {
    const totalEnrollments = coursesData.reduce(
      (sum, course) => sum + (course.enrolledStudents?.length || 0),
      0
    );

    const uniqueStudents = new Set();
    coursesData.forEach(course => {
      course.enrolledStudents?.forEach(student =>
        uniqueStudents.add(student)
      );
    });

    setAnalytics({
      totalCourses: coursesData.length,
      totalStudents: uniqueStudents.size,
      totalEnrollments,
      avgEnrollmentPerCourse:
        coursesData.length > 0
          ? Math.round(totalEnrollments / coursesData.length)
          : 0
    });
  };

  const topCourses = [...courses]
    .sort(
      (a, b) =>
        (b.enrolledStudents?.length || 0) -
        (a.enrolledStudents?.length || 0)
    )
    .slice(0, 5);

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your LMS platform</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="📖" value={analytics.totalCourses} label="Total Courses" />
        <StatCard icon="👥" value={analytics.totalStudents} label="Total Students" />
        <StatCard icon="📊" value={analytics.totalEnrollments} label="Total Enrollments" />
        <StatCard icon="📈" value={analytics.avgEnrollmentPerCourse} label="Avg per Course" />
      </div>

      {/* Popular Courses */}
      <div className="dashboard-sections">
        <div className="popular-courses">
          <h2>Most Popular Courses</h2>
          {topCourses.length === 0 ? (
            <p>No courses available</p>
          ) : (
            topCourses.map(course => (
              <div key={course.id} className="course-analytics-item">
                <div>
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
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="admin-actions">
          <h2>Quick Actions</h2>
          <button onClick={() => navigate("/add")} className="action-btn primary">
            ➕ Add Course
          </button>
          <button onClick={() => navigate("/courses")} className="action-btn">
            📚 Manage Courses
          </button>
        </div>
      </div>

      {/* Enrollment Chart */}
      <div className="enrollment-chart">
        <h2>Enrollment Overview</h2>
        <div className="chart-container">
          {courses.map(course => {
            const percent =
              analytics.totalStudents > 0
                ? Math.min(
                    (course.enrolledStudents?.length || 0) /
                      analytics.totalStudents *
                      100,
                    100
                  )
                : 0;

            return (
              <div key={course.id} className="chart-bar">
                <span className="bar-label">{course.title}</span>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${percent}%` }} />
                </div>
                <span className="bar-value">
                  {course.enrolledStudents?.length || 0}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Reusable stat card */
function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <h3>{value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}
