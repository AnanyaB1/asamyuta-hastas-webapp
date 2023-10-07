# asamyuta-hastas-webapp

A web application that uses a trained model to recognize Asamyuta Hastas. The camera is capable of detecting 28 unique hand gestures, offering users an interactive experience and a fun game to test their skills.

## Welcome to Asamyuta Hastas Detection!

Ready to test your skills? Here's what you can do on this platform:

1. **Detection:** Simply make a hasta viniyoga, and the algorithm will detect it.
2. **Single Player Game:** Test your skills as you try to get as many hand gestures right as possible within a 10-second frame.
3. **Two Player Game:** Compete with a friend and see who can nail the most hand gestures in 10 seconds.

### Tips for a Great Experience:

- **Positioning:** For optimal results, position your hand clearly in front of your webcam. Ensure your hand is centered and occupies a significant part of the frame.

- **Lighting:** Good lighting is crucial! Be in a well-lit area and avoid shadows or backlighting that might disrupt gesture recognition.

- **Gesture Recognition:** This game recognizes 28 unique asamyuta hastas. When prompted, aim to replicate the gesture as accurately as possible.

- **Scoring: Single Player Game:** You're given 10 seconds to accumulate points for each accurate gesture you display. Speed matters!

- **Scoring: Two Player Game:** Challenge a friend to compete against you. Aim to showcase as many gestures as you can within a 10-second timeframe. The fastest to gesture correctly wins!

## Directory Structure

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
