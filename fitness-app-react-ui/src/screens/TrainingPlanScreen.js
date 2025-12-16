import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, userAPI, aiCoachAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './TrainingPlanScreen.css';

const TrainingPlanScreen = () => {
  const [trainingPlan, setTrainingPlan] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainingPlan = async () => {
      const { userId } = getAuthData();
      if (!userId) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch user profile to get fitness level and goals
        const userProfile = await userAPI.getProfile(userId);

        // Get AI-generated training advice and plan
        const coachResponse = await aiCoachAPI.generateTrainingPlan({
          fitnessLevel: userProfile.fitnessLevel || 'intermediate',
          goals: userProfile.goals || 'general fitness',
          name: userProfile.name
        });

        // Use the returned advice and training plan
        setAiAdvice(coachResponse.advice);

        if (coachResponse.trainingPlan && Array.isArray(coachResponse.trainingPlan)) {
          setTrainingPlan(coachResponse.trainingPlan);
        } else {
          // Fallback if AI doesn't return a valid plan array, though parsing should catch most issues
          console.warn("AI didn't return a valid training plan structure, falling back to static generation.");
          const plan = generateStructuredPlan(userProfile.fitnessLevel);
          setTrainingPlan(plan);
        }
      } catch (err) {
        console.error('Error fetching training plan:', err);
        setError('Failed to generate training plan. Using default plan.');
        // Fallback to default plan
        setTrainingPlan(getDefaultPlan());
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPlan();
  }, [navigate]);

  const generateStructuredPlan = (fitnessLevel) => {
    const intensity = fitnessLevel === 'beginner' ? 'Easy' : fitnessLevel === 'advanced' ? 'High' : 'Moderate';
    const baseDuration = fitnessLevel === 'beginner' ? 20 : fitnessLevel === 'advanced' ? 45 : 30;

    return [
      {
        week: 1,
        days: [
          { day: 'Monday', activity: 'Running', duration: `${baseDuration} min`, distance: `${Math.round(baseDuration / 6)} km`, intensity },
          { day: 'Tuesday', activity: 'Strength Training', duration: `${baseDuration + 15} min`, exercises: 'Full Body', intensity },
          { day: 'Wednesday', activity: 'Rest Day', duration: '-', notes: 'Active recovery or rest' },
          { day: 'Thursday', activity: 'Running', duration: `${baseDuration + 5} min`, distance: `${Math.round((baseDuration + 5) / 6)} km`, intensity },
          { day: 'Friday', activity: 'Yoga', duration: '30 min', notes: 'Flexibility and stretching' },
          { day: 'Saturday', activity: 'Long Run', duration: `${baseDuration + 20} min`, distance: `${Math.round((baseDuration + 20) / 6)} km`, intensity: 'Moderate' },
          { day: 'Sunday', activity: 'Rest Day', duration: '-', notes: 'Complete rest' }
        ]
      },
      {
        week: 2,
        days: [
          { day: 'Monday', activity: 'Running', duration: `${baseDuration + 5} min`, distance: `${Math.round((baseDuration + 5) / 6)} km`, intensity },
          { day: 'Tuesday', activity: 'Strength Training', duration: `${baseDuration + 15} min`, exercises: 'Upper Body', intensity },
          { day: 'Wednesday', activity: 'Running', duration: `${baseDuration} min`, distance: `${Math.round(baseDuration / 6)} km`, intensity: 'Easy' },
          { day: 'Thursday', activity: 'Interval Training', duration: `${baseDuration + 10} min`, distance: `${Math.round((baseDuration + 10) / 6)} km`, intensity: 'High' },
          { day: 'Friday', activity: 'Yoga', duration: '30 min', notes: 'Flexibility and stretching' },
          { day: 'Saturday', activity: 'Long Run', duration: `${baseDuration + 25} min`, distance: `${Math.round((baseDuration + 25) / 6)} km`, intensity: 'Moderate' },
          { day: 'Sunday', activity: 'Rest Day', duration: '-', notes: 'Complete rest' }
        ]
      }
    ];
  };

  const getDefaultPlan = () => [
    {
      week: 1,
      days: [
        { day: 'Monday', activity: 'Running', duration: '30 min', distance: '5 km', intensity: 'Moderate' },
        { day: 'Tuesday', activity: 'Strength Training', duration: '45 min', exercises: 'Full Body', intensity: 'High' },
        { day: 'Wednesday', activity: 'Rest Day', duration: '-', notes: 'Active recovery or rest' },
        { day: 'Thursday', activity: 'Running', duration: '35 min', distance: '6 km', intensity: 'Moderate' },
        { day: 'Friday', activity: 'Yoga', duration: '30 min', notes: 'Flexibility and stretching' },
        { day: 'Saturday', activity: 'Long Run', duration: '50 min', distance: '8 km', intensity: 'Moderate' },
        { day: 'Sunday', activity: 'Rest Day', duration: '-', notes: 'Complete rest' }
      ]
    },
    {
      week: 2,
      days: [
        { day: 'Monday', activity: 'Running', duration: '35 min', distance: '6 km', intensity: 'Moderate' },
        { day: 'Tuesday', activity: 'Strength Training', duration: '45 min', exercises: 'Upper Body', intensity: 'High' },
        { day: 'Wednesday', activity: 'Running', duration: '30 min', distance: '5 km', intensity: 'Easy' },
        { day: 'Thursday', activity: 'Interval Training', duration: '40 min', distance: '6 km', intensity: 'High' },
        { day: 'Friday', activity: 'Yoga', duration: '30 min', notes: 'Flexibility and stretching' },
        { day: 'Saturday', activity: 'Long Run', duration: '55 min', distance: '9 km', intensity: 'Moderate' },
        { day: 'Sunday', activity: 'Rest Day', duration: '-', notes: 'Complete rest' }
      ]
    }
  ];

  const currentWeek = trainingPlan.find(w => w.week === selectedWeek);

  if (loading) {
    return (
      <div className="training-plan-container">
        <Navbar />
        <div className="training-plan-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Generating your personalized training plan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="training-plan-container">
      <Navbar />
      <div className="training-plan-content">
        <div className="plan-header">
          <div>
            <h1 className="training-plan-title">Training Plan</h1>
            <p className="training-plan-subtitle">AI-generated weekly training recommendations</p>
          </div>
          <div className="week-selector">
            <label>Week:</label>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
            >
              {trainingPlan.map(week => (
                <option key={week.week} value={week.week}>
                  Week {week.week}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        )}

        {aiAdvice && (
          <div className="ai-advice-section">
            <h3>🤖 AI Coach Advice</h3>
            <div className="ai-advice-content">
              {aiAdvice.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {currentWeek && (
          <div className="week-plan">
            <h2>Week {currentWeek.week} Schedule</h2>
            <div className="days-grid">
              {currentWeek.days.map((day, index) => (
                <div key={index} className="day-card">
                  <h3 className="day-name">{day.day}</h3>
                  <div className="day-activity">
                    <span className="activity-type">{day.activity}</span>
                    {day.intensity && (
                      <span className={`intensity-badge ${day.intensity.toLowerCase()}`}>
                        {day.intensity}
                      </span>
                    )}
                  </div>
                  <div className="day-details">
                    {day.duration && day.duration !== '-' && (
                      <p>Duration: {day.duration}</p>
                    )}
                    {day.distance && (
                      <p>Distance: {day.distance}</p>
                    )}
                    {day.exercises && (
                      <p>Exercises: {day.exercises}</p>
                    )}
                    {day.notes && (
                      <p className="notes">{day.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ai-note">
          <p>This training plan is AI-generated based on your fitness level and goals. Adjust as needed!</p>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlanScreen;

