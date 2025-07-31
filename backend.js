// backend.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Gemini API endpoint and key
const GEMINI_API_KEY = process.env.AIzaSyDCOMsJ_CPXzyRSDM6NO0-UAl4Necws4fw || 'AIzaSyDCOMsJ_CPXzyRSDM6NO0-UAl4Necws4fw';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

app.post('/api/ask', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided.' });
    try {
        const payload = {
            contents: [{ parts: [{ text: question }] }]
        };
        const response = await fetch(GEMINI_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        const aiText = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) || 'Sorry, I could not get an answer from the AI.';
        res.json({ answer: aiText });
    } catch (err) {
        res.status(500).json({ error: 'AI service error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
