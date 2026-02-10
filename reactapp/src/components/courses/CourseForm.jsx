import React, { useState } from "react";
import { addCourse } from "../../api";
import { useNavigate } from "react-router-dom";
import "./CourseForm.css";

export default function CourseForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([""]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean and validate quiz questions
    const quizArray = quizQuestions
      .map((q) => q.trim())
      .filter(Boolean);

    if (!title || !description || !content) {
      alert("Please fill all course fields");
      return;
    }

    if (quizArray.length === 0) {
      alert("Please add at least one quiz question");
      return;
    }

    try {
      const courseData = {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        quizQuestions: quizArray,
      };

      await addCourse(courseData);

      alert("Course added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setContent("");
      setQuizQuestions([""]);

      navigate("/courses");
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Error adding course");
    }
  };

  const handleQuizChange = (index, value) => {
    setQuizQuestions((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addQuestion = () => {
    setQuizQuestions((prev) => [...prev, ""]);
  };

  return (
    <div className="forms">
      <h3>Add Course</h3>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <br />

        <textarea
          placeholder="Course Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="6"
          required
        />
        <br />

        <h4>Quiz Questions</h4>

        {quizQuestions.map((q, i) => (
          <div key={i}>
            <input
              type="text"
              placeholder={`Question ${i + 1} (format: Question*Answer)`}
              value={q}
              onChange={(e) => handleQuizChange(i, e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addQuestion}>
          + Add Question
        </button>

        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
