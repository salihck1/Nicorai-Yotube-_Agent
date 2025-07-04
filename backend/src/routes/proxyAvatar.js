const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ProxyAvatarUpload = require('../models/ProxyAvatarUpload');

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

router.post('/save', async (req, res) => {
  try {
    const { file, drive, status, topic, script, title, video, avatarId, voiceId, jobId } = req.body;
    await ProxyAvatarUpload.findOneAndUpdate(
      { jobId },
      {
        $set: {
          topic,
          script,
          title,
          drive,
          file,
          video,
          avatarId,
          voiceId,
          status: 'pending'
        }
      },
      { upsert: true, new: true }
    );
    await fetch('https://n8n.srv810314.hstgr.cloud/webhook/avatar-video-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, drive, status: 'save' }),
    });
    res.status(200).json({ status: 'pending', file, drive, jobId });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

router.post('/upload', async (req, res) => {
  try {
    const { file, drive, status, topic, script, title, video, avatarId, voiceId, jobId } = req.body;
    const n8nRes = await fetch('https://n8n.srv810314.hstgr.cloud/webhook/avatar-video-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file, drive, status: 'upload' }),
    });
    const text = await n8nRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    const { youtubelink, title: n8nTitle, embedding } = data;
    await ProxyAvatarUpload.findOneAndUpdate(
      { jobId },
      {
        $set: {
          topic,
          script,
          title: n8nTitle || title,
          embedding,
          drive,
          file,
          video,
          avatarId,
          voiceId,
          youtubelink,
          status: 'uploaded'
        }
      },
      { upsert: true, new: true }
    );
    res.status(200).json({ youtubelink, status: 'uploaded', title: n8nTitle, jobId, embedding });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

module.exports = router; 