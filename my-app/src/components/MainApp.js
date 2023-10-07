import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import GamePage from './GamePage';
import HandDetection from './HandDetection';
import MPGamePage from './MPGamePage';
import HowToPlay from './HowToPlay';

function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tryout" element={<HandDetection />} />
        <Route path="/howto" element= {<HowToPlay />} />
        <Route path="/spgame" element={<GamePage />} />
        <Route path="/mpgame" element={<MPGamePage />} />
      </Routes>
    </Router>
  );
}

export default MainApp;