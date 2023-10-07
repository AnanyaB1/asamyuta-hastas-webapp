import './App.css';
import $ from 'jquery';
import axios from 'axios';
import React, { useEffect, useState, useRef} from 'react';  
import { useNavigate } from 'react-router-dom';

function GamePage() {
    const navigate = useNavigate()
    const [gameMode, setGameMode] = useState(false);
    const [currentGesture, setCurrentGesture] = useState("");
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(10);
    const currentGestureRef = useRef(currentGesture);
    const gameModeRef = useRef(gameMode);
    const isLockedRef = useRef(false);
    const lastRecognizedGestureRef = useRef(null);
    const detectedGesturesRef = useRef([]);
    const [gameResult, setGameResult] = useState(null);
    const scoreRef = useRef(0);
    const [countdown, setCountdown] = useState(null);



        
    const labels = ['Pathakas', 'Tripathako', 'Ardhapathakas', 'Kartharimukhaha', 'Mayoorakhyo',
    'Ardhachandrascha', 'Araala', 'Shukathundakaha', 'Mushtischa', 'Shikharakhyascha',
        'Kapitha', 'Katakhamukhaha', 'Suchi', 'Chandrakhala', 'Padmakosha', 'Sarparhirasthathaa',
            'Mrigashirsha', 'Simhamukhaha', 'Kaangoolascha', 'Alapadmakaha', 'Chaturo', 'Bhramaraschaiva',
                'Hamsasyo', 'Hamsapakshakaha', 'Samdamsho', 'Mukulaschaiva', 'Thaamrachoodas', 'Trisoolakaha']
    const [availableGestures, setAvailableGestures] = useState([...labels]);


    useEffect(() => {

          let video = document.getElementById('webcam');

          if (navigator.mediaDevices.getUserMedia) {
              navigator.mediaDevices.getUserMedia({ video: true })
                  .then(function (stream) {
                      video.srcObject = stream;
                  })
                  .catch(function (error) {
                      console.log("Error accessing webcam!", error);
                  });
          }

          function captureFrame() {
              let canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas.getContext('2d').drawImage(video, 0, 0);
              return canvas.toDataURL('image/jpeg', 0.8);
          }

          if (gameInterval) {
            clearInterval(gameInterval);
            }
          const frameInterval = setInterval(() => {
            let frame = captureFrame();
            //   console.log("frame: ", frame);
              axios.post("http://127.0.0.1:5000/predict", { image_data: frame })
                  .then(function(response) {
                    const data = response.data;
                    // console.log("gameModeRef.current:", gameModeRef.current);
                    // console.log("data.prediction:", data.prediction);
                    // console.log("currentGestureRef.current:", currentGestureRef.current);
                    if (
                        !isLockedRef.current && 
                        gameModeRef.current && 
                        data.prediction === currentGestureRef.current &&
                        lastRecognizedGestureRef.current !== currentGestureRef.current
                    ) {
                        isLockedRef.current = true;
                        lastRecognizedGestureRef.current = currentGestureRef.current;
                        detectedGesturesRef.current.push(data.prediction);  
                        setScore(prevScore => {
                            const newScore = prevScore + 1;
                            scoreRef.current = newScore;
                            console.log("Incrementing from", prevScore, "to", newScore);
                            return newScore;
                        });
                        nextGesture();
                    }
                    
                                  
                    if ('error' in data) {
                        document.getElementById('prediction').textContent = "";
                        document.getElementById('augmented_frame').style.display = "none";
                        document.getElementById('augmented_frame').src = "";  // Clear the src attribute
                    } else {
                        document.getElementById('augmented_frame').style.display = "block";
                        document.getElementById('augmented_frame').src = "data:image/jpeg;base64," + data.augmented_frame;
                        document.getElementById('prediction').textContent = "Prediction: " + data.prediction;
                    }
                    
                  })
                  .catch(function(error) {
                      console.error("Error making request:", error.message);
                  });
      
          }, 100);  // Adjust the interval as required.
      
          return () => {
            clearInterval(frameInterval);
        };
  }, []);

// Declare the interval variable at the top of the component.
let gameInterval;

const startGame = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
    }, 1000);


    setTimeout(() => {
        clearInterval(countdownInterval); // Clear the countdown interval here
        setCountdown(null);
        setGameMode(true);
        setScore(0);
        detectedGesturesRef.current = [];
        setTimer(10);
        nextGesture();

        gameInterval = setInterval(() => {
            setTimer(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(gameInterval);
                    endGame();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    }, 3000);
};

const endGame = () => {
    clearInterval(gameInterval); // Ensure that the interval is cleared here too.
    console.log("Time's up!");
    setGameMode(false);
    console.log("score: ", scoreRef.current);
    // alert(`Time's up!\nTotal Points: ${scoreRef.current}\nDetected Gestures: ${detectedGesturesRef.current.join(', ')}`);
    setGameResult({ score: scoreRef.current, gestures: detectedGesturesRef.current });

};


    useEffect(() => {
        gameModeRef.current = gameMode;
    }, [gameMode]);
    

    const nextGesture = () => {
        if (availableGestures.length === 0) {
            setAvailableGestures([...labels]);
        }
    
        const randomIndex = Math.floor(Math.random() * availableGestures.length);
        const chosenGesture = availableGestures[randomIndex];
        setCurrentGesture(chosenGesture);
    
        // Remove the chosen gesture from the available gestures
        setAvailableGestures(prev => prev.filter(gesture => gesture !== chosenGesture));
    
        isLockedRef.current = false;
    }

    useEffect(() => {
        currentGestureRef.current = currentGesture; // update the ref whenever currentGesture changes
    }, [currentGesture]);

//     const submitScore = async () => {    
//         const response = await fetch("http://127.0.0.1:5000/submit_score", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 name: winnerName,
//                 score: winnerScore
//             })
//         });
//         const data = await response.json();
//         // Handle the response, e.g., show a success message or handle errors
//     };
    

//     // Fetching and displaying the leaderboard:
// const fetchLeaderboard = async () => {
//     const response = await fetch("http://127.0.0.1:5000/get_leaderboard");
//     const data = await response.json();
//     // Set your state with the leaderboard data to display it
// };
  return (
    <div className="container">
        {gameMode ? (
            <div className="header-container">
                <div className='font-gestures'><strong>Make: </strong>{currentGesture}</div>
                <div className="timer-overlay">{timer}</div>
            </div>
            ) : (<h1 className="font-link">~Asamyuta Hastas Detection~</h1>)}
        <div className="video-container">
            <video autoPlay height="480" id="webcam" playsInline width="640"></video>
            {countdown && (
                <div className='video-container-overlay'>
                    <div className="countdown-overlay"><strong>{countdown}</strong></div>
                </div>
            )}
            <a href="/howto" className="instructions-icon instructions-icon:hover">
                ?
                <span className="tooltip" >Instructions</span>
            </a>
            {!gameMode && gameResult && countdown === null && (
                <div className='video-container-overlay'>
                    <p className="winner-text"><strong>Total Points: {gameResult.score}!</strong></p>
                    <p className="gestures-single">Detected Gestures: {gameResult.gestures.join(', ')}</p>
                    <button className="button-style button-style-game" onClick={startGame}>Play Again</button>
                    <button className="button-style button-style-game" onClick={() => navigate('/')}> <i className="fas fa-home"></i></button>
                </div>
            )}
            <img alt="Augmented Frame" className="overlay" id="augmented_frame"/>
        </div>
        <div 
        id="prediction" 
        style={{
            fontSize: '20px',
            fontWeight: 'bold',
            marginTop: '20px',
            textAlign: 'center',
            width: '100%'
        }}
        ></div>
        <div className={gameMode || gameResult ? "game-container" : ""}>
            {!gameMode && !gameResult && (
                <div>
                <button className="button-style button-style-game" onClick={startGame}>Start Game</button>
                <button className="button-style button-style-game" onClick={() => navigate('/howto')}>How To Play</button>
                <button className="button-style button-style-game" onClick={() => navigate('/')}> <i className="fas fa-home"></i></button>
                </div>
            )}
        </div>
        
    </div>
  );
}
  
export default GamePage;

