const express = require('express');
const path = require('path');
const contactHandler = require('./api/contact.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies (necessary for req.body to be parsed and sent to the serverless function)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests for easy local debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Route /api/contact to the serverless function
app.post('/api/contact', contactHandler);
app.options('/api/contact', contactHandler);

// Serve static assets from the current directory (index.html, css/, js/, assets/)
app.use(express.static(__dirname));

// Fallback all other routes to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 Success Software Academy local server running:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`==================================================`);
});
