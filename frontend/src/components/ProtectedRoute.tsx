// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("chat-agent-token"); // Replace with real auth logic
};

const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
