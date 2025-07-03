const express = require('express');
const router = express.Router();
const ScriptHistory = require('../models/ScriptHistory');
const ProxyAvatarUpload = require('../models/ProxyAvatarUpload');

// GET /api/uploaded-projects
router.get('/', async (req, res) => {
  try {
    const uploadedProjects = await ScriptHistory.find({ status: 'uploaded' }).sort({ timestamp: -1 });
    const uploadedProxyAvatars = await ProxyAvatarUpload.find({ status: 'uploaded' }).sort({ createdAt: -1 });
    res.json({
      scriptHistories: uploadedProjects,
      proxyAvatarUploads: uploadedProxyAvatars
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

module.exports = router; 