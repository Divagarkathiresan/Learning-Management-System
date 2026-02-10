//app.js - Main application component with routing and layout
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./components/common/Home";
import Dashboard from "./components/dashboard/Dashboard";
import CourseList from "./components/courses/CourseList";
import CourseForm from "./components/courses/CourseForm";
import ProgressTracker from "./components/quiz/ProgressTracker";
import QuizPage from "./components/quiz/QuizPage";
import Enroll from "./components/courses/Enroll";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import EnrollStudents from "./components/courses/EnrollStudents";
import QuizSubmit from "./components/quiz/QuizSubmit";
import Content from "./components/courses/Content";
import Profile from "./components/profile/Profile";
import "./app.css";

function AppWrapper() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="app">
      {!hideNavbar && token && (
        <div className="navbar">
          <Navbar />
        </div>
      )}

      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
              token ? <Navigate to="/home" /> : <Navigate to="/register" />
            }
          />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enroll/:id/:title"
            element={
              <ProtectedRoute>
                <Enroll />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enrolledstudents/:id/:title"
            element={
              <ProtectedRoute>
                <EnrollStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress/:id"
            element={
              <ProtectedRoute>
                <ProgressTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/:title"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendQuiz/:id/:title"
            element={
              <ProtectedRoute>
                <QuizSubmit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/:id/:title"
            element={
              <ProtectedRoute>
                <Content />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />

    </BrowserRouter>
  );
}

export default App;
