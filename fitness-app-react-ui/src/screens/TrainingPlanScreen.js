import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, aiCoachAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './TrainingPlanScreen.css';

const TrainingPlanScreen = () => {
  const [trainingPlan, setTrainingPlan] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const { userId } = getAuthData();
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchTrainingPlan = async () => {
      try {
        // Context for AI (could be expanded with real user data)
        const context = {
          fitnessLevel: 'Intermediate',
          goals: ['Improve endurance', 'Build muscle'],
          preferences: ['Running', 'Strength Training']
        };

        const response = await aiCoachAPI.getAdvice(context);
        if (response && response.advice) {
          setTrainingPlan(response.advice);
        }
      } catch (error) {
        console.error('Failed to fetch training plan:', error);
        // Fallback to empty or error state if needed
      }
    };

    fetchTrainingPlan();
  }, [navigate]);

  const currentWeek = trainingPlan.find(w => w.week === selectedWeek);

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

