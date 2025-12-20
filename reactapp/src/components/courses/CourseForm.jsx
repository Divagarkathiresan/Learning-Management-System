import React, { useState } from "react";
import { addCourse } from "../../api";
import { useNavigate } from "react-router-dom";
import "./CourseForm.css";

export default function CourseForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [quizQuestions, setQuiz] = useState([""]);
  const navigate=useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizArray = quizQuestions.map(q => q.trim()).filter(q => q);

    try {
      const courseData = { title, description, content, quizQuestions: quizArray };
      await addCourse(courseData);
      console.log("Course added successfully:", courseData);
      alert("Course added successfully!");
      setTitle("");
      setDescription("");
      setContent("");
      setQuiz([""]);
      navigate("/courses");
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Error adding course");
    }
  };

  const handleQuizChange = (index, value) => {
    const copy = [...quizQuestions];
    copy[index] = value;
    setQuiz(copy);
  };

  const addQuestion = () => {
    setQuiz([...quizQuestions, ""]);
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
          required
          rows="6"
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
              required
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
