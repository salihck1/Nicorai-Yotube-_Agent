const express = require('express');
const router = express.Router();
const multer = require('multer');
const ScriptHistory = require('../models/ScriptHistory');
const ProxyAvatarUpload = require('../models/ProxyAvatarUpload');
const { google } = require('googleapis');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Multer setup for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Google Drive API setup (assumes credentials are set up elsewhere)
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });

router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { projectId } = req.body;
    const file = req.file;
    if (!projectId || !file) {
      return res.status(400).json({ error: 'Missing projectId or video file' });
    }
    // Try ScriptHistory first
    let project = await ScriptHistory.findById(projectId);
    let isProxyAvatar = false;
    let driveLink = null;
    if (!project) {
      // Try ProxyAvatarUpload
      project = await ProxyAvatarUpload.findById(projectId);
      isProxyAvatar = true;
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      driveLink = project.drive && project.drive.url;
    } else {
      driveLink = project.driveLink;
    }
    // Extract Google Drive folder ID
    const match = driveLink && driveLink.match(/folders\/([a-zA-Z0-9_-]+)/);
    const folderId = match ? match[1] : null;
    if (!folderId) {
      return res.status(400).json({ error: 'Invalid or missing Google Drive folder link' });
    }
    // Upload video to Google Drive
    const driveResponse = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [folderId],
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: require('stream').Readable.from(file.buffer),
      },
      fields: 'id, webViewLink, webContentLink',
    });
    const videoFileId = driveResponse.data.id;
    const videoLink = `https://drive.google.com/file/d/${videoFileId}/view`;
    // Share file with anyone with the link
    await drive.permissions.create({
      fileId: videoFileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });
    // Notify n8n
    const n8nPayload = {
      projectId,
      videoLink,
      driveLink: driveLink,
    };
    const n8nRes = await fetch('https://n8n.srv810314.hstgr.cloud/webhook/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload),
    });
    if (!n8nRes.ok) {
      return res.status(502).json({ error: 'n8n webhook failed', details: await n8nRes.text() });
    }
    const n8nData = await n8nRes.json();
    const youtubeLink = n8nData.youtubelink;
    const title = n8nData.title;
    if (!youtubeLink) {
      return res.status(502).json({ error: 'No YouTube link returned from n8n', details: n8nData });
    }
    // Update project in MongoDB
    if (isProxyAvatar) {
      project.status = 'uploaded';
      project.youtubelink = youtubeLink;
      project.title = title;
      project.video = { url: videoLink };
      await project.save();
    } else {
      project.status = 'uploaded';
      project.youtubeLink = youtubeLink;
      project.title = title;
      await project.save();
    }
    return res.json({ success: true, youtubeLink, title });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router; 