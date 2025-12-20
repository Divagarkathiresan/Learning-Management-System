import React from "react";
import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/auth";

export default function ProtectedRoute({ children }) {
  if (isTokenExpired()) {
    return <Navigate to="/login" />;
  }
  return children;
}
