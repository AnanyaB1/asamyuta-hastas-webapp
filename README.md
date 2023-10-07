# asamyuta-hastas-webapp

A web application that uses the trained model I built in [asamyuta-hastas-detection-using-mediapipe](https://github.com/AnanyaB1/asamyuta-hastas-detection-using-mediapipe) to recognize 28 unique hand signs, known as the Asamyuta Hastas, from the Indian classical dance form, Bharatanatyam. This is meant to be an interactive experience and a fun game to test dancers' skills.

## Welcome to Asamyuta Hastas Detection!

Here's what you can do on this platform:

1. **Detection:** Simply make a hasta viniyoga, and the algorithm will detect it.
2. **Single Player Game:** Test your skills as you try to get as many hand gestures right as possible within a 10-second frame.
3. **Two Player Game:** Compete with a friend and see who can nail the most hand gestures in 10 seconds.

### Home Page
<img src= "https://github.com/AnanyaB1/asamyuta-hastas-detection-using-mediapipe/assets/63778650/f79cb1f4-483c-492b-ab8d-3f3fec9a4608" width=60% ><br>

### Detection & Game Modes
<img src= "https://github.com/AnanyaB1/asamyuta-hastas-detection-using-mediapipe/assets/63778650/e99ed800-1f8a-4343-95b1-40bb95ea4dbf" width=40% >
<img src= "https://github.com/AnanyaB1/asamyuta-hastas-detection-using-mediapipe/assets/63778650/b1daa06a-7005-4633-9c41-42ff5c98548d" width=40% > <br>

### Two Player Game
<img src= "https://github.com/AnanyaB1/asamyuta-hastas-detection-using-mediapipe/assets/63778650/89afe809-5881-463b-a927-475f4345e6c8" width=40% >


## Directory Structure
```
asamyuta-hastas-webapp
│ app.py
│ helper.py
│ leaderboard.db
│
├───model
│ keypoint_classifier.tflite
│
├───my-app
│ ├───src
│ │ ├───components
│ │ │ App.css
│ │ │ GamePage.js
│ │ │ HandDetection.js
│ │ │ HowToPlay.css
│ │ │ HowToPlay.js
│ │ │ LandingPage.js
│ │ │ MainApp.js
│ │ │ manymandalas.jpg
│ │ │ MPGamePage.css
│ │ │ MPGamePage.js
│ │ └───... (other directories and files in src)
│ └───... (other directories and files in my-app)
│
└───__pycache__
helper.cpython-39.pyc
```

## Structure
Backend: Flask
Frontend: React

## Credits
How I trained the model to recognise the unique hand gesutues is elaborated upon in [asamyuta-hastas-detection-using-mediapipe](https://github.com/AnanyaB1/asamyuta-hastas-detection-using-mediapipe) for which I took reference from [hand-gesture-recognition-mediapipe repository](https://github.com/kinivi/hand-gesture-recognition-mediapipe). Significant modifications were made to cater to the specific needs of recognizing Asamyuta Hastas, including changes in data collection methodology and model architecture.

