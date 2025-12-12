import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, leaderboardAPI, userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './LeaderboardScreen.css';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
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
      const [globalLeaderboard, userRankData] = await Promise.all([
        leaderboardAPI.getGlobal(10),
        leaderboardAPI.getUserRank()
      ]);

      // Try to fetch current user's profile to get their name
      let currentUserDisplayName = null;
      try {
        const userProfile = await userAPI.getProfile(userId);
        if (userProfile && userProfile.name) {
          currentUserDisplayName = userProfile.name;
          setCurrentUserName(userProfile.name);
        }
      } catch (profileError) {
        // If profile fetch fails, we'll just use userId - not a critical error
        console.log('Could not fetch user profile for name');
      }

      // Format user display names
      // Since LeaderboardEntry doesn't include username, we use userId
      // For the current user, we'll replace it with their name if available
      setLeaderboard(globalLeaderboard.map((entry, index) => {
        const isCurrentUser = entry.userId === userId;
        let displayName = entry.userId; // Default to userId
        
        // If this is the current user and we have their name, use it
        if (isCurrentUser && currentUserDisplayName) {
          displayName = currentUserDisplayName;
        } else {
          // Format userId nicely (e.g., "user-001" -> "User 001")
          const userIdMatch = entry.userId.match(/user-(\d+)/);
          if (userIdMatch) {
            displayName = `User ${userIdMatch[1]}`;
          }
        }

        return {
          id: entry.userId,
          name: displayName,
          score: entry.score,
          rank: index + 1,
          avatar: '👤',
          isCurrentUser: isCurrentUser
        };
      }));

      if (userRankData) {
        setUserRank(userRankData.rank);
        setUserScore(userRankData.score);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard', error);
      let errorMessage = 'Failed to load leaderboard. ';
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Your session has expired. Please log in again.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 404) {
          errorMessage = 'Leaderboard data not found.';
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

  const getRankIcon = (rank) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <Navbar />
        <div className="leaderboard-content">
          <h1 className="leaderboard-title">Leaderboard</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <Navbar />
      <div className="leaderboard-content">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <p className="leaderboard-subtitle">See how you rank against other challengers</p>

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

        {userRank && (
          <div className="user-rank-card">
            <h2>Your Rank</h2>
            <div className="user-rank-info">
              <span className="rank-number">{getRankIcon(userRank)}</span>
              <div className="rank-details">
                <h3>Rank #{userRank}</h3>
                <p>{userScore !== null ? `${Math.round(userScore).toLocaleString()} points` : 'Loading...'}</p>
              </div>
            </div>
          </div>
        )}

        <div className="leaderboard-table">
          <div className="leaderboard-header">
            <div className="header-rank">Rank</div>
            <div className="header-user">User</div>
            <div className="header-score">Score</div>
          </div>

          {leaderboard.map((user) => (
            <div
              key={user.id}
              className={`leaderboard-row ${user.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="row-rank">
                {user.rank <= 3 ? (
                  <span className="medal">{getRankIcon(user.rank)}</span>
                ) : (
                  <span className="rank-number">{user.rank}</span>
                )}
              </div>
              <div className="row-user">
                <span className="user-name">{user.name}</span>
                {user.isCurrentUser && <span className="you-badge">You</span>}
              </div>
              <div className="row-score">{user.score.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;

