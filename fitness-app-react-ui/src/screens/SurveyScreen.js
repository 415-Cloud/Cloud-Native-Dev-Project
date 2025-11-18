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
            const { userId, token } = getAuthData();
            if (!userId || !token) {
                setError('Session expired. Please register again.');
                navigate('/register');
                return;
            }

            // First, check if profile exists
            let profileExists = false;
            try {
                await userAPI.getProfile(userId);
                profileExists = true;
            } catch (getError) {
                // Profile doesn't exist - we'll create it
                profileExists = false;
            }

            if (!profileExists) {
                // Decode JWT to get email
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const email = decodedToken.sub || decodedToken.email;
                
                if (!email) {
                    setError('Unable to retrieve email from token. Please try logging in again.');
                    setLoading(false);
                    return;
                }

                // Create the profile first
                try {
                    await userAPI.createProfile(userId, email, {
                        name,
                        fitnessLevel,
                        goals,
                    });
                } catch (createError) {
                    console.error('Failed to create profile', createError);
                    // Try to update anyway in case it was created between check and create
                }
            }

            // Update the profile (this will work whether it was just created or already existed)
            await userAPI.updateProfile(userId, {
                name,
                fitnessLevel,
                goals,
            });

            // Success - navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const errorData = error.response.data;
                
                // Handle errors
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

