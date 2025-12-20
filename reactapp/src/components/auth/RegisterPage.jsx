import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../api";
import "./RegisterPage.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");       // Added email state
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      await registerUser({ username, email, password });
      alert("Registration successful! Please login.");
      setUsername("");
      setEmail("");      // reset email
      setPassword("");
      navigate("/login"); // Redirect to login after registration
    } catch (error) {
      alert(error.message || "Error in registration");
      console.error("Error in registering:", error);
    }
  };

  return (
    <div className="login-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Email"             
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" >Register</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
}
