import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user,loading } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
