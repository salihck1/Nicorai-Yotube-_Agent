const express = require('express');
const router = express.Router();
const ScriptHistory = require('../models/ScriptHistory');

// GET /api/uploaded-projects
router.get('/', async (req, res) => {
  try {
    const uploadedProjects = await ScriptHistory.find({ status: 'uploaded' }).sort({ timestamp: -1 });
    res.json(uploadedProjects);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

module.exports = router; 