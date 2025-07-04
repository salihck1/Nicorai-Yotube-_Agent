const mongoose = require('mongoose');

const proxyAvatarUploadSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  script: { type: String },
  title: { type: String },
  embedding: { type: String },
  drive: {
    url: { type: String }
  },
  file: {
    url: { type: String }
  },
  youtubelink: { type: String },
  video: {
    url: { type: String }
  },
  avatarId: { type: String },
  voiceId: { type: String },
  status: { type: String, enum: ['pending', 'save', 'upload', 'uploaded'], default: 'pending' },
  jobId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('ProxyAvatarUpload', proxyAvatarUploadSchema); 