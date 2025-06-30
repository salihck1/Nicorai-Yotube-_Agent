require('dotenv').config();
const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const proxyRoutes = require('./routes/proxy');
const approveAssetsRoutes = require('./routes/approveAssets');
const mediaRegenerateRoutes = require('./routes/mediaRegenerate');
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 