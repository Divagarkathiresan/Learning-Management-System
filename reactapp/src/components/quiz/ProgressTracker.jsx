// src/components/ProgressTracker.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchCourses, updateProgress } from "../../api";

export default function ProgressTracker() {
  const { id } = useParams();
  const [progress, setProgress] = useState("");

  useEffect(() => {
    fetchCourses().then((courses) => {
      const course = courses.find((c) => String(c.id) === id);
      if (course && course.progress) {
        setProgress(course.progress["john_doe"]);
      }
    });
  }, [id]);

  const handleUpdate = async () => {
    await updateProgress(id, progress);
    alert("Progress updated");
  };

  return (
    <div>
      <h2>Progress Tracker</h2>
      <input
        type="number"
        value={progress}
        onChange={(e) => setProgress(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Progress</button>
    </div>
  );
}
