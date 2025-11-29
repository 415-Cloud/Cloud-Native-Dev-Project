import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, storeAuthData } from '../services/api';
import './RegisterScreen.css';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.register({ email, password });
            storeAuthData(response.accessToken, response.userId);
            navigate('/survey');
        } catch (error) {
            if (error.response) {
                // Handle error response - could be string or object
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    setError(errorData);
                } else if (errorData && typeof errorData === 'object') {
                    // Extract error message from error object
                    setError(errorData.error || errorData.message || 'Registration failed. Please try again.');
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else {
                setError('Network error. Please check if the server is running.');
            }
            console.error('Registration failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create Account</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                    <div className="form-group password-group">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="link-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;
