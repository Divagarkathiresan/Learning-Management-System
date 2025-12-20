import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser} from "../../api"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = await loginUser({ username, password });
      localStorage.setItem("token", token); // Save JWT
      navigate("/home");
    } catch (error) {
      alert(error.message || "Invalid username or password");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
}
