import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, challengeAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './ChallengesScreen.css';

const ChallengesScreen = () => {
  const [challenges, setChallenges] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [allChallenges, userChallenges] = await Promise.all([
          challengeAPI.getAll(),
          challengeAPI.getUserChallenges()
        ]);

        setChallenges(allChallenges);

        // Create a set of joined challenge IDs
        const joinedSet = new Set(userChallenges.map(c => c.id));
        setJoinedChallenges(joinedSet);
      } catch (error) {
        console.error('Failed to fetch challenges', error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleJoinChallenge = async (challengeId) => {
    try {
      await challengeAPI.join(challengeId);
      setJoinedChallenges(prev => new Set([...prev, challengeId]));
    } catch (error) {
      console.error('Failed to join challenge', error);
      alert('Failed to join challenge. Please try again.');
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    // Note: Leave functionality might not be implemented in backend yet
    // For now, we'll just update local state if successful
    try {
      // await challengeAPI.leave(challengeId); 
      setJoinedChallenges(prev => {
        const newSet = new Set(prev);
        newSet.delete(challengeId);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to leave challenge', error);
    }
  };

  return (
    <div className="challenges-container">
      <Navbar />
      <div className="challenges-content">
        <h1 className="challenges-title">Challenges</h1>
        <p className="challenges-subtitle">Join challenges to push your limits and compete with others</p>

        <div className="challenges-grid">
          {challenges.map((challenge) => {
            const isJoined = joinedChallenges.has(challenge.id);
            return (
              <div key={challenge.id} className="challenge-card">
                <div className="challenge-header">
                  <h3>{challenge.name}</h3>
                  <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="challenge-description">{challenge.description}</p>
                <div className="challenge-details">
                  <span>{challenge.duration} days</span>
                  <span>{challenge.participants} participants</span>
                  <span>{challenge.category}</span>
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

