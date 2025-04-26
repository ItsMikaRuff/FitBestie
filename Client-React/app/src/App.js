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
import SignupPage from './pages/SignUpForm';
import SignUpSuccessful from './pages/SignUpSuccessful';
import Profile from './pages/Profile';
import TrainerProfile from './pages/TrainerProfile';
import PersonalQuiz from './components/PersonalQuiz';

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
          <Route path="profile" element={user?.role === 'trainer' ? <TrainerProfile /> : <Profile />} />
          <Route path="SignUpSuccessful" element={<SignUpSuccessful />} />
          <Route path="/quiz" element={<PersonalQuiz />} />
        </Route>

        {/* עמודים בלי Header/Footer */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
