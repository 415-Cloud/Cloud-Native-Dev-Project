import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
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

    // TODO: Fetch real AI-generated training plan from backend
    // Mock data for now
    const mockPlan = [
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

    setTrainingPlan(mockPlan);
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
                      <p>⏱️ {day.duration}</p>
                    )}
                    {day.distance && (
                      <p>📏 {day.distance}</p>
                    )}
                    {day.exercises && (
                      <p>💪 {day.exercises}</p>
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
          <p>💡 This training plan is AI-generated based on your fitness level and goals. Adjust as needed!</p>
        </div>
      </div>
    </div>
  );
};

export default TrainingPlanScreen;

