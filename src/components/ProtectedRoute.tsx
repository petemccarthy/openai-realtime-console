import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    // You could render a loading spinner here
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
