import './App.css';
import React from 'react';
import HomePage from './pages/Home';
import { BrowserRouter, Route, Routes, Router } from 'react-router-dom';

function App() {
  return (

    <div >
      <BrowserRouter>
        <Router>
          <Routes>
            <Route path="/home" component={HomePage} />
          </Routes>
        </Router>
      </BrowserRouter>
    </div>
  );
}

export default App;
