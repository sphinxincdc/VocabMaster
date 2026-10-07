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

  const workspaceOutDir = path.resolve(__dirname, '../assets/chrome_store');
  const downloadsRootDir = '/Users/andyhu/Downloads/HORD_Chrome_Store_上架素材全套';
  const downloadsEnDir = path.join(downloadsRootDir, '官方英文命名直接上传版');

  [workspaceOutDir, downloadsRootDir, downloadsEnDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  const artboards = [
    { 
      id: 'artboard-icon', 
      filename: '01_store_icon_128x128.png', 
      userFriendlyName: '01_应用图标_Store_Icon_128x128.png',
      w: 128, h: 128 
    },
    { 
      id: 'artboard-small-promo', 
      filename: '02_small_promo_440x280.png', 
      userFriendlyName: '02_小型宣传卡_Small_Promo_440x280.png',
      w: 440, h: 280 
    },
    { 
      id: 'artboard-marquee', 
      filename: '03_marquee_promo_1400x560.png', 
      userFriendlyName: '03_主要宣传横幅_Marquee_Promo_1400x560.png',
      w: 1400, h: 560 
    },
    { 
      id: 'artboard-shot-1', 
      filename: '04_screenshot_1_context_ai_1280x800.png', 
      userFriendlyName: '04_功能截图1_极速划词与AI语境深度透析_1280x800.png',
      w: 1280, h: 800 
    },
    { 
      id: 'artboard-shot-2', 
      filename: '05_screenshot_2_video_companion_1280x800.png', 
      userFriendlyName: '05_功能截图2_YouTube与B站双语影音伴侣_1280x800.png',
      w: 1280, h: 800 
    },
    { 
      id: 'artboard-shot-3', 
      filename: '06_screenshot_3_reader_3d_1280x800.png', 
      userFriendlyName: '06_功能截图3_3D实景原著书架与AI长难句拆解_1280x800.png',
      w: 1280, h: 800 
    },
    { 
      id: 'artboard-shot-4', 
      filename: '07_screenshot_4_switch_arcade_1280x800.png', 
      userFriendlyName: '07_功能截图4_任天堂Switch拟真英语电玩城大厅_1280x800.png',
      w: 1280, h: 800 
    },
    { 
      id: 'artboard-shot-5', 
      filename: '08_screenshot_5_manager_bento_badges_1280x800.png', 
      userFriendlyName: '08_功能截图5_单词本Bento中枢与100款成长勋章_1280x800.png',
      w: 1280, h: 800 
    }
  ];

  for (const item of artboards) {
    const el = await page.$(`#${item.id}`);
    if (el) {
      // 1. Save to workspace assets/chrome_store/
      const destWorkspace = path.join(workspaceOutDir, item.filename);
      await el.screenshot({ path: destWorkspace, omitBackground: false });
      
      // 2. Save to Downloads root with clear descriptive name
      const destUser = path.join(downloadsRootDir, item.userFriendlyName);
      fs.copyFileSync(destWorkspace, destUser);

      // 3. Save to Downloads English direct-upload dir
      const destEn = path.join(downloadsEnDir, item.filename);
      fs.copyFileSync(destWorkspace, destEn);

      const stats = fs.statSync(destWorkspace);
      console.log(`Saved ${item.userFriendlyName} (${stats.size} bytes)`);
    }
  }

  await browser.close();
  console.log('All store assets exported and copied to Downloads successfully!');
})();
