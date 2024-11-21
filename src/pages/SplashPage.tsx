import React from 'react';
import { Link } from 'react-router-dom';
import './SplashPage.scss';

interface SplashPageProps {}

export const SplashPage: React.FC<SplashPageProps> = () => {
  return (
    <div data-component="SplashPage">
      <div className="splash-content">
        <h1>Postcard Time Machine</h1>
        <p>Generate beautiful AI postcards from anywhere in the world</p>
        <div className="cta-button">
          <Link to="/postcards" className="start-button">
            Start Creating
          </Link>
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
            <span className="icon">🌤️</span>
            <h3>Live Weather</h3>
            <p>Check current weather at your postcard locations</p>
          </div>
        </div>
      </div>
    </div>
  );
};