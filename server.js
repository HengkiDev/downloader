// server.js
const express = require('express');
const { downloadTikTokVideo } = require('./utils/tiktokDownloader');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware untuk mengizinkan CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/download', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL TikTok diperlukan' });
    }

    const videoInfo = await downloadTikTokVideo(url);
    
    res.json({
      status: 'sukses',
      data: videoInfo
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});