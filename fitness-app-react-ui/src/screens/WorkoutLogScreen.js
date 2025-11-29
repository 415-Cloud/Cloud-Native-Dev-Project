import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, workoutAPI } from '../services/api';
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

  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    const { userId } = getAuthData();
    if (userId) {
      try {
        const data = await workoutAPI.getUserWorkouts(userId);
        setWorkouts(data.workouts || []);
      } catch (err) {
        console.error('Failed to fetch workouts', err);
      }
    }
  };

  React.useEffect(() => {
    fetchWorkouts();
  }, []);

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
      // Call backend API to save workout log
      await workoutAPI.create({
        userId,
        type: formData.activityType,
        duration: parseInt(formData.duration),
        distance: parseFloat(formData.distance) || 0,
        notes: formData.notes,
        calories: 0, // Backend might calculate or we can add field
        date: new Date().toISOString()
      });

      setSuccess(true);
      setFormData({
        activityType: '',
        distance: '',
        duration: '',
        notes: ''
      });

      // Refresh list
      fetchWorkouts();

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setError('Failed to log workout. Please try again.');
      console.error('Workout log failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await workoutAPI.delete(id);
        fetchWorkouts();
      } catch (err) {
        console.error('Failed to delete workout', err);
        setError('Failed to delete workout');
      }
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
                <label htmlFor="distance">Distance (miles)</label>
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

        <div className="workout-history-section" style={{ marginTop: '40px' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Recent Workouts</h2>
          {workouts.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No workouts logged yet.</p>
          ) : (
            <div className="workout-list" style={{ display: 'grid', gap: '15px' }}>
              {workouts.map(workout => (
                <div key={workout.id} className="workout-item" style={{
                  background: 'var(--surface-color)',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: 'var(--primary-color)' }}>{workout.type}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {workout.duration} mins • {workout.distance} miles • {new Date(workout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--error-color)',
                      color: 'var(--error-color)',
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutLogScreen;

