import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
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

    // TODO: Fetch real data from backend
    // Mock data for now
    setChallenges([
      {
        id: 1,
        name: '30-Day Running Challenge',
        description: 'Run at least 5km every day for 30 days',
        duration: 30,
        participants: 45,
        difficulty: 'Intermediate',
        category: 'Running'
      },
      {
        id: 2,
        name: 'Weekly Distance Goal',
        description: 'Complete 50km of running this week',
        duration: 7,
        participants: 23,
        difficulty: 'Advanced',
        category: 'Running'
      },
      {
        id: 3,
        name: 'Strength Training Challenge',
        description: 'Complete 100 push-ups, 100 squats, and 100 sit-ups daily',
        duration: 21,
        participants: 67,
        difficulty: 'Beginner',
        category: 'Strength'
      },
      {
        id: 4,
        name: 'Cycling Marathon',
        description: 'Cycle 200km over the next month',
        duration: 30,
        participants: 34,
        difficulty: 'Advanced',
        category: 'Cycling'
      },
      {
        id: 5,
        name: 'Yoga Flow Challenge',
        description: 'Complete 30 minutes of yoga daily for 2 weeks',
        duration: 14,
        participants: 89,
        difficulty: 'Beginner',
        category: 'Yoga'
      }
    ]);

    // Mock: User has joined challenges 1 and 3
    setJoinedChallenges(new Set([1, 3]));
  }, [navigate]);

  const handleJoinChallenge = (challengeId) => {
    // TODO: Call backend API to join challenge
    setJoinedChallenges(prev => new Set([...prev, challengeId]));
  };

  const handleLeaveChallenge = (challengeId) => {
    // TODO: Call backend API to leave challenge
    setJoinedChallenges(prev => {
      const newSet = new Set(prev);
      newSet.delete(challengeId);
      return newSet;
    });
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
                  <span>⏱️ {challenge.duration} days</span>
                  <span>👥 {challenge.participants} participants</span>
                  <span>🏷️ {challenge.category}</span>
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

