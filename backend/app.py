

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all origins
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Load the blended model
with open("models/blended_model.pkl", "rb") as f:
    model_data = pickle.load(f)

# Extract individual models & blending weights
log_meta = model_data["log_meta"]
xgb_meta = model_data["xgb_meta"]
xgb_weight, log_weight = model_data["weights"]

# Define feature names (must match training data)
FEATURE_NAMES = [
    "age", "sex", "trestbps", "chol", "fbs", "thalach", "exang", "oldpeak", "ca",
    "cp_1", "cp_2", "cp_3", "restecg_1", "restecg_2", "slope_1", "slope_2",
    "thal_1", "thal_2", "thal_3"
]


@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON data from request
        data = request.json
        if not data:
            return jsonify({"error": "Empty JSON received!"}), 400

        print("✅ Received Data:", data)  # Debugging

        # Extract numerical values & categorical one-hot encoding
        features = [float(data[feature]) for feature in FEATURE_NAMES]

        print("🔎 Features Sent to Model:", features)  # Debugging
        
        # Convert input to Pandas DataFrame
        features_df = pd.DataFrame([features], columns=FEATURE_NAMES)

        # Get probability predictions
        log_probs = log_meta.predict_proba(features_df)[:, 1]
        xgb_probs = xgb_meta.predict_proba(features_df)[:, 1]

        # Apply Weighted Blending
        final_probs = (xgb_weight * xgb_probs) + (log_weight * log_probs)

        # Convert to final prediction (Threshold = 0.6)
        final_prediction = int(final_probs[0] >= 0.6)

        print(f"📌 Final Prediction: {'High' if final_prediction == 1 else 'Low'}")  # Debugging

        return jsonify({"prediction": final_prediction})

    except Exception as e:
        print(f"❌ Error: {str(e)}")  # Debugging
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)







