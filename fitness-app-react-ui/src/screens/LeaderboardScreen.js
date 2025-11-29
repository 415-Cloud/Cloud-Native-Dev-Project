import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, leaderboardAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './LeaderboardScreen.css';

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [filter, setFilter] = useState('all');
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

        setLeaderboard(globalLeaderboard.map((entry, index) => ({
          id: entry.userId,
          name: entry.username || 'Unknown User',
          score: entry.score,
          rank: index + 1,
          avatar: '👤',
          isCurrentUser: entry.userId === userId
        })));

        if (userRankData) {
          setUserRank(userRankData.rank);
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
                <p>980 points</p>
              </div>
            </div>
          </div>
        )}

        <div className="leaderboard-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button
            className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
            onClick={() => setFilter('month')}
          >
            This Month
          </button>
          <button
            className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
            onClick={() => setFilter('week')}
          >
            This Week
          </button>
        </div>

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
                  <span className="rank-number">#{user.rank}</span>
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

