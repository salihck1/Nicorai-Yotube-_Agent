const express = require('express');
const router = express.Router();

// Dynamic import for node-fetch v3+ (ESM workaround)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.type || (!payload.originalUrl && !payload.fileId)) {
      return res.status(400).json({ error: 'Missing required fields', details: 'The request must include type and either originalUrl or fileId' });
    }
    const response = await fetch(`${process.env.N8N_WEBHOOK_BASE}/media-regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Express-API-Client',
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      return res.status(502).json({ error: 'Invalid JSON response from service', rawResponse: responseText });
    }
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to regenerate media', status: response.status, statusText: response.statusText, responseText });
    }
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router; 