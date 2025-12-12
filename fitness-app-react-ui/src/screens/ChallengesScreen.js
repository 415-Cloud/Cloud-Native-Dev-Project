import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, challengeAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './ChallengesScreen.css';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
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
    setLoading(true);
    setError(null);
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
      let errorMessage = 'Failed to load challenges. ';
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Your session has expired. Please log in again.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 404) {
          errorMessage = 'Challenges not found.';
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
    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const handleJoinChallenge = async (challengeId) => {
    setActionError(null);
    try {
      await challengeAPI.join(challengeId);
      setJoinedChallenges(prev => new Set([...prev, challengeId]));
      fetchData(); // Refresh to get updated participant counts
    } catch (error) {
      console.error('Failed to join challenge', error);
      let errorMessage = 'Failed to join challenge. ';
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Your session has expired. Please log in again.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 400) {
          errorMessage = 'Unable to join this challenge. It may have ended or you may already be a participant.';
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
      }
      
      setActionError(errorMessage);
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    setActionError(null);
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
      let errorMessage = 'Failed to leave challenge. ';
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Your session has expired. Please log in again.';
          setTimeout(() => navigate('/login'), 2000);
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
      }
      
      setActionError(errorMessage);
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    const { userId } = getAuthData();
    if (!userId) return;

    setActionError(null);
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
      let errorMessage = 'Failed to create challenge. ';
      
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = 'Your session has expired. Please log in again.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid challenge data. Please check all fields and try again.';
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
      }
      
      setActionError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="challenges-container">
        <Navbar />
        <div className="challenges-content">
          <h1 className="challenges-title">Challenges</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading challenges...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {actionError && (
          <div className="error-message" style={{
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            <strong>⚠️ Error:</strong> {actionError}
            <button
              onClick={() => setActionError(null)}
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
              Dismiss
            </button>
          </div>
        )}

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

