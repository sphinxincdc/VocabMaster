# -*- coding: utf-8 -*-
import os

html_content = '''<!DOCTYPE html>
<html lang="zh-CN" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HORD 词境伴侣 · Chrome 应用商店官方素材工坊</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#fff1f2',
                            100: '#ffe4e6',
                            500: '#f43f5e',
                            600: '#e11d48',
                            700: '#be123c',
                        },
                        dark: {
                            900: '#07090e',
                            800: '#0c1017',
                            700: '#131926',
                            600: '#1e293b'
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                        mono: ['JetBrains Mono', 'Menlo', 'monospace']
                    }
                }
            }
        }
    </script>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@500;600;700;800;900&family=Noto+Sans+SC:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- html2canvas, JSZip, FileSaver -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

    <style>
        body {
            font-family: 'Outfit', 'Inter', 'Noto Sans SC', sans-serif;
            background-color: #07090e;
            color: #f1f5f9;
        }

        /* Ambient grid pattern */
        .ambient-grid {
            background-size: 32px 32px;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        }

        /* Artboard styling */
        .artboard-wrapper {
            transform-origin: top left;
            transition: transform 0.2s ease;
        }

        .artboard {
            position: relative;
            overflow: hidden;
            background: #090d16;
            color: #f8fafc;
            user-select: none;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        /* Editable text cues */
        .editable-active [contenteditable="true"] {
            outline: 1.5px dashed rgba(244, 63, 94, 0.6);
            outline-offset: 3px;
            border-radius: 4px;
            cursor: text;
        }
        .editable-active [contenteditable="true"]:hover {
            outline: 2px solid #f43f5e;
            background-color: rgba(244, 63, 94, 0.08);
        }

        /* Custom scrollbars */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #07090e;
        }
        ::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #334155;
        }
    </style>
</head>
<body class="min-h-screen bg-[#07090e] text-slate-100 selection:bg-rose-500 selection:text-white">

    <!-- Top Sticky Control Header -->
    <header class="sticky top-0 z-50 bg-[#0c1017]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-2xl">
        <div class="max-w-[1540px] mx-auto flex flex-wrap items-center justify-between gap-4">
            <!-- Brand & Status -->
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 p-0.5 shadow-lg shadow-rose-500/25 flex items-center justify-center">
                    <img src="assets/screenshot_v3/06-品牌素材-Brand/品牌素材-Logo图标-H红心.png" alt="HORD" class="w-full h-full object-contain rounded-lg">
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <h1 class="font-bold text-lg text-white tracking-tight">HORD 词境伴侣 · Chrome 应用商店素材工坊</h1>
                        <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Store Spec 3.0</span>
                    </div>
                    <p class="text-xs text-slate-400">严格适配 Chrome 网上应用店官方像素与宽高比 · 包含 8 组高保真物料 · 支持单图即时导出与全量 ZIP 打包</p>
                </div>
            </div>

            <!-- Viewport & Editor Controls -->
            <div class="flex items-center flex-wrap gap-3">
                <!-- Zoom Controls -->
                <div class="flex items-center bg-slate-800/80 border border-white/10 rounded-lg p-1 text-xs">
                    <span class="px-2 text-slate-400"><i class="fa-solid fa-magnifying-glass mr-1"></i>缩放:</span>
                    <button onclick="setZoom(0.5)" class="zoom-btn px-2.5 py-1 rounded hover:bg-white/10 transition" data-zoom="0.5">50%</button>
                    <button onclick="setZoom(0.75)" class="zoom-btn px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-medium hover:bg-rose-500/30 transition" data-zoom="0.75">75%</button>
                    <button onclick="setZoom(1.0)" class="zoom-btn px-2.5 py-1 rounded hover:bg-white/10 transition" data-zoom="1.0">100%</button>
                </div>

                <!-- Editable text toggle -->
                <button id="toggleEditBtn" onclick="toggleEditableMode()" class="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/15 bg-white/5 hover:bg-white/10 transition flex items-center gap-1.5 text-slate-200">
                    <i class="fa-solid fa-pen-to-square text-rose-400"></i>
                    <span>文案编辑模式: <b id="editStatusText" class="text-slate-400">关</b></span>
                </button>

                <!-- Batch Download ZIP Button -->
                <button id="batchZipBtn" onclick="downloadAllAsZip()" class="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition flex items-center gap-2">
                    <i class="fa-solid fa-file-zipper text-sm"></i>
                    <span>一键打包下载全部 8 张物料 (ZIP)</span>
                </button>
            </div>
        </div>

        <!-- Quick Filter Anchor Bar -->
        <div class="max-w-[1540px] mx-auto mt-3 pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto text-xs text-slate-400 scrollbar-none">
            <span class="text-slate-500 shrink-0"><i class="fa-solid fa-arrow-down-short-wide mr-1"></i>快速跳转:</span>
            <a href="#sec-icon" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">1. 应用图标 (128×128)</a>
            <a href="#sec-small-promo" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">2. 小型宣传图 (440×280)</a>
            <a href="#sec-marquee" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">3. 横幅主图 (1400×560)</a>
            <a href="#sec-shot-1" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">4. 极速划词即查 (1280×800)</a>
            <a href="#sec-shot-2" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">5. 影音双语伴侣 (1280×800)</a>
            <a href="#sec-shot-3" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">6. 3D实景阅读 (1280×800)</a>
            <a href="#sec-shot-4" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">7. 电玩城与勋章 (1280×800)</a>
            <a href="#sec-shot-5" class="px-2.5 py-1 rounded-md hover:text-white hover:bg-white/5 transition shrink-0">8. 金句壁纸工坊 (1280×800)</a>
        </div>
    </header>

    <!-- Main Workspace Area -->
    <main class="max-w-[1540px] mx-auto px-6 py-10 space-y-16">

        <!-- ========================================================= -->
        <!-- ITEM 1: Store Icon (128 x 128 px) -->
        <!-- ========================================================= -->
        <section id="sec-icon" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">1</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">Chrome Web Store 扩展图标 (Store Icon)</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：必须为 <code class="text-rose-300 font-mono">128 × 128 px</code>，PNG 格式。用于商店详情页、列表项及扩展管理栏。</p>
                </div>
                <button onclick="downloadAsset('artboard-icon', '01_store_icon_128x128.png', 128, 128)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此图标 (128×128)</span>
                </button>
            </div>

            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 flex items-center gap-8 ambient-grid">
                <!-- Artboard Frame -->
                <div class="shrink-0 p-2 bg-slate-900/90 rounded-2xl border border-white/10 shadow-2xl">
                    <div id="artboard-icon" class="artboard w-[128px] h-[128px] rounded-2xl flex items-center justify-center relative bg-gradient-to-br from-slate-900 via-[#101726] to-[#1c0f18] overflow-hidden" data-name="01_store_icon_128x128.png">
                        <!-- Glow -->
                        <div class="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-amber-500/20"></div>
                        <!-- Logo -->
                        <img src="assets/screenshot_v3/06-品牌素材-Brand/品牌素材-Logo图标-H红心.png" alt="HORD Icon" class="w-[96px] h-[96px] object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(244,63,94,0.4)]">
                        <!-- Glass Border Highlight -->
                        <div class="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
                    </div>
                </div>

                <div class="space-y-2 text-xs text-slate-300">
                    <div class="flex items-center gap-2 text-sm font-semibold text-white">
                        <i class="fa-solid fa-circle-check text-emerald-400"></i>
                        <span>官方 128px 标准无损导出</span>
                    </div>
                    <p class="text-slate-400 leading-relaxed max-w-xl">采用高保真立体红心与 H 徽标，融合微光拟态边框。支持高 DPI 视网膜清晰度，在 Chrome 商店深浅色背景下均具备卓越识别度。</p>
                </div>
            </div>
        </section>

        <!-- ========================================================= -->
        <!-- ITEM 2: Small Promo Tile (440 x 280 px) -->
        <!-- ========================================================= -->
        <section id="sec-small-promo" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">2</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">小型宣传卡片 (Small Promo Tile)</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：必须为 <code class="text-rose-300 font-mono">440 × 280 px</code>。用于 Chrome 商店分类搜索结果列表与推荐卡位。</p>
                </div>
                <button onclick="downloadAsset('artboard-small-promo', '02_small_promo_440x280.png', 440, 280)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此卡片 (440×280)</span>
                </button>
            </div>

            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 flex flex-wrap items-center gap-8 ambient-grid">
                <!-- Scaled Canvas Wrapper -->
                <div class="shrink-0 p-3 bg-slate-900/90 rounded-2xl border border-white/10 shadow-2xl">
                    <div id="artboard-small-promo" class="artboard w-[440px] h-[280px] rounded-xl relative p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1a0f1b]" data-name="02_small_promo_440x280.png">
                        <!-- Background Accents -->
                        <div class="absolute -top-16 -right-16 w-52 h-52 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
                        <div class="absolute -bottom-16 -left-16 w-52 h-52 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
                        <div class="absolute inset-0 ambient-grid opacity-30 pointer-events-none"></div>

                        <!-- Top Status Bar -->
                        <div class="relative z-10 flex items-center justify-between">
                            <div class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span contenteditable="true" class="text-[10px] font-semibold tracking-wider text-slate-200 uppercase">Chrome Extension · v3.0 Pro</span>
                            </div>
                            <div class="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                                <span>★★★★★</span>
                            </div>
                        </div>

                        <!-- Center Identity -->
                        <div class="relative z-10 my-auto flex items-center gap-4">
                            <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-red-500 to-amber-500 p-0.5 shadow-xl shadow-rose-500/25 shrink-0 flex items-center justify-center">
                                <img src="assets/screenshot_v3/06-品牌素材-Brand/品牌素材-AI生成3D玻璃H图标.png" alt="Logo" class="w-full h-full object-cover rounded-2xl">
                            </div>
                            <div>
                                <h3 contenteditable="true" class="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                                    HORD <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400 font-extrabold">词境伴侣</span>
                                </h3>
                                <p contenteditable="true" class="text-xs text-slate-300 font-medium mt-1 leading-snug">
                                    沉浸式双核 AI 英语学习伴侣
                                </p>
                            </div>
                        </div>

                        <!-- Bottom Feature Badges Strip -->
                        <div class="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                            <span contenteditable="true" class="flex items-center gap-1"><i class="fa-solid fa-bolt text-amber-400"></i> 划词即查</span>
                            <span class="text-slate-600">•</span>
                            <span contenteditable="true" class="flex items-center gap-1"><i class="fa-brands fa-youtube text-red-400"></i> 影音双语</span>
                            <span class="text-slate-600">•</span>
                            <span contenteditable="true" class="flex items-center gap-1"><i class="fa-solid fa-book-open text-cyan-400"></i> 3D原著</span>
                            <span class="text-slate-600">•</span>
                            <span contenteditable="true" class="flex items-center gap-1"><i class="fa-solid fa-gamepad text-emerald-400"></i> 电玩复习</span>
                        </div>
                    </div>
                </div>

                <div class="space-y-2 text-xs text-slate-300">
                    <div class="flex items-center gap-2 text-sm font-semibold text-white">
                        <i class="fa-solid fa-layer-group text-rose-400"></i>
                        <span>搜索卡位高对比设计</span>
                    </div>
                    <p class="text-slate-400 leading-relaxed max-w-md">
                        专为 440×280 紧凑尺寸调优，避免小字糊化与复杂图片压缩失真。突出“双核 AI”与“全功能集成”核心特征，吸引用户点击安装。
                    </p>
                </div>
            </div>
        </section>

        <!-- ========================================================= -->
        <!-- ITEM 3: Marquee Promo Tile (1400 x 560 px) -->
        <!-- ========================================================= -->
        <section id="sec-marquee" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">3</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">横幅宣传主图 (Marquee Promo Tile)</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：必须为 <code class="text-rose-300 font-mono">1400 × 560 px</code>。用于 Chrome 商店首页 Featured 头部精选横幅大图推荐位。</p>
                </div>
                <button onclick="downloadAsset('artboard-marquee', '03_marquee_promo_1400x560.png', 1400, 560)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此横幅 (1400×560)</span>
                </button>
            </div>

            <!-- Canvas Viewport with horizontal scrolling container -->
            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 overflow-x-auto ambient-grid">
                <div class="artboard-wrapper inline-block">
                    <div id="artboard-marquee" class="artboard w-[1400px] h-[560px] rounded-2xl relative p-10 flex items-center justify-between overflow-hidden bg-gradient-to-br from-[#070B14] via-[#0D1424] to-[#180B1C]" data-name="03_marquee_promo_1400x560.png">
                        <!-- Lighting & Grid -->
                        <div class="absolute -top-32 left-1/4 w-96 h-96 bg-rose-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                        <div class="absolute -bottom-32 right-1/4 w-[32rem] h-[32rem] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none"></div>
                        <div class="absolute inset-0 ambient-grid opacity-25 pointer-events-none"></div>

                        <!-- Left Hero Column (520px) -->
                        <div class="relative z-10 w-[520px] flex flex-col justify-between h-full py-1">
                            <!-- Top Brand Chip -->
                            <div>
                                <div class="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shadow-lg mb-5">
                                    <img src="assets/screenshot_v3/06-品牌素材-Brand/品牌素材-Logo图标-H红心.png" alt="Logo" class="w-5 h-5 object-contain">
                                    <span contenteditable="true" class="text-xs font-bold text-slate-200 tracking-wider uppercase">HORD ENGLISH COMPANION 3.0</span>
                                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                    <span contenteditable="true" class="text-[11px] font-semibold text-rose-300">深度重构版</span>
                                </div>

                                <h2 contenteditable="true" class="text-4xl font-black text-white leading-[1.2] tracking-tight">
                                    在真实语境中自然习得，<br>
                                    让每个英文单词<br>
                                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-amber-300">
                                        化为终身记忆与生产力
                                    </span>
                                </h2>

                                <p contenteditable="true" class="mt-4 text-sm text-slate-300 leading-relaxed">
                                    突破孤立背单词困局。网页划词双核 AI 解析 · YouTube & B 站双语影音沉浸 · 3D 实景文学阅读器 · 艾宾浩斯电玩复习 · 金句壁纸全端秒级流转。
                                </p>
                            </div>

                            <!-- Highlights Badges Matrix -->
                            <div class="pt-5 border-t border-white/10">
                                <div class="grid grid-cols-3 gap-3">
                                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div class="text-rose-400 text-base mb-1"><i class="fa-solid fa-bolt"></i></div>
                                        <div contenteditable="true" class="text-xs font-bold text-white">0.05s 极速响应</div>
                                        <div contenteditable="true" class="text-[10px] text-slate-400 mt-0.5">网页任意划词即解</div>
                                    </div>
                                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div class="text-indigo-400 text-base mb-1"><i class="fa-solid fa-brain"></i></div>
                                        <div contenteditable="true" class="text-xs font-bold text-white">双核 AI 语境</div>
                                        <div contenteditable="true" class="text-[10px] text-slate-400 mt-0.5">官方与自建接口</div>
                                    </div>
                                    <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div class="text-amber-400 text-base mb-1"><i class="fa-solid fa-trophy"></i></div>
                                        <div contenteditable="true" class="text-xs font-bold text-white">100+ 专属勋章</div>
                                        <div contenteditable="true" class="text-[10px] text-slate-400 mt-0.5">5 款电玩游戏抗遗忘</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Multi-Device Mockup Stage (780px, well within boundary) -->
                        <div class="relative z-10 w-[780px] h-[480px] flex items-center justify-end pr-2">
                            <!-- Layer 1 (Back): YouTube Player Card -->
                            <div class="absolute right-4 top-2 w-[660px] h-[330px] rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900 transform -rotate-1 hover:rotate-0 transition duration-500">
                                <div class="bg-slate-800/90 px-3 py-1.5 flex items-center gap-1.5 border-b border-white/10">
                                    <div class="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                                    <div class="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                    <div class="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                                    <span class="text-[10px] text-slate-400 font-mono ml-2">YouTube 原生双语字幕沉浸模式</span>
                                </div>
                                <img src="assets/screenshot_v3/07-YouTube-伴侣/YouTube-播放页-双语字幕沉浸模式.png" alt="YouTube" class="w-full h-[calc(100%-25px)] object-cover object-top">
                            </div>

                            <!-- Layer 2 (Front-Left Floating): Context AI Web Lookup Popup -->
                            <div class="absolute left-6 bottom-3 w-[400px] rounded-xl overflow-hidden border border-white/20 shadow-[0_30px_70px_rgba(0,0,0,0.85)] bg-slate-950/95 backdrop-blur-2xl transform rotate-2 hover:rotate-0 transition duration-500 z-20">
                                <div class="bg-gradient-to-r from-slate-900 to-slate-800 px-3 py-2 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                                        <span class="text-xs font-bold text-white tracking-wide">网页划词 · AI 语境解析</span>
                                    </div>
                                    <span class="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">0.05s</span>
                                </div>
                                <img src="assets/screenshot_v3/04-网页划词弹窗/网页划词-unprecedented查词-AI语境解析.png" alt="Context AI" class="w-full h-auto object-cover">
                            </div>

                            <!-- Layer 3 (Bottom-Right Floating Accent): Badge Achievement Matrix Pill (safely inside) -->
                            <div class="absolute right-6 bottom-4 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-white/15 backdrop-blur-xl shadow-2xl z-30 flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                    <i class="fa-solid fa-medal text-base"></i>
                                </div>
                                <div>
                                    <div class="text-xs font-bold text-white">全成就勋章矩阵</div>
                                    <div class="text-[10px] text-slate-400">100 款专属精美成就已就绪</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================= -->
        <!-- SCREENSHOT 1: 极速划词即查 · 双核 AI 语境深度透析 (1280x800) -->
        <!-- ========================================================= -->
        <section id="sec-shot-1" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">4</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">截图 1：极速划词即查 · 双核 AI 语境深度透析</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：<code class="text-rose-300 font-mono">1280 × 800 px</code> (16:10 推荐格式)。店铺详情页首屏轮播图，决定用户第一印象。</p>
                </div>
                <button onclick="downloadAsset('artboard-shot-1', '04_screenshot_1_context_ai_1280x800.png', 1280, 800)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此图 (1280×800)</span>
                </button>
            </div>

            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 overflow-x-auto ambient-grid">
                <div class="artboard-wrapper inline-block">
                    <div id="artboard-shot-1" class="artboard w-[1280px] h-[800px] rounded-2xl relative p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#090D18] via-[#0E1526] to-[#0A0E1A]" data-name="04_screenshot_1_context_ai_1280x800.png">
                        <!-- Top Ambient Glow -->
                        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none"></div>

                        <!-- Top Header Area (150px) -->
                        <div class="relative z-10 text-center max-w-4xl mx-auto">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold tracking-widest uppercase mb-3">
                                <i class="fa-solid fa-bolt text-rose-400"></i>
                                <span contenteditable="true">FEATURE 01 · BROWSER POPUP & CONTEXT AI</span>
                            </div>
                            <h2 contenteditable="true" class="text-3xl font-black text-white tracking-tight">
                                极速划词即查 · 双核 AI 语境深度透析
                            </h2>
                            <p contenteditable="true" class="text-sm text-slate-300 mt-2 font-normal leading-relaxed">
                                网页任意选词瞬间响应 · 支持官方解析与个人私有大模型 API 自由接入 · 搭配短语与真实语法语境精准剖析
                            </p>
                            <!-- Feature Pills -->
                            <div class="mt-4 flex items-center justify-center gap-2.5 text-xs">
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-bolt text-amber-400 mr-1.5"></i>0.05s 瞬时浮窗</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-microchip text-indigo-400 mr-1.5"></i>双核 AI 智能切换</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-spell-check text-emerald-400 mr-1.5"></i>高频搭配短语</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-bookmark text-rose-400 mr-1.5"></i>真题例句自动关联</span>
                            </div>
                        </div>

                        <!-- Showcase Stage (560px) -->
                        <div class="relative z-10 w-full h-[550px] flex items-center justify-center gap-6 px-4">
                            <!-- Card A: unprecedented AI Context Analysis -->
                            <div class="w-[570px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)] transform hover:-translate-y-1 transition duration-300">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">大模型语境解析 · unprecedented</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">AI 解析模式</span>
                                </div>
                                <div class="p-3 bg-slate-950 flex items-center justify-center">
                                    <img src="assets/screenshot_v3/04-网页划词弹窗/网页划词-unprecedented查词-AI语境解析.png" alt="AI Context" class="w-full h-auto max-h-[460px] object-contain rounded-xl">
                                </div>
                            </div>

                            <!-- Card B: exhilarating Collocation & Source -->
                            <div class="w-[570px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)] transform hover:-translate-y-1 transition duration-300">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">高频搭配与详细释义 · exhilarating</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">权威词典库</span>
                                </div>
                                <div class="p-3 bg-slate-950 flex items-center justify-center">
                                    <img src="assets/screenshot_v3/04-网页划词弹窗/网页划词-exhilarating查词-搭配短语.png" alt="Collocations" class="w-full h-auto max-h-[460px] object-contain rounded-xl">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================= -->
        <!-- SCREENSHOT 2: YouTube & B 站双语伴侣 · 原生影音学习 (1280x800) -->
        <!-- ========================================================= -->
        <section id="sec-shot-2" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">5</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">截图 2：YouTube & B 站双语伴侣 · 原生影音学习</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：<code class="text-rose-300 font-mono">1280 × 800 px</code>。展示影音双语沉浸学习体验。</p>
                </div>
                <button onclick="downloadAsset('artboard-shot-2', '05_screenshot_2_video_companion_1280x800.png', 1280, 800)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此图 (1280×800)</span>
                </button>
            </div>

            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 overflow-x-auto ambient-grid">
                <div class="artboard-wrapper inline-block">
                    <div id="artboard-shot-2" class="artboard w-[1280px] h-[800px] rounded-2xl relative p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0B0F1C] via-[#10172B] to-[#0A0D17]" data-name="05_screenshot_2_video_companion_1280x800.png">
                        <!-- Top Ambient Glow -->
                        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none"></div>

                        <!-- Top Header -->
                        <div class="relative z-10 text-center max-w-4xl mx-auto">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-3">
                                <i class="fa-solid fa-play text-indigo-400"></i>
                                <span contenteditable="true">FEATURE 02 · VIDEO IMMERSIVE COMPANION</span>
                            </div>
                            <h2 contenteditable="true" class="text-3xl font-black text-white tracking-tight">
                                YouTube & B 站双语伴侣 · 原生影音沉浸学习
                            </h2>
                            <p contenteditable="true" class="text-sm text-slate-300 mt-2 font-normal leading-relaxed">
                                原汁原味双语字幕同显 · 视频实时悬浮划词 · 侧边栏字幕列表精准精听与单句复读
                            </p>
                            <!-- Feature Pills -->
                            <div class="mt-4 flex items-center justify-center gap-2.5 text-xs">
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-brands fa-youtube text-red-400 mr-1.5"></i>YouTube 原生双语字幕</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-brands fa-bilibili text-sky-400 mr-1.5"></i>B 站全功能伴侣</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-headphones text-amber-400 mr-1.5"></i>句段精听复读</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-cloud-arrow-down text-emerald-400 mr-1.5"></i>影音原生生词收录</span>
                            </div>
                        </div>

                        <!-- Showcase Stage (Tightly balanced within 1280px) -->
                        <div class="relative z-10 w-full h-[550px] flex items-center justify-center px-6">
                            <!-- Main YouTube Player Mockup (Left/Center) -->
                            <div class="w-[740px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900 shadow-[0_30px_70px_rgba(0,0,0,0.85)] z-10">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">YouTube 原生双语字幕播放沉浸态</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-semibold"><i class="fa-brands fa-youtube mr-1"></i>YouTube</span>
                                </div>
                                <img src="assets/screenshot_v3/07-YouTube-伴侣/YouTube-播放页-双语字幕沉浸模式.png" alt="YouTube Player" class="w-full h-[450px] object-cover object-top">
                            </div>

                            <!-- Overlapping Bilibili Subtitles Inset (Right) -->
                            <div class="w-[440px] rounded-2xl overflow-hidden border border-white/20 bg-slate-950/95 shadow-[0_35px_80px_rgba(0,0,0,0.9)] z-20 -ml-16 transform translate-y-4">
                                <div class="bg-slate-800/95 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                                        <span class="text-xs text-white font-medium">Bilibili 双语伴侣 · 侧栏精听与选词</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-semibold"><i class="fa-brands fa-bilibili mr-1"></i>B站</span>
                                </div>
                                <img src="assets/screenshot_v3/09-Bilibili-伴侣/Bilibili-播放页-双语字幕与侧栏列表-余华活着访谈.png" alt="Bilibili Subtitle" class="w-full h-[410px] object-cover object-left-top">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================= -->
        <!-- SCREENSHOT 3: 3D 实景原著阅读器 · 经典文学与长难句剖析 (1280x800) -->
        <!-- ========================================================= -->
        <section id="sec-shot-3" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">6</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">截图 3：3D 实景原著阅读器 · 经典文学与长难句剖析</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：<code class="text-rose-300 font-mono">1280 × 800 px</code>。展示 3D 拟真书架与长难句深度语法拆解能力。</p>
                </div>
                <button onclick="downloadAsset('artboard-shot-3', '06_screenshot_3_reader_3d_1280x800.png', 1280, 800)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此图 (1280×800)</span>
                </button>
            </div>

            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 overflow-x-auto ambient-grid">
                <div class="artboard-wrapper inline-block">
                    <div id="artboard-shot-3" class="artboard w-[1280px] h-[800px] rounded-2xl relative p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#090D18] via-[#0D1528] to-[#0A0E1A]" data-name="06_screenshot_3_reader_3d_1280x800.png">
                        <!-- Top Ambient Glow -->
                        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none"></div>

                        <!-- Top Header -->
                        <div class="relative z-10 text-center max-w-4xl mx-auto">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">
                                <i class="fa-solid fa-book-open text-cyan-400"></i>
                                <span contenteditable="true">FEATURE 03 · 3D IMMERSIVE READER</span>
                            </div>
                            <h2 contenteditable="true" class="text-3xl font-black text-white tracking-tight">
                                3D 实景原著阅读器 · 经典文学与长难句剖析
                            </h2>
                            <p contenteditable="true" class="text-sm text-slate-300 mt-2 font-normal leading-relaxed">
                                拟真质感原著书架 · 原汁原味英文排版 · AI 长难句树状语法剖析与全篇深度解析
                            </p>
                            <!-- Feature Pills -->
                            <div class="mt-4 flex items-center justify-center gap-2.5 text-xs">
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-layer-group text-cyan-400 mr-1.5"></i>3D 拟真原著书架</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-wand-magic-sparkles text-amber-400 mr-1.5"></i>AI 长难句语法拆解</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-maximize text-emerald-400 mr-1.5"></i>全屏沉浸纯净排版</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-highlighter text-rose-400 mr-1.5"></i>段落金句实时高亮</span>
                            </div>
                        </div>

                        <!-- Showcase Stage -->
                        <div class="relative z-10 w-full h-[550px] flex items-center justify-center gap-6 px-4">
                            <!-- Left: 3D Bookshelf -->
                            <div class="w-[640px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">3D 实景拟真书架 · 经典英文原著</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">15+ 原著典藏</span>
                                </div>
                                <img src="assets/screenshot_v3/03-阅读器-Reader/书架/阅读器-书架-丰富版15本书.png" alt="3D Bookshelf" class="w-full h-[450px] object-cover object-top">
                            </div>

                            <!-- Right: AI Grammar Tree Breakdown -->
                            <div class="w-[500px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">AI 语法分析与长难句剖析</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">长难句拆解</span>
                                </div>
                                <img src="assets/screenshot_v3/03-阅读器-Reader/AI翻译深度解析/阅读器-AI翻译面板-全页展开态.png" alt="AI Grammar" class="w-full h-[450px] object-cover object-top">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================= -->
        <!-- SCREENSHOT 4: 英语电玩城 · 艾宾浩斯抗遗忘与 100 款成长勋章 (1280x800) -->
        <!-- ========================================================= -->
        <section id="sec-shot-4" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">7</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">截图 4：英语电玩城 · 艾宾浩斯抗遗忘与 100 款成长勋章</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：<code class="text-rose-300 font-mono">1280 × 800 px</code>。展示 5 款电玩游戏复习与 100 款成长徽章激励机制。</p>
                </div>
                <button onclick="downloadAsset('artboard-shot-4', '07_screenshot_4_arcade_badges_1280x800.png', 1280, 800)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此图 (1280×800)</span>
                </button>
            </div>

            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 overflow-x-auto ambient-grid">
                <div class="artboard-wrapper inline-block">
                    <div id="artboard-shot-4" class="artboard w-[1280px] h-[800px] rounded-2xl relative p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0B0E1B] via-[#12162C] to-[#0A0D18]" data-name="07_screenshot_4_arcade_badges_1280x800.png">
                        <!-- Top Ambient Glow -->
                        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-amber-600/15 rounded-full blur-[100px] pointer-events-none"></div>

                        <!-- Top Header -->
                        <div class="relative z-10 text-center max-w-4xl mx-auto">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
                                <i class="fa-solid fa-gamepad text-amber-400"></i>
                                <span contenteditable="true">FEATURE 04 · GAMIFIED REVIEW & BADGES</span>
                            </div>
                            <h2 contenteditable="true" class="text-3xl font-black text-white tracking-tight">
                                英语电玩城 · 艾宾浩斯抗遗忘与 100 款成长勋章
                            </h2>
                            <p contenteditable="true" class="text-sm text-slate-300 mt-2 font-normal leading-relaxed">
                                告别枯燥背词 · 5 款趣味闯关电玩游戏 · 遵循认知抗遗忘记忆算法 · 100 款成就徽章持续正向反馈
                            </p>
                            <!-- Feature Pills -->
                            <div class="mt-4 flex items-center justify-center gap-2.5 text-xs">
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-gamepad text-amber-400 mr-1.5"></i>5 大互动电玩</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-chart-line text-emerald-400 mr-1.5"></i>艾宾浩斯曲线</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-medal text-rose-400 mr-1.5"></i>100 款成长勋章</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-fire text-amber-500 mr-1.5"></i>连胜打卡机制</span>
                            </div>
                        </div>

                        <!-- Showcase Stage -->
                        <div class="relative z-10 w-full h-[550px] flex items-center justify-center gap-6 px-4">
                            <!-- Left: Arcade Lobby -->
                            <div class="w-[640px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">复习电玩城 · 游戏化互动学习大厅</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">5 大游戏合集</span>
                                </div>
                                <img src="assets/screenshot_v3/02-复习-Ebbinghaus/复习-英语电玩城-游戏化学习总览.png" alt="Arcade" class="w-full h-[450px] object-cover object-top">
                            </div>

                            <!-- Right: 100-Badge Matrix -->
                            <div class="w-[500px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">成长勋章系统 · 100 款全成就</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">激励体系</span>
                                </div>
                                <img src="assets/screenshot_v3/01-Manager-单词本中枢/Manager-Dashboard-全部徽章矩阵-成就激励.png" alt="Badges" class="w-full h-[450px] object-cover object-top">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ========================================================= -->
        <!-- SCREENSHOT 5: 金句工坊壁纸艺术 · 手机电脑全端毫秒流转 (1280x800) -->
        <!-- ========================================================= -->
        <section id="sec-shot-5" class="scroll-mt-32">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">8</span>
                        <h2 class="text-xl font-bold text-white tracking-tight">截图 5：金句工坊壁纸艺术 · 手机电脑全端毫秒流转</h2>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">官方规范：<code class="text-rose-300 font-mono">1280 × 800 px</code>。展示 4K 电脑与手机金句壁纸排版与跨端生态。</p>
                </div>
                <button onclick="downloadAsset('artboard-shot-5', '08_screenshot_5_quotes_mobile_1280x800.png', 1280, 800)" class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:border-white/20 transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-download text-rose-400"></i>
                    <span>下载此图 (1280×800)</span>
                </button>
            </div>

            <div class="p-6 rounded-2xl bg-[#0c1017] border border-white/10 overflow-x-auto ambient-grid">
                <div class="artboard-wrapper inline-block">
                    <div id="artboard-shot-5" class="artboard w-[1280px] h-[800px] rounded-2xl relative p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#090D18] via-[#0E1527] to-[#0A0D18]" data-name="08_screenshot_5_quotes_mobile_1280x800.png">
                        <!-- Top Ambient Glow -->
                        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-rose-600/15 rounded-full blur-[100px] pointer-events-none"></div>

                        <!-- Top Header -->
                        <div class="relative z-10 text-center max-w-4xl mx-auto">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold tracking-widest uppercase mb-3">
                                <i class="fa-solid fa-wand-magic-sparkles text-rose-400"></i>
                                <span contenteditable="true">FEATURE 05 · QUOTE STUDIO & MULTI-DEVICE</span>
                            </div>
                            <h2 contenteditable="true" class="text-3xl font-black text-white tracking-tight">
                                金句工坊壁纸艺术 · 手机电脑全端毫秒流转
                            </h2>
                            <p contenteditable="true" class="text-sm text-slate-300 mt-2 font-normal leading-relaxed">
                                心动好词一键排版为 4K 电脑与手机壁纸 · 沉浸式名言社媒卡片 · 跨端云同步温故知新
                            </p>
                            <!-- Feature Pills -->
                            <div class="mt-4 flex items-center justify-center gap-2.5 text-xs">
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-laptop text-amber-400 mr-1.5"></i>4K 电脑壁纸样机</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-mobile-screen text-sky-400 mr-1.5"></i>iPhone 锁屏金句艺术</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-palette text-rose-400 mr-1.5"></i>8+ 款大师艺术模板</span>
                                <span contenteditable="true" class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-200"><i class="fa-solid fa-rotate text-emerald-400 mr-1.5"></i>全端数据无缝流转</span>
                            </div>
                        </div>

                        <!-- Showcase Stage -->
                        <div class="relative z-10 w-full h-[550px] flex items-center justify-center gap-6 px-4">
                            <!-- Left: Mobile Mockup 1 -->
                            <div class="w-[200px] h-[450px] flex items-center justify-center shrink-0 transform -rotate-2 hover:rotate-0 transition duration-300">
                                <img src="assets/screenshot_v3/05-移动端-Mobile/hord-mobile-preview-1.png" alt="Mobile 1" class="h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]">
                            </div>

                            <!-- Center: MacBook Laptop Wallpaper Mockup -->
                            <div class="w-[660px] rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_30px_70px_rgba(0,0,0,0.85)] z-10">
                                <div class="bg-slate-800/90 px-4 py-2.5 flex items-center justify-between border-b border-white/10">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span class="text-xs text-slate-300 font-medium ml-2">MacBook 1080P/4K 金句电脑壁纸实机样机</span>
                                    </div>
                                    <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Obsidian Mist 模板</span>
                                </div>
                                <img src="assets/screenshot_v3/08-金句导出-QuoteExport/成品素材-电脑壁纸/金句导出-ObsidianMist-1080P电脑壁纸-MacBook笔记本样机.png" alt="Laptop Wallpaper" class="w-full h-[450px] object-cover object-center">
                            </div>

                            <!-- Right: Mobile Mockup 2 -->
                            <div class="w-[200px] h-[450px] flex items-center justify-center shrink-0 transform rotate-2 hover:rotate-0 transition duration-300">
                                <img src="assets/screenshot_v3/05-移动端-Mobile/hord-mobile-preview-3.png" alt="Mobile 3" class="h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="mt-20 border-t border-white/10 py-10 text-center text-xs text-slate-500">
        <p>HORD 词境伴侣 · Chrome Web Store 官方素材设计工坊 · 严格适配 Chrome 商店审核要求</p>
        <p class="mt-1">Generated for HORD-English-Companion v3.0.0 Pro · All rights reserved.</p>
    </footer>

    <!-- Export Loading / Progress Toast Modal -->
    <div id="exportModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden flex items-center justify-center">
        <div class="bg-slate-900 border border-white/15 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
            <div class="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 text-2xl flex items-center justify-center mx-auto mb-4 animate-spin">
                <i class="fa-solid fa-circle-notch"></i>
            </div>
            <h3 id="exportModalTitle" class="text-lg font-bold text-white mb-2">正在导出物料...</h3>
            <p id="exportModalDesc" class="text-xs text-slate-400 mb-4">正在导出高清物料，请稍候</p>
            <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden mb-2">
                <div id="exportProgressBar" class="bg-gradient-to-r from-rose-500 to-amber-500 h-full w-0 transition-all duration-300"></div>
            </div>
            <span id="exportProgressText" class="text-[11px] font-mono text-slate-400">0%</span>
        </div>
    </div>

    <!-- Interactive Script -->
    <script>
        // 1. Zoom Control
        let currentZoom = 0.75;
        function setZoom(val) {
            currentZoom = val;
            document.querySelectorAll('.artboard-wrapper').forEach(wrap => {
                wrap.style.transform = `scale(${val})`;
                wrap.style.transformOrigin = 'top left';
                const child = wrap.firstElementChild;
                if (child) {
                    wrap.parentElement.style.height = `${child.offsetHeight * val + 48}px`;
                }
            });

            // Update UI buttons
            document.querySelectorAll('.zoom-btn').forEach(btn => {
                if (parseFloat(btn.dataset.zoom) === val) {
                    btn.className = 'zoom-btn px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-medium hover:bg-rose-500/30 transition';
                } else {
                    btn.className = 'zoom-btn px-2.5 py-1 rounded hover:bg-white/10 transition';
                }
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            setZoom(0.75);
        });
        window.addEventListener('resize', () => {
            setZoom(currentZoom);
        });

        // 2. ContentEditable Mode Toggle
        let isEditable = false;
        let hasUserEdited = false;
        function toggleEditableMode() {
            isEditable = !isEditable;
            document.body.classList.toggle('editable-active', isEditable);
            const statusText = document.getElementById('editStatusText');
            if (isEditable) {
                statusText.innerText = '开 (点击文字可直接修改)';
                statusText.className = 'text-rose-400 font-bold';
            } else {
                statusText.innerText = '关';
                statusText.className = 'text-slate-400';
            }
        }

        document.addEventListener('input', (e) => {
            if (e.target.isContentEditable) {
                hasUserEdited = true;
            }
        });

        // 3. Smart Download: If not edited, download pre-rendered asset; if edited, use html2canvas!
        async function downloadAsset(elementId, filename, targetWidth, targetHeight) {
            // Check if user edited text
            if (!hasUserEdited) {
                try {
                    // Fetch pre-rendered file directly
                    const preRenderedUrl = `assets/chrome_store/${filename}`;
                    const resp = await fetch(preRenderedUrl);
                    if (resp.ok) {
                        const blob = await resp.blob();
                        saveAs(blob, filename);
                        return;
                    }
                } catch (e) {
                    console.log('Falling back to html2canvas rendering:', e);
                }
            }

            // Otherwise, render live from DOM with html2canvas
            const el = document.getElementById(elementId);
            if (!el) return;

            const modal = document.getElementById('exportModal');
            const modalTitle = document.getElementById('exportModalTitle');
            const modalDesc = document.getElementById('exportModalDesc');
            const bar = document.getElementById('exportProgressBar');
            const ptext = document.getElementById('exportProgressText');
            
            modal.classList.remove('hidden');
            modalTitle.innerText = `正在导出 ${filename}`;
            modalDesc.innerText = `目标尺寸: ${targetWidth} × ${targetHeight} px`;
            bar.style.width = '30%';
            ptext.innerText = '正在光栅化...';

            try {
                const wrapper = el.closest('.artboard-wrapper');
                const prevTransform = wrapper ? wrapper.style.transform : '';
                if (wrapper) wrapper.style.transform = 'none';

                const canvas = await html2canvas(el, {
                    scale: 1,
                    width: targetWidth,
                    height: targetHeight,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    logging: false
                });

                if (wrapper) wrapper.style.transform = prevTransform;

                bar.style.width = '90%';
                ptext.innerText = '生成图像数据...';

                canvas.toBlob(blob => {
                    saveAs(blob, filename);
                    bar.style.width = '100%';
                    ptext.innerText = '完成！';
                    setTimeout(() => {
                        modal.classList.add('hidden');
                        bar.style.width = '0%';
                    }, 500);
                }, 'image/png');

            } catch (err) {
                console.error(err);
                alert('导出失败: ' + err.message);
                modal.classList.add('hidden');
            }
        }

        // 4. Batch Download All as ZIP
        async function downloadAllAsZip() {
            const items = [
                { id: 'artboard-icon', name: '01_store_icon_128x128.png', w: 128, h: 128 },
                { id: 'artboard-small-promo', name: '02_small_promo_440x280.png', w: 440, h: 280 },
                { id: 'artboard-marquee', name: '03_marquee_promo_1400x560.png', w: 1400, h: 560 },
                { id: 'artboard-shot-1', name: '04_screenshot_1_context_ai_1280x800.png', w: 1280, h: 800 },
                { id: 'artboard-shot-2', name: '05_screenshot_2_video_companion_1280x800.png', w: 1280, h: 800 },
                { id: 'artboard-shot-3', name: '06_screenshot_3_reader_3d_1280x800.png', w: 1280, h: 800 },
                { id: 'artboard-shot-4', name: '07_screenshot_4_arcade_badges_1280x800.png', w: 1280, h: 800 },
                { id: 'artboard-shot-5', name: '08_screenshot_5_quotes_mobile_1280x800.png', w: 1280, h: 800 }
            ];

            const modal = document.getElementById('exportModal');
            const modalTitle = document.getElementById('exportModalTitle');
            const modalDesc = document.getElementById('exportModalDesc');
            const bar = document.getElementById('exportProgressBar');
            const ptext = document.getElementById('exportProgressText');

            modal.classList.remove('hidden');
            modalTitle.innerText = '正在批量打包 Chrome 商店物料';
            
            const zip = new JSZip();

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const pct = Math.round(((i) / items.length) * 100);
                bar.style.width = `${pct}%`;
                ptext.innerText = `${pct}% (${i + 1}/${items.length})`;
                modalDesc.innerText = `正在处理: ${item.name}`;

                // If not edited, fetch local pre-rendered file directly for ultra fast zip creation
                let blob = null;
                if (!hasUserEdited) {
                    try {
                        const resp = await fetch(`assets/chrome_store/${item.name}`);
                        if (resp.ok) {
                            blob = await resp.blob();
                        }
                    } catch (e) {}
                }

                if (!blob) {
                    const el = document.getElementById(item.id);
                    if (!el) continue;

                    const wrapper = el.closest('.artboard-wrapper');
                    const prevTransform = wrapper ? wrapper.style.transform : '';
                    if (wrapper) wrapper.style.transform = 'none';

                    const canvas = await html2canvas(el, {
                        scale: 1,
                        width: item.w,
                        height: item.h,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: null,
                        logging: false
                    });

                    if (wrapper) wrapper.style.transform = prevTransform;
                    blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                }

                zip.file(item.name, blob);
            }

            bar.style.width = '95%';
            modalDesc.innerText = '正在压缩打包 ZIP 文件...';
            ptext.innerText = '95%';

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'hord-chrome-store-materials.zip');

            bar.style.width = '100%';
            ptext.innerText = '100% 完成！';
            setTimeout(() => {
                modal.classList.add('hidden');
                bar.style.width = '0%';
            }, 600);
        }
    </script>
</body>
</html>
'''

with open('chrome-store-assets.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("chrome-store-assets.html re-written successfully! Size:", os.path.getsize('chrome-store-assets.html'))
