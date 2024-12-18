from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from flask_cors import CORS
import numpy as np
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({"message": "Hello from Flask!"})
# Load the Keras model
model_path = os.path.join(os.path.dirname(__file__), 'stego_2024-12-12_03-07-32.h5')
model = load_model(model_path)

# @app.route('/api/classify', methods=['POST'])
# def classify_image():
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400
    
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400
    
#     try:
#         # Save the uploaded file temporarily
#         temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
#         os.makedirs(temp_dir, exist_ok=True)
#         file_path = os.path.join(temp_dir, file.filename)
#         file.save(file_path)

#         # Preprocess the image
#         img = image.load_img(file_path, target_size=(224, 224))
#         img_array = image.img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0) / 255.0

#         # Make a prediction
#         prediction = model.predict(img_array)
#         predicted_class = np.argmax(prediction, axis=1)[0]
#         confidence = prediction[0][predicted_class]

#         # Cleanup the temporary file
#         os.remove(file_path)

#         return jsonify({
#             'predicted_class': int(predicted_class),
#             'confidence': float(confidence)
#         })

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
