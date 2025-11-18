import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, getAuthData, clearAuthData } from '../services/api';
import Navbar from '../components/Navbar';
import './ProfileScreen.css';

const ProfileScreen = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        profileInfo: '',
        fitnessLevel: '',
        goals: '',
        measuringSystem: 'metric'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const { userId } = getAuthData();

            if (!userId) {
                navigate('/login');
                return;
            }

            try {
                const profileData = await userAPI.getProfile(userId);
                setProfile(profileData);
                setEditForm({
                    name: profileData.name || '',
                    profileInfo: profileData.profileInfo || '',
                    fitnessLevel: profileData.fitnessLevel || '',
                    goals: profileData.goals || '',
                    measuringSystem: profileData.measuringSystem || 'metric'
                });
            } catch (error) {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    clearAuthData();
                    navigate('/login');
                } else if (error.response && error.response.status === 404) {
                    // Profile doesn't exist - create it
                    const { token } = getAuthData();
                    if (token) {
                        try {
                            const decodedToken = JSON.parse(atob(token.split('.')[1]));
                            const email = decodedToken.sub || decodedToken.email;
                            if (email) {
                                await userAPI.createProfile(userId, email);
                                // Retry fetching profile
                                const profileData = await userAPI.getProfile(userId);
                                setProfile(profileData);
                                setEditForm({
                                    name: profileData.name || '',
                                    profileInfo: profileData.profileInfo || '',
                                    fitnessLevel: profileData.fitnessLevel || '',
                                    goals: profileData.goals || '',
                                    measuringSystem: profileData.measuringSystem || 'metric'
                                });
                            } else {
                                setError('Profile not found and unable to create. Please try logging in again.');
                            }
                        } catch (createError) {
                            console.error('Failed to create profile', createError);
                            setError('Profile not found. Please complete your profile setup.');
                        }
                    } else {
                        setError('Profile not found. Please complete your profile setup.');
                    }
                } else {
                    // Handle error response - could be string or object
                    const errorData = error.response?.data;
                    if (typeof errorData === 'string') {
                        setError(errorData);
                    } else if (errorData && typeof errorData === 'object') {
                        setError(errorData.error || errorData.message || 'Failed to load profile. Please try again.');
                    } else {
                        setError('Failed to load profile. Please try again.');
                    }
                    console.error('Failed to fetch profile', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
            // Reset form to original profile values
        if (profile) {
            setEditForm({
                name: profile.name || '',
                profileInfo: profile.profileInfo || '',
                fitnessLevel: profile.fitnessLevel || '',
                goals: profile.goals || '',
                measuringSystem: profile.measuringSystem || 'metric'
            });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError('');

        const { userId } = getAuthData();
        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            const updatedProfile = await userAPI.updateProfile(userId, editForm);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                clearAuthData();
                navigate('/login');
            } else {
                // Handle error response - could be string or object
                const errorData = error.response?.data;
                if (typeof errorData === 'string') {
                    setError(errorData);
                } else if (errorData && typeof errorData === 'object') {
                    setError(errorData.error || errorData.message || 'Failed to update profile. Please try again.');
                } else {
                    setError('Failed to update profile. Please try again.');
                }
                console.error('Failed to update profile', error);
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <div className="profile-card">
                    <div className="error-message">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <Navbar />
            <div className="profile-content-wrapper">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>User Profile</h2>
                    <div className="profile-actions">
                        {!isEditing && (
                            <button onClick={handleEdit} className="edit-button">Edit Profile</button>
                        )}
                    </div>
                </div>
                {error && <div className="error-message">{error}</div>}
                {profile ? (
                    <div className="profile-content">
                        {!isEditing ? (
                            <>
                                <div className="profile-field">
                                    <label>User ID</label>
                                    <p>{profile.userId}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <p>{profile.email}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Name</label>
                                    <p>{profile.name || 'Not set'}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Fitness Level</label>
                                    <p>{profile.fitnessLevel || 'Not set'}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Measuring System</label>
                                    <p>{profile.measuringSystem === 'imperial' ? 'Imperial' : 'Metric'}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Goals</label>
                                    <p>{profile.goals || 'Not set'}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Profile Info</label>
                                    <p>{profile.profileInfo || 'Not set'}</p>
                                </div>
                                {profile.createdAt && (
                                    <div className="profile-field">
                                        <label>Member Since</label>
                                        <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <form onSubmit={handleUpdate} className="profile-edit-form">
                                <div className="profile-field">
                                    <label>User ID</label>
                                    <p>{profile.userId}</p>
                                </div>
                                <div className="profile-field">
                                    <label>Email</label>
                                    <p>{profile.email}</p>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="fitnessLevel">Fitness Level</label>
                                    <select
                                        id="fitnessLevel"
                                        name="fitnessLevel"
                                        value={editForm.fitnessLevel}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select fitness level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="measuringSystem">Measuring System</label>
                                    <select
                                        id="measuringSystem"
                                        name="measuringSystem"
                                        value={editForm.measuringSystem}
                                        onChange={handleInputChange}
                                    >
                                        <option value="metric">Metric (kg, km)</option>
                                        <option value="imperial">Imperial (lbs, miles)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="goals">Goals</label>
                                    <textarea
                                        id="goals"
                                        name="goals"
                                        value={editForm.goals}
                                        onChange={handleInputChange}
                                        placeholder="Enter your fitness goals"
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="profileInfo">Profile Info</label>
                                    <textarea
                                        id="profileInfo"
                                        name="profileInfo"
                                        value={editForm.profileInfo}
                                        onChange={handleInputChange}
                                        placeholder="Tell us about yourself"
                                        rows="3"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="cancel-button"
                                        disabled={updateLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="save-button"
                                        disabled={updateLoading}
                                    >
                                        {updateLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <p>No profile data available</p>
                )}
            </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
