import './App.css';
import axios from 'axios';
import React, { useEffect } from 'react';  
import { useNavigate } from 'react-router-dom';

function HandDetection() {        
    console.log("inside HandDetection")
    const navigate = useNavigate();

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

          const frameInterval = setInterval(() => {
            let frame = captureFrame();
            //   console.log("frame: ", frame);
              axios.post("http://127.0.0.1:5000/predict", { image_data: frame })
                  .then(function(response) {
                    const data = response.data;
                                  
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

  return (
    <div className="container">
        <h1 className="font-link">~Asamyuta Hastas Detection~</h1>
        <div className="video-container">
            <video autoPlay height="480" id="webcam" playsInline width="640"></video>
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
        <button className="button-style button-style-game" onClick={() => navigate('/spgame')}>Play Game</button>
        <button className="button-style button-style-game" onClick={() => navigate('/howto')}>How To Play</button>
        <button className="button-style button-style-game" onClick={() => navigate('/')}> <i className="fas fa-home"></i></button>
    </div>
  );
}
  
export default HandDetection;