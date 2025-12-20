// src/components/QuizPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuiz } from "../../api";
import "./QuizPage.css";

export default function QuizPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getQuiz(id).then(setQuestions);
  }, [id]);

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <span className="quiz-icon" role="img" aria-label="quiz">📝</span>
        <h2>Quiz</h2>
      </div>
      <div className="quiz-questions">
        {questions.length === 0 ? (
          <div className="quiz-empty">No questions available.</div>
        ) : (
          questions.map((q, i) => {
            const [question] = q.split("*");
            return (
              <div className="quiz-question" key={i}>
                <span className="quiz-qnum">{i + 1}.</span>
                <span className="quiz-qtext">{question}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
