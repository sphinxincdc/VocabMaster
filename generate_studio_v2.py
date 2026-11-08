import os
import json
import base64

with open('assets/toolkit/jszip.min.js', 'r', encoding='utf-8') as f:
    jszip_code = f.read()

with open('assets/toolkit/FileSaver.min.js', 'r', encoding='utf-8') as f:
    filesaver_code = f.read()

with open('locales_config_v2.json', 'r', encoding='utf-8') as f:
    locales_json = f.read()

def b64(path, mime):
    with open(path, 'rb') as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode('ascii')

assets_map = {
    'icon': b64('assets/toolkit/icon128.png', 'image/png'),
    'elon': b64('assets/toolkit/feed_elon_starship.jpg', 'image/jpeg'),
    'elonAvatar': b64('assets/toolkit/feed_elon_avatar.jpg', 'image/jpeg'),
    'cr7Avatar': b64('assets/toolkit/feed_cr7_avatar.jpg', 'image/jpeg'),
    'hug': b64('assets/toolkit/feed_cr7_messi_hug_opt.jpg', 'image/jpeg'),
    'ad': b64('assets/toolkit/feed_ad_ugly_vpn.jpg', 'image/jpeg'),
    'nasa': b64('assets/toolkit/feed_nasa_cosmos.jpg', 'image/jpeg'),
    'nasaAvatar': b64('assets/toolkit/feed_nasa_avatar_opt.png', 'image/png'),
    'taylorAvatar': b64('assets/toolkit/feed_taylor_avatar.jpg', 'image/jpeg'),
}

