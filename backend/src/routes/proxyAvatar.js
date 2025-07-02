const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

router.post('/', async (req, res) => {
  try {
    const { topic, avatarId, script, voiceId } = req.body;
    const n8nRes = await fetch('https://n8n.srv810314.hstgr.cloud/webhook/avatar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, avatarId, script, voiceId }),
    });
    const text = await n8nRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
    res.status(n8nRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

module.exports = router; 