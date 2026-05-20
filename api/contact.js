const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }

    const { name, phone, course, message } = req.body || {};

    if (!name || !phone) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Name and Phone are required fields.' }));
        return;
    }

    const dbPath = process.env.VERCEL 
        ? path.join('/tmp', 'messages.json') 
        : path.join(__dirname, '..', 'messages.json');

    // Ensure database file exists safely
    try {
        if (!fs.existsSync(dbPath)) {
            fs.writeFileSync(dbPath, JSON.stringify([]));
        }
    } catch (err) {
        console.error('Error creating database file:', err);
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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Transmission received.' }));
    } catch (error) {
        console.error('Error saving message:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error.' }));
    }
};
