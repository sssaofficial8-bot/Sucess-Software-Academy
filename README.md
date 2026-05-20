# Success Software Academy (SSA) Web Portal

Welcome to the official web application codebase for **Success Software Academy (SSA)**, professional IT training institute based in Anantapuramu, Andhra Pradesh. This is a high-fidelity web portal utilizing modern UI/UX design, custom canvas animations, and a lightweight Node.js/Express contact transmission server.

---

## 🚀 Key Features

*   **100% Native Animations**: Includes a high-fidelity startup preloader canvas, dynamic floating physics particles in the hero header, custom trailing cursor elements, 3D card tilt effects, and auto-sliding reviews.
*   **Fully Responsive Styling**: Styled completely with premium Vanilla CSS featuring a gorgeous glassmorphic dark theme, custom scrolls, and fluid screen adaptability.
*   **Lightweight Express Backend**: Pre-configured Node.js server (`server.js`) that handles static routing and provides a contact registration API.
*   **JSON-Based Local Database**: Automatically writes student enrollment inquiries submitted through the contact page into a local database file (`messages.json`) in real-time.

---

## 🛠️ Technology Stack

*   **Frontend**: Semantic HTML5, Vanilla CSS (CSS Grid, Keyframes, Custom Scrollbars), and Native ES6+ Javascript.
*   **Backend**: Node.js, Express.js, and CORS Middleware.
*   **Assets**: High-resolution layout configurations and maps integration.

---

## ⚙️ How to Run Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Install Dependencies
Navigate to the project root folder and run:
```bash
npm install
```

### 3. Start the Server
Start the Express server:
```bash
npm start
```
The server will boot up at **`http://localhost:3000`**.

### 4. Interact & Submit
Open your browser and go to `http://localhost:3000`. Navigate to the **Mission Control (Contact)** section, fill out the form, and hit submit. Submissions will be logged instantly inside `messages.json`!

---

## 🌐 Deployment to Production

### 1. Free Deployment via Render (Recommended)
This portal is pre-configured to run on server environments. You can deploy it for free:
1. Push this repository to your GitHub account.
2. Sign up on [Render](https://render.com/) and create a new **Web Service**.
3. Link your GitHub repository.
4. Set the following settings:
    *   **Runtime**: `Node`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
5. Click deploy and your web academy will be live!
