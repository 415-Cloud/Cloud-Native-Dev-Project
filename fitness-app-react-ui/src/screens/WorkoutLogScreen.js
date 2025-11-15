import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
import Navbar from '../components/Navbar';
import './WorkoutLogScreen.css';

const WorkoutLogScreen = () => {
  const [formData, setFormData] = useState({
    activityType: '',
    distance: '',
    duration: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }

    if (!formData.activityType || !formData.duration) {
      setError('Please fill in activity type and duration');
      setLoading(false);
      return;
    }

    try {
      // TODO: Call backend API to save workout log
      // await workoutAPI.logWorkout(userId, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({
        activityType: '',
        distance: '',
        duration: '',
        notes: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to log workout. Please try again.');
      console.error('Workout log failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-log-container">
      <Navbar />
      <div className="workout-log-content">
        <h1 className="workout-log-title">Log Workout</h1>
        <p className="workout-log-subtitle">Record your activity to track your progress</p>
        
        <div className="workout-log-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="activityType">Activity Type *</label>
              <select
                id="activityType"
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select activity type</option>
                <option value="Running">Running</option>
                <option value="Cycling">Cycling</option>
                <option value="Walking">Walking</option>
                <option value="Swimming">Swimming</option>
                <option value="Strength Training">Strength Training</option>
                <option value="Yoga">Yoga</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="distance">Distance (km)</label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Duration (minutes) *</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="0"
                  step="1"
                  min="0"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about your workout..."
                rows="4"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Workout logged successfully! 🎉</div>}

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Logging...' : 'Log Workout'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogScreen;

