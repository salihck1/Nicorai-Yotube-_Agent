const express = require('express');
const router = express.Router();
const ScriptHistory = require('../models/ScriptHistory');

// GET /api/pending-projects
router.get('/', async (req, res) => {
  try {
    const pendingProjects = await ScriptHistory.find({ status: 'pending' }).sort({ timestamp: -1 });
    res.json(pendingProjects);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

module.exports = router; 