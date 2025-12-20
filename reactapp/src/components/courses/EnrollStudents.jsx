import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEnrolledStudents } from "../../api";
import "./EnrollStudents.css";

export default function EnrollStudents() {
  const [students, setStudents] = useState([]);
  const { id, title } = useParams();

  useEffect(() => {
    getEnrolledStudents(id).then(setStudents);
  }, [id]);

  return (
    <div className="enroll-card">
      <div className="enroll-header">
        <span className="enroll-icon" role="img" aria-label="students">👥</span>
        <h2>Enrolled Students</h2>
        <div className="enroll-title">for <span>{title}</span></div>
      </div>
      <ul className="enrolled-names">
        {students.length === 0 ? (
          <li className="no-students">No students enrolled yet.</li>
        ) : (
          students.map((student, index) => (
            <li key={index}>{index + 1}. {student}</li>
          ))
        )}
      </ul>
    </div>
  );
}
