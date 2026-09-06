const puppeteer = require('/Users/andyhu/Library/CloudStorage/OneDrive-个人/VibeCoding Work Space/HORD-English-Companion_3.0.0_DEVELOP/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching headless Chrome via Puppeteer (scale: 1.0 exact)...');
  const browser = await puppeteer.launch({ 
    headless: true, 
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'] 
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 2560, height: 1600, deviceScaleFactor: 1 });
  
  const htmlPath = path.resolve(__dirname, '../chrome-store-assets.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });
  
  await page.evaluateHandle('document.fonts.ready');

  // Explicitly call setZoom(1.0)
  await page.evaluate(() => {
    if (typeof setZoom === 'function') {
      setZoom(1.0);
    }
    document.querySelectorAll('.artboard-wrapper').forEach(wrap => {
      wrap.style.transform = 'none';
    });
  });
  await new Promise(r => setTimeout(r, 2000));

  const outDir = path.resolve(__dirname, '../assets/chrome_store');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const artboards = [
    { id: 'artboard-icon', filename: '01_store_icon_128x128.png', w: 128, h: 128 },
    { id: 'artboard-small-promo', filename: '02_small_promo_440x280.png', w: 440, h: 280 },
    { id: 'artboard-marquee', filename: '03_marquee_promo_1400x560.png', w: 1400, h: 560 },
    { id: 'artboard-shot-1', filename: '04_screenshot_1_context_ai_1280x800.png', w: 1280, h: 800 },
    { id: 'artboard-shot-2', filename: '05_screenshot_2_video_companion_1280x800.png', w: 1280, h: 800 },
    { id: 'artboard-shot-3', filename: '06_screenshot_3_reader_3d_1280x800.png', w: 1280, h: 800 },
    { id: 'artboard-shot-4', filename: '07_screenshot_4_arcade_badges_1280x800.png', w: 1280, h: 800 },
    { id: 'artboard-shot-5', filename: '08_screenshot_5_quotes_mobile_1280x800.png', w: 1280, h: 800 }
  ];

  for (const item of artboards) {
    const el = await page.$(`#${item.id}`);
    if (el) {
      const destPath = path.join(outDir, item.filename);
      await el.screenshot({ path: destPath, omitBackground: false });
      const stats = fs.statSync(destPath);
      console.log(`Saved ${item.filename} (${stats.size} bytes)`);
    }
  }

  await browser.close();
  console.log('Export finished.');
})();
