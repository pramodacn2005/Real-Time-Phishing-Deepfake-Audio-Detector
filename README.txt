CyberSentinel – Real-Time Phishing & Deepfake Audio Detector

Overview
--------
CyberSentinel is a full-stack cybersecurity platform designed to detect deepfake audio and phishing text/URLs. It uses a simulated machine learning logic system, provides a comprehensive dashboard for monitoring, and tracks risk scores across time.

Tech Stack
----------
* Frontend: React (Vite), Tailwind CSS (v3), Recharts, Lucide Icons
* Backend: FastAPI (Python), SQLite (via SQLAlchemy)

Features
--------
* Dashboard: Overview of total scans, high-risk threats, risk distribution, and recent alerts.
* Audio Analysis: Drag-and-drop file upload with simulated real-time detection confidence scores for .wav and .mp3 files.
* Phishing Detection: Text input analysis to detect malicious keywords and URLs.
* Risk Reports: Historical logs of all scans with filterable tables.
* Alerts & Notifications: Dedicated system notifications for high-risk threats.

How to Run Locally
------------------
Prerequisites:
* Python 3.x
* Node.js & npm

1. Starting the Backend Server:
   - Open a terminal and navigate to the `backend` folder.
   - Install the required dependencies:
     python -m pip install -r requirements.txt
   - Start the FastAPI server:
     python -m uvicorn main:app --port 8000
   - The backend API will be available at http://127.0.0.1:8000
   - Interactive API documentation is available at http://127.0.0.1:8000/docs

2. Starting the Frontend Server:
   - Open a second terminal and navigate to the `frontend` folder.
   - Install dependencies (if not already installed):
     npm install
   - Start the Vite development server:
     npm run dev
   - Access the frontend application in your web browser at http://localhost:5173

Project Structure
-----------------
* backend/
  * main.py: API entry point.
  * database.py: SQLite DB setup.
  * models.py: SQLAlchemy DB models.
  * schemas.py: Pydantic schemas.
  * routers/: API endpoints for audio, phishing, risk, alerts, and reports.
* frontend/
  * src/pages/: UI components for different application sections.
  * src/components/: Reusable components (e.g., Sidebar).
  * src/services/api.js: Axios configurations for API communication.
  * src/index.css: Global styles with custom Tailwind configuration.
