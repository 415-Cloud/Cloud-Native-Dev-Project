import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
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

    // TODO: Fetch real data from backend
    // Mock data for now
    const mockLeaderboard = [
      { id: 1, name: 'Alex Johnson', score: 1250, rank: 1, avatar: '👤' },
      { id: 2, name: 'Sarah Williams', score: 1180, rank: 2, avatar: '👤' },
      { id: 3, name: 'Mike Chen', score: 1120, rank: 3, avatar: '👤' },
      { id: 4, name: 'Emma Davis', score: 1080, rank: 4, avatar: '👤' },
      { id: 5, name: 'David Brown', score: 1050, rank: 5, avatar: '👤' },
      { id: 6, name: 'You', score: 980, rank: 6, avatar: '👤', isCurrentUser: true },
      { id: 7, name: 'Lisa Anderson', score: 950, rank: 7, avatar: '👤' },
      { id: 8, name: 'Tom Wilson', score: 920, rank: 8, avatar: '👤' },
      { id: 9, name: 'Rachel Green', score: 890, rank: 9, avatar: '👤' },
      { id: 10, name: 'Chris Taylor', score: 860, rank: 10, avatar: '👤' }
    ];

    setLeaderboard(mockLeaderboard);
    setUserRank(6);
  }, [navigate]);

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
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
                <span className="user-avatar">{user.avatar}</span>
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

