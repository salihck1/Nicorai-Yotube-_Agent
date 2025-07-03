const express = require('express');
const router = express.Router();
const ScriptHistory = require('../models/ScriptHistory');

// Dynamic import for node-fetch v3+ (ESM workaround)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data.content || !data.media) {
      return res.status(400).json({ error: 'Missing required fields: content and media' });
    }
    // Transform Uploaded_media and media to set url as driveLink and move proxy URL to proxyUrl
    const transformMediaArray = (arr) =>
      Array.isArray(arr)
        ? arr.map(item => ({
            ...item,
            proxyUrl: item.url || item.src,
            url: item.driveLink || item.url || item.src,
          }))
        : arr;

    const payload = {
      content: data.content,
      media: transformMediaArray(data.media),
      Uploaded_media: transformMediaArray(data.Uploaded_media),
      responseId: data.responseId,
      timestamp: data.timestamp,
      status: 'approved',
      topic: data.topic,
      tone: data.tone,
      genre: data.genre
    };
    const response = await fetch('https://n8n.srv810314.hstgr.cloud/webhook/media-regenerate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      return res.status(502).json({ error: 'Invalid JSON response from webhook', details: responseText });
    }
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Webhook request failed', details: responseData });
    }

    // Store approval in MongoDB, including Google Drive link if present
    try {
      await ScriptHistory.create({
        responseId: data.responseId,
        topic: data.topic,
        tone: data.tone,
        genre: data.genre,
        content: data.content,
        timestamp: data.timestamp,
        status: responseData.status || pending,
        media: data.media,
        driveLink: responseData.path || null,
        youtubeLink: responseData.youtubelink || null,
        title: responseData.title || null
      });
    } catch (dbErr) {
      console.error('Failed to save ScriptHistorys:', dbErr);
      // Do not block the response to client, but log the error
    }

    return res.json(responseData);
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

module.exports = router; 