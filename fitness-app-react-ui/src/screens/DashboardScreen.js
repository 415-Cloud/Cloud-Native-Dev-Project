import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
import Navbar from '../components/Navbar';
import './DashboardScreen.css';

const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDistance: 0,
    totalDuration: 0,
    activeChallenges: 0
  });
  const [activeChallenges, setActiveChallenges] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }

    // TODO: Fetch real data from backend
    // Mock data for now
    setStats({
      totalWorkouts: 12,
      totalDistance: 45.5,
      totalDuration: 480,
      activeChallenges: 3
    });

    setActiveChallenges([
      {
        id: 1,
        name: '30-Day Running Challenge',
        progress: 65,
        daysRemaining: 12,
        participants: 45
      },
      {
        id: 2,
        name: 'Weekly Distance Goal',
        progress: 80,
        daysRemaining: 3,
        participants: 23
      },
      {
        id: 3,
        name: 'Strength Training Challenge',
        progress: 40,
        daysRemaining: 20,
        participants: 67
      }
    ]);
  }, [navigate]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏃</div>
            <div className="stat-info">
              <h3>{stats.totalWorkouts}</h3>
              <p>Total Workouts</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-info">
              <h3>{stats.totalDistance} km</h3>
              <p>Total Distance</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h3>{formatDuration(stats.totalDuration)}</h3>
              <p>Total Time</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>{stats.activeChallenges}</h3>
              <p>Active Challenges</p>
            </div>
          </div>
        </div>

        <div className="challenges-section">
          <div className="section-header">
            <h2>Active Challenges</h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/challenges')}
            >
              View All
            </button>
          </div>
          
          <div className="challenges-grid">
            {activeChallenges.map((challenge) => (
              <div key={challenge.id} className="challenge-card">
                <h3>{challenge.name}</h3>
                <div className="challenge-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                  <span>{challenge.progress}% Complete</span>
                </div>
                <div className="challenge-meta">
                  <span>⏰ {challenge.daysRemaining} days left</span>
                  <span>👥 {challenge.participants} participants</span>
                </div>
                <button 
                  className="challenge-btn"
                  onClick={() => navigate(`/challenges`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;

