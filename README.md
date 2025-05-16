# 🗳️ Electronic Voting System

A secure, decentralized, and scalable electronic voting platform developed with enterprise-grade security standards. Designed using **Microsoft Secured by Design** principles, this system ensures integrity, confidentiality, and auditability of votes cast in a digital election environment.

---

## 🚀 Features

- ✅ **Zero-Knowledge Proofs**: Ensures voter anonymity and ballot integrity.
- 🔐 **Homomorphic Encryption**: Enables secure and private vote tallying without exposing individual votes.
- 🛡️ **Multi-Factor Authentication**: WebAuthn + biometric verification for robust identity validation.
- 📦 **Secure Storage**: All sensitive data is stored securely in Firebase and Google Cloud.
- 📜 **Audit-Ready**: Designed for **SOC 2 Type II** compliance and aligned with **OWASP Top 10** security guidelines.
- 🔎 **Real-Time Activity Logs**: Tracks user interactions and system operations for transparency and traceability.
- 🧪 **Test-Driven Development**: Unit tested with Jest for reliability and coverage.

---

## 🧰 Tech Stack

- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Authentication & Storage**: Firebase Auth, Firestore
- **Cloud Functions**: Google Cloud Functions
- **Security**: WebAuthn, MFA, Homomorphic Encryption, ZK-Proofs
- **Testing**: Jest

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/kishaiyan/electronic-voting-system.git

```
### 2. Install Dependency

``` code
npm install
```

### 3. Firebase Setup

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id

### 4. Run the development server

```bash
nom run dev
```
