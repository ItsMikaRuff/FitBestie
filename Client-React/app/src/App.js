import { ThemeProvider } from 'styled-components';
import {theme} from './themes/theme';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import GlobalStyle from './themes/GlobalStyle';

import Layout from './components/Layout';
import { useUser } from './context/UserContext';

// Pages
import HomePage from './pages/Home';
import LoginForm from './pages/LoginForm';
import UserSignUp from './pages/UserSignUp';
import SignUpSuccessful from './pages/SignUpSuccessful';
import UserProfile from './pages/UserProfile';
import TrainerProfile from './pages/TrainerProfile';
import PersonalQuiz from './components/PersonalQuiz';
import SearchTrainerResults from './pages/SearchTrainerResults';
import AdminProfile from './pages/AdminProfile';
import ManagerPage from './pages/ManagerPage';
import WorkerPage from './pages/WorkerPage';
import TrainerSignUp from './pages/TrainerSignUp';

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
          <Route path="SignUpSuccessful" element={<SignUpSuccessful />} />
          <Route path="/quiz" element={<PersonalQuiz />} />
          <Route path="/search" element={<SearchTrainerResults />} />
          <Route path="admin" element={<AdminProfile />} />
          <Route path="manager" element={<ManagerPage />} />
          <Route path="/worker" element={<WorkerPage />} />
          <Route path="/trainer-signup" element={<TrainerSignUp />} />
        </Route>

        {/* עמודים בלי Header/Footer */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<UserSignUp />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
