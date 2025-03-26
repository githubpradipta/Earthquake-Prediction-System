from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

model = pickle.load(open('../MLModel/model.pkl', 'rb'))

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/prediction', methods=['POST'])
def prediction():
    body = request.get_json()
    print(body)
 
    latitude = int(round(float(body.get('lat'))))
    longitude = int(round(float(body.get('long'))))
    depth = int(round(float(body.get('depth'))))

    arr = np.array([[latitude, longitude, depth]])
    output = model.predict(arr)[0]

    print(output)
    return jsonify({"magnitude": int(output)})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
