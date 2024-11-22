import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './SplashPage.scss';

interface SplashPageProps {}

export const SplashPage: React.FC<SplashPageProps> = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  // Automatically redirect based on auth status
  useEffect(() => {
    if (isSignedIn) {
      navigate('/postcards');
    }
  }, [isSignedIn, navigate]);

  const handleStartCreating = () => {
    if (isSignedIn) {
      navigate('/postcards');
    } else {
      navigate('/sign-up');
    }
  };

  // Don't render splash page content if user is signed in
  if (isSignedIn) {
    return null;
  }

  return (
    <div data-component="SplashPage">
      <div className="splash-content">
        <h1>AI Postcard Creator</h1>
        <p>Transform any location into a beautiful vintage-style AI postcard</p>
        <div className="cta-button">
          <button onClick={handleStartCreating} className="start-button">
            Start Creating
          </button>
        </div>
        <div className="features">
          <div className="feature">
            <span className="icon">🌍</span>
            <h3>Any Location</h3>
            <p>Create postcards from any place on Earth</p>
          </div>
          <div className="feature">
            <span className="icon">🎨</span>
            <h3>AI Generated</h3>
            <p>Unique vintage-style artwork for each location</p>
          </div>
          <div className="feature">
            <span className="icon">✉️</span>
            <h3>Personalized</h3>
            <p>Add your own message and customize the style</p>
          </div>
        </div>
      </div>
    </div>
  );
};