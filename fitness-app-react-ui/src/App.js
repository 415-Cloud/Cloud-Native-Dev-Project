import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './screens/LandingPage';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SurveyScreen from './screens/SurveyScreen';
import DashboardScreen from './screens/DashboardScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import WorkoutLogScreen from './screens/WorkoutLogScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import TrainingPlanScreen from './screens/TrainingPlanScreen';
import ProfileScreen from './screens/ProfileScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/survey" element={<SurveyScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/challenges" element={<ChallengesScreen />} />
        <Route path="/workout-log" element={<WorkoutLogScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/training-plan" element={<TrainingPlanScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
