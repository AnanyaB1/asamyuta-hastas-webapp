import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landing-button-container">
            <h1 className="font-link">~Asamyuta Hastas Detection~</h1>
            <button className = "button-style button-style-landing" onClick={() => navigate('/tryout')}>Try Out Hastas Detection</button>
            <button className = "button-style button-style-landing" onClick={() => navigate('/howto')}>How To Play</button>
            <button className = "button-style button-style-landing" onClick={() => navigate('/spgame')}>Single Player Game</button>
            <button className = "button-style button-style-landing" onClick={() => navigate('/mpgame')}>Multiplayer Game</button>
        </div>
    );
}

export default LandingPage;
