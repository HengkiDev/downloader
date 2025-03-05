// utils/tiktokDownloader.js
const { extractTikTokVideoByPuppeteer, extractTikTokVideoByAxios } = require('./extractors');

async function downloadTikTokVideo(url) {
  try {
    // Coba metode Puppeteer terlebih dahulu
    let videoInfo = await extractTikTokVideoByPuppeteer(url);
    
    // Jika gagal, gunakan metode Axios
    if (!videoInfo.videoUrl) {
      videoInfo = await extractTikTokVideoByAxios(url);
    }
    
    if (!videoInfo.videoUrl) {
      throw new Error('Tidak dapat menemukan URL video');
    }
    
    return videoInfo;
  } catch (error) {
    console.error('Kesalahan mengunduh video:', error);
    throw error;
  }
}

module.exports = { downloadTikTokVideo };