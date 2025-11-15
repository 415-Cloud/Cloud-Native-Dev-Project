import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, storeAuthData } from '../services/api';
import './LoginScreen.css';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        try {
            const response = await authAPI.login({ email, password });
            storeAuthData(response.accessToken, response.userId);
            navigate('/dashboard');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Invalid email or password');
            } else if (error.response) {
                // Handle error response - could be string or object
                const errorData = error.response.data;
                if (typeof errorData === 'string') {
                    setError(errorData);
                } else if (errorData && typeof errorData === 'object') {
                    // Extract error message from error object
                    setError(errorData.error || errorData.message || 'Login failed. Please try again.');
                } else {
                    setError('Login failed. Please try again.');
                }
            } else {
                setError('Network error. Please check if the server is running.');
            }
            console.error('Login failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="link-text">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
