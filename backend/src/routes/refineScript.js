const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const router = express.Router();

router.post('/', async (req, res) => {
  const { script, feedback, topic, tone, genre, responseId, timestamp } = req.body;
  try {
    const n8nResponse = await fetch(`${process.env.N8N_WEBHOOK_BASE}/avatarfeedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script, feedback, topic, tone, genre, responseId, timestamp })
    });
    const data = await n8nResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to forward to n8n webhook', details: error.message });
  }
});

module.exports = router; 