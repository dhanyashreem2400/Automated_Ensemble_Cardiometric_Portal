# Automated Model Ensemble Techniques for Improved Accuracy

![Project Preview](public/landing_page.png)
## Description
This project implements a machine learning model ensemble using blending techniques to improve predictive accuracy. The system consists of a Flask backend serving the model and a React-based frontend for user interaction.

## Installation and Setup

### 1. Clone the Repository
```sh
git clone https://github.com/dhanyashreem2400/Automated_Ensemble_Cardiometric_Portal
```

### 2. Install Backend Dependencies
Navigate to the backend directory and install Python dependencies:
```sh
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies
Navigate to the frontend directory and install Node.js dependencies:
```sh
npm install
```

### 4. Running the Application

#### Start the Flask Backend
In one terminal, navigate to the backend directory and run:
```sh
python app.py
```
This will start the Flask server on `http://localhost:5000`.

#### Start the React Frontend
In another terminal, navigate to the frontend directory and run:
```sh
npm run dev
```
This will start the frontend, which will be accessible at `http://localhost:8080`.

### 5. Accessing the Application
Once both the backend and frontend are running, you can access the application in your browser at `http://localhost:8080`.


## Deployment
If deploying to Render or another hosting service, ensure that:
- The Flask backend is hosted with the required environment variables.
- The frontend is deployed separately and points to the correct backend URL.

## Notes
- **Ensure you don’t push `node_modules/` or `__pycache__/` to GitHub** (these are ignored in `.gitignore`).
- **Use a virtual environment for Python** (`python -m venv env` and `source env/bin/activate` or `env\Scripts\activate` for Windows).

## License
This project is open-source and available for use under the MIT License.

