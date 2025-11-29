import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, challengeAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './ChallengesScreen.css';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState(new Set());
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    description: '',
    type: 'distance',
    targetValue: '',
    targetUnit: 'miles',
    startDate: '',
    endDate: ''
  });

  const fetchData = async () => {
    try {
      const [allChallenges, userChallenges] = await Promise.all([
        challengeAPI.getAll(),
        challengeAPI.getUserChallenges()
      ]);

      setChallenges(allChallenges.challenges || []);

      // Create a set of joined challenge IDs
      const joinedSet = new Set((userChallenges.challenges || []).map(c => c.id));
      setJoinedChallenges(joinedSet);
    } catch (error) {
      console.error('Failed to fetch challenges', error);
    }
  };

  useEffect(() => {
    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleJoinChallenge = async (challengeId) => {
    try {
      await challengeAPI.join(challengeId);
      setJoinedChallenges(prev => new Set([...prev, challengeId]));
      fetchData(); // Refresh to get updated participant counts
    } catch (error) {
      console.error('Failed to join challenge', error);
      alert('Failed to join challenge. Please try again.');
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      await challengeAPI.leave(challengeId);
      setJoinedChallenges(prev => {
        const newSet = new Set(prev);
        newSet.delete(challengeId);
        return newSet;
      });
      fetchData(); // Refresh
    } catch (error) {
      console.error('Failed to leave challenge', error);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    const { userId } = getAuthData();
    if (!userId) return;

    try {
      await challengeAPI.create({
        ...newChallenge,
        createdBy: userId,
        targetValue: parseFloat(newChallenge.targetValue)
      });
      setShowCreateForm(false);
      setNewChallenge({
        name: '',
        description: '',
        type: 'distance',
        targetValue: '',
        targetUnit: 'miles',
        startDate: '',
        endDate: ''
      });
      fetchData(); // Refresh list
    } catch (error) {
      console.error('Failed to create challenge', error);
      alert('Failed to create challenge');
    }
  };

  return (
    <div className="challenges-container">
      <Navbar />
      <div className="challenges-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 className="challenges-title">Challenges</h1>
            <p className="challenges-subtitle">Join challenges to push your limits and compete with others</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showCreateForm ? 'Cancel' : 'Create Challenge'}
          </button>
        </div>

        {showCreateForm && (
          <div className="challenge-card" style={{ marginBottom: '30px' }}>
            <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Create New Challenge</h2>
            <form onSubmit={handleCreateChallenge} style={{ display: 'grid', gap: '15px' }}>
              <div className="form-group">
                <label>Challenge Name</label>
                <input
                  type="text"
                  value={newChallenge.name}
                  onChange={e => setNewChallenge({ ...newChallenge, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newChallenge.description}
                  onChange={e => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newChallenge.type}
                    onChange={e => setNewChallenge({ ...newChallenge, type: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  >
                    <option value="distance">Distance</option>
                    <option value="workouts">Workout Count</option>
                    <option value="calories">Calories</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Value ({newChallenge.targetUnit})</label>
                  <input
                    type="number"
                    value={newChallenge.targetValue}
                    onChange={e => setNewChallenge({ ...newChallenge, targetValue: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newChallenge.startDate}
                    onChange={e => setNewChallenge({ ...newChallenge, startDate: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newChallenge.endDate}
                    onChange={e => setNewChallenge({ ...newChallenge, endDate: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  />
                </div>
              </div>
              <button type="submit" className="submit-button">Create Challenge</button>
            </form>
          </div>
        )}

        <div className="challenges-grid">
          {challenges.map((challenge) => {
            const isJoined = joinedChallenges.has(challenge.id);
            return (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-header">
                  <h3>{challenge.name}</h3>
                  <span className={`difficulty-badge ${challenge.type}`}>
                    {challenge.type}
                  </span>
                </div>
                <p className="challenge-description">{challenge.description}</p>
                <div className="challenge-details">
                  <span>Target: {challenge.target_value} {challenge.target_unit}</span>
                  <span>{challenge.participant_count || 0} participants</span>
                  <span>{new Date(challenge.end_date).toLocaleDateString()}</span>
                </div>
                {isJoined ? (
                  <button
                    className="challenge-btn leave-btn"
                    onClick={() => handleLeaveChallenge(challenge.id)}
                  >
                    Leave Challenge
                  </button>
                ) : (
                  <button
                    className="challenge-btn join-btn"
                    onClick={() => handleJoinChallenge(challenge.id)}
                  >
                    Join Challenge
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChallengesScreen;

