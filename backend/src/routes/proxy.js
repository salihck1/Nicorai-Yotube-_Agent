const express = require('express');
const router = express.Router();

// Dynamic import for node-fetch v3+ (ESM workaround)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

router.get('/:fileId', async (req, res) => {
  const { fileId } = req.params;
  let url = `${process.env.GOOGLE_DRIVE_DOWNLOAD_URL}&id=${fileId}`;
  try {
    let response = await fetch(url, { redirect: 'manual' });
    let body = await response.text();

    // If Google Drive returns a confirmation page, extract the confirm token
    const confirmMatch = body.match(/confirm=([0-9A-Za-z_]+)&amp;id=/);
    if (confirmMatch) {
      const confirmToken = confirmMatch[1];
      url = `${process.env.GOOGLE_DRIVE_DOWNLOAD_URL}&confirm=${confirmToken}&id=${fileId}`;
      response = await fetch(url);
    } else {
      // If not a confirmation page, re-fetch as a stream
      response = await fetch(url);
    }

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch file from Google Drive');
    }
    res.set('Access-Control-Allow-Origin', '*');
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.set('Content-Type', contentType);
    // Only set Content-Disposition for non-image/audio/video files
    if (
      !contentType.startsWith('image/') &&
      !contentType.startsWith('audio/') &&
      !contentType.startsWith('video/')
    ) {
      res.set('Content-Disposition', 'attachment');
    }
    // Do NOT set Content-Disposition for images, audio, or video!
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Proxy error: ' + err.message);
  }
});

module.exports = router;