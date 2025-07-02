const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  type: String,
  url: String,
  description: String
});

const scriptHistorySchema = new mongoose.Schema({
  responseId: String,
  topic: String,
  tone: String,
  genre: String,
  content: String,
  timestamp: Date,
  status: { type: String, enum: ['pending', 'approved', 'uploaded'], default: 'pending' },
  media: [mediaSchema],
  driveLink: String,
  youtubeLink: String,
  feedback: String,
  title: String
});

module.exports = mongoose.model('ScriptHistory', scriptHistorySchema); 