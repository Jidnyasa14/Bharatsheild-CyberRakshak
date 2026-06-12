# 🛡️ ShieldURL — AI-Powered URL Threat Detector

A hackathon project that detects phishing, malware, and suspicious URLs using
Machine Learning, VirusTotal, and IP intelligence.

---

## 📁 Project Structure

```
shieldurl/
├── ml-model/        ← Python Flask ML API
├── backend/         ← Node.js Express API
├── frontend/        ← React dashboard
└── extension/       ← Chrome extension
```

---

## 🚀 Setup Instructions

### Step 1 — Start the ML Model (Python)

```bash
cd ml-model
pip install -r requirements.txt
python app.py
# Running on http://localhost:5001
```

### Step 2 — Start the Backend (Node.js)

```bash
cd backend
npm install
# Edit .env and add your API keys (optional for demo)
npm run dev
# Running on http://localhost:3001
```

### Step 3 — Start the Frontend (React)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

### Step 4 — Load the Chrome Extension

1. Open Chrome → go to `chrome://extensions`
2. Enable **Developer Mode** (top right)
3. Click **"Load unpacked"**
4. Select the `extension/` folder
5. The ShieldURL icon appears in your toolbar!

---

## 🔑 Free API Keys (Optional but recommended)

| Service      | URL                              | What it adds           |
|--------------|----------------------------------|------------------------|
| VirusTotal   | https://virustotal.com/gui/join  | 70+ antivirus engines  |
| IPInfo       | https://ipinfo.io/signup         | IP geolocation data    |

Add them to `backend/.env`.

---

## ✨ Features

- **AI phishing score** — ML model trained on URL patterns
- **VirusTotal scan** — checks against 70+ security engines
- **IP geolocation** — shows where the server is located
- **Scan history** — all past scans saved in MongoDB
- **Dashboard stats** — total scans, threat counts, breakdown chart
- **Chrome extension** — right-click any link → instant scan

---

## 🏗️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| ML Model  | Python, Flask, scikit-learn       |
| Backend   | Node.js, Express, MongoDB         |
| Frontend  | React, Vite, CSS                  |
| Extension | Chrome Extension API (Manifest v3)|

---

## 🎯 Demo Flow (for judges)

1. Open the dashboard
2. Paste a suspicious URL (e.g. from phishtank.org)
3. Show the risk score, VT results, and IP location
4. Right-click a link in Chrome → "Check with ShieldURL"
5. Show scan history and stats dashboard
