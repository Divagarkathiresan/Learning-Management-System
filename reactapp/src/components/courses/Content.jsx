import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchCourses } from "../../api";
import "./Content.css";

export default function Content() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const courses = await fetchCourses();
        const foundCourse = courses.find(
          (c) => c.id === Number(id)
        );
        setCourse(foundCourse || null);
      } catch (err) {
        console.error("Error fetching course content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading content...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  return (
    <div className="content-container">
      <div className="content-header">
        <h1>{course.title}</h1>
        <p className="course-description">
          {course.description}
        </p>
      </div>

      <div className="content-body">
        <h2>Course Content</h2>

        {course.content ? (
          <div className="content-text">
            <p>{course.content}</p>
          </div>
        ) : (
          <div className="no-content">
            <p>No content available for this course yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
