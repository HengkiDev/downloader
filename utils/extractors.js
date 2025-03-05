// utils/extractors.js
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function extractTikTokVideoByPuppeteer(url) {
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Simulasi browser mobile
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Tunggu video dimuat
    await page.waitForSelector('video');
    
    // Ekstrak URL video dan metadata
    const videoData = await page.evaluate(() => {
      const video = document.querySelector('video');
      const userName = document.querySelector('.user-name')?.textContent || 'Unknown';
      const videoDescription = document.querySelector('.video-description')?.textContent || '';
      
      return {
        videoUrl: video?.src || '',
        userName: userName,
        description: videoDescription
      };
    });
    
    await browser.close();
    return videoData;
  } catch (error) {
    console.error('Kesalahan ekstraksi video:', error);
    await browser.close();
    throw new Error('Gagal mengekstrak video TikTok');
  }
}

async function extractTikTokVideoByAxios(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Referer': 'https://www.tiktok.com/'
      }
    });
    
    const $ = cheerio.load(response.data);
    const videoUrl = $('video').attr('src');
    const userName = $('.user-name').text().trim();
    const description = $('.video-description').text().trim();
    
    return {
      videoUrl,
      userName,
      description
    };
  } catch (error) {
    console.error('Kesalahan ekstraksi video dengan Axios:', error);
    throw new Error('Gagal mengekstrak video TikTok');
  }
}

module.exports = {
  extractTikTokVideoByPuppeteer,
  extractTikTokVideoByAxios
};