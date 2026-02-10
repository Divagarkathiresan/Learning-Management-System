import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/auth";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If no token or token expired → redirect to login
  if (!token || isTokenExpired()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
