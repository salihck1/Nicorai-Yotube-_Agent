const express = require('express');
const router = express.Router();
const ScriptHistory = require('../models/ScriptHistory');
const ProxyAvatarUpload = require('../models/ProxyAvatarUpload');

// GET /api/pending-projects
router.get('/', async (req, res) => {
  try {
    const pendingProjects = await ScriptHistory.find({ status: 'pending' }).sort({ timestamp: -1 });
    const pendingProxyAvatars = await ProxyAvatarUpload.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({
      scriptHistories: pendingProjects,
      proxyAvatarUploads: pendingProxyAvatars
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

module.exports = router; 