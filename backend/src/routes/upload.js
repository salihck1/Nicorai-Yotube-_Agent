const express = require('express');
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { Readable } = require('stream');

// Multer setup for file uploads (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Google Drive setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });

// Helper to get folder ID by type
function getFolderId(type) {
  switch (type) {
    case 'images':
      return process.env.DRIVE_FOLDER_IMAGES;
    case 'audio':
      return process.env.DRIVE_FOLDER_AUDIO;
    case 'video':
      return process.env.DRIVE_FOLDER_VIDEO;
    case 'thumbnail':
      return process.env.DRIVE_FOLDER_THUMBNAIL;
    default:
      throw new Error('Invalid upload type');
  }
}

// POST /upload/:type (type = images, audio, video, thumbnail)
router.post('/:type', upload.single('file'), async (req, res) => {
  const { type } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  let folderId;
  try {
    folderId = getFolderId(type);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  try {
    // Upload file to Google Drive
    const driveRes = await drive.files.create({
      requestBody: {
        name: file.originalname,
        parents: [folderId],
      },
      media: {
        mimeType: file.mimetype,
        body: Readable.from(file.buffer),
      },
      fields: 'id, name',
    });

    // Make the file readable by anyone with the link
    await drive.permissions.create({
      fileId: driveRes.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the web link
    const fileLink = `${process.env.GOOGLE_DRIVE_VIEW_URL}/${driveRes.data.id}/view`;
    res.json({
      success: true,
      fileId: driveRes.data.id,
      name: driveRes.data.name,
      link: fileLink,
    });
  } catch (err) {
    console.error('Drive upload error:', err);
    res.status(500).json({ error: 'Failed to upload to Google Drive', details: err.message });
  }
});

module.exports = router; 