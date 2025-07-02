require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const proxyRoutes = require('./routes/proxy');
const approveAssetsRoutes = require('./routes/approveAssets');
const mediaRegenerateRoutes = require('./routes/mediaRegenerate');
const pendingProjectsRoutes = require('./routes/pendingProjects');
const uploadVideoRoutes = require('./routes/uploadVideo');
const proxyAvatarRoutes = require('./routes/proxyAvatar');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount upload routes
app.use('/upload', uploadRoutes);
app.use('/proxy', proxyRoutes);
app.use('/approve-assets', approveAssetsRoutes);
app.use('/media-regenerate', mediaRegenerateRoutes);
app.use('/api/pending-projects', pendingProjectsRoutes);
app.use('/api/upload-video', uploadVideoRoutes);
app.use('/api/proxy-avatar', proxyAvatarRoutes);

const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 