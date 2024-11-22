import { SignIn, SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

export const AuthPage = () => {
  const location = useLocation();
  const isSignUp = location.pathname === "/sign-up";

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      {isSignUp ? <SignUp signInUrl="/sign-in" /> : <SignIn signUpUrl="/sign-up" />}
    </div>
  );
}
