import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, workoutAPI, challengeAPI } from '../services/api';
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

    const fetchData = async () => {
      try {
        // Fetch workouts and challenges in parallel
        const [workouts, userChallenges] = await Promise.all([
          workoutAPI.getAll(),
          challengeAPI.getUserChallenges()
        ]);

        // Calculate stats
        const totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
        const totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);

        setStats({
          totalWorkouts: workouts.length,
          totalDistance: Math.round(totalDistance * 10) / 10,
          totalDuration: totalDuration,
          activeChallenges: userChallenges.length
        });

        // Format challenges for display
        const formattedChallenges = userChallenges.map(c => ({
          id: c.id,
          name: c.name,
          progress: c.progress || 0, // Assuming backend returns progress
          daysRemaining: Math.ceil((new Date(c.endDate) - new Date()) / (1000 * 60 * 60 * 24)),
          participants: c.participantsCount || 0
        }));

        setActiveChallenges(formattedChallenges);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchData();
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
            <div className="stat-info">
              <h3>{stats.totalWorkouts}</h3>
              <p>Total Workouts</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.totalDistance} miles</h3>
              <p>Total Distance</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>{formatDuration(stats.totalDuration)}</h3>
              <p>Total Time</p>
            </div>
          </div>

          <div className="stat-card">
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
                  <span>{challenge.daysRemaining} days left</span>
                  <span>{challenge.participants} participants</span>
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

