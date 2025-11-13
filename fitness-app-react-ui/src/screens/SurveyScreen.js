import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, getAuthData } from '../services/api';
import './SurveyScreen.css';

const SurveyScreen = () => {
    const [name, setName] = useState('');
    const [fitnessLevel, setFitnessLevel] = useState('');
    const [goals, setGoals] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!name || !fitnessLevel || !goals) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const { userId } = getAuthData();
            if (!userId) {
                setError('Session expired. Please register again.');
                navigate('/register');
                return;
            }

            await userAPI.updateProfile(userId, {
                name,
                fitnessLevel,
                goals,
            });

            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    setError(errorData);
                } else if (errorData && typeof errorData === 'object') {
                    setError(errorData.error || errorData.message || 'Failed to save profile. Please try again.');
                } else {
                    setError('Failed to save profile. Please try again.');
                }
            } else {
                setError('Network error. Please check if the server is running.');
            }
            console.error('Profile update failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="survey-container">
            <div className="survey-card">
                <h2>Complete Your Profile</h2>
                <p className="survey-subtitle">Tell us about yourself to get started</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input 
                            id="name"
                            type="text" 
                            placeholder="Enter your name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="fitnessLevel">Fitness Level</label>
                        <select 
                            id="fitnessLevel"
                            value={fitnessLevel} 
                            onChange={(e) => setFitnessLevel(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select your fitness level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="goals">Fitness Goals</label>
                        <textarea 
                            id="goals"
                            placeholder="Describe your fitness goals (e.g., lose weight, build muscle, improve endurance, etc.)" 
                            value={goals} 
                            onChange={(e) => setGoals(e.target.value)}
                            disabled={loading}
                            rows="4"
                        />
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}
                    
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Saving...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SurveyScreen;

