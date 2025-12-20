import React,{ useState , useEffect } from "react";
import { enrollInCourse } from "../../api";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./Enroll.css";

export default function Enroll(){
	const[name,setName]=useState("");
	const{ id , title }=useParams();
	const Navigate=useNavigate();


	const handleEnroll = async (e) => {
		e.preventDefault();
		console.log("Enrolling student:", { courseId: id, courseName: title, studentName: name });
		await enrollInCourse(id,name);
		console.log("Student enrolled successfully:", { courseId: id, courseName: title, studentName: name });
		setName("");
		Navigate("/courses");
	  };
	return(
		<div className="enroll-container">
			<h2>Enroll to {title}</h2>
			<form onSubmit={handleEnroll} className="enroll-form">
				<input 
					placeholder="Name"
					required
					value={name}
					onChange={(event) => setName(event.target.value)}
				/>
				<button type="submit">Enroll</button>
			</form>
		</div>
	);
}