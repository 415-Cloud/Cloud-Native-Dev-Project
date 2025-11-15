import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-header">
        <div className="landing-nav-buttons">
          <button 
            className="nav-button login-nav-button" 
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="nav-button signup-nav-button" 
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
      </div>
      
      <div className="landing-content">
        <h1 className="landing-title">Challenger</h1>
        <p className="landing-subtitle">Push your limits. Track your progress. Achieve your goals.</p>
        <div className="landing-cta">
          <button 
            className="cta-button primary" 
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
          <button 
            className="cta-button secondary" 
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

