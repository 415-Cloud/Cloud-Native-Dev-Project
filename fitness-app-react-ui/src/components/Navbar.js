import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAuthData, getAuthData } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <h1>Challenger</h1>
      </div>
      
      <div className="navbar-links">
        <button 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-link ${isActive('/challenges') ? 'active' : ''}`}
          onClick={() => navigate('/challenges')}
        >
          Challenges
        </button>
        <button 
          className={`nav-link ${isActive('/workout-log') ? 'active' : ''}`}
          onClick={() => navigate('/workout-log')}
        >
          Log Workout
        </button>
        <button 
          className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
          onClick={() => navigate('/leaderboard')}
        >
          Leaderboard
        </button>
        <button 
          className={`nav-link ${isActive('/training-plan') ? 'active' : ''}`}
          onClick={() => navigate('/training-plan')}
        >
          Training Plan
        </button>
        <button 
          className="nav-link notifications-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          🔔 Notifications
        </button>
        <button 
          className="nav-link profile-btn"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
        <button className="nav-link logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>✕</button>
          </div>
          <div className="notifications-list">
            <div className="notification-item">
              <p><strong>New Challenge Available</strong></p>
              <p className="notification-time">2 hours ago</p>
            </div>
            <div className="notification-item">
              <p><strong>Workout Reminder</strong></p>
              <p className="notification-time">5 hours ago</p>
            </div>
            <div className="notification-item">
              <p><strong>You moved up in the leaderboard!</strong></p>
              <p className="notification-time">1 day ago</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

