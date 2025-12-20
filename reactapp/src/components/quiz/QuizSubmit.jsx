import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuiz, submitQuizScore } from "../../api";
import "./QuizSubmit.css";
export default function QuizSubmit() {
	const { id } = useParams();
  	const [questions, setQuestions] = useState([]);
  	const [answers, setAnswers] = useState([]);

  useEffect(() => {
	getQuiz(id).then((qs) => {
	  console.log("Fetched question",qs);
	  setQuestions(qs);
	  setAnswers(qs.map(() => ""));
	});
  }, [id]);

  const handleSubmit = async () => {
	let score = 0;
	console.log("Quiz submission started:", { courseId: id, totalQuestions: questions.length });
	
	questions.forEach((q, i) => {
	  const parts = q.split("*");
	  const question = parts[0];
	  const correct = parts[1] ? parts[1].trim().toLowerCase() : "";

	  const userAnswer = answers[i] ? answers[i].trim().toLowerCase() : "";
	  
	  console.log(`Question ${i+1}:`, { question, userAnswer, correctAnswer: correct, isCorrect: userAnswer === correct });

	  if (userAnswer === correct && correct !== "") {
		score++;
	  }
	});

	console.log("Quiz completed:", { courseId: id, score, totalQuestions: questions.length, percentage: Math.round((score/questions.length)*100) });
	
	try {
	  const token = localStorage.getItem('token');
	  const profileResponse = await fetch('http://localhost:8080/api/auth/profile', {
		headers: {
		  'Authorization': `Bearer ${token}`,
		  'Content-Type': 'application/json'
		}
	  });
	  const profileData = await profileResponse.json();
	  const username = profileData.username;
	  
	  await submitQuizScore(id, username, score);
	  alert(`You scored ${score}/${questions.length}. Score saved!`);
	} catch (err) {
	  console.error('Error saving score:', err);
	  alert(`You scored ${score}/${questions.length}. Error saving score.`);
	}
  };

  return (
	<div className="quiz-container">
	  <h2>Quiz</h2>
	  {questions.map((q, i) => {
		const [question] = q.split("*");
		return (
		  <div key={i} className="question-item">
			<p>{i+1}. {question}</p>
			<input
			  type="text"
			  value={answers[i]}
			  placeholder="Enter your answer..."
			  onChange={(e) => {
				const copy = [...answers];
				copy[i] = e.target.value;
				setAnswers(copy);
			  }}
			/>
		  </div>
		);
	  })}
	  <button onClick={handleSubmit} className="Quiz-button">Submit Quiz</button>
	</div>

	)
}
