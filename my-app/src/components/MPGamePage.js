import './App.css';
import './MPGamePage.css'
import $ from 'jquery';
import axios from 'axios';
import React, { useEffect, useState, useRef} from 'react';  
import { useNavigate } from 'react-router-dom';

function MPGamePage() {
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
    const [player1Gesture, setPlayer1Gesture] = useState("");
    const [player2Gesture, setPlayer2Gesture] = useState("");
    const player1GestureRef = useRef(player1Gesture);
    const player2GestureRef  = useRef(player2Gesture);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [winner, setWinner] = useState("tie");
    const detectedGesturesPlayer1Ref = useRef([]);
    const detectedGesturesPlayer2Ref = useRef([]);
    const isLockedPlayer1Ref = useRef(false);
    const isLockedPlayer2Ref = useRef(false);
    const player1scoreRef = useRef(0);
    const player2scoreRef = useRef(0);
    const [player1Name, setPlayer1Name] = useState('Player 1');
    const [player2Name, setPlayer2Name] = useState('Player 2');
    const [showNameInput, setShowNameInput] = useState(false);

    

    const labels = ['Pathakas', 'Tripathako', 'Ardhapathakas', 'Kartharimukhaha', 'Mayoorakhyo',
    'Ardhachandrascha', 'Araala', 'Shukathundakaha', 'Mushtischa', 'Shikharakhyascha',
        'Kapitha', 'Katakhamukhaha', 'Suchi', 'Chandrakhala', 'Padmakosha', 'Sarparhirasthathaa',
            'Mrigashirsha', 'Simhamukhaha', 'Kaangoolascha', 'Alapadmakaha', 'Chaturo', 'Bhramaraschaiva',
                'Hamsasyo', 'Hamsapakshakaha', 'Samdamsho', 'Mukulaschaiva', 'Thaamrachoodas', 'Trisoolakaha']
    const [availableGesturesPlayer1, setAvailableGesturesPlayer1] = useState([...labels]);
    const [availableGesturesPlayer2, setAvailableGesturesPlayer2] = useState([...labels]);

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
              axios.post("http://127.0.0.1:5000/predictmp", { image_data: frame })
                  .then(function(response) {
                    const data = response.data;
                    // console.log("gameModeRef.current:", gameModeRef.current);
                    // console.log("data.prediction:", data.prediction);
                    // console.log("currentGestureRef.current:", currentGestureRef.current);
                    // console.log("Predictions - Player 1:", data.player1_prediction, "Player 2:", data.player2_prediction);
                    // console.log("Is Locked:", isLockedRef.current);
                    // console.log("Current Gestures - Player 1:", player1GestureRef.current, "Player 2:", player2GestureRef.current);
                    // console.log("Last Recognized Gesture:", lastRecognizedGestureRef.current);


                    if (gameModeRef.current) {
                        if (
                            !isLockedPlayer1Ref.current && 
                            data.player1_prediction === player1GestureRef.current &&
                            lastRecognizedGestureRef.current !== player1GestureRef.current
                        ) {
                            isLockedPlayer1Ref.current = true;
                            lastRecognizedGestureRef.current = player1GestureRef.current;
                            detectedGesturesPlayer1Ref.current.push(data.player1_prediction);
                    
                            setPlayer1Score(prevScore => {
                                const newScore = prevScore + 1;
                                player1scoreRef.current = newScore;
                                console.log("Incrementing p 1 from", prevScore, "to", newScore);
                                return newScore;
                            });
                            nextGestureForPlayer1(); // You might want to call this only if both players have matched their gestures.
                        }
                    
                        if (
                            !isLockedPlayer2Ref.current && 
                            data.player2_prediction === player2GestureRef.current &&
                            lastRecognizedGestureRef.current !== player2GestureRef.current
                        ) {
                            isLockedPlayer2Ref.current = true;
                            lastRecognizedGestureRef.current = player2GestureRef.current;
                            detectedGesturesPlayer2Ref.current.push(data.player2_prediction);
                    
                            setPlayer2Score(prevScore => {
                                const newScore = prevScore + 1;
                                player2scoreRef.current = newScore;
                                console.log("Incrementing p 2 from", prevScore, "to", newScore);
                                return newScore;
                            });
                            nextGestureForPlayer2();
                        }
                    }
                    
                    
                                  
                    if ('error' in data ) {
                        // document.getElementById('player1_prediction').textContent = "";
                        // document.getElementById('player2_prediction').textContent = "";
                        document.getElementById('augmented_frame').style.display = "none";
                        document.getElementById('augmented_frame').src = "";  // Clear the src attribute
                    } else {
                        document.getElementById('augmented_frame').style.display = "block";
                        document.getElementById('augmented_frame').src = "data:image/jpeg;base64," + data.augmented_frame;
                        // document.getElementById('player1_prediction').textContent = "player1_prediction: " + data.player1_prediction;
                        // document.getElementById('player2_prediction').textContent = "player2_prediction: " + data.player2_prediction;
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

const handleStartClick = () => {
    setShowNameInput(true);
};
// Declare the interval variable at the top of the component.
let gameInterval;

const startGame = () => {
    setShowNameInput(false)
    setCountdown(3);
    const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
    }, 1000);


    setTimeout(() => {
        clearInterval(countdownInterval); // Clear the countdown interval here
        setGameResult(false);
        setCountdown(null);
        setGameMode(true);
        detectedGesturesPlayer1Ref.current = [];
        detectedGesturesPlayer2Ref.current = [];
        setTimer(10);
        setPlayer1Score(0);
        setPlayer2Score(0);
        setWinner("tie");
        setAvailableGesturesPlayer1([...labels]);
        setAvailableGesturesPlayer2([...labels]);
        nextGestureForPlayer1();
        nextGestureForPlayer2();

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
    let currentWinner;
    if (player1scoreRef.current > player2scoreRef.current) {
        currentWinner = 'player1';
    } else if (player1scoreRef.current < player2scoreRef.current) {
        currentWinner = 'player2';
    } else {
        currentWinner = 'tie';
    }
    setWinner(currentWinner);
    console.log("Determined Winner:", currentWinner);
}, [player1Score, player2Score]);

useEffect(() => {
    player1GestureRef.current = player1Gesture;
}, [player1Gesture]);

useEffect(() => {
    player2GestureRef.current = player2Gesture;
}, [player2Gesture]);


    useEffect(() => {
        gameModeRef.current = gameMode;
    }, [gameMode]);
    
    const nextGestureForPlayer1 = () => {
        if (availableGesturesPlayer1.length === 0) {
            setAvailableGesturesPlayer1([...labels]);
        }
    
        const randomIndex = Math.floor(Math.random() * availableGesturesPlayer1.length);
        const chosenGesture = availableGesturesPlayer1[randomIndex];
        setPlayer1Gesture(chosenGesture);
    
        // Remove the chosen gesture from the available gestures
        setAvailableGesturesPlayer1(prev => prev.filter(gesture => gesture !== chosenGesture));
    
        isLockedPlayer1Ref.current = false;
    }
    
    const nextGestureForPlayer2 = () => {
        if (availableGesturesPlayer2.length === 0) {
            setAvailableGesturesPlayer2([...labels]);
        }
    
        const randomIndex = Math.floor(Math.random() * availableGesturesPlayer2.length);
        const chosenGesture = availableGesturesPlayer2[randomIndex];
        setPlayer2Gesture(chosenGesture);
    
        // Remove the chosen gesture from the available gestures
        setAvailableGesturesPlayer2(prev => prev.filter(gesture => gesture !== chosenGesture));
    
        isLockedPlayer2Ref.current = false;
    
        
    }

    useEffect(() => {
        console.log("Player 1 Score:", player1Score);
    }, [player1Score]);
    
    useEffect(() => {
        console.log("Player 2 Score:", player2Score);
    }, [player2Score]);
    
    useEffect(() => {
        console.log("Winner:", winner);
    }, [winner]);

    const handlePlayAgain = () => {
        setPlayer1Name('Player 1');
        setPlayer2Name('Player 2');
        handleStartClick();
    };

  return (
    <div className="container">
        {!gameMode ? (
            <h1 className="font-link">~Asamyuta Hastas Detection~</h1>
        ) : (
            <div className="header-container-mp">
                <div className='make-gesture'>
                    <p>{player1Name}, make:</p>
                    <p><strong>{player1Gesture}</strong></p>
                </div>

                <div className="timer-overlay-mp">{timer}</div>

                <div className='make-gesture'>
                    <p>{player2Name}, make:</p>
                    <p><strong>{player2Gesture}</strong></p>
                </div>
            </div>
        )}
        

        <div className="video-container multiplayer">
            <video autoPlay height="480" id="webcam" playsInline width="640"></video>

            {showNameInput && (
                <div className='video-container-overlay'>
                    <div className="name-input-container">
                        <div className='name-input'>
                            <label className="player-name-label">Enter name for Player 1:</label>
                            <input 
                                type="text" 
                                placeholder="Player 1" 
                                onChange={(e) => setPlayer1Name(e.target.value ? e.target.value : 'Player 1')}
                            />
                        </div>
                        <div className='name-input'>
                            <label className="player-name-label">Enter name for Player 2:</label>
                            <input 
                                type="text" 
                                placeholder="Player 2" 
                                onChange={(e) => setPlayer2Name(e.target.value ? e.target.value : 'Player 2')}
                            />
                        </div>
                    </div>
                    <div className="game-buttons">
                        <button className="button-style button-style-game" onClick={startGame}>Begin</button>
                    </div>
                </div>
            )}


            {countdown && (
                <div className='video-container-overlay'>
                    <div className="countdown-container">
                        <div className="countdown-overlay"><strong>{countdown}</strong></div>
                        <div className='hand-instructions'>Make sure both your hands are within screen at all times!</div>
                    </div>
                </div>
            )}


            {!gameMode && (
                <a href="/howto" className="instructions-icon instructions-icon:hover">
                    ?
                    <span className="tooltip">Instructions</span>
                </a>
            )}
            {gameMode ? (
                null
            ) : (
                <div>
                {gameResult && countdown===null && !showNameInput && (
                    <div className='video-container-overlay'>
                        <p className="winner-text"><strong>{winner === 'tie' ? "It's a tie!" : `Winner: ${winner === 'player1' ? player1Name : player2Name}!`}</strong></p>
                        
                        <div className="player-stats-container">
                            <div className="player-stats player1-stats">
                                <p><strong>{player1Name}'s Total Points: {player1Score}!</strong></p>
                                <p className="gestures">Detected Gestures: {detectedGesturesPlayer1Ref.current.join(', ')}</p>
                            </div>
                            
                            <div className="player-stats player2-stats">
                                <p><strong>{player2Name }'s Total Points: {player2Score}!</strong></p>
                                <p className="gestures">Detected Gestures: {detectedGesturesPlayer2Ref.current.join(', ')}</p>
                            </div>
                        </div>
                    
                        <div className="game-buttons">
                            <button className="button-style button-style-game" onClick={handlePlayAgain}>Play Again</button>
                            <button className="button-style button-style-game" onClick={() => navigate('/')}> <i className="fas fa-home"></i></button>
                        </div>
                    </div>
                )}
                </div>
            )}

            <img alt="Augmented Frame" className="overlay" id="augmented_frame"/>
        </div>

        {!gameMode && countdown === null && !gameResult && !countdown && !showNameInput && (
                <div>
                    <button className="button-style button-style-game" onClick={handleStartClick}>Start Game</button>
                    <button className="button-style button-style-game" onClick={() => navigate('/howto')}>How To Play</button>
                    <button className="button-style button-style-game" onClick={() => navigate('/')}> <i className="fas fa-home"></i></button>
                </div>
        )}

        
    </div>
  );
}
  
export default MPGamePage;