html = f"""<!DOCTYPE html>
<html lang="zh-CN" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chrome 商店宣传图设计工作台 — HORD X-Toolkit</title>
  
  <script>
{jszip_code}
{filesaver_code}
  </script>

  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #0B0E14;
      color: #E2E8F0;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
    }}

    /* Top Navbar */
    .top-navbar {{
      height: 56px;
      background: #0B0E14;
      border-bottom: 1px solid #1E293B;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 50;
      flex-shrink: 0;
    }}
    .brand-section {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .brand-logo {{
      width: 28px;
      height: 28px;
    }}
    .brand-title {{
      font-size: 15px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.2px;
    }}
    .brand-badge {{
      font-size: 11px;
      color: #00BA7C;
      background: rgba(0, 186, 124, 0.12);
      border: 1px solid rgba(0, 186, 124, 0.3);
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
    }}

    /* Material Switcher Tabs */
    .material-pills {{
      display: flex;
      align-items: center;
      background: #111622;
      border: 1px solid #1E293B;
      border-radius: 8px;
      padding: 3px;
      gap: 2px;
    }}
    .mat-pill {{
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 500;
      color: #94A3B8;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }}
    .mat-pill:hover {{
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.05);
    }}
    .mat-pill.active {{
      background: #1E293B;
      color: #FFFFFF;
      font-weight: 600;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }}

    /* Top Actions */
    .top-actions {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .lang-select {{
      background: #111622;
      color: #E2E8F0;
      border: 1px solid #1E293B;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      outline: none;
    }}
    .lang-select:focus {{
      border-color: #00BA7C;
    }}
    .btn-secondary {{
      background: #161F2E;
      color: #CBD5E1;
      border: 1px solid #2D3B4E;
      border-radius: 6px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }}
    .btn-secondary:hover {{
      background: #1E293B;
      color: #FFFFFF;
      border-color: #38BDF8;
    }}
    .btn-primary {{
      background: #00BA7C;
      color: #070A0F;
      border: none;
      border-radius: 6px;
      padding: 6px 16px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }}
    .btn-primary:hover {{
      background: #00D68F;
      box-shadow: 0 2px 8px rgba(0, 186, 124, 0.4);
    }}

    /* Main Workspace */
    .workspace {{
      display: flex;
      flex: 1;
      overflow: hidden;
    }}

    /* Left Sidebar */
    .sidebar {{
      width: 320px;
      background: #0D1117;
      border-right: 1px solid #1E293B;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow-y: auto;
    }}
    .sidebar-header {{
      padding: 16px;
      border-bottom: 1px solid #1E293B;
      font-size: 13px;
      font-weight: 600;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}
    .sidebar-section {{
      padding: 16px;
      border-bottom: 1px solid #1E293B;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }}
    .section-title {{
      font-size: 12px;
      font-weight: 600;
      color: #CBD5E1;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}
    .form-group {{
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}
    .form-label {{
      font-size: 11px;
      font-weight: 500;
      color: #64748B;
    }}
    .form-input, .form-textarea {{
      background: #111622;
      border: 1px solid #1E293B;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 12px;
      color: #E2E8F0;
      outline: none;
      transition: border 0.15s;
    }}
    .form-input:focus, .form-textarea:focus {{
      border-color: #00BA7C;
    }}
    .form-textarea {{
      resize: vertical;
      min-height: 60px;
      font-family: inherit;
    }}
    .pills-group {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }}

    /* Center Canvas Stage */
    .canvas-stage {{
      flex: 1;
      background: #11141C;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: auto;
      padding: 30px;
    }}
    .canvas-card {{
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #080C14;
    }}
    #mainCanvas {{
      display: block;
      max-width: 100%;
      max-height: calc(100vh - 180px);
      object-fit: contain;
    }}

    /* Bottom Thumbnail Bar */
    .bottom-strip {{
      height: 68px;
      background: #0B0E14;
      border-top: 1px solid #1E293B;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 0 20px;
      flex-shrink: 0;
    }}
    .thumb-item {{
      width: 100px;
      height: 48px;
      border-radius: 6px;
      background: #111622;
      border: 1px solid #1E293B;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      opacity: 0.5;
      transition: all 0.15s ease;
    }}
    .thumb-item:hover {{
      opacity: 0.8;
      border-color: #475569;
    }}
    .thumb-item.active {{
      opacity: 1;
      border-color: #00BA7C;
      background: #16202E;
      box-shadow: 0 0 10px rgba(0, 186, 124, 0.2);
    }}
    .thumb-label {{
      font-size: 11px;
      font-weight: 600;
      color: #E2E8F0;
    }}
    .thumb-spec {{
      font-size: 9px;
      color: #64748B;
    }}
  </style>
</head>
<body>

  <!-- Top Navbar -->
  <header class="top-navbar">
    <div class="brand-section">
      <img src="{assets_map['icon']}" class="brand-logo" alt="HORD" />
      <span class="brand-title">HORD Store Studio</span>
      <span class="brand-badge">V2.0 纯净价值定位</span>
    </div>

    <!-- Segmented Material Switcher -->
    <div class="material-pills" id="materialPills">
      <div class="mat-pill active" data-asset="s1">1. 综合总览</div>
      <div class="mat-pill" data-asset="s2">2. 媒体下载</div>
      <div class="mat-pill" data-asset="s3">3. 净化前后对比</div>
      <div class="mat-pill" data-asset="s4">4. 宽度与居中</div>
      <div class="mat-pill" data-asset="s5">5. 关键词过滤</div>
      <div class="mat-pill" data-asset="marquee">横幅 (1400×560)</div>
      <div class="mat-pill" data-asset="small">小图 (440×280)</div>
      <div class="mat-pill" data-asset="icon">图标 (128×128)</div>
    </div>

    <!-- Right Actions -->
    <div class="top-actions">
      <select class="lang-select" id="langSelect">
        <option value="zh-CN">🇨🇳 简体中文</option>
        <option value="zh-TW">🇭🇰 繁體中文</option>
        <option value="en-US">🇺🇸 English</option>
        <option value="ja">🇯🇵 日本語</option>
        <option value="ko">🇰🇷 한국어</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
      </select>
      <button class="btn-secondary" id="exportSingleBtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        导出当前 PNG
      </button>
      <button class="btn-primary" id="exportAllZipBtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        一键导出全部 ZIP (8张)
      </button>
    </div>
  </header>

  <!-- Workspace -->
  <main class="workspace">
    <!-- Left Configuration Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">物料与文案配置</div>
      
      <div class="sidebar-section">
        <div class="section-title">核心文案 (Copy)</div>
        <div class="form-group">
          <label class="form-label">顶部精简标签 (Tag)</label>
          <input type="text" class="form-input" id="inputTag" />
        </div>
        <div class="form-group">
          <label class="form-label">主标题 (Headline)</label>
          <input type="text" class="form-input" id="inputTitle" />
        </div>
        <div class="form-group">
          <label class="form-label">补充说明 (Subtitle)</label>
          <textarea class="form-textarea" id="inputSub"></textarea>
        </div>
        <div class="pills-group">
          <div class="form-group">
            <label class="form-label">标签 1</label>
            <input type="text" class="form-input" id="inputPill1" />
          </div>
          <div class="form-group">
            <label class="form-label">标签 2</label>
            <input type="text" class="form-input" id="inputPill2" />
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="section-title">预设与重置</div>
        <button class="btn-secondary" id="resetBtn" style="justify-content: center;">恢复当前语系默认文案</button>
      </div>
    </aside>

    <!-- Center Stage Area -->
    <section class="canvas-stage">
      <div class="canvas-card">
        <canvas id="mainCanvas"></canvas>
      </div>
    </section>
  </main>

  <!-- Bottom Thumbnail Bar -->
  <footer class="bottom-strip" id="bottomThumbnails">
    <div class="thumb-item active" data-asset="s1">
      <span class="thumb-label">1. 综合总览</span>
      <span class="thumb-spec">1280×800</span>
    </div>
    <div class="thumb-item" data-asset="s2">
      <span class="thumb-label">2. 媒体下载</span>
      <span class="thumb-spec">1280×800</span>
    </div>
    <div class="thumb-item" data-asset="s3">
      <span class="thumb-label">3. 净化前后对比</span>
      <span class="thumb-spec">1280×800</span>
    </div>
    <div class="thumb-item" data-asset="s4">
      <span class="thumb-label">4. 宽度与居中</span>
      <span class="thumb-spec">1280×800</span>
    </div>
    <div class="thumb-item" data-asset="s5">
      <span class="thumb-label">5. 关键词过滤</span>
      <span class="thumb-spec">1280×800</span>
    </div>
    <div class="thumb-item" data-asset="marquee">
      <span class="thumb-label">大横幅</span>
      <span class="thumb-spec">1400×560</span>
    </div>
    <div class="thumb-item" data-asset="small">
      <span class="thumb-label">小图</span>
      <span class="thumb-spec">440×280</span>
    </div>
    <div class="thumb-item" data-asset="icon">
      <span class="thumb-label">图标</span>
      <span class="thumb-spec">128×128</span>
    </div>
  </footer>

  <script>
    const ASSET_DATA_URLS = {json.dumps(assets_map)};
    const LOCALES_DATA = {locales_json};

    const ASSET_DIMS = {{
      s1: [1280, 800, "01_screenshot_1_overview_1280x800.png"],
      s2: [1280, 800, "02_screenshot_2_media_saver_1280x800.png"],
      s3: [1280, 800, "03_screenshot_3_clean_timeline_1280x800.png"],
      s4: [1280, 800, "04_screenshot_4_custom_layout_1280x800.png"],
      s5: [1280, 800, "05_screenshot_5_keyword_filter_1280x800.png"],
      marquee: [1400, 560, "06_marquee_promo_1400x560.png"],
      small: [440, 280, "07_small_promo_440x280.png"],
      icon: [128, 128, "08_store_icon_128x128.png"]
    }};

    let currentAsset = 's1';
    let currentLocale = 'zh-CN';
    let localDataCopy = JSON.parse(JSON.stringify(LOCALES_DATA));

    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext('2d');

    // Preload Images
    const IMG_CACHE = {{}};
    let loadedCount = 0;
    const totalImgs = Object.keys(ASSET_DATA_URLS).length;

    for (const [k, url] of Object.entries(ASSET_DATA_URLS)) {{
      const img = new Image();
      img.onload = () => {{
        loadedCount++;
        if (loadedCount === totalImgs) {{
          updateFormFields();
          renderActive();
        }}
      }};
      img.src = url;
      IMG_CACHE[k] = img;
    }}

    // UI Elements
    const pillsContainer = document.getElementById('materialPills');
    const thumbContainer = document.getElementById('bottomThumbnails');
    const langSelect = document.getElementById('langSelect');
    const inputTag = document.getElementById('inputTag');
    const inputTitle = document.getElementById('inputTitle');
    const inputSub = document.getElementById('inputSub');
    const inputPill1 = document.getElementById('inputPill1');
    const inputPill2 = document.getElementById('inputPill2');
    const resetBtn = document.getElementById('resetBtn');
    const exportSingleBtn = document.getElementById('exportSingleBtn');
    const exportAllZipBtn = document.getElementById('exportAllZipBtn');

    // Drawing Helpers
    function roundRect(ctx, x, y, w, h, r, fill = true, stroke = false) {{
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }}

    function drawVerifiedBadge(ctx, cx, cy, r = 7) {{
      ctx.save();
      ctx.fillStyle = '#1D9BF0';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(1, r * 0.28);
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.45, cy);
      ctx.lineTo(cx - r * 0.1, cy + r * 0.4);
      ctx.lineTo(cx + r * 0.5, cy - r * 0.35);
      ctx.stroke();
      ctx.restore();
    }}

    function drawXLogo(ctx, cx, cy, size = 16, color = '#FFFFFF') {{
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      const s = size / 2;
      ctx.beginPath();
      ctx.moveTo(cx - s, cy - s);
      ctx.lineTo(cx + s, cy + s);
      ctx.moveTo(cx + s, cy - s);
      ctx.lineTo(cx - s, cy + s);
      ctx.stroke();
      ctx.restore();
    }}

    function drawHeaderBanner(ctx, tag, title, subtitle, pills = []) {{
      // Tag
      if (tag) {{
        ctx.font = 'bold 11px -apple-system, sans-serif';
        const tw = ctx.measureText(tag).width;
        const tagX = (1280 - (tw + 24)) / 2;
        ctx.fillStyle = '#0B1F2D';
        ctx.strokeStyle = '#00BA7C';
        ctx.lineWidth = 1;
        roundRect(ctx, tagX, 24, tw + 24, 22, 11, true, true);
        ctx.fillStyle = '#00BA7C';
        ctx.fillText(tag, tagX + 12, 39);
      }}

      // Title
      ctx.font = 'bold 36px -apple-system, sans-serif';
      const titW = ctx.measureText(title).width;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(title, (1280 - titW) / 2, 86);

      // Subtitle
      ctx.font = '15px -apple-system, sans-serif';
      const subW = ctx.measureText(subtitle).width;
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(subtitle, (1280 - subW) / 2, 114);

      // Pills
      if (pills && pills.length) {{
        ctx.font = '12px -apple-system, sans-serif';
        let totalW = 0;
        const pwList = pills.map(p => {{
          const pw = ctx.measureText(p).width + 20;
          totalW += pw + 10;
          return pw;
        }});
        totalW -= 10;
        let curX = (1280 - totalW) / 2;
        pills.forEach((p, i) => {{
          const pw = pwList[i];
          ctx.fillStyle = '#111827';
          ctx.strokeStyle = '#1F2937';
          ctx.lineWidth = 1;
          roundRect(ctx, curX, 128, pw, 22, 11, true, true);
          ctx.fillStyle = '#38BDF8';
          ctx.fillText(p, curX + 10, 143);
          curX += pw + 10;
        }});
      }}
    }}

    function drawWindowShell(ctx, bx, by, bw, bh, url = 'x.com/home') {{
      ctx.fillStyle = '#070A0F';
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      roundRect(ctx, bx, by, bw, bh, 14, true, true);

      // Title bar
      ctx.fillStyle = '#0D1117';
      roundRect(ctx, bx, by, bw, 38, 14, true, true);
      ctx.fillRect(bx, by + 24, bw, 14);
      ctx.strokeStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(bx, by + 38);
      ctx.lineTo(bx + bw, by + 38);
      ctx.stroke();

      // 3 dots
      ctx.fillStyle = '#EF4444'; ctx.beginPath(); ctx.arc(bx + 19, by + 19, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#F59E0B'; ctx.beginPath(); ctx.arc(bx + 35, by + 19, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#10B981'; ctx.beginPath(); ctx.arc(bx + 51, by + 19, 5, 0, Math.PI * 2); ctx.fill();

      // URL
      ctx.fillStyle = '#070A0F';
      ctx.strokeStyle = '#1F2937';
      roundRect(ctx, bx + 76, by + 8, bw - 136, 22, 11, true, true);
      ctx.fillStyle = '#64748B';
      ctx.font = '11px sans-serif';
      ctx.fillText('https://' + url, bx + 92, by + 23);

      // Mini Icon
      if (IMG_CACHE.icon && IMG_CACHE.icon.complete) {{
        ctx.drawImage(IMG_CACHE.icon, bx + bw - 38, by + 10, 18, 18);
      }}
    }}

    // SCREENSHOT 1
    function renderS1(ctx, data) {{
      drawHeaderBanner(ctx, data.tag, data.title, data.sub, data.pills);

      const bx = 70, by = 162, bw = 1140, bh = 608;
      drawWindowShell(ctx, bx, by, bw, bh, 'x.com/home');

      // Left Rail
      ctx.strokeStyle = '#161F2E';
      ctx.beginPath();
      ctx.moveTo(bx + 180, by + 38);
      ctx.lineTo(bx + 180, by + bh);
      ctx.stroke();

      drawXLogo(ctx, bx + 36, by + 60, 20);

      const navs = ["Home", "Explore", "Notifications", "Bookmarks", "Threads"];
      let ny = by + 95;
      navs.forEach((item, i) => {{
        if (i === 0) {{
          ctx.fillStyle = '#161E2E';
          ctx.strokeStyle = '#00BA7C';
          roundRect(ctx, bx + 16, ny - 4, 148, 30, 8, true, true);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 13px sans-serif';
          ctx.fillText(item, bx + 30, ny + 16);
        }} else {{
          ctx.fillStyle = '#71767B';
          ctx.font = '13px sans-serif';
          ctx.fillText(item, bx + 30, ny + 16);
        }}
        ny += 38;
      }});

      // Status card
      ctx.fillStyle = '#0D1420';
      ctx.strokeStyle = '#1F2937';
      roundRect(ctx, bx + 16, by + bh - 110, 148, 94, 10, true, true);
      ctx.fillStyle = '#10B981';
      ctx.beginPath(); ctx.arc(bx + 31, by + bh - 91, 3.5, 0, Math.PI*2); ctx.fill();
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('HORD Active', bx + 40, by + bh - 87);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px sans-serif';
      ctx.fillText('100% Ad-Free', bx + 28, by + bh - 68);
      ctx.fillText('Widescreen Ready', bx + 28, by + bh - 48);
      ctx.fillText('Media Saver Ready', bx + 28, by + bh - 28);

      // Center Feed
      const fx = bx + 180, fw = 620;
      ctx.strokeStyle = '#161F2E';
      ctx.beginPath(); ctx.moveTo(fx + fw, by + 38); ctx.lineTo(fx + fw, by + bh); ctx.stroke();

      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('For You', fx + 40, by + 62);
      ctx.fillStyle = '#00BA7C'; ctx.fillRect(fx + 40, by + 74, 50, 2);
      ctx.fillStyle = '#71767B'; ctx.font = '13px sans-serif';
      ctx.fillText('Following', fx + 140, by + 62);
      ctx.strokeStyle = '#161F2E'; ctx.beginPath(); ctx.moveTo(fx, by + 76); ctx.lineTo(fx + fw, by + 76); ctx.stroke();

      // Tweet 1: Taylor
      const ty1 = by + 88;
      if (IMG_CACHE.taylorAvatar) {{
        ctx.save();
        ctx.beginPath(); ctx.arc(fx + 39, ty1 + 19, 19, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(IMG_CACHE.taylorAvatar, fx + 20, ty1, 38, 38);
        ctx.restore();
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Taylor Swift', fx + 68, ty1 + 14);
      const tw = ctx.measureText('Taylor Swift').width;
      drawVerifiedBadge(ctx, fx + 68 + tw + 10, ty1 + 10, 7);
      ctx.fillStyle = '#71767B'; ctx.font = '12px sans-serif';
      ctx.fillText('@taylorswift13 · 2h', fx + 68 + tw + 22, ty1 + 14);
      ctx.fillStyle = '#E7E9EA';
      ctx.fillText('The Eras Tour film is streaming in 4K lossless! Thank you all for singing with me!', fx + 68, ty1 + 36);
      ctx.fillStyle = '#71767B'; ctx.font = '11px sans-serif';
      ctx.fillText('12.4K · 48.2K · 310K · 24.5M', fx + 68, ty1 + 58);
      ctx.strokeStyle = '#161F2E'; ctx.beginPath(); ctx.moveTo(fx, ty1 + 68); ctx.lineTo(fx + fw, ty1 + 68); ctx.stroke();

      // Tweet 2: Elon
      const ty2 = ty1 + 78;
      if (IMG_CACHE.elonAvatar) {{
        ctx.save();
        ctx.beginPath(); ctx.arc(fx + 39, ty2 + 19, 19, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(IMG_CACHE.elonAvatar, fx + 20, ty2, 38, 38);
        ctx.restore();
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Elon Musk', fx + 68, ty2 + 14);
      const ew = ctx.measureText('Elon Musk').width;
      drawVerifiedBadge(ctx, fx + 68 + ew + 10, ty2 + 10, 7);
      ctx.fillStyle = '#71767B'; ctx.font = '12px sans-serif';
      ctx.fillText('@elonmusk · 4h', fx + 68 + ew + 22, ty2 + 14);
      ctx.fillStyle = '#E7E9EA';
      ctx.fillText('Starship Flight 5 booster catch was incredible! Life becoming multiplanetary.', fx + 68, ty2 + 36);

      if (IMG_CACHE.elon) {{
        ctx.save();
        roundRect(ctx, fx + 68, ty2 + 48, 520, 210, 8, false, false);
        ctx.clip();
        ctx.drawImage(IMG_CACHE.elon, fx + 68, ty2 + 48, 520, 210);
        ctx.restore();
      }}
      ctx.strokeStyle = '#2D3B4E';
      roundRect(ctx, fx + 68, ty2 + 48, 520, 210, 8, false, true);

      // Play button
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath(); ctx.arc(fx + 68 + 260, ty2 + 48 + 105, 24, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(fx + 68 + 254, ty2 + 48 + 95);
      ctx.lineTo(fx + 68 + 254, ty2 + 48 + 115);
      ctx.lineTo(fx + 68 + 272, ty2 + 48 + 105);
      ctx.fill();

      // Download Action
      const btnText = data.btn || 'Save 4K Video';
      ctx.font = 'bold 11px sans-serif';
      const bwBtn = ctx.measureText(btnText).width + 28;
      const downBtnX = fx + 68 + 520 - bwBtn;
      ctx.fillStyle = '#00BA7C';
      roundRect(ctx, downBtnX, ty2 + 48 + 210 + 6, bwBtn, 22, 11, true, false);
      ctx.fillStyle = '#070A0F';
      ctx.fillText(btnText, downBtnX + 14, ty2 + 48 + 210 + 21);

      // Metrics
      ctx.fillStyle = '#71767B'; ctx.font = '11px sans-serif';
      ctx.fillText(data.metrics || '18.4K · 52.8K · 410K · 32.5M', fx + 68, ty2 + 48 + 210 + 22);

      // Right Sidebar
      const sx = fx + fw + 16;
      ctx.fillStyle = '#0D1420'; ctx.strokeStyle = '#1E293B';
      roundRect(ctx, sx, by + 50, bw - (fw + 180 + 32), 32, 16, true, true);
      ctx.fillStyle = '#71767B'; ctx.font = '12px sans-serif';
      ctx.fillText('Search X & Threads', sx + 16, by + 70);

      roundRect(ctx, sx, by + 96, bw - (fw + 180 + 32), 184, 12, true, true);
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Trends for you', sx + 16, by + 120);

      const trends = [
        ["#StarshipFlight5", "Aerospace · 245K"],
        ["#ErasTourFilm", "Music · 180K"],
        ["#Rust2026", "Tech · 54K"],
        ["#HORDExtension", "Productivity · Pick"]
      ];
      let cty = by + 146;
      trends.forEach(([t, s]) => {{
        ctx.fillStyle = '#E7E9EA'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(t, sx + 16, cty);
        ctx.fillStyle = '#71767B'; ctx.font = '10px sans-serif';
        ctx.fillText(s, sx + 16, cty + 15);
        cty += 34;
      }});
    }}

    // SCREENSHOT 2
    function renderS2(ctx, data) {{
      drawHeaderBanner(ctx, data.tag, data.title, data.sub, data.pills);

      const bx = 110, by = 162, bw = 1060, bh = 608;
      drawWindowShell(ctx, bx, by, bw, bh, 'x.com/elonmusk/status/...');

      const px = bx + 50, pw = bw - 100, py = by + 58;
      if (IMG_CACHE.elonAvatar) {{
        ctx.save();
        ctx.beginPath(); ctx.arc(px + 22, py + 22, 22, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(IMG_CACHE.elonAvatar, px, py, 44, 44);
        ctx.restore();
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Elon Musk', px + 56, py + 16);
      const ew = ctx.measureText('Elon Musk').width;
      drawVerifiedBadge(ctx, px + 56 + ew + 12, py + 12, 8);
      ctx.fillStyle = '#71767B'; ctx.font = '13px sans-serif';
      ctx.fillText('@elonmusk · 3h', px + 56 + ew + 26, py + 16);

      ctx.fillStyle = '#E7E9EA'; ctx.font = '15px sans-serif';
      ctx.fillText('Starship Flight 5 booster catch was incredible! Life becoming multiplanetary.', px, py + 56);

      const vy = py + 84, vw = pw, vh = 320;
      if (IMG_CACHE.elon) {{
        ctx.save();
        roundRect(ctx, px, vy, vw, vh, 10, false, false);
        ctx.clip();
        ctx.drawImage(IMG_CACHE.elon, px, vy, vw, vh);
        ctx.restore();
      }}
      ctx.strokeStyle = '#2D3B4E';
      roundRect(ctx, px, vy, vw, vh, 10, false, true);

      // Center play
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath(); ctx.arc(px + vw/2, vy + vh/2, 32, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(px + vw/2 - 10, vy + vh/2 - 16);
      ctx.lineTo(px + vw/2 - 10, vy + vh/2 + 16);
      ctx.lineTo(px + vw/2 + 16, vy + vh/2);
      ctx.fill();

      // Action bar
      const ay = vy + vh + 16;
      ctx.fillStyle = '#71767B'; ctx.font = '13px sans-serif';
      ctx.fillText(data.metrics || '18.4K · 52.8K · 410K · 32.5M', px, ay + 22);

      // Download Button
      const btnText = data.btn || 'Save Video (4K)';
      ctx.font = 'bold 13px sans-serif';
      const btnW = ctx.measureText(btnText).width + 32;
      const btnX = px + pw - btnW;
      ctx.fillStyle = '#00BA7C';
      roundRect(ctx, btnX, ay, btnW, 36, 18, true, false);
      ctx.fillStyle = '#070A0F';
      ctx.fillText(btnText, btnX + 16, ay + 23);

      // Popover Bubble
      const bubW = 280, bubH = 130;
      const bubX = btnX - (bubW - btnW);
      const bubY = ay - bubH - 14;

      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#00BA7C';
      ctx.lineWidth = 1;
      roundRect(ctx, bubX, bubY, bubW, bubH, 12, true, true);

      // Arrow
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.moveTo(btnX + btnW/2 - 8, bubY + bubH);
      ctx.lineTo(btnX + btnW/2 + 8, bubY + bubH);
      ctx.lineTo(btnX + btnW/2, bubY + bubH + 10);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText('HORD Media Saver', bubX + 16, bubY + 24);
      ctx.fillStyle = '#00BA7C'; ctx.font = '11px sans-serif';
      ctx.fillText('3 Streams', bubX + bubW - 75, bubY + 24);

      ctx.strokeStyle = '#1E293B';
      ctx.beginPath(); ctx.moveTo(bubX + 12, bubY + 36); ctx.lineTo(bubX + bubW - 12, bubY + 36); ctx.stroke();

      // Option 1
      ctx.fillStyle = '#16253B'; ctx.strokeStyle = '#00BA7C';
      roundRect(ctx, bubX + 12, bubY + 44, bubW - 24, 26, 6, true, true);
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText('4K 2160p · 60fps · 148 MB', bubX + 20, bubY + 61);
      ctx.fillStyle = '#00BA7C';
      roundRect(ctx, bubX + bubW - 62, bubY + 48, 44, 18, 4, true, false);
      ctx.fillStyle = '#070A0F'; ctx.font = 'bold 10px sans-serif';
      ctx.fillText('Save', bubX + bubW - 52, bubY + 61);

      // Option 2
      ctx.fillStyle = '#CBD5E1'; ctx.font = '11px sans-serif';
      ctx.fillText('1080p FHD · 60fps · 46 MB', bubX + 20, bubY + 88);

      // Option 3
      ctx.fillText('Audio · 320 kbps (MP3)', bubX + 20, bubY + 114);
    }}

    // SCREENSHOT 3
    function renderS3(ctx, data) {{
      drawHeaderBanner(ctx, data.tag, data.title, data.sub, data.pills);

      const bx = 80, by = 162, bw = 1120, bh = 608;
      drawWindowShell(ctx, bx, by, bw, bh, 'x.com/home');

      const splitX = bx + bw / 2;

      // Left
      ctx.fillStyle = '#1A1115'; ctx.strokeStyle = '#7F1D1D'; ctx.lineWidth = 1;
      roundRect(ctx, bx + 20, by + 48, splitX - bx - 40, 28, 6, true, true);
      ctx.fillStyle = '#F87171'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText(data.beforeTag || 'Stock X: Cluttered with Ads', bx + 32, by + 66);

      // Taylor Tweet
      const ly1 = by + 86;
      if (IMG_CACHE.taylorAvatar) {{
        ctx.save();
        ctx.beginPath(); ctx.arc(bx + 41, ly1 + 17, 17, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(IMG_CACHE.taylorAvatar, bx + 24, ly1, 34, 34);
        ctx.restore();
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Taylor Swift', bx + 66, ly1 + 14);
      const tw = ctx.measureText('Taylor Swift').width;
      drawVerifiedBadge(ctx, bx + 66 + tw + 8, ly1 + 9, 6);
      ctx.fillStyle = '#71767B'; ctx.font = '11px sans-serif';
      ctx.fillText('@taylorswift13 · 2h', bx + 66 + tw + 18, ly1 + 14);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText('The Eras Tour film is streaming in 4K lossless! Love you all!', bx + 66, ly1 + 34);

      // Ugly Ad
      const adY = ly1 + 56;
      ctx.fillStyle = '#11151F'; ctx.strokeStyle = '#F59E0B'; ctx.lineWidth = 1;
      roundRect(ctx, bx + 20, adY, splitX - bx - 40, 240, 8, true, true);
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Hyperspeed VPN Pro', bx + 32, adY + 22);
      ctx.fillStyle = '#FCD34D';
      roundRect(ctx, splitX - 90, adY + 8, 60, 18, 4, true, false);
      ctx.fillStyle = '#78350F'; ctx.font = '10px sans-serif';
      ctx.fillText('Sponsored', splitX - 84, adY + 21);

      if (IMG_CACHE.ad) {{
        ctx.drawImage(IMG_CACHE.ad, bx + 32, adY + 54, splitX - bx - 64, 130);
      }}
      ctx.fillStyle = '#F59E0B';
      roundRect(ctx, bx + 32, adY + 194, 98, 30, 6, true, false);
      ctx.fillStyle = '#070A0F'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText('Install Now', bx + 48, adY + 214);

      // Center Divider
      ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(splitX, by + 38); ctx.lineTo(splitX, by + bh); ctx.stroke();
      ctx.fillStyle = '#070A0F'; ctx.strokeStyle = '#00BA7C';
      ctx.beginPath(); ctx.arc(splitX, by + bh/2, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00BA7C'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText('VS', splitX - 9, by + bh/2 + 4);

      // Right: After
      ctx.fillStyle = '#0B1F2D'; ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 1;
      roundRect(ctx, splitX + 20, by + 48, bw - (splitX - bx + 40), 28, 6, true, true);
      ctx.fillStyle = '#00BA7C'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText(data.afterTag || 'HORD Active: Clean Timeline', splitX + 32, by + 66);

      // Taylor again
      if (IMG_CACHE.taylorAvatar) {{
        ctx.save();
        ctx.beginPath(); ctx.arc(splitX + 41, ly1 + 17, 17, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(IMG_CACHE.taylorAvatar, splitX + 24, ly1, 34, 34);
        ctx.restore();
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Taylor Swift', splitX + 66, ly1 + 14);
      drawVerifiedBadge(ctx, splitX + 66 + tw + 8, ly1 + 9, 6);
      ctx.fillStyle = '#CBD5E1'; ctx.font = '11px sans-serif';
      ctx.fillText('The Eras Tour film is streaming in 4K lossless! Love you all!', splitX + 66, ly1 + 34);

      // Directly CR7
      const ry2 = ly1 + 56;
      if (IMG_CACHE.cr7Avatar) {{
        ctx.save();
        ctx.beginPath(); ctx.arc(splitX + 41, ry2 + 17, 17, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(IMG_CACHE.cr7Avatar, splitX + 24, ry2, 34, 34);
        ctx.restore();
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Cristiano Ronaldo', splitX + 66, ry2 + 14);
      const cw = ctx.measureText('Cristiano Ronaldo').width;
      drawVerifiedBadge(ctx, splitX + 66 + cw + 8, ry2 + 9, 6);

      if (IMG_CACHE.hug) {{
        ctx.save();
        roundRect(ctx, splitX + 66, ry2 + 46, bw - (splitX - bx + 86), 190, 8, false, false);
        ctx.clip();
        ctx.drawImage(IMG_CACHE.hug, splitX + 66, ry2 + 46, bw - (splitX - bx + 86), 190);
        ctx.restore();
      }}

      // Bottom Pill
      ctx.fillStyle = '#0B1F2D'; ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 1;
      roundRect(ctx, splitX + 20, by + bh - 52, bw - (splitX - bx + 40), 32, 8, true, true);
      ctx.fillStyle = '#00BA7C'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText(data.bottomPill || 'Zero gap residual · Pure feed', splitX + 40, by + bh - 32);
    }}

    // SCREENSHOT 4
    function renderS4(ctx, data) {{
      drawHeaderBanner(ctx, data.tag, data.title, data.sub, data.pills);

      const bx = 70, by = 162, bw = 1140, bh = 608;
      drawWindowShell(ctx, bx, by, bw, bh, 'x.com/NASA');

      const ctrlY = by + 50;
      ctx.fillStyle = '#0D1420'; ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 1;
      roundRect(ctx, bx + 40, ctrlY, bw - 80, 44, 10, true, true);

      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText(data.sliderLabel || 'Timeline Width:', bx + 60, ctrlY + 27);

      const slX1 = bx + 220, slX2 = bx + 780, slY = ctrlY + 22;
      ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(slX1, slY); ctx.lineTo(slX2, slY); ctx.stroke();
      const slThumb = slX1 + (slX2 - slX1) * 0.65;
      ctx.strokeStyle = '#00BA7C';
      ctx.beginPath(); ctx.moveTo(slX1, slY); ctx.lineTo(slThumb, slY); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(slThumb, slY, 8, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 2; ctx.stroke();

      const modeText = data.modePill || '1050px Centered Widescreen';
      ctx.font = 'bold 11px sans-serif';
      const mwPill = ctx.measureText(modeText).width + 24;
      ctx.fillStyle = '#0B1F2D'; ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 1;
      roundRect(ctx, bx + bw - mwPill - 56, ctrlY + 10, mwPill, 24, 12, true, true);
      ctx.fillStyle = '#00BA7C';
      ctx.fillText(modeText, bx + bw - mwPill - 44, ctrlY + 26);

      // Centered Feed
      const feedW = 860;
      const feedX = bx + (bw - feedW) / 2;
      const fy = ctrlY + 60;

      if (IMG_CACHE.nasaAvatar) {{
        ctx.save();
        ctx.beginPath(); ctx.arc(feedX + 32, fy + 22, 22, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(IMG_CACHE.nasaAvatar, feedX + 10, fy, 44, 44);
        ctx.restore();
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 16px sans-serif';
      ctx.fillText('NASA Cosmos', feedX + 64, fy + 16);
      const nw = ctx.measureText('NASA Cosmos').width;
      drawVerifiedBadge(ctx, feedX + 64 + nw + 12, fy + 12, 8);
      ctx.fillStyle = '#71767B'; ctx.font = '13px sans-serif';
      ctx.fillText('@NASA · 5h', feedX + 64 + nw + 26, fy + 16);

      ctx.fillStyle = '#E7E9EA'; ctx.font = '13px sans-serif';
      ctx.fillText('Earth from orbit at night. A breathtaking panoramic view of city lights and atmospheric glow.', feedX + 64, fy + 38);

      if (IMG_CACHE.nasa) {{
        ctx.save();
        roundRect(ctx, feedX + 10, fy + 54, feedW - 20, 280, 10, false, false);
        ctx.clip();
        ctx.drawImage(IMG_CACHE.nasa, feedX + 10, fy + 54, feedW - 20, 280);
        ctx.restore();
      }}
      ctx.strokeStyle = '#1E293B';
      roundRect(ctx, feedX + 10, fy + 54, feedW - 20, 280, 10, false, true);

      // Action row
      ctx.fillStyle = '#71767B'; ctx.font = '12px sans-serif';
      ctx.fillText(data.metrics || '14.2K · 48.6K · 210K · 18.4M', feedX + 10, fy + 54 + 280 + 20);
      ctx.fillStyle = '#00BA7C'; ctx.font = '11px sans-serif';
      ctx.fillText(data.bottomNote || 'Sidebars cleanly collapsed', feedX + feedW - 220, fy + 54 + 280 + 20);
    }}

    // SCREENSHOT 5
    function renderS5(ctx, data) {{
      drawHeaderBanner(ctx, data.tag, data.title, data.sub, data.pills);

      const bx = 110, by = 162, bw = 1060, bh = 608;
      drawWindowShell(ctx, bx, by, bw, bh, 'x.com/home');

      const ry = by + 52;
      ctx.fillStyle = '#0D1420'; ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 1;
      roundRect(ctx, bx + 40, ry, bw - 80, 104, 12, true, true);

      ctx.fillStyle = '#070A0F'; ctx.strokeStyle = '#2D3B4E';
      roundRect(ctx, bx + 56, ry + 14, bw - 112, 32, 8, true, true);
      ctx.fillStyle = '#64748B'; ctx.font = '12px sans-serif';
      ctx.fillText(data.placeholder || 'Type keywords to mute...', bx + 70, ry + 34);

      ctx.fillStyle = '#00BA7C';
      roundRect(ctx, bx + bw - 146, ry + 18, 82, 24, 6, true, false);
      ctx.fillStyle = '#070A0F'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText(data.addBtn || '+ Add Rule', bx + bw - 134, ry + 34);

      // Rules
      ctx.fillStyle = '#94A3B8'; ctx.font = '11px sans-serif';
      ctx.fillText(data.rulesLabel || 'Active Rules:', bx + 56, ry + 78);
      const rules = data.rules || ["✕ #spoilers", "✕ #airdrop", "✕ #giveaway", "✕ #drama"];
      let curRx = bx + 160;
      rules.forEach(r => {{
        ctx.font = '11px sans-serif';
        const rw = ctx.measureText(r).width + 18;
        ctx.fillStyle = '#161F2E'; ctx.strokeStyle = '#334155';
        roundRect(ctx, curRx, ry + 62, rw, 24, 6, true, true);
        ctx.fillStyle = '#E2E8F0';
        ctx.fillText(r, curRx + 9, ry + 78);
        curRx += rw + 10;
      }});

      // Collapsed notice
      const sy = ry + 120;
      ctx.fillStyle = '#0F141E'; ctx.strokeStyle = '#1E293B';
      roundRect(ctx, bx + 40, sy, bw - 80, 38, 8, true, true);
      ctx.fillStyle = '#64748B'; ctx.font = '12px sans-serif';
      ctx.fillText(data.mutedRow || 'Auto-collapsed 1 tweet matching rule', bx + 56, sy + 24);

      // Rust tweet
      const ty = sy + 54;
      ctx.fillStyle = '#070A0F'; ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(bx + 62, ty + 22, 22, 0, Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#00BA7C'; ctx.font = 'bold 15px sans-serif';
      ctx.fillText('RF', bx + 52, ty + 27);

      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Rust Foundation', bx + 96, ty + 16);
      const rfw = ctx.measureText('Rust Foundation').width;
      drawVerifiedBadge(ctx, bx + 96 + rfw + 10, ty + 12, 8);
      ctx.fillStyle = '#71767B'; ctx.font = '13px sans-serif';
      ctx.fillText('@rustlang · 1h', bx + 96 + rfw + 24, ty + 16);

      ctx.fillStyle = '#E7E9EA'; ctx.font = '14px sans-serif';
      ctx.fillText('Announcing Rust 2026 edition! Zero-cost abstractions, fearless concurrency, and ultra-fast', bx + 96, ty + 42);
      ctx.fillText('memory safety without garbage collection. The future of systems engineering is here.', bx + 96, ty + 64);

      ctx.fillStyle = '#090E17'; ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 1;
      roundRect(ctx, bx + 96, ty + 80, bw - 136, 110, 8, true, true);
      ctx.fillStyle = '#64748B'; ctx.font = '12px monospace';
      ctx.fillText('// Rust 2026 Concurrency Benchmark', bx + 114, ty + 102);
      ctx.fillStyle = '#00BA7C';
      ctx.fillText('let cluster = AsyncCluster::spawn_parallel(4096)?;', bx + 134, ty + 126);

      ctx.fillStyle = '#71767B'; ctx.font = '12px sans-serif';
      ctx.fillText(data.metrics || '1.8K · 6.2K · 45K · 2.8M', bx + 96, ty + 214);
      ctx.fillStyle = '#00BA7C'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText(data.bottomNote || 'High signal-to-noise ratio', bx + bw - 220, ty + 214);
    }}

    // MARQUEE BANNER
    function renderMarquee(ctx, data) {{
      const curY = 60;
      if (IMG_CACHE.icon) {{
        ctx.drawImage(IMG_CACHE.icon, 80, curY, 36, 36);
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 20px sans-serif';
      ctx.fillText('HORD', 126, curY + 25);
      ctx.fillStyle = '#00BA7C';
      ctx.fillText('X-Toolkit', 194, curY + 25);

      ctx.fillStyle = '#0B1F2D'; ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 1;
      roundRect(ctx, 80, curY + 50, 160, 26, 13, true, true);
      ctx.fillStyle = '#00BA7C'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText(data.tag || 'FOR X & THREADS', 96, curY + 67);

      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 42px sans-serif';
      ctx.fillText(data.title, 80, curY + 126);

      ctx.fillStyle = '#94A3B8'; ctx.font = '17px sans-serif';
      ctx.fillText(data.sub, 80, curY + 164);

      const pills = data.pills || ["Clean Feed", "4K Video Saver", "Widescreen", "Noise Muted"];
      let curPx = 80;
      pills.forEach(p => {{
        ctx.font = '12px sans-serif';
        const pw = ctx.measureText(p).width + 20;
        ctx.fillStyle = '#111827'; ctx.strokeStyle = '#1F2937';
        roundRect(ctx, curPx, curY + 196, pw, 32, 16, true, true);
        ctx.fillStyle = '#38BDF8';
        ctx.fillText(p, curPx + 10, curY + 216);
        curPx += pw + 10;
      }});

      // Right window
      const bx = 620, by = 60, bw = 720, bh = 440;
      drawWindowShell(ctx, bx, by, bw, bh, 'x.com/home');

      if (IMG_CACHE.elon) {{
        ctx.save();
        roundRect(ctx, bx + 20, by + 56, bw - 40, 240, 8, false, false);
        ctx.clip();
        ctx.drawImage(IMG_CACHE.elon, bx + 20, by + 56, bw - 40, 240);
        ctx.restore();
      }}
      ctx.strokeStyle = '#1E293B';
      roundRect(ctx, bx + 20, by + 56, bw - 40, 240, 8, false, true);

      ctx.fillStyle = 'rgba(11, 20, 34, 0.9)'; ctx.strokeStyle = '#00BA7C'; ctx.lineWidth = 1;
      roundRect(ctx, bx + bw - 230, by + 56 + 240 - 70, 200, 60, 8, true, true);
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 11px sans-serif';
      ctx.fillText('4K Stream Ready', bx + bw - 216, by + 56 + 240 - 45);
      ctx.fillStyle = '#00BA7C'; ctx.font = '10px sans-serif';
      ctx.fillText('One-Click Instant Save', bx + bw - 216, by + 56 + 240 - 25);

      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Elon Musk @elonmusk · Starship Flight 5', bx + 20, by + 56 + 240 + 30);
      ctx.fillStyle = '#71767B'; ctx.font = '11px sans-serif';
      ctx.fillText('18.4K · 52.8K · 410K · 32.5M', bx + 20, by + 56 + 240 + 52);

      const btnText = data.btn || 'Save 4K Video';
      ctx.font = 'bold 12px sans-serif';
      const bwBtn = ctx.measureText(btnText).width + 28;
      ctx.fillStyle = '#00BA7C';
      roundRect(ctx, bx + bw - bwBtn - 20, by + 56 + 240 + 26, bwBtn, 30, 15, true, false);
      ctx.fillStyle = '#070A0F';
      ctx.fillText(btnText, bx + bw - bwBtn - 6, by + 56 + 240 + 46);
    }}

    // SMALL TILE
    function renderSmall(ctx, data) {{
      ctx.fillStyle = '#0B0F19'; ctx.strokeStyle = '#1E293B'; ctx.lineWidth = 1.5;
      roundRect(ctx, 12, 12, 416, 256, 16, true, true);

      if (IMG_CACHE.icon) {{
        ctx.drawImage(IMG_CACHE.icon, 32, 32, 36, 36);
      }}
      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 18px sans-serif';
      ctx.fillText('HORD', 78, 56);
      ctx.fillStyle = '#00BA7C';
      ctx.fillText('X-Toolkit', 138, 56);

      ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 24px sans-serif';
      ctx.fillText(data.title, 32, 114);

      ctx.fillStyle = '#94A3B8'; ctx.font = '13px sans-serif';
      ctx.fillText(data.sub, 32, 146);

      const pills = data.pills || ["Clean Feed", "4K Download"];
      let curPx = 32;
      pills.forEach(p => {{
        ctx.font = '12px sans-serif';
        const pw = ctx.measureText(p).width + 24;
        ctx.fillStyle = '#111827'; ctx.strokeStyle = '#1F2937';
        roundRect(ctx, curPx, 172, pw, 34, 8, true, true);
        ctx.fillStyle = p.includes('4K') ? '#00BA7C' : '#38BDF8';
        ctx.fillText(p, curPx + 12, 194);
        curPx += pw + 10;
      }});

      ctx.fillStyle = '#64748B'; ctx.font = 'bold 10px sans-serif';
      ctx.fillText('CHROME WEB STORE OFFICIAL', 32, 244);
    }}

    // STORE ICON
    function renderIcon(ctx) {{
      if (IMG_CACHE.icon) {{
        ctx.drawImage(IMG_CACHE.icon, 0, 0, 128, 128);
      }}
    }}

    // Active Render Dispatcher
    function renderActive() {{
      const [w, h] = ASSET_DIMS[currentAsset];
      canvas.width = w;
      canvas.height = h;

      ctx.fillStyle = '#080C14';
      ctx.fillRect(0, 0, w, h);

      const data = localDataCopy[currentLocale][currentAsset] || {{}};

      if (currentAsset === 's1') renderS1(ctx, data);
      else if (currentAsset === 's2') renderS2(ctx, data);
      else if (currentAsset === 's3') renderS3(ctx, data);
      else if (currentAsset === 's4') renderS4(ctx, data);
      else if (currentAsset === 's5') renderS5(ctx, data);
      else if (currentAsset === 'marquee') renderMarquee(ctx, data);
      else if (currentAsset === 'small') renderSmall(ctx, data);
      else if (currentAsset === 'icon') renderIcon(ctx);
    }}

    function updateFormFields() {{
      const data = localDataCopy[currentLocale][currentAsset] || {{}};
      inputTag.value = data.tag || '';
      inputTitle.value = data.title || '';
      inputSub.value = data.sub || '';
      inputPill1.value = (data.pills && data.pills[0]) || '';
      inputPill2.value = (data.pills && data.pills[1]) || '';
    }}

    function bindFormEvents() {{
      const sync = () => {{
        const data = localDataCopy[currentLocale][currentAsset];
        if (!data) return;
        data.tag = inputTag.value;
        data.title = inputTitle.value;
        data.sub = inputSub.value;
        if (!data.pills) data.pills = [];
        data.pills[0] = inputPill1.value;
        data.pills[1] = inputPill2.value;
        renderActive();
      }};

      inputTag.oninput = sync;
      inputTitle.oninput = sync;
      inputSub.oninput = sync;
      inputPill1.oninput = sync;
      inputPill2.oninput = sync;

      resetBtn.onclick = () => {{
        localDataCopy[currentLocale][currentAsset] = JSON.parse(JSON.stringify(LOCALES_DATA[currentLocale][currentAsset]));
        updateFormFields();
        renderActive();
      }};

      langSelect.onchange = (e) => {{
        currentLocale = e.target.value;
        updateFormFields();
        renderActive();
      }};

      // Tab switching
      pillsContainer.addEventListener('click', (e) => {{
        const pill = e.target.closest('.mat-pill');
        if (!pill) return;
        const asset = pill.dataset.asset;
        setActiveAsset(asset);
      }});

      thumbContainer.addEventListener('click', (e) => {{
        const thumb = e.target.closest('.thumb-item');
        if (!thumb) return;
        const asset = thumb.dataset.asset;
        setActiveAsset(asset);
      }});

      exportSingleBtn.onclick = () => {{
        const filename = ASSET_DIMS[currentAsset][2];
        canvas.toBlob((blob) => {{
          saveAs(blob, filename);
        }});
      }};

      exportAllZipBtn.onclick = async () => {{
        exportAllZipBtn.innerText = '正在打包...';
        exportAllZipBtn.disabled = true;

        const zip = new JSZip();
        const folder = zip.folder(`hord_cws_${{currentLocale}}`);

        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');

        for (const [key, spec] of Object.entries(ASSET_DIMS)) {{
          const [w, h, filename] = spec;
          offCanvas.width = w;
          offCanvas.height = h;
          offCtx.fillStyle = '#080C14';
          offCtx.fillRect(0, 0, w, h);

          const data = localDataCopy[currentLocale][key] || {{}};
          if (key === 's1') renderS1(offCtx, data);
          else if (key === 's2') renderS2(offCtx, data);
          else if (key === 's3') renderS3(offCtx, data);
          else if (key === 's4') renderS4(offCtx, data);
          else if (key === 's5') renderS5(offCtx, data);
          else if (key === 'marquee') renderMarquee(offCtx, data);
          else if (key === 'small') renderSmall(offCtx, data);
          else if (key === 'icon') renderIcon(offCtx);

          const dataUrl = offCanvas.toDataURL('image/png');
          const base64Data = dataUrl.replace(/^data:image\\/png;base64,/, '');
          folder.file(filename, base64Data, {{ base64: true }});
        }}

        const content = await zip.generateAsync({{ type: 'blob' }});
        saveAs(content, `hord_cws_store_assets_${{currentLocale}}.zip`);

        exportAllZipBtn.innerText = '一键导出全部 ZIP (8张)';
        exportAllZipBtn.disabled = false;
      }};
    }}

    function setActiveAsset(asset) {{
      currentAsset = asset;
      document.querySelectorAll('.mat-pill').forEach(el => {{
        el.classList.toggle('active', el.dataset.asset === asset);
      }});
      document.querySelectorAll('.thumb-item').forEach(el => {{
        el.classList.toggle('active', el.dataset.asset === asset);
      }});
      updateFormFields();
      renderActive();
    }}

    bindFormEvents();
  </script>
</body>
</html>
"""

with open("chrome_store_assets_studio.html", "w", encoding="utf-8") as f:
    f.write(html)

print(f"Generated chrome_store_assets_studio.html successfully! Size: {len(html)} bytes")
