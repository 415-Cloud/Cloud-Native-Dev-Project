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
  const navigate = useNavigate();

  useEffect(() => {
    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
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
          // If profile fetch fails, we'll just use userId
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
      }
    };

    fetchData();
  }, [navigate]);

  const getRankIcon = (rank) => {
    if (rank === 1) return '1st';
    if (rank === 2) return '2nd';
    if (rank === 3) return '3rd';
    return `#${rank}`;
  };

  return (
    <div className="leaderboard-container">
      <Navbar />
      <div className="leaderboard-content">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <p className="leaderboard-subtitle">See how you rank against other challengers</p>

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

