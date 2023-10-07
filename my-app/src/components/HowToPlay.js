import React from 'react';
import './HowToPlay.css'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function HowToPlay() {
    const navigate = useNavigate();
    const [currentInstruction, setCurrentInstruction] = useState(0);
    const [lastInstruction, setLastInstruction] = useState(false)
    const [firstInstruction, setFirstInstruction] = useState(true)

    const instructions = [
        {
            title: "Positioning",
            content: "For the best results, position your hand clearly in front of your webcam. Make sure your hand is centered and fills a significant portion of the frame."
        },
        {
            title: "Lighting",
            content: "Good lighting is key! Ensure you're in a well-lit area, and avoid shadows or backlighting that might interfere with gesture recognition."
        },
        {
            title: "Gesture Recognition",
            content: "The game recognizes 28 unique asamyuta hastas. When prompted, try to replicate the gesture as closely as possible."
        },
        {
            title: "Scoring: Single Player Game",
            content: "You have 10 seconds to earn points for each correct gesture you make. Be quick!"
        },
        {
            title: "Scoring: Two Player Game",
            content: "Pick a friend to compete with you in this game to make as many gestures as possible in 10 seconds! Fastest fingers wins!"

        }
    ];

    const handleNext = () => {
        setFirstInstruction(false);
        if (currentInstruction < instructions.length - 2) {
            setCurrentInstruction(currentInstruction + 1);
            setLastInstruction(false);
        }
        if (currentInstruction === instructions.length - 2){
            setCurrentInstruction(currentInstruction + 1);
            setLastInstruction(true);
        }
    };

    const handlePrev = () => {
        setLastInstruction(false);
        if (currentInstruction > 0) {
            setCurrentInstruction(currentInstruction - 1);
        }
        if (currentInstruction === 1){
            setFirstInstruction(true);
        } else {
            setFirstInstruction(false);
        }
    };

    const skipToTryOut = () => {
        setCurrentInstruction(instructions.length);
    };

    return (
        <div className="howto-container">
            {/* Introduction */}
            <section className="intro">
                <h1>Welcome to Asamyuta Hastas Detection!</h1>
                <p>Ready to test your skills? There are 3 things you can do on this website:</p>
                <ol>
                    <ul><strong>Detection:</strong> Simply make a hasta viniyoga, and the algorithm will detect it.</ul>
                    <ul><strong>Single Player Game:</strong> Test your skills as you try to get as many hand gestures as possible in 10 seconds.</ul>
                    <ul><strong>Two Player Game:</strong> Compete with a friend to see who can get the most hand gestures in 10 seconds.</ul>
                </ol>
            </section>

            {/* Dynamic Instructions */}
            {currentInstruction < instructions.length ? (
                <section className="instructions">
                    <h2>{instructions[currentInstruction].title}</h2>
                    <p>{instructions[currentInstruction].content}</p>
                    {!lastInstruction ? (
                        firstInstruction ?
                            (
                                <div>
                                    <button className="button-style button-style-game" onClick={handleNext}>Next</button>
                                    <button className="button-style button-style-game" onClick={() => navigate('/')}> <i className="fas fa-home"></i></button>
                                </div>
                            ) : (
                                <div>
                                    <button className="button-style button-style-game" onClick={handleNext}>Next</button>
                                    <button className="button-style button-style-game" onClick={handlePrev}>Previous</button>
                                </div>
                            )
                        ) : (
                            <div>
                                <section className="conclusion">
                                    <h2>All Done!</h2>
                                    <p>Now that you're familiar with the gestures and how the game works, it's time to play! Head back to the main game and test your skills. Good luck!</p>
                                </section>
                            <button className="button-style button-style-game" onClick={handlePrev}>Previous</button>
                            <button className="button-style button-style-game" onClick={() => navigate('/spgame')}>Single Player Game</button>
                            <button className="button-style button-style-game" onClick={() => navigate('/mpgame')}>Multiplayer Player Game</button>
                            <button className="button-style button-style-game" onClick={() => navigate('/')}> <i className="fas fa-home"></i></button>
                            </div>
                        )
                    }
                </section>
            ) : (
                // Try It Feature
                <section className="try-it">
                    <h2>Try It Out!</h2>
                    <p>Ready to give it a shot? Below are the 28 hand gestures used in the game. Click on each one to see an example, then try replicating it in the webcam feed. If you get it right, you'll see a 'Correct!' message.</p>
                    <div className="gestures-list">
                        {/* Example for a gesture button. Repeat for all 28 gestures */}
                        <button className="gesture-button">Gesture 1</button>
                        {/* ... */}
                    </div>
                    <div className="webcam-feed">
                        {/* Webcam feed goes here */}
                    </div>
                    <div className="feedback">
                        {/* Feedback message ("Correct!" or "Try Again!") appears here */}
                    </div>
                </section>
            )}
            
        </div>
    );
}

export default HowToPlay;
