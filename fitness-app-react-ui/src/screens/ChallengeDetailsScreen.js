import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthData, challengeAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './ChallengeDetailsScreen.css';

const ChallengeDetailsScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChallengeDetails = async () => {
            const { userId } = getAuthData();
            if (!userId) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                // Fetch challenge details
                const response = await challengeAPI.getById(id);
                setChallenge(response);
            } catch (err) {
                console.error('Error fetching challenge details:', err);
                setError('Failed to load challenge details.');
            } finally {
                setLoading(false);
            }
        };

        fetchChallengeDetails();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="challenge-details-container">
                <Navbar />
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading challenge details...</p>
                </div>
            </div>
        );
    }

    if (error || !challenge) {
        return (
            <div className="challenge-details-container">
                <Navbar />
                <div className="error-message">
                    <p>⚠️ {error || 'Challenge not found'}</p>
                    <button onClick={() => navigate('/challenges')}>Back to Challenges</button>
                </div>
            </div>
        );
    }

    return (
        <div className="challenge-details-container">
            <Navbar />
            <div className="challenge-details-content">
                <button className="back-btn" onClick={() => navigate('/challenges')}>← Back</button>

                <div className="challenge-header">
                    <h1>{challenge.name}</h1>
                    <span className={`status-badge ${challenge.status === 'active' ? 'active' : 'completed'}`}>
                        {challenge.status}
                    </span>
                </div>

                <div className="challenge-stats-grid">
                    <div className="stat-box">
                        <span className="label">Difficulty</span>
                        <span className="value">{challenge.difficulty}</span>
                    </div>
                    <div className="stat-box">
                        <span className="label">Goal</span>
                        <span className="value">{challenge.target_value} {challenge.target_metric}</span>
                    </div>
                    <div className="stat-box">
                        <span className="label">Duration</span>
                        <span className="value">{new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="stat-box">
                        <span className="label">Participants</span>
                        <span className="value">{challenge.participants ? challenge.participants.length : 0}</span>
                    </div>
                </div>

                <div className="participants-section">
                    <h2>Participants</h2>
                    {challenge.participants && challenge.participants.length > 0 ? (
                        <div className="participants-list">
                            {challenge.participants.map((p, index) => (
                                <div key={index} className="participant-card">
                                    <div className="participant-avatar">{p.username ? p.username[0].toUpperCase() : 'U'}</div>
                                    <div className="participant-info">
                                        <span className="p-name">{p.username || p.user_id}</span>
                                        <span className="p-progress">Progress: {p.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-participants">No participants yet. Be the first to join!</p>
                    )}
                </div>

                <div className="description-section">
                    <h2>Description</h2>
                    <p>{challenge.description}</p>
                </div>

            </div>
        </div>
    );
};

export default ChallengeDetailsScreen;
