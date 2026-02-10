import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEnrolledStudents } from "../../api";
import "./EnrollStudents.css";

export default function EnrollStudents() {
  const { id, title } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [id]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const data = await getEnrolledStudents(id);
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching enrolled students:", err);
      setError("Failed to load enrolled students");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading students...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="enroll-card">
      <div className="enroll-header">
        <span className="enroll-icon" role="img" aria-label="students">👥</span>
        <h2>Enrolled Students</h2>
        <div className="enroll-title">
          for <span>{title}</span>
        </div>
      </div>

      <ul className="enrolled-names">
        {students.length === 0 ? (
          <li className="no-students">No students enrolled yet.</li>
        ) : (
          students.map((student, index) => (
            <li key={`${student}-${index}`}>
              {index + 1}. {student}
            </li>
          ))
        )}
      </ul>

      <button className="back-btn" onClick={() => navigate("/courses")}>
        ⬅ Back to Courses
      </button>
    </div>
  );
}
