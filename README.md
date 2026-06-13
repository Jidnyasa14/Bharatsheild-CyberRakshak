# BharatShield-CyberRakshak 🇮🇳

## Project Overview

BharatShield-CyberRakshak is an AI-powered cybersecurity platform designed to protect Indian users from phishing attacks, fraudulent websites, scam links, fake government portals, UPI frauds, and malicious WhatsApp messages. The system analyzes URLs using machine learning techniques and provides instant risk assessment to help users avoid online scams.

---

## Problem Statement

Cyber frauds in India are increasing rapidly through phishing websites, fake government portals, fake job offers, UPI scams, and malicious WhatsApp links. Many users are unable to identify suspicious links before becoming victims of fraud.

There is a need for a simple and intelligent system that can detect potentially dangerous URLs and warn users before they interact with them.

---

## Proposed Solution

BharatShield-CyberRakshak uses Machine Learning, URL feature analysis, and threat intelligence techniques to analyze URLs and classify them as Safe, Suspicious, or Dangerous.

The platform also includes a WhatsApp Scanner that extracts links from messages and evaluates their risk level, helping users identify scam messages before clicking on malicious links.

---

## Features

* URL Safety Scanner
* AI-based Fraud URL Detection
* Indian Scam Pattern Detection
* WhatsApp Scam Link Scanner
* Risk Classification (Safe / Suspicious / Dangerous)
* Scan History Tracking
* Security Statistics Dashboard
* MongoDB-based Data Storage
* Cybercrime Reporting Guidance

---

## Technology Stack

### Frontend

* React.js
* Vite
* CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Machine Learning

* Python
* Scikit-Learn
* Pickle Model

---
# BharatShield-CyberRakshak

AI-powered cybersecurity platform developed by Team The Innovators (S2TJ).

## Live Demo
https://bharatsheild-cyber-rakshak.vercel.app/

## Demo Video
https://youtu.be/NRsTapInlPA?si=X0TVpnKfS5GQfIh-

## Features
- URL Threat Detection
- AI Phishing Analysis
- WhatsApp Scam Scanner
- Cyber Awareness Dashboard
- Mobile Responsive UI

## Team
The Innovators (S2TJ)

## Setup & Usage Instructions

### Clone Repository

```bash
git clone <repository-url>
```

### Backend Setup

```bash
cd shieldurl/backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd shieldurl/frontend
npm install
npm run dev
```

### ML Model Setup

```bash
cd shieldurl/ml-model
pip install -r requirements.txt
python app.py
```

### Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
ML_URL=http://localhost:5001/predict
```

---

## Team Details

Team Name: BharatShield-CyberRakshak

Team Members:

* Jidnyasa Gole
* Sakshi Mali
* Sharvari Pawar
* Patyetanvi (GitHub Contributor)

---

## Future Enhancements

* Browser Extension Integration
* Real-time Scam Database
* SMS Scam Detection
* QR Code Security Scanner
* Multi-language Support

---

## Conclusion

BharatShield-CyberRakshak aims to make the internet safer for Indian users by providing quick and intelligent scam detection. The platform empowers users to identify threats before becoming victims of cyber fraud.
