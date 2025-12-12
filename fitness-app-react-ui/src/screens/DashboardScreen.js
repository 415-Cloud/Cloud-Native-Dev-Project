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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setLoading(true);
      setError(null);
      try {
        // Fetch workouts and challenges in parallel
        const [workoutsResponse, userChallengesResponse] = await Promise.all([
          workoutAPI.getUserWorkouts(userId),
          challengeAPI.getUserChallenges()
        ]);

        // Extract workouts and challenges from responses
        const workouts = workoutsResponse.workouts || [];
        const userChallenges = userChallengesResponse.challenges || [];

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
          daysRemaining: Math.ceil((new Date(c.end_date) - new Date()) / (1000 * 60 * 60 * 24)),
          participants: c.participant_count || 0
        }));

        setActiveChallenges(formattedChallenges);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        let errorMessage = 'Failed to load dashboard data. ';
        
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 403) {
            errorMessage = 'Your session has expired. Please log in again.';
            setTimeout(() => navigate('/login'), 2000);
          } else if (error.response.status === 404) {
            errorMessage = 'Some data could not be found. Please try refreshing.';
          } else if (error.response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          } else {
            const errorData = error.response.data;
            if (typeof errorData === 'string') {
              errorMessage += errorData;
            } else if (errorData?.error || errorData?.message) {
              errorMessage += errorData.error || errorData.message;
            }
          }
        } else if (error.request) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else {
          errorMessage += 'An unexpected error occurred.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Navbar />
        <div className="dashboard-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <h1 className="dashboard-title">Dashboard</h1>

        {error && (
          <div className="error-message" style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            <strong>⚠️ Error:</strong> {error}
            <button
              onClick={fetchData}
              style={{
                marginLeft: '10px',
                padding: '4px 12px',
                background: '#c33',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        )}

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

