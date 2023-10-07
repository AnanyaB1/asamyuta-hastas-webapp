# import sys
# sys.path.append('C:/Users/anany/OneDrive - Nanyang Technological University/Documents/GitHub/asamyuta-hastas-recognition')
from flask import Flask, request, jsonify, render_template
import numpy as np
import cv2 as cv
import mediapipe as mp
import base64
# from model import KeyPointClassifier
import argparse
import copy
import itertools
from flask_cors import CORS
import tensorflow as tf
import sqlite3
from helper import KeyPointClassifier, get_args, calc_bounding_rect, calc_landmark_list, pre_process_landmark, draw_bounding_rect, draw_info_text, draw_landmarks


app = Flask(__name__)
CORS(app)


labels = ['Pathakas', 'Tripathako', 'Ardhapathakas', 'Kartharimukhaha', 'Mayoorakhyo',\
             'Ardhachandrascha', 'Araala', 'Shukathundakaha', 'Mushtischa', 'Shikharakhyascha',\
                  'Kapitha', 'Katakhamukhaha', 'Suchi', 'Chandrakhala', 'Padmakosha', 'Sarparhirasthathaa',\
                      'Mrigashirsha', 'Simhamukhaha', 'Kaangoolascha', 'Alapadmakaha', 'Chaturo', 'Bhramaraschaiva',\
                          'Hamsasyo', 'Hamsapakshakaha', 'Samdamsho', 'Mukulaschaiva', 'Thaamrachoodas', 'Trisoolakaha']

import sqlite3

