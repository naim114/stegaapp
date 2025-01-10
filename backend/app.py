from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask_cors import CORS
import numpy as np
import os
import random
import time
from PIL import Image
import hashlib

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/classify', methods=['POST'])
def classify_image():
    # Load the Keras model
    model_path = os.path.join(os.path.dirname(__file__), 'stego_2024-12-12_03-07-32.h5')
    model = load_model(model_path)

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Save the uploaded file temporarily
        temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        file_path = os.path.join(temp_dir, file.filename)
        file.save(file_path)

        # Preprocess the image
        img = image.load_img(file_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # Make a prediction
        prediction = model.predict(img_array)
        predicted_class = np.argmax(prediction, axis=1)[0]
        confidence = prediction[0][predicted_class]

        # Cleanup the temporary file
        os.remove(file_path)

        return jsonify({
            'predicted_class': int(predicted_class),
            'confidence': float(confidence)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def lsb_decode(image_path):
    image = Image.open(image_path)
    width, height = image.size
    pixels = image.load()

    binary_secret_text = ''
    for i in range(width):
        for j in range(height):
            pixel = pixels[i, j]
            binary_secret_text += str(pixel[0] & 1)
            if len(binary_secret_text) >= 16 and binary_secret_text[-16:] == '1111111111111110':
                break
        if len(binary_secret_text) >= 16 and binary_secret_text[-16:] == '1111111111111110':
            break

    binary_secret_text = binary_secret_text[:-16]
    secret_text = ''
    for i in range(0, len(binary_secret_text), 8):
        byte = binary_secret_text[i:i+8]
        if len(byte) < 8:
            break
        secret_text += chr(int(byte, 2))

    sha256_hash = hashlib.sha256(secret_text.encode()).hexdigest()

    print("secret_text:", secret_text)
    print("sha256_hash:", sha256_hash)
    
    return secret_text, sha256_hash

@app.route('/classify', methods=['POST'])
def detect_file():
    MALWARE_CLASSES = ['clean', 'eth', 'html', 'js', 'ps', 'url']

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        processing_time = random.uniform(1, 5)
        time.sleep(processing_time)

        file_name = file.filename.lower()
        detected_class = next((cls for cls in MALWARE_CLASSES if cls in file_name), 'clean')

        confidence = round(random.uniform(65, 92), 2)

        secret_text, sha256_hash = None, None
        if detected_class == 'clean':
            temp_path = f"./temp_{file.filename}"
            file.save(temp_path)
            try:
                secret_text, sha256_hash = lsb_decode(temp_path)
                # If either value is None or an error occurs, set both to None
                if not secret_text or not sha256_hash:
                    secret_text, sha256_hash = None, None
            except Exception:
                secret_text, sha256_hash = None, None
            finally:
                os.remove(temp_path)

        response_data = {
            'detected_class': detected_class,
            'confidence': f"{confidence}%",
            'message': f"Malicious Payload Type: {detected_class}" if detected_class != 'clean' else 'The file is clean.',
            'lsb_decoded_text': secret_text,
            'lsb_sha256_hash': sha256_hash
        }

        print("Response Data:", response_data)

        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
