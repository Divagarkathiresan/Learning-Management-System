import React, { useState, useEffect } from "react";
import { fetchCourses } from "../../api";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function StudentDashboard({ username }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    inProgress: 0,
    quizzesTaken: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadStudentData();
  }, [username]);

  const loadStudentData = async () => {
    try {
      const allCourses = await fetchCourses();
      const enrolled = allCourses.filter(course =>
        course.enrolledStudents?.includes(username)
      );

      setEnrolledCourses(enrolled);
      setStats({
        enrolled: enrolled.length,
        completed: enrolled.filter(c => c.progress?.[username] === 100).length,
        inProgress: enrolled.filter(c => c.progress?.[username] > 0 && c.progress?.[username] < 100).length,
        quizzesTaken: enrolled.filter(c => c.scores?.[username] !== undefined).length
      });
    } catch (err) {
      console.error("Error loading student dashboard:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {username}!</h1>
        <p>Track your learning progress</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="📚" value={stats.enrolled} label="Enrolled Courses" />
        <StatCard icon="✅" value={stats.completed} label="Completed" />
        <StatCard icon="📖" value={stats.inProgress} label="In Progress" />
        <StatCard icon="📝" value={stats.quizzesTaken} label="Quizzes Taken" />
      </div>

      {/* Enrolled Courses */}
      <div className="dashboard-sections">
        <div className="enrolled-courses">
          <h2>My Courses</h2>
          {enrolledCourses.length === 0 ? (
            <div className="empty-state">
              <p>You haven't enrolled in any courses yet.</p>
              <button onClick={() => navigate("/courses")} className="action-btn primary">
                Browse Courses
              </button>
            </div>
          ) : (
            enrolledCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-progress">
                    <span>Progress: {course.progress?.[username] || 0}%</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress?.[username] || 0}%` }}
                      />
                    </div>
                  </div>
                  {course.scores?.[username] !== undefined && (
                    <p className="quiz-score">
                      Quiz Score: {course.scores[username]}/{course.quizQuestions?.length || 0}
                    </p>
                  )}
                </div>
                <div className="course-actions">
                  <button onClick={() => navigate(`/content/${course.id}/${course.title}`)}>
                    View Content
                  </button>
                  <button onClick={() => navigate(`/attendQuiz/${course.id}/${course.title}`)}>
                    Take Quiz
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="student-actions">
          <h2>Quick Actions</h2>
          <button onClick={() => navigate("/courses")} className="action-btn">
            🔍 Browse Courses
          </button>
          <button onClick={() => navigate("/profile")} className="action-btn">
            👤 View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

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