def init_db():
    with sqlite3.connect('leaderboard.db') as conn:
        cursor = conn.cursor()
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            score INTEGER NOT NULL
        )
        ''')


args = get_args()

cap_device = args.device
cap_width = args.width
cap_height = args.height

use_static_image_mode = args.use_static_image_mode
min_detection_confidence = args.min_detection_confidence
min_tracking_confidence = args.min_tracking_confidence

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=use_static_image_mode,
    max_num_hands=1,
    min_detection_confidence=min_detection_confidence,
    min_tracking_confidence=min_tracking_confidence,
)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/predict', methods=["POST"])
def predict():
    try:
        # Imported from model/keypoint_classifier.py
        keypoint_classifier = KeyPointClassifier()
        # Decode the frame from base64 to OpenCV format
        # print(request.data[:100])  # print the first 100 bytes to inspect it
        # received_str = request.form['image_data']
        data = request.get_json()
        received_str = data.get('image_data', '')
        # received_str = data.get('image_data', '')
        # print(received_str)
        # print(received_str[:100])
        encoded_img = received_str.split(',')[1]
        frame_bytes = base64.b64decode(encoded_img)
        frame = cv.imdecode(np.frombuffer(frame_bytes, dtype=np.uint8), cv.IMREAD_COLOR)
        frame = cv.flip(frame, 1)  # 1 indicates flipping horizontally
        image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        image.flags.writeable = False
        print("Processing frame")
        results = hands.process(image)
        print("Frame processed")
        image.flags.writeable = True
        # print("got here without error")

        # one hand (?)
        if results.multi_hand_landmarks:
            print("detected hand")
            # Extract and process landmarks
            handedness = results.multi_handedness[0]
            hand_landmarks = results.multi_hand_landmarks[0]
            brect = calc_bounding_rect(image, hand_landmarks)
            landmark_list = calc_landmark_list(frame, hand_landmarks)
            pre_processed_landmark_list = pre_process_landmark(landmark_list)
            # print("processing hand yaar")
            
            # Get prediction (you should integrate your prediction code here)
            hand_sign_id = keypoint_classifier(pre_processed_landmark_list)
            prediction = labels[hand_sign_id]  # Example

            debug_image = draw_bounding_rect(image, brect)
            debug_image = draw_landmarks(debug_image, landmark_list)
            debug_image = draw_info_text(
                debug_image,
                brect,
                handedness,
                prediction
            )
            # print(prediction)
            # print(debug_image)
            # Convert the modified frame to JPEG
            debug_image_bgr = cv.cvtColor(debug_image, cv.COLOR_RGB2BGR)
            _, buffer = cv.imencode('.jpg', debug_image_bgr)

            # Base64 encode
            encoded_image = base64.b64encode(buffer).decode('utf-8')
            print("hereeeeeeeeeeeeeeeeee")
            print(prediction)
            return jsonify({"prediction": prediction, "augmented_frame": encoded_image})
        return jsonify({"error": "No hand detected"})
    except Exception as e:
        print("Error encountered:", e)
        return jsonify({"error": "Server error"}), 500


mp_hands2 = mp.solutions.hands
hands2 = mp_hands2.Hands(
    static_image_mode=use_static_image_mode,
    max_num_hands=2,
    min_detection_confidence=min_detection_confidence,
    min_tracking_confidence=min_tracking_confidence,
)
@app.route('/predictmp', methods=["POST"])
def predictmp():
    try:
        # Imported from model/keypoint_classifier.py
        keypoint_classifier = KeyPointClassifier()

        data = request.get_json()
        received_str = data.get('image_data', '')
        encoded_img = received_str.split(',')[1]
        frame_bytes = base64.b64decode(encoded_img)
        frame = cv.imdecode(np.frombuffer(frame_bytes, dtype=np.uint8), cv.IMREAD_COLOR)
        frame = cv.flip(frame, 1)  # 1 indicates flipping horizontally
        print("frmae:", frame.shape, frame.dtype)
        
        image = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        image.flags.writeable = False
        print("Processing frame")
        results = hands2.process(image)
        print("Frame processed")
        image.flags.writeable = True
        # print("got here without error")
        print("image", image.shape, image.dtype)

        # one hand (?)
        if results.multi_hand_landmarks and len(results.multi_hand_landmarks) == 2:
            print("inside here")
            # Sort hands based on their x-coordinate to differentiate left and right hands
            sorted_hands = sorted(
                results.multi_hand_landmarks,
                key=lambda x: x.landmark[9].x  # Using the x-coordinate of the 9th landmark (tip of the index finger)
            )
            # Determine handedness
            left_handedness = results.multi_handedness[0].classification[0].label
            right_handedness = results.multi_handedness[1].classification[0].label

            # If both hands are the same type, assign based on position
            player1_hand = sorted_hands[0]
            player2_hand = sorted_hands[1]


            # Process the player1 hand
            player1_brect = calc_bounding_rect(image, player1_hand)
            player1_landmark_list = calc_landmark_list(frame, player1_hand)
            player1_pre_processed_landmark_list = pre_process_landmark(player1_landmark_list)
            player1_hand_sign_id = keypoint_classifier(player1_pre_processed_landmark_list)
            player1_prediction = labels[player1_hand_sign_id]

            # Process the player2 hand
            player2_brect = calc_bounding_rect(image, player2_hand)
            player2_landmark_list = calc_landmark_list(frame, player2_hand)
            player2_pre_processed_landmark_list = pre_process_landmark(player2_landmark_list)
            player2_hand_sign_id = keypoint_classifier(player2_pre_processed_landmark_list)
            player2_prediction = labels[player2_hand_sign_id]

            # Draw bounding boxes, landmarks, and info
            debug_image = draw_bounding_rect(image, player1_brect)
            debug_image = draw_landmarks(debug_image, player1_landmark_list)
            debug_image = draw_info_text(debug_image, player1_brect, results.multi_handedness[0], player1_prediction)

            debug_image = draw_bounding_rect(debug_image, player2_brect)
            debug_image = draw_landmarks(debug_image, player2_landmark_list)
            debug_image = draw_info_text(debug_image, player2_brect, results.multi_handedness[1], player2_prediction)

            # Convert the modified frame to JPEG
            debug_image_bgr = cv.cvtColor(debug_image, cv.COLOR_RGB2BGR)
            _, buffer = cv.imencode('.jpg', debug_image_bgr)

            # Base64 encode
            encoded_image = base64.b64encode(buffer).decode('utf-8')
            return jsonify({
                "player1_prediction": player1_prediction,
                "player2_prediction": player2_prediction,
                "augmented_frame": encoded_image
            })

        return jsonify({"error": "Either no hand or only one hand detected"})
    except Exception as e:
        print("Error encountered:", e)
        return jsonify({"error": "Server error"}), 500


@app.route('/submit_score', methods=['POST'])
def submit_score():
    data = request.json
    name = data['name']
    score = data['score']
    print(f"name: {name}, score: {score}")
    
    with sqlite3.connect('leaderboard.db') as conn:
        cursor = conn.cursor()
        cursor.execute('INSERT INTO leaderboard (name, score) VALUES (?, ?)', (name, score))
        conn.commit()
        print("added to database")

    return jsonify(success=True)

@app.route('/get_leaderboard', methods=['GET'])
def get_leaderboard():
    with sqlite3.connect('leaderboard.db') as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT name, score FROM leaderboard ORDER BY score DESC LIMIT 10')
        results = cursor.fetchall()

    # Convert the results to a list of dictionaries for JSON serialization
    leaderboard = [{'name': name, 'score': score} for name, score in results]
    return jsonify(leaderboard)

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
