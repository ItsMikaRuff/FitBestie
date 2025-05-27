//App.js

import { ThemeProvider } from 'styled-components';
import {theme} from './themes/theme';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './themes/GlobalStyle';
import WorkoutVideos from './pages/WorkoutVideos';

import Layout from './components/Layout';
import { useUser } from './context/UserContext';

// Pages

import HomePage from './pages/Home';
import LoginPage from './pages/LoginPage';
import UserSignUp from './pages/UserSignUp';
import UserProfile from './pages/UserProfile';
import TrainerProfile from './pages/TrainerProfile';
import PersonalQuiz from './components/PersonalQuiz';
import SearchTrainer from './pages/SearchTrainer';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import WorkerPage from './pages/WorkerPage';
import TrainerSignUp from './pages/TrainerSignUp';
import SignupSuccessful from './pages/SignUpSuccessful';
import ForgotPassword from './pages/ForgotPassword';
import UserMetrics from './pages/UserMetrics';
import FavoriteRecipes from './pages/FavoriteRecipesPage';
import ResetPassword from './pages/ResetPassword';

function App() {

  const [mainTheme] = useState(theme);
  const { user } = useUser();

  return (
    <ThemeProvider theme={mainTheme}>
      <GlobalStyle />
      <Routes>

        {/* עמודים עם Header/Footer */}

        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={user?.role === 'trainer' ? <TrainerProfile /> : <UserProfile />} />
          <Route path="/signup-successful" element={<SignupSuccessful />} />
          <Route path="/quiz" element={<PersonalQuiz />} />
          <Route path="/search" element={<SearchTrainer/>} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/worker" element={<WorkerPage />} />
          <Route path="/trainer-signup" element={<TrainerSignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/workout-videos" element={<WorkoutVideos />} />
          <Route path="/metrics" element={<UserMetrics />} />
          <Route path="/favorite-recipes" element={<FavoriteRecipes />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          
        </Route>

        {/* עמודים בלי Header/Footer */}

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<UserSignUp />} />

      </Routes>
    </ThemeProvider>
  );
}

export default App;
