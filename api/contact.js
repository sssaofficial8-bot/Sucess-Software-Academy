const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

// Database file path (Vercel has a read-only filesystem, use /tmp for serverless writes)
const dbPath = process.env.VERCEL 
    ? path.join('/tmp', 'messages.json') 
    : path.join(__dirname, '..', 'messages.json');

// Ensure the messages file exists safely
try {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify([]));
    }
} catch (error) {
    console.error('Error initializing database file:', error);
}

// API Route for Contact Form Submission
app.post('/api/contact', (req, res) => {
    const { name, phone, course, message } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and Phone are required fields.' });
    }

    const newMessage = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        name,
        phone,
        course: course || 'Not Specified',
        message: message || 'No Message'
    };

    try {
        const fileData = fs.readFileSync(dbPath, 'utf8');
        const messages = JSON.parse(fileData);
        messages.push(newMessage);
        fs.writeFileSync(dbPath, JSON.stringify(messages, null, 2));

        console.log(`[New Transmission] From: ${name}, Course: ${course}`);
        res.status(200).json({ success: true, message: 'Transmission received.' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server (only if not running on Vercel)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`SSA Command Center Backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;
