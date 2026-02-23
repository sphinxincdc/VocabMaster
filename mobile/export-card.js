(function(global){
  'use strict';

  const BRAND_NAME = 'HORD';
  const BRAND_TAGLINE = 'Yesterday, You Said Tomorrow';

  const FONT_STACK_QUOTE = '"Inter","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif';
  const FONT_STACK_BODY = '"Noto Sans SC","PingFang SC","Microsoft YaHei","Segoe UI",sans-serif';
  const FONT_STACK_BRAND = '"Inter","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif';

  const MAIN_FONT_OPTIONS = {
    inter: { label: 'Inter', stack: '"Inter","Segoe UI","Helvetica Neue",Arial,sans-serif', primary: 'Inter' },
    playfair: { label: 'Playfair Display', stack: '"Playfair Display","Times New Roman",serif', primary: 'Playfair Display' },
    garamond: { label: 'EB Garamond', stack: '"EB Garamond","Garamond","Times New Roman",serif', primary: 'EB Garamond' },
    lora: { label: 'Lora', stack: '"Lora","Georgia","Times New Roman",serif', primary: 'Lora' },
  };

  const CJK_FONT_OPTIONS = {
    notoSansSC: { label: 'Noto Sans SC', stack: '"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif', primary: 'Noto Sans SC' },
    notoSerifSC: { label: 'Noto Serif SC', stack: '"Noto Serif SC","Songti SC","STSong","SimSun",serif', primary: 'Noto Serif SC' },
    lxgwWenKai: { label: 'LXGW WenKai', stack: '"LXGW WenKai","Kaiti SC","KaiTi","STKaiti",serif', primary: 'LXGW WenKai' },
  };

  const DEFAULT_FEATURES = {
    advancedTemplates: false,
    backgroundWatermark: false,
    highResolutionExport: false,
  };

  const DEFAULT_SETTINGS = {
    template: 'hordSignature',
    ratio: '1:1',
    density: 'standard',
    fontAdjust: 0,
    textSizeRange: 'standard',
    mainFont: 'inter',
    cjkFont: 'notoSansSC',
    enhanceContent: true,
    shortFillLevel: 'medium',
    lockscreenTuning: true,
    annotationStyle: 'normal',
    showTranslation: true,
    showAnnotation: false,
    showSource: false,
    showWatermark: true,
    watermarkMode: 'signature',
    isProUser: false,
    features: DEFAULT_FEATURES,
    allowAutoHideSecondary: false,
    debugLayout: false,
    previewScale: 1,
    previewFit: true,
    previewScaleMode: 'fit',
    previewMaxHeight: 0,
    previewMaxWidth: 0,
    previewSafeArea: true,
    desktopFrame: 'auto',
    desktopAnchor: 'left-middle',
    desktopTextWidth: 'standard',
    desktopTaskbarSafe: true,
    desktopTaskbarPx: 112,
    customWidth: 2560,
    customHeight: 1440,
    filenamePattern: 'hord-{date}-{template}-{ratio}',
    quoteTextOverride: '',
    translationTextOverride: '',
    sourceTextOverride: '',
    annotationTextOverride: '',
  };

  const RATIO_MAP = {
    iphone: { width: 1206, height: 2622 },
    iphone17: { width: 1206, height: 2622 },
    '4:5': { width: 1080, height: 1350 },
    '1:1': { width: 1080, height: 1080 },
    '9:16': { width: 1080, height: 1920 },
    '16:9': { width: 1920, height: 1080 },
    '4k': { width: 3840, height: 2160 },
    '3:4': { width: 900, height: 1200 },
    custom: { width: 2560, height: 1440 },
  };

  const RATIO_LAYOUT = {
    iphone: { quoteMaxLines: 11, translationMaxLines: 4, annotationMaxLines: 3, sourceMaxLines: 2, paddingFactor: 0.052, quoteBaseDiv: 9.8, extraBottom: 0.02 },
    iphone17: { quoteMaxLines: 11, translationMaxLines: 4, annotationMaxLines: 3, sourceMaxLines: 2, paddingFactor: 0.052, quoteBaseDiv: 9.8, extraBottom: 0.02 },
    '4:5': { quoteMaxLines: 6, translationMaxLines: 4, annotationMaxLines: 3, sourceMaxLines: 2, paddingFactor: 0.045, quoteBaseDiv: 12, extraBottom: 0.02 },
    '1:1': { quoteMaxLines: 5, translationMaxLines: 3, annotationMaxLines: 3, sourceMaxLines: 2, paddingFactor: 0.05, quoteBaseDiv: 12, extraBottom: 0.01 },
    '9:16': { quoteMaxLines: 8, translationMaxLines: 3, annotationMaxLines: 3, sourceMaxLines: 1, paddingFactor: 0.037, quoteBaseDiv: 11.2, extraBottom: 0.02 },
    '16:9': { quoteMaxLines: 10, translationMaxLines: 4, annotationMaxLines: 3, sourceMaxLines: 2, paddingFactor: 0.038, quoteBaseDiv: 11.3, extraBottom: 0.01 },
    '4k': { quoteMaxLines: 10, translationMaxLines: 4, annotationMaxLines: 3, sourceMaxLines: 2, paddingFactor: 0.036, quoteBaseDiv: 11.5, extraBottom: 0.01 },
    '3:4': { quoteMaxLines: 6, translationMaxLines: 4, annotationMaxLines: 3, sourceMaxLines: 2, paddingFactor: 0.045, quoteBaseDiv: 12, extraBottom: 0.02 },
  };

  const WATERMARK_MODES = ['signature', 'monogram', 'capsule', 'dotline', 'cornerLogo', 'backgroundLogo'];
  const PRO_TEMPLATE_KEYS = ['hordSignature', 'editorial', 'gradientSoft', 'letterClassic', 'letterCotton', 'parchment', 'inkJournal', 'typewriter', 'linenSoft', 'canvasStone', 'noirGrain', 'recycledPaper', 'blueprintGrid', 'gridStudio', 'sandstone', 'midnightVelvet', 'carbonCode', 'obsidianMist', 'forestNocturne', 'graphiteWeave', 'nightCircuit', 'deepSpaceGrain'];
  const IPHONE_TEMPLATE_PREFIX = 'iphone';

  const TEMPLATE_CONFIG = {
    light: {
      background: { type: 'gradient', from: '#f8fbff', to: '#eff3ff' },
      card: { bg: '#ffffff', radius: 16, shadow: 'rgba(73, 93, 179, 0.12)', borderColor: '#dce4f6', borderWidth: 1 },
      quoteStyle: { color: '#1e2446', fontWeight: 780, lineHeightMultiplier: 1.26, quoteScale: 1.0 },
      translationStyle: { color: '#45556f', fontWeight: 540, lineHeightMultiplier: 1.34, scale: 0.62 },
      annotationStyle: { color: '#6d7589', fontWeight: 500, lineHeightMultiplier: 1.34, scale: 0.55 },
      sourceStyle: { color: '#5f6f87', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#697893', fontWeight: 650, lineColor: '#d9e0f3' },
      watermarkStyle: { color: '#7a86b2', signatureOpacity: 0.30, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
      spacingScale: 1.0,
      contentWidthRatio: 0.86,
      texture: { type: 'none' },
    },
    dark: {
      background: { type: 'gradient', from: '#13142d', to: '#1e2251' },
      card: { bg: '#191c35', radius: 16, shadow: 'rgba(3, 8, 25, 0.28)', borderColor: '#2f3a64', borderWidth: 1 },
      quoteStyle: { color: '#edf1ff', fontWeight: 740, lineHeightMultiplier: 1.30, quoteScale: 0.97 },
      translationStyle: { color: '#c3ccf2', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.62 },
      annotationStyle: { color: '#b0b9dd', fontWeight: 500, lineHeightMultiplier: 1.34, scale: 0.55 },
      sourceStyle: { color: '#b8c2e9', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#c7cff0', fontWeight: 650, lineColor: '#34406b' },
      watermarkStyle: { color: '#bdc7ef', signatureOpacity: 0.28, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
      spacingScale: 0.95,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphoneWallpaper: {
      background: { type: 'gradient', from: '#050917', to: '#111a43' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#f4f7ff', fontWeight: 780, lineHeightMultiplier: 1.28, quoteScale: 1.08 },
      translationStyle: { color: '#ccd7ff', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
      annotationStyle: { color: '#bac8f1', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
      sourceStyle: { color: '#b8c6eb', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
      footerStyle: { color: '#e8eeff', fontWeight: 660, lineColor: 'rgba(175, 191, 255, 0.38)' },
      watermarkStyle: { color: '#d7e1ff', signatureOpacity: 0.28, cornerOpacity: 0.2, backgroundOpacity: 0.07 },
      spacingScale: 1.05,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphoneMinimalLight: {
      background: { type: 'gradient', from: '#f8f9ff', to: '#eef1fa' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#141a2b', fontWeight: 780, lineHeightMultiplier: 1.28, quoteScale: 1.05 },
      translationStyle: { color: '#2f3a55', fontWeight: 560, lineHeightMultiplier: 1.34, scale: 0.60 },
      annotationStyle: { color: '#43506c', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.54 },
      sourceStyle: { color: '#4b5a77', fontWeight: 520, lineHeightMultiplier: 1.28, scale: 0.41 },
      footerStyle: { color: '#1f2a43', fontWeight: 660, lineColor: 'rgba(75, 92, 132, 0.26)' },
      watermarkStyle: { color: '#4a5c86', signatureOpacity: 0.30, cornerOpacity: 0.20, backgroundOpacity: 0.07 },
      spacingScale: 1.03,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphoneMinimalDark: {
      background: { type: 'gradient', from: '#0b1024', to: '#161a38' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#eef2ff', fontWeight: 780, lineHeightMultiplier: 1.28, quoteScale: 1.06 },
      translationStyle: { color: '#c8d2f5', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
      annotationStyle: { color: '#b7c3e8', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
      sourceStyle: { color: '#aebde3', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
      footerStyle: { color: '#dde6ff', fontWeight: 660, lineColor: 'rgba(149, 170, 226, 0.30)' },
      watermarkStyle: { color: '#cad7ff', signatureOpacity: 0.30, cornerOpacity: 0.20, backgroundOpacity: 0.07 },
      spacingScale: 1.03,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphoneFrostedGlass: {
      background: { type: 'gradient', from: '#eef2ff', to: '#dde6ff' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#1f2e53', fontWeight: 770, lineHeightMultiplier: 1.29, quoteScale: 1.04 },
      translationStyle: { color: '#3c537a', fontWeight: 540, lineHeightMultiplier: 1.34, scale: 0.60 },
      annotationStyle: { color: '#4f678f', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.54 },
      sourceStyle: { color: '#586c8f', fontWeight: 520, lineHeightMultiplier: 1.28, scale: 0.41 },
      footerStyle: { color: '#2c4370', fontWeight: 660, lineColor: 'rgba(78, 105, 164, 0.30)' },
      watermarkStyle: { color: '#4f6a9f', signatureOpacity: 0.28, cornerOpacity: 0.20, backgroundOpacity: 0.07 },
      spacingScale: 1.02,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphoneMidnightGlow: {
      background: { type: 'gradient', from: '#0b1130', to: '#1f275f' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#f3f6ff', fontWeight: 790, lineHeightMultiplier: 1.28, quoteScale: 1.08 },
      translationStyle: { color: '#ced8ff', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
      annotationStyle: { color: '#c1ccf1', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
      sourceStyle: { color: '#b8c5ea', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
      footerStyle: { color: '#e9efff', fontWeight: 660, lineColor: 'rgba(159, 177, 255, 0.36)' },
      watermarkStyle: { color: '#d4deff', signatureOpacity: 0.28, cornerOpacity: 0.20, backgroundOpacity: 0.07 },
      spacingScale: 1.04,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphoneBusinessGold: {
      background: { type: 'gradient', from: '#151515', to: '#27211a' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#f2e6c9', fontWeight: 790, lineHeightMultiplier: 1.28, quoteScale: 1.06 },
      translationStyle: { color: '#d9c79e', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
      annotationStyle: { color: '#c7b589', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
      sourceStyle: { color: '#bea979', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
      footerStyle: { color: '#e5d2a4', fontWeight: 660, lineColor: 'rgba(202, 173, 113, 0.34)' },
      watermarkStyle: { color: '#d8bf8d', signatureOpacity: 0.30, cornerOpacity: 0.20, backgroundOpacity: 0.07 },
      spacingScale: 1.03,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphonePaperMinimal: {
      background: { type: 'gradient', from: '#faf6ed', to: '#f2ecdf' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#2f2b25', fontWeight: 760, lineHeightMultiplier: 1.29, quoteScale: 1.02 },
      translationStyle: { color: '#534d43', fontWeight: 530, lineHeightMultiplier: 1.35, scale: 0.60 },
      annotationStyle: { color: '#645c4f', fontWeight: 510, lineHeightMultiplier: 1.35, scale: 0.54 },
      sourceStyle: { color: '#6e6454', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
      footerStyle: { color: '#443d32', fontWeight: 660, lineColor: 'rgba(130, 116, 93, 0.30)' },
      watermarkStyle: { color: '#7d6f5d', signatureOpacity: 0.26, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
      spacingScale: 1.04,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
    iphoneNeonNight: {
      background: { type: 'gradient', from: '#05050f', to: '#140d35' },
      card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
      quoteStyle: { color: '#e8fbff', fontWeight: 790, lineHeightMultiplier: 1.28, quoteScale: 1.08 },
      translationStyle: { color: '#bff4ff', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
      annotationStyle: { color: '#a8e7f3', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
      sourceStyle: { color: '#9fd6e2', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
      footerStyle: { color: '#d8f8ff', fontWeight: 660, lineColor: 'rgba(126, 224, 255, 0.34)' },
      watermarkStyle: { color: '#8ee9ff', signatureOpacity: 0.28, cornerOpacity: 0.20, backgroundOpacity: 0.08 },
      spacingScale: 1.04,
      contentWidthRatio: 0.84,
      texture: { type: 'none' },
    },
      iphoneFilmGrain: {
        background: { type: 'gradient', from: '#d7d9de', to: '#c7cbd3' },
        card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
        quoteStyle: { color: '#232933', fontWeight: 770, lineHeightMultiplier: 1.28, quoteScale: 1.03 },
        translationStyle: { color: '#434d5c', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
        annotationStyle: { color: '#556071', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
        sourceStyle: { color: '#626d7d', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
        footerStyle: { color: '#303848', fontWeight: 660, lineColor: 'rgba(106, 120, 142, 0.28)' },
        watermarkStyle: { color: '#6f7d95', signatureOpacity: 0.25, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
        spacingScale: 1.02,
        contentWidthRatio: 0.84,
        texture: { type: 'none' },
      },
      iphoneAurora: {
        background: { type: 'gradient', from: '#061420', to: '#123a3f' },
        card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
        quoteStyle: { color: '#f2fbff', fontWeight: 790, lineHeightMultiplier: 1.28, quoteScale: 1.08 },
        translationStyle: { color: '#ccecf2', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
        annotationStyle: { color: '#b8dfe4', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
        sourceStyle: { color: '#a9cdd3', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
        footerStyle: { color: '#e2f6ff', fontWeight: 660, lineColor: 'rgba(122, 186, 200, 0.32)' },
        watermarkStyle: { color: '#c6eef2', signatureOpacity: 0.28, cornerOpacity: 0.20, backgroundOpacity: 0.07 },
        spacingScale: 1.04,
        contentWidthRatio: 0.84,
        texture: { type: 'none' },
      },
      iphoneBlushDawn: {
        background: { type: 'gradient', from: '#fff1f3', to: '#f6e3ea' },
        card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
        quoteStyle: { color: '#2a1f25', fontWeight: 770, lineHeightMultiplier: 1.29, quoteScale: 1.03 },
        translationStyle: { color: '#49353f', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
        annotationStyle: { color: '#5a424c', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
        sourceStyle: { color: '#604751', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
        footerStyle: { color: '#3d2d35', fontWeight: 660, lineColor: 'rgba(125, 84, 102, 0.26)' },
        watermarkStyle: { color: '#b57987', signatureOpacity: 0.26, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
        spacingScale: 1.03,
        contentWidthRatio: 0.84,
        texture: { type: 'none' },
      },
      iphoneGraphite: {
        background: { type: 'gradient', from: '#0b0d12', to: '#1b202a' },
        card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
        quoteStyle: { color: '#eef1f7', fontWeight: 790, lineHeightMultiplier: 1.28, quoteScale: 1.07 },
        translationStyle: { color: '#c7d0dd', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
        annotationStyle: { color: '#b2bbc9', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
        sourceStyle: { color: '#a4adba', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
        footerStyle: { color: '#e1e7f2', fontWeight: 660, lineColor: 'rgba(140, 150, 175, 0.28)' },
        watermarkStyle: { color: '#c3ccd8', signatureOpacity: 0.28, cornerOpacity: 0.20, backgroundOpacity: 0.07 },
        spacingScale: 1.03,
        contentWidthRatio: 0.84,
        texture: { type: 'none' },
      },
      iphoneSageMist: {
        background: { type: 'gradient', from: '#f2f6f1', to: '#e4eee7' },
        card: { bg: 'transparent', radius: 0, shadow: 'rgba(0, 0, 0, 0)', borderColor: '', borderWidth: 0 },
        quoteStyle: { color: '#1f2b26', fontWeight: 770, lineHeightMultiplier: 1.29, quoteScale: 1.03 },
        translationStyle: { color: '#3b4a44', fontWeight: 540, lineHeightMultiplier: 1.35, scale: 0.60 },
        annotationStyle: { color: '#4c5a53', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.54 },
        sourceStyle: { color: '#54625a', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.41 },
        footerStyle: { color: '#2f3b34', fontWeight: 660, lineColor: 'rgba(90, 112, 96, 0.26)' },
        watermarkStyle: { color: '#6c8b79', signatureOpacity: 0.24, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
        spacingScale: 1.03,
        contentWidthRatio: 0.84,
        texture: { type: 'none' },
      },
    hordSignature: {
      background: { type: 'gradient', from: '#2c2c54', to: '#40407a' },
      card: { bg: '#f7f8ff', radius: 16, shadow: 'rgba(28, 33, 88, 0.2)' },
      quoteStyle: { color: '#1f2752', fontWeight: 820, lineHeightMultiplier: 1.22, quoteScale: 1.12 },
      translationStyle: { color: '#3c477d', fontWeight: 560, lineHeightMultiplier: 1.30, scale: 0.66 },
      annotationStyle: { color: '#555e8f', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.55 },
      sourceStyle: { color: '#49507b', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#2c2c54', fontWeight: 660, lineColor: '#cfd3ea' },
      watermarkStyle: { color: '#40407a', signatureOpacity: 0.30, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
      spacingScale: 1.05,
      contentWidthRatio: 0.90,
      texture: { type: 'none' },
    },
    editorial: {
      background: { type: 'gradient', from: '#f7f4ed', to: '#ece6da' },
      card: { bg: '#fffdf7', radius: 16, shadow: 'rgba(95, 74, 36, 0.16)' },
      quoteStyle: { color: '#2f2720', fontWeight: 700, lineHeightMultiplier: 1.34, quoteScale: 0.92 },
      translationStyle: { color: '#564638', fontWeight: 500, lineHeightMultiplier: 1.38, scale: 0.61 },
      annotationStyle: { color: '#6d5c4b', fontWeight: 500, lineHeightMultiplier: 1.38, scale: 0.55 },
      sourceStyle: { color: '#6f604f', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#3d3127', fontWeight: 650, lineColor: '#e0d5c4' },
      watermarkStyle: { color: '#6f604f', signatureOpacity: 0.30, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
      spacingScale: 1.08,
      contentWidthRatio: 0.80,
      texture: { type: 'none' },
    },
    gradientSoft: {
      background: { type: 'gradient', from: '#eef2ff', to: '#f4ecff' },
      card: { bg: '#ffffff', radius: 16, shadow: 'rgba(117, 95, 184, 0.16)' },
      quoteStyle: { color: '#25234d', fontWeight: 760, lineHeightMultiplier: 1.27, quoteScale: 0.98 },
      translationStyle: { color: '#554d84', fontWeight: 530, lineHeightMultiplier: 1.35, scale: 0.62 },
      annotationStyle: { color: '#66618f', fontWeight: 510, lineHeightMultiplier: 1.35, scale: 0.55 },
      sourceStyle: { color: '#66618e', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#39386c', fontWeight: 650, lineColor: '#e3dcfa' },
      watermarkStyle: { color: '#7062b3', signatureOpacity: 0.30, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
      spacingScale: 1.0,
      contentWidthRatio: 0.85,
      texture: { type: 'none' },
    },
    boldImpact: {
      background: { type: 'gradient', from: '#0f122c', to: '#2b1b53' },
      card: { bg: '#161a3a', radius: 16, shadow: 'rgba(5, 7, 24, 0.34)' },
      quoteStyle: { color: '#f5f7ff', fontWeight: 860, lineHeightMultiplier: 1.2, quoteScale: 1.1 },
      translationStyle: { color: '#d6dcff', fontWeight: 560, lineHeightMultiplier: 1.28, scale: 0.60 },
      annotationStyle: { color: '#c2c9ee', fontWeight: 530, lineHeightMultiplier: 1.3, scale: 0.55 },
      sourceStyle: { color: '#c1caec', fontWeight: 520, lineHeightMultiplier: 1.28, scale: 0.42 },
      footerStyle: { color: '#e2e7ff', fontWeight: 650, lineColor: '#323a69' },
      watermarkStyle: { color: '#d0d8ff', signatureOpacity: 0.30, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
      spacingScale: 0.9,
      contentWidthRatio: 0.87,
      texture: { type: 'none' },
    },
      letterClassic: {
        background: { type: 'gradient', from: '#f4efe4', to: '#efe7d8' },
        card: { bg: '#fffaf1', radius: 16, shadow: 'rgba(92, 72, 36, 0.16)', borderColor: '#d8c7a8', borderWidth: 1.2 },
        quoteStyle: { color: '#2f2a24', fontWeight: 700, lineHeightMultiplier: 1.32, quoteScale: 0.96 },
        translationStyle: { color: '#52473b', fontWeight: 520, lineHeightMultiplier: 1.36, scale: 0.60 },
        annotationStyle: { color: '#6a5d4d', fontWeight: 510, lineHeightMultiplier: 1.36, scale: 0.55 },
        sourceStyle: { color: '#6f604f', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
        footerStyle: { color: '#4a3e33', fontWeight: 650, lineColor: '#d8c7a8' },
        watermarkStyle: { color: '#6f604f', signatureOpacity: 0.24, cornerOpacity: 0.16, backgroundOpacity: 0.05 },
        spacingScale: 1.02,
        contentWidthRatio: 0.84,
        texture: { type: 'letter' },
      },
      letterCotton: {
        background: { type: 'gradient', from: '#f8f3ea', to: '#f1e8d8' },
        card: { bg: '#fffaf2', radius: 16, shadow: 'rgba(94, 76, 44, 0.16)', borderColor: '#decfb4', borderWidth: 1.1 },
        quoteStyle: { color: '#2f2a24', fontWeight: 710, lineHeightMultiplier: 1.32, quoteScale: 0.96 },
        translationStyle: { color: '#52473b', fontWeight: 520, lineHeightMultiplier: 1.36, scale: 0.60 },
        annotationStyle: { color: '#6a5d4d', fontWeight: 510, lineHeightMultiplier: 1.36, scale: 0.55 },
        sourceStyle: { color: '#6f604f', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
        footerStyle: { color: '#4a3e33', fontWeight: 650, lineColor: '#d9c9ad' },
        watermarkStyle: { color: '#6f604f', signatureOpacity: 0.22, cornerOpacity: 0.14, backgroundOpacity: 0.04 },
        spacingScale: 1.03,
        contentWidthRatio: 0.84,
        texture: { type: 'letter' },
      },
    parchment: {
      background: { type: 'gradient', from: '#e7d3a8', to: '#d6bf8d' },
      card: { bg: '#f1dfb5', radius: 16, shadow: 'rgba(92, 62, 17, 0.2)', borderColor: '#b89863', borderWidth: 1.4 },
      quoteStyle: { color: '#3a2c1d', fontWeight: 690, lineHeightMultiplier: 1.34, quoteScale: 0.92 },
      translationStyle: { color: '#5b4730', fontWeight: 520, lineHeightMultiplier: 1.36, scale: 0.6 },
      annotationStyle: { color: '#664f37', fontWeight: 500, lineHeightMultiplier: 1.36, scale: 0.55 },
      sourceStyle: { color: '#755a3c', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#523e29', fontWeight: 650, lineColor: '#b89863' },
      watermarkStyle: { color: '#6f5335', signatureOpacity: 0.22, cornerOpacity: 0.14, backgroundOpacity: 0.04 },
      spacingScale: 1.04,
      contentWidthRatio: 0.82,
      texture: { type: 'parchment' },
    },
    inkJournal: {
      background: { type: 'gradient', from: '#edf1f4', to: '#e4e9ee' },
      card: { bg: '#f8fbfe', radius: 16, shadow: 'rgba(55, 65, 81, 0.14)', borderColor: '#cfd9e4', borderWidth: 1.1 },
      quoteStyle: { color: '#202a36', fontWeight: 720, lineHeightMultiplier: 1.3, quoteScale: 0.97 },
      translationStyle: { color: '#445364', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.61 },
      annotationStyle: { color: '#526173', fontWeight: 510, lineHeightMultiplier: 1.34, scale: 0.55 },
      sourceStyle: { color: '#5f6d7d', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#37475a', fontWeight: 650, lineColor: '#c4d0dd' },
      watermarkStyle: { color: '#5b6a7a', signatureOpacity: 0.22, cornerOpacity: 0.14, backgroundOpacity: 0.05 },
      spacingScale: 1.0,
      contentWidthRatio: 0.85,
      texture: { type: 'journal' },
    },
    typewriter: {
      background: { type: 'gradient', from: '#dbdcd4', to: '#d0d2c9' },
      card: { bg: '#f1f2eb', radius: 14, shadow: 'rgba(43, 45, 35, 0.12)', borderColor: '#b8bba8', borderWidth: 1.2 },
      quoteStyle: { color: '#2f312e', fontWeight: 690, lineHeightMultiplier: 1.3, quoteScale: 0.95 },
      translationStyle: { color: '#4b4f47', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.6 },
      annotationStyle: { color: '#5a5e55', fontWeight: 500, lineHeightMultiplier: 1.34, scale: 0.55 },
      sourceStyle: { color: '#63675f', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#4b4f47', fontWeight: 650, lineColor: '#b4b8aa' },
      watermarkStyle: { color: '#585d55', signatureOpacity: 0.2, cornerOpacity: 0.14, backgroundOpacity: 0.04 },
      spacingScale: 0.94,
      contentWidthRatio: 0.84,
      texture: { type: 'typewriter' },
    },
    linenSoft: {
      background: { type: 'gradient', from: '#f7f5ee', to: '#ecefe6' },
      card: { bg: '#fffdf7', radius: 16, shadow: 'rgba(86, 78, 58, 0.14)', borderColor: '#e1d8c8', borderWidth: 1.1 },
      quoteStyle: { color: '#2d2a24', fontWeight: 720, lineHeightMultiplier: 1.32, quoteScale: 0.95 },
      translationStyle: { color: '#4f4a42', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.6 },
      annotationStyle: { color: '#5f594f', fontWeight: 500, lineHeightMultiplier: 1.34, scale: 0.55 },
      sourceStyle: { color: '#6a6257', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#4a443b', fontWeight: 650, lineColor: '#d6cbbb' },
      watermarkStyle: { color: '#6f6557', signatureOpacity: 0.22, cornerOpacity: 0.14, backgroundOpacity: 0.04 },
      spacingScale: 1.0,
      contentWidthRatio: 0.85,
      texture: { type: 'linen' },
    },
    canvasStone: {
      background: { type: 'gradient', from: '#eef2f7', to: '#e1e7ee' },
      card: { bg: '#f7f8fb', radius: 16, shadow: 'rgba(54, 64, 80, 0.14)', borderColor: '#cfd7e2', borderWidth: 1.1 },
      quoteStyle: { color: '#253041', fontWeight: 740, lineHeightMultiplier: 1.3, quoteScale: 0.96 },
      translationStyle: { color: '#435165', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.6 },
      annotationStyle: { color: '#536173', fontWeight: 500, lineHeightMultiplier: 1.34, scale: 0.55 },
      sourceStyle: { color: '#5f6e80', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
      footerStyle: { color: '#3b4a5c', fontWeight: 650, lineColor: '#c3ccd8' },
      watermarkStyle: { color: '#5a6a80', signatureOpacity: 0.22, cornerOpacity: 0.14, backgroundOpacity: 0.04 },
      spacingScale: 0.98,
      contentWidthRatio: 0.85,
      texture: { type: 'canvas' },
    },
      noirGrain: {
        background: { type: 'gradient', from: '#0d111b', to: '#171c2c' },
        card: { bg: '#161b2c', radius: 16, shadow: 'rgba(3, 5, 15, 0.34)', borderColor: '#2a3146', borderWidth: 1 },
        quoteStyle: { color: '#f1f4ff', fontWeight: 800, lineHeightMultiplier: 1.24, quoteScale: 1.04 },
        translationStyle: { color: '#c7d0e6', fontWeight: 540, lineHeightMultiplier: 1.3, scale: 0.6 },
        annotationStyle: { color: '#b4bed6', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.55 },
        sourceStyle: { color: '#aab4cc', fontWeight: 520, lineHeightMultiplier: 1.28, scale: 0.42 },
        footerStyle: { color: '#d8e0f2', fontWeight: 650, lineColor: '#2f3853' },
        watermarkStyle: { color: '#c7d0e6', signatureOpacity: 0.26, cornerOpacity: 0.18, backgroundOpacity: 0.06 },
        spacingScale: 0.94,
        contentWidthRatio: 0.86,
        texture: { type: 'grain' },
      },
      recycledPaper: {
        background: { type: 'gradient', from: '#f4f1e8', to: '#e9e2d7' },
        card: { bg: '#fffaf0', radius: 16, shadow: 'rgba(88, 78, 60, 0.16)', borderColor: '#d6cdbd', borderWidth: 1.1 },
        quoteStyle: { color: '#2f2a23', fontWeight: 720, lineHeightMultiplier: 1.32, quoteScale: 0.95 },
        translationStyle: { color: '#534b40', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.6 },
        annotationStyle: { color: '#61574b', fontWeight: 500, lineHeightMultiplier: 1.35, scale: 0.55 },
        sourceStyle: { color: '#6b5f52', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
        footerStyle: { color: '#4a4036', fontWeight: 650, lineColor: '#d5cbbc' },
        watermarkStyle: { color: '#7a6c5c', signatureOpacity: 0.22, cornerOpacity: 0.16, backgroundOpacity: 0.05 },
        spacingScale: 1.02,
        contentWidthRatio: 0.85,
        texture: { type: 'speckle' },
      },
      blueprintGrid: {
        background: { type: 'gradient', from: '#e6f0ff', to: '#d9e6ff' },
        card: { bg: '#f8fbff', radius: 16, shadow: 'rgba(70, 90, 130, 0.14)', borderColor: '#c2d2ee', borderWidth: 1.1 },
        quoteStyle: { color: '#1c2e4a', fontWeight: 740, lineHeightMultiplier: 1.3, quoteScale: 0.97 },
        translationStyle: { color: '#3b4f6d', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.6 },
        annotationStyle: { color: '#4b5f7b', fontWeight: 500, lineHeightMultiplier: 1.34, scale: 0.55 },
        sourceStyle: { color: '#5a6d87', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
        footerStyle: { color: '#293b57', fontWeight: 650, lineColor: '#c7d6ee' },
        watermarkStyle: { color: '#5f79a6', signatureOpacity: 0.22, cornerOpacity: 0.16, backgroundOpacity: 0.05 },
        spacingScale: 1.0,
        contentWidthRatio: 0.85,
        texture: { type: 'grid' },
      },
      gridStudio: {
        background: { type: 'gradient', from: '#f1f6ff', to: '#e7f0ff' },
        card: { bg: '#ffffff', radius: 16, shadow: 'rgba(65, 90, 138, 0.14)', borderColor: '#cad9f2', borderWidth: 1.1 },
        quoteStyle: { color: '#1e2b45', fontWeight: 740, lineHeightMultiplier: 1.3, quoteScale: 0.98 },
        translationStyle: { color: '#3b4b66', fontWeight: 520, lineHeightMultiplier: 1.34, scale: 0.6 },
        annotationStyle: { color: '#4b5c77', fontWeight: 500, lineHeightMultiplier: 1.34, scale: 0.55 },
        sourceStyle: { color: '#5a6b86', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
        footerStyle: { color: '#26334b', fontWeight: 650, lineColor: '#c4d4f1' },
        watermarkStyle: { color: '#5f79a6', signatureOpacity: 0.22, cornerOpacity: 0.16, backgroundOpacity: 0.05 },
        spacingScale: 1.0,
        contentWidthRatio: 0.85,
        texture: { type: 'grid' },
      },
      sandstone: {
        background: { type: 'gradient', from: '#f2e6d5', to: '#e7d6c2' },
        card: { bg: '#fff3e4', radius: 16, shadow: 'rgba(96, 78, 54, 0.16)', borderColor: '#d8c3ab', borderWidth: 1.1 },
        quoteStyle: { color: '#2f2a22', fontWeight: 720, lineHeightMultiplier: 1.32, quoteScale: 0.95 },
        translationStyle: { color: '#534a40', fontWeight: 520, lineHeightMultiplier: 1.35, scale: 0.6 },
        annotationStyle: { color: '#61574b', fontWeight: 500, lineHeightMultiplier: 1.35, scale: 0.55 },
        sourceStyle: { color: '#6b5f52', fontWeight: 520, lineHeightMultiplier: 1.3, scale: 0.42 },
        footerStyle: { color: '#4a4036', fontWeight: 650, lineColor: '#d4c2ad' },
        watermarkStyle: { color: '#7a6c5c', signatureOpacity: 0.22, cornerOpacity: 0.16, backgroundOpacity: 0.05 },
        spacingScale: 1.01,
        contentWidthRatio: 0.85,
        texture: { type: 'fiber' },
      },
      midnightVelvet: {
        background: { type: 'gradient', from: '#0a1026', to: '#171f42' },
        card: { bg: '#141b36', radius: 16, shadow: 'rgba(2, 5, 18, 0.42)', borderColor: '#2f3a66', borderWidth: 1 },
        quoteStyle: { color: '#edf2ff', fontWeight: 800, lineHeightMultiplier: 1.24, quoteScale: 1.04 },
        translationStyle: { color: '#cdd8f6', fontWeight: 550, lineHeightMultiplier: 1.32, scale: 0.61 },
        annotationStyle: { color: '#b8c4e6', fontWeight: 530, lineHeightMultiplier: 1.33, scale: 0.55 },
        sourceStyle: { color: '#aebadb', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#dde5ff', fontWeight: 660, lineColor: '#313d6f' },
        watermarkStyle: { color: '#d8e1ff', signatureOpacity: 0.36, cornerOpacity: 0.24, backgroundOpacity: 0.08 },
        spacingScale: 0.95,
        contentWidthRatio: 0.90,
        texture: { type: 'none' },
      },
      carbonCode: {
        background: { type: 'gradient', from: '#0a0f14', to: '#1a232d' },
        card: { bg: '#111a24', radius: 16, shadow: 'rgba(1, 4, 8, 0.44)', borderColor: '#2a3a49', borderWidth: 1 },
        quoteStyle: { color: '#eff6ff', fontWeight: 790, lineHeightMultiplier: 1.25, quoteScale: 1.03 },
        translationStyle: { color: '#c9d8e6', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.61 },
        annotationStyle: { color: '#b2c4d4', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#9eb0c1', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#d9e8f7', fontWeight: 655, lineColor: '#2d3e51' },
        watermarkStyle: { color: '#d4e8f6', signatureOpacity: 0.34, cornerOpacity: 0.22, backgroundOpacity: 0.07 },
        spacingScale: 0.96,
        contentWidthRatio: 0.90,
        texture: { type: 'grain' },
      },
      obsidianMist: {
        background: { type: 'gradient', from: '#0d1220', to: '#25263f' },
        card: { bg: '#181d33', radius: 16, shadow: 'rgba(3, 6, 20, 0.42)', borderColor: '#32395f', borderWidth: 1 },
        quoteStyle: { color: '#f2f4ff', fontWeight: 800, lineHeightMultiplier: 1.24, quoteScale: 1.04 },
        translationStyle: { color: '#d6dbf1', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.60 },
        annotationStyle: { color: '#bfc6e2', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#b2bbd6', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#e3e7ff', fontWeight: 655, lineColor: '#3a426b' },
        watermarkStyle: { color: '#d9ddff', signatureOpacity: 0.34, cornerOpacity: 0.22, backgroundOpacity: 0.07 },
        spacingScale: 0.95,
        contentWidthRatio: 0.90,
        texture: { type: 'none' },
      },
      forestNocturne: {
        background: { type: 'gradient', from: '#081716', to: '#173430' },
        card: { bg: '#102723', radius: 16, shadow: 'rgba(1, 7, 6, 0.42)', borderColor: '#2f5a52', borderWidth: 1 },
        quoteStyle: { color: '#ecfbf7', fontWeight: 790, lineHeightMultiplier: 1.25, quoteScale: 1.02 },
        translationStyle: { color: '#c8e7de', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.60 },
        annotationStyle: { color: '#b5d8cd', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#a4c9be', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#d7f0e8', fontWeight: 655, lineColor: '#2f6258' },
        watermarkStyle: { color: '#d0efe6', signatureOpacity: 0.34, cornerOpacity: 0.22, backgroundOpacity: 0.07 },
        spacingScale: 0.96,
        contentWidthRatio: 0.90,
        texture: { type: 'none' },
      },
      graphiteWeave: {
        background: { type: 'gradient', from: '#0b0f1a', to: '#1f2937' },
        card: { bg: '#111827', radius: 16, shadow: 'rgba(2, 6, 15, 0.44)', borderColor: '#334155', borderWidth: 1 },
        quoteStyle: { color: '#ecf2ff', fontWeight: 800, lineHeightMultiplier: 1.24, quoteScale: 1.04 },
        translationStyle: { color: '#c8d6ef', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.61 },
        annotationStyle: { color: '#b3c3dd', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#a6b7d0', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#dce8ff', fontWeight: 655, lineColor: 'rgba(148,163,184,0.42)' },
        watermarkStyle: { color: '#d7e7ff', signatureOpacity: 0.35, cornerOpacity: 0.24, backgroundOpacity: 0.08 },
        spacingScale: 0.95,
        contentWidthRatio: 0.91,
        texture: { type: 'linen' },
      },
      nightCircuit: {
        background: { type: 'gradient', from: '#050b16', to: '#0f1a2d' },
        card: { bg: '#0b1426', radius: 16, shadow: 'rgba(2, 6, 18, 0.46)', borderColor: '#1e3a5f', borderWidth: 1 },
        quoteStyle: { color: '#e6f2ff', fontWeight: 790, lineHeightMultiplier: 1.25, quoteScale: 1.03 },
        translationStyle: { color: '#bfd8f7', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.61 },
        annotationStyle: { color: '#aac9eb', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#9fbcdd', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#d6ebff', fontWeight: 655, lineColor: 'rgba(96,165,250,0.38)' },
        watermarkStyle: { color: '#c9e6ff', signatureOpacity: 0.34, cornerOpacity: 0.24, backgroundOpacity: 0.08 },
        spacingScale: 0.96,
        contentWidthRatio: 0.91,
        texture: { type: 'grid', color: '#4b6f94' },
      },
      deepSpaceGrain: {
        background: { type: 'gradient', from: '#070817', to: '#161139' },
        card: { bg: '#0e1230', radius: 16, shadow: 'rgba(2, 4, 18, 0.48)', borderColor: '#2e3a7a', borderWidth: 1 },
        quoteStyle: { color: '#eef0ff', fontWeight: 800, lineHeightMultiplier: 1.24, quoteScale: 1.04 },
        translationStyle: { color: '#d0d5f5', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.60 },
        annotationStyle: { color: '#bcc3e8', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#acb4da', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#e0e5ff', fontWeight: 655, lineColor: 'rgba(129,140,248,0.40)' },
        watermarkStyle: { color: '#d8ddff', signatureOpacity: 0.35, cornerOpacity: 0.24, backgroundOpacity: 0.08 },
        spacingScale: 0.95,
        contentWidthRatio: 0.91,
        texture: { type: 'grain' },
      },
      eclipseAlloy: {
        background: { type: 'gradient', from: '#06080d', to: '#1a202b' },
        card: { bg: '#0c1118', radius: 16, shadow: 'rgba(2, 4, 10, 0.52)', borderColor: '#2f3949', borderWidth: 1 },
        quoteStyle: { color: '#edf3ff', fontWeight: 800, lineHeightMultiplier: 1.24, quoteScale: 1.03 },
        translationStyle: { color: '#cad6ea', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.60 },
        annotationStyle: { color: '#b7c4d9', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#a6b3c7', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#dce8ff', fontWeight: 655, lineColor: 'rgba(148,163,184,0.40)' },
        watermarkStyle: { color: '#d8e6ff', signatureOpacity: 0.35, cornerOpacity: 0.24, backgroundOpacity: 0.08 },
        spacingScale: 0.95,
        contentWidthRatio: 0.92,
        texture: { type: 'linen' },
      },
      abyssMatrix: {
        background: { type: 'gradient', from: '#050910', to: '#111d33' },
        card: { bg: '#091425', radius: 16, shadow: 'rgba(2, 6, 16, 0.50)', borderColor: '#1c3354', borderWidth: 1 },
        quoteStyle: { color: '#eaf2ff', fontWeight: 790, lineHeightMultiplier: 1.25, quoteScale: 1.03 },
        translationStyle: { color: '#bfd3f2', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.61 },
        annotationStyle: { color: '#a8c2e6', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#9bb4d7', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#d6e7ff', fontWeight: 655, lineColor: 'rgba(96,165,250,0.40)' },
        watermarkStyle: { color: '#cfe2ff', signatureOpacity: 0.35, cornerOpacity: 0.24, backgroundOpacity: 0.08 },
        spacingScale: 0.95,
        contentWidthRatio: 0.92,
        texture: { type: 'grid', color: '#456c98' },
      },
      violetNoctis: {
        background: { type: 'gradient', from: '#0a0a1a', to: '#24194a' },
        card: { bg: '#130f31', radius: 16, shadow: 'rgba(5, 4, 20, 0.52)', borderColor: '#3a3180', borderWidth: 1 },
        quoteStyle: { color: '#f0eeff', fontWeight: 800, lineHeightMultiplier: 1.24, quoteScale: 1.04 },
        translationStyle: { color: '#d3cef6', fontWeight: 540, lineHeightMultiplier: 1.32, scale: 0.60 },
        annotationStyle: { color: '#c0b9ea', fontWeight: 520, lineHeightMultiplier: 1.32, scale: 0.55 },
        sourceStyle: { color: '#b0a9dc', fontWeight: 520, lineHeightMultiplier: 1.30, scale: 0.42 },
        footerStyle: { color: '#e2dcff', fontWeight: 655, lineColor: 'rgba(167,139,250,0.42)' },
        watermarkStyle: { color: '#ddd7ff', signatureOpacity: 0.35, cornerOpacity: 0.24, backgroundOpacity: 0.08 },
        spacingScale: 0.95,
        contentWidthRatio: 0.92,
        texture: { type: 'grain' },
      },
    };

  function clamp(v, min, max){
    return Math.max(min, Math.min(max, v));
  }

  function normalizeFeatures(features){
    const out = Object.assign({}, DEFAULT_FEATURES, features || {});
    out.advancedTemplates = !!out.advancedTemplates;
    out.backgroundWatermark = !!out.backgroundWatermark;
    out.highResolutionExport = !!out.highResolutionExport;
    return out;
  }

  function normalizeSettings(settings){
    const raw = Object.assign({}, DEFAULT_SETTINGS, settings || {});
    const out = Object.assign({}, raw);
    const caps = (raw.capabilities && typeof raw.capabilities === 'object') ? raw.capabilities : null;
    out.capabilities = caps;
    out.features = normalizeFeatures(raw.features);
    out.showTranslation = !!raw.showTranslation;
    out.showAnnotation = !!raw.showAnnotation;
    out.showSource = !!raw.showSource;
    out.showWatermark = true;
    out.isProUser = !!raw.isProUser;
    out.allowAutoHideSecondary = !!raw.allowAutoHideSecondary;
    out.debugLayout = !!raw.debugLayout;
    out.density = ['compact', 'standard', 'airy'].includes(raw.density) ? raw.density : 'standard';
    out.fontAdjust = clamp(Number(raw.fontAdjust || 0), -24, 16);
    out.textSizeRange = ['compact', 'standard', 'roomy'].includes(raw.textSizeRange) ? raw.textSizeRange : 'standard';
    out.mainFont = MAIN_FONT_OPTIONS[raw.mainFont] ? raw.mainFont : 'inter';
    out.cjkFont = CJK_FONT_OPTIONS[raw.cjkFont] ? raw.cjkFont : 'notoSansSC';
    out.enhanceContent = raw.enhanceContent !== false;
    out.shortFillLevel = ['light', 'medium', 'strong'].includes(raw.shortFillLevel) ? raw.shortFillLevel : 'medium';
    out.lockscreenTuning = raw.lockscreenTuning !== false;
    out.annotationStyle = raw.annotationStyle === 'emphasis' ? 'emphasis' : 'normal';
    out.previewScaleMode = String(raw.previewScaleMode || 'fit');
    out.previewFit = raw.previewFit !== false;
    out.previewMaxHeight = Number(raw.previewMaxHeight || 0);
    out.previewMaxWidth = Number(raw.previewMaxWidth || 0);
    out.previewSafeArea = raw.previewSafeArea !== false;
    out.desktopFrame = ['auto', 'none', 'card'].includes(String(raw.desktopFrame || 'auto')) ? String(raw.desktopFrame || 'auto') : 'auto';
    out.desktopAnchor = ['left-top', 'left-middle', 'left-bottom', 'center-top', 'center', 'center-bottom', 'right-top', 'right-middle', 'right-bottom'].includes(String(raw.desktopAnchor || 'left-middle')) ? String(raw.desktopAnchor || 'left-middle') : 'left-middle';
    out.desktopTextWidth = ['narrow', 'standard', 'wide'].includes(String(raw.desktopTextWidth || 'standard')) ? String(raw.desktopTextWidth || 'standard') : 'standard';
    out.desktopTaskbarSafe = raw.desktopTaskbarSafe !== false;
    out.desktopTaskbarPx = clamp(Number(raw.desktopTaskbarPx || 112), 0, 240);
    out.customWidth = clamp(Math.round(Number(raw.customWidth || 2560)), 720, 8192);
    out.customHeight = clamp(Math.round(Number(raw.customHeight || 1440)), 720, 8192);
    out.filenamePattern = String(raw.filenamePattern || 'hord-{date}-{template}-{ratio}').trim() || 'hord-{date}-{template}-{ratio}';
    out.quoteTextOverride = String(raw.quoteTextOverride || '').replace(/\r/g, '');
    out.translationTextOverride = String(raw.translationTextOverride || '').replace(/\r/g, '');
    out.sourceTextOverride = String(raw.sourceTextOverride || '').trim();
    out.annotationTextOverride = String(raw.annotationTextOverride || '').replace(/\r/g, '');
    if(out.ratio === 'iphone17') out.ratio = 'iphone';
    if(!RATIO_MAP[out.ratio] && out.ratio !== 'custom') out.ratio = DEFAULT_SETTINGS.ratio;
    if(out.template === 'boldImpact') out.template = 'hordSignature';
    if(!TEMPLATE_CONFIG[out.template]) out.template = DEFAULT_SETTINGS.template;
    if(String(out.template || '').startsWith(IPHONE_TEMPLATE_PREFIX)) out.ratio = 'iphone';
    if(out.ratio === '16:9' || out.ratio === '4k' || out.ratio === 'custom'){
      if(!String(raw.desktopTextWidth || '').trim()) out.desktopTextWidth = 'wide';
      if(!String(raw.desktopAnchor || '').trim()) out.desktopAnchor = 'left-middle';
      if(!String(raw.desktopFrame || '').trim()) out.desktopFrame = 'none';
    }else{
      out.desktopFrame = 'none';
      out.desktopAnchor = 'left-middle';
      out.desktopTextWidth = 'standard';
    }
    if(!WATERMARK_MODES.includes(out.watermarkMode)) out.watermarkMode = DEFAULT_SETTINGS.watermarkMode;

    // Capability enforcement (engine-level):
    // advancedTemplates must be unlocked via capabilities; UI disable alone is not sufficient.
    const advancedTemplates = !!(caps && caps.advancedTemplates === true);
    if(!advancedTemplates){
      if(out.template !== 'light') out.template = 'light';
      out.watermarkMode = 'signature';
    }
    return out;
  }

  function getUiState(rawSettings){
    const settings = normalizeSettings(rawSettings);
    return {
      settings,
      features: settings.features,
      allowedTemplates: Object.keys(TEMPLATE_CONFIG),
      allowedWatermarkModes: WATERMARK_MODES.slice(),
      proTemplateKeys: PRO_TEMPLATE_KEYS.slice(),
      mainFontOptions: Object.keys(MAIN_FONT_OPTIONS),
      cjkFontOptions: Object.keys(CJK_FONT_OPTIONS),
      policyNote: 'Templates/watermark modes are enforced by capabilities.',
    };
  }

  function getFontStacks(settings){
    const s = normalizeSettings(settings || {});
    const main = MAIN_FONT_OPTIONS[s.mainFont] || MAIN_FONT_OPTIONS.inter;
    const cjk = CJK_FONT_OPTIONS[s.cjkFont] || CJK_FONT_OPTIONS.notoSansSC;
    const quote = `${main.stack},${cjk.stack}`;
    const body = cjk.stack;
    const brand = `${FONT_STACK_BRAND},${cjk.stack}`;
    return {
      mainKey: s.mainFont,
      cjkKey: s.cjkFont,
      quote,
      body,
      brand,
      loadFamilies: [main.primary, cjk.primary],
    };
  }

  function resolveCanvasDims(settings){
    const s = normalizeSettings(settings || {});
    if(s.ratio === 'custom'){
      return {
        width: clamp(Math.round(Number(s.customWidth || 2560)), 720, 8192),
        height: clamp(Math.round(Number(s.customHeight || 1440)), 720, 8192),
      };
    }
    return RATIO_MAP[s.ratio] || RATIO_MAP['1:1'];
  }

  function resolveLayoutKey(settings, dims){
    const s = normalizeSettings(settings || {});
    if(s.ratio !== 'custom') return s.ratio;
    const w = Number(dims?.width || 1);
    const h = Number(dims?.height || 1);
    const ar = w / Math.max(1, h);
    if(ar >= 1.45) return '16:9';
    if(ar >= 1.12) return '3:4';
    if(ar <= 0.62) return 'iphone';
    if(ar <= 0.85) return '4:5';
    return '1:1';
  }

  async function ensureFontsLoaded(settings){
    try{
      if(!document?.fonts?.load) return;
      const stacks = getFontStacks(settings);
      const loaders = [];
      for(const fam of stacks.loadFamilies){
        loaders.push(document.fonts.load(`700 40px "${fam}"`));
        loaders.push(document.fonts.load(`500 28px "${fam}"`));
      }
      await Promise.allSettled(loaders);
    }catch(_){
      // ignore; canvas will fallback to available fonts
    }
  }

  function calculateFontSize(text, containerWidth, containerHeight){
    const baseSize = containerWidth / 12;
    const lengthFactor = String(text || '').length / 100;
    const next = baseSize - (lengthFactor * 2);
    const floor = Math.max(18, containerHeight * 0.08);
    const ceil = Math.min(Math.max(floor, containerHeight * 0.30), 72);
    return clamp(next, floor, ceil);
  }

  function getDomainText(url){
    const raw = String(url || '').trim();
    if(!raw) return '';
    try{
      return new URL(raw).hostname.replace(/^www\./i, '');
    }catch(_){
      return '';
    }
  }

  function toReadableSource(text){
    const raw = String(text || '').trim();
    if(!raw) return '';
    const middleEllipsis = (input, max = 52)=>{
      const s = String(input || '').trim();
      if(s.length <= max) return s;
      const head = Math.max(12, Math.floor(max * 0.58));
      const tail = Math.max(8, max - head - 3);
      return `${s.slice(0, head)}...${s.slice(-tail)}`;
    };
    try{
      const u = new URL(raw);
      const host = u.hostname.replace(/^www\./i, '');
      const path = (u.pathname || '/').replace(/\/+$/, '');
      if(!path || path === '/') return middleEllipsis(host, 46);
      const seg = path.split('/').filter(Boolean);
      if(seg.length <= 2) return middleEllipsis(`${host}${path}`, 52);
      const last = String(seg[seg.length - 1] || '').slice(0, 18);
      return middleEllipsis(`${host}/${seg[0]}/.../${last}`, 52);
    }catch(_){
      return middleEllipsis(raw, 48);
    }
  }

  function roundedRectPath(ctx, x, y, w, h, r){
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function fillBackground(ctx, width, height, background){
    if(background?.type === 'gradient'){
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, background.from || '#f8fafc');
      grad.addColorStop(1, background.to || '#eef2ff');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      return;
    }
    ctx.fillStyle = background?.color || '#f8fafc';
    ctx.fillRect(0, 0, width, height);
  }

  function drawPaperTexture(ctx, card, texture){
    const type = texture?.type || 'none';
    if(type === 'none') return;
    ctx.save();
    roundedRectPath(ctx, card.x, card.y, card.w, card.h, card.r);
    ctx.clip();

    if(type === 'letter'){
      ctx.globalAlpha = 0.12;
      for(let y = card.y + 18; y < card.y + card.h; y += 36){
        ctx.fillStyle = '#c7b08a';
        ctx.fillRect(card.x + 14, y, card.w - 28, 0.6);
      }
      ctx.globalAlpha = 0.05;
      for(let i = 0; i < 90; i += 1){
        const x = card.x + ((i * 37) % card.w);
        const y = card.y + ((i * 53 + (i % 7) * 11) % card.h);
        ctx.fillStyle = '#7c6c53';
        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }else if(type === 'parchment'){
      const g = ctx.createRadialGradient(card.x + card.w * 0.55, card.y + card.h * 0.45, card.w * 0.1, card.x + card.w * 0.5, card.y + card.h * 0.5, card.w * 0.7);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(121,84,35,0.18)');
      ctx.fillStyle = g;
      ctx.fillRect(card.x, card.y, card.w, card.h);
      ctx.globalAlpha = 0.08;
      for(let i = 0; i < 200; i += 1){
        const x = card.x + ((i * 29 + (i % 5) * 7) % card.w);
        const y = card.y + ((i * 47 + (i % 11) * 3) % card.h);
        ctx.fillStyle = '#6f5335';
        ctx.fillRect(x, y, 1, 1);
      }
    }else if(type === 'journal'){
      ctx.globalAlpha = 0.13;
      for(let y = card.y + 30; y < card.y + card.h; y += 34){
        ctx.fillStyle = '#a2b6c9';
        ctx.fillRect(card.x + 12, y, card.w - 24, 0.8);
      }
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#d16b6b';
      ctx.fillRect(card.x + 36, card.y + 18, 1.3, card.h - 36);
    }else if(type === 'typewriter'){
      ctx.globalAlpha = 0.1;
      for(let i = 0; i < 220; i += 1){
        const x = card.x + ((i * 31 + (i % 13) * 9) % card.w);
        const y = card.y + ((i * 59 + (i % 17) * 5) % card.h);
        const w = 0.5 + ((i % 7) / 6) * 1.5;
        const h = 0.5 + ((i % 5) / 4) * 1.5;
        ctx.fillStyle = '#6a6c62';
        ctx.fillRect(x, y, w, h);
      }
      ctx.globalAlpha = 0.06;
      for(let y = card.y + 16; y < card.y + card.h; y += 20){
        ctx.fillStyle = '#73766a';
        ctx.fillRect(card.x + 10, y, card.w - 20, 0.5);
      }
    }else if(type === 'linen'){
      ctx.globalAlpha = 0.1;
      for(let y = card.y + 14; y < card.y + card.h; y += 20){
        ctx.fillStyle = '#c8bba9';
        ctx.fillRect(card.x + 12, y, card.w - 24, 0.6);
      }
      ctx.globalAlpha = 0.07;
      for(let x = card.x + 12; x < card.x + card.w; x += 24){
        ctx.fillStyle = '#d8cfc1';
        ctx.fillRect(x, card.y + 12, 0.6, card.h - 24);
      }
      ctx.globalAlpha = 0.05;
      for(let i = 0; i < 120; i += 1){
        const x = card.x + ((i * 37 + (i % 5) * 11) % card.w);
        const y = card.y + ((i * 53 + (i % 7) * 9) % card.h);
        ctx.fillStyle = '#8f7f6a';
        ctx.fillRect(x, y, 0.8, 0.8);
      }
    }else if(type === 'canvas'){
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.translate(card.x, card.y);
      ctx.rotate(-0.35);
      for(let y = -card.w; y < card.h + card.w; y += 18){
        ctx.fillStyle = '#8d97a5';
        ctx.fillRect(-card.w, y, card.w * 3, 0.6);
      }
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.translate(card.x, card.y);
      ctx.rotate(0.35);
      for(let y = -card.w; y < card.h + card.w; y += 20){
        ctx.fillStyle = '#b1b9c3';
        ctx.fillRect(-card.w, y, card.w * 3, 0.6);
      }
      ctx.restore();
      }else if(type === 'grain'){
        ctx.globalAlpha = 0.12;
        for(let i = 0; i < 260; i += 1){
          const x = card.x + ((i * 29 + (i % 11) * 7) % card.w);
          const y = card.y + ((i * 41 + (i % 13) * 9) % card.h);
          const s = 0.6 + ((i % 5) / 5);
          ctx.fillStyle = '#c7d0e2';
          ctx.fillRect(x, y, s, s);
        }
      }else if(type === 'speckle'){
        const dotColor = texture?.color || '#9a8f7c';
        ctx.globalAlpha = 0.12;
        for(let i = 0; i < 240; i += 1){
          const x = card.x + ((i * 37 + (i % 7) * 11) % card.w);
          const y = card.y + ((i * 53 + (i % 9) * 7) % card.h);
          const s = 0.6 + ((i % 6) / 6);
          ctx.fillStyle = dotColor;
          ctx.fillRect(x, y, s, s);
        }
      }else if(type === 'grid'){
        const gridColor = texture?.color || '#b2c3dd';
        ctx.globalAlpha = 0.12;
        for(let y = card.y + 18; y < card.y + card.h; y += 26){
          ctx.fillStyle = gridColor;
          ctx.fillRect(card.x + 14, y, card.w - 28, 0.6);
        }
        ctx.globalAlpha = 0.08;
        for(let x = card.x + 16; x < card.x + card.w; x += 26){
          ctx.fillStyle = gridColor;
          ctx.fillRect(x, card.y + 14, 0.6, card.h - 28);
        }
      }else if(type === 'fiber'){
        const fiberColor = texture?.color || '#b19a84';
        ctx.globalAlpha = 0.08;
        ctx.lineWidth = 0.6;
        ctx.lineCap = 'round';
        for(let i = 0; i < 160; i += 1){
          const x = card.x + ((i * 41 + (i % 9) * 7) % card.w);
          const y = card.y + ((i * 59 + (i % 11) * 5) % card.h);
          const len = 10 + (i % 17);
          const angle = ((i % 7) - 3) * 0.08;
          ctx.strokeStyle = fiberColor;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

  function parseHexColor(input){
    const s = String(input || '').trim();
    const m = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if(!m) return null;
    const hex = m[1];
    if(hex.length === 3){
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  function relativeLuminance(rgb){
    const toLin = (v)=>{
      const x = v / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLin(rgb.r) + 0.7152 * toLin(rgb.g) + 0.0722 * toLin(rgb.b);
  }

  function contrastRatio(a, b){
    const c1 = parseHexColor(a);
    const c2 = parseHexColor(b);
    if(!c1 || !c2) return null;
    const l1 = relativeLuminance(c1);
    const l2 = relativeLuminance(c2);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function pickReadableColor(preferred, bgHex, light, dark, minRatio){
    const pref = String(preferred || '').trim();
    const bg = String(bgHex || '').trim();
    const target = Number(minRatio || 3.8);
    const prefRatio = contrastRatio(pref, bg);
    if(prefRatio && prefRatio >= target) return pref;
    const c = parseHexColor(bg);
    const bgLum = c ? relativeLuminance(c) : 0.5;
    return bgLum < 0.45 ? (light || '#eef2ff') : (dark || '#1f2937');
  }

  function getPhoneTextPalette(template){
    const bg = template?.background || {};
    const c1 = parseHexColor(bg.from || '');
    const c2 = parseHexColor(bg.to || '');
    const l1 = c1 ? relativeLuminance(c1) : 0.5;
    const l2 = c2 ? relativeLuminance(c2) : l1;
    const avg = (l1 + l2) / 2;
    const darkBg = avg < 0.42;
    if(darkBg){
      return {
        quote: '#eef2ff',
        translation: '#ced7f7',
        annotation: '#bcc8ea',
        source: '#aab7dc',
        line: 'rgba(180,190,230,0.34)',
        footer: '#d8e1ff',
        logo: 'rgba(216,225,255,0.34)',
      };
    }
    return {
      quote: '#141a2b',
      translation: '#2f3a55',
      annotation: '#46526c',
      source: '#55617a',
      line: 'rgba(76,90,122,0.26)',
      footer: '#2c3752',
      logo: 'rgba(52,64,92,0.32)',
    };
  }

  function collapseSpaces(s){
    return String(s || '').replace(/\s+/g, ' ').trim();
  }

  function squeezeLockscreenQuote(raw, lenTier){
    const text = collapseSpaces(raw);
    if(!text) return '';
    const capByTier = {
      short: 220,
      medium: 210,
      long: 188,
      xlong: 168,
    };
    const cap = capByTier[lenTier] || 188;
    if(text.length <= cap) return text;

    const sentenceParts = text.split(/(?<=[.!?;。！？；])\s+/).filter(Boolean);
    if(sentenceParts.length > 1){
      let joined = '';
      for(const part of sentenceParts){
        const next = joined ? (joined + ' ' + part) : part;
        if(next.length > cap) break;
        joined = next;
      }
      if(joined && joined.length >= Math.floor(cap * 0.62)){
        return joined.replace(/[;,:，、\s]+$/, '') + '...';
      }
    }

    const words = text.split(' ').filter(Boolean);
    if(words.length > 10){
      let out = '';
      for(const w of words){
        const next = out ? (out + ' ' + w) : w;
        if(next.length > cap) break;
        out = next;
      }
      if(out) return out.replace(/[\s,;:]+$/, '') + '...';
    }

    return text.slice(0, cap).replace(/[\s,;:，、]+$/, '') + '...';
  }

  function enhanceTextFlow(text){
    let next = String(text || '');
    next = next.replace(/\r/g, '\n');
    next = next.replace(/[ \t]+/g, ' ');
    next = next.replace(/\n{3,}/g, '\n\n');
    next = next.replace(/([,.;:!?])([^\s])/g, '$1 $2');
    next = next.replace(/\s+([,.;:!?])/g, '$1');
    return next.trim();
  }

  function tokenizeForWrap(line){
    if(!line) return [];
    const out = [];
    const chars = Array.from(line);
    let i = 0;
    while(i < chars.length){
      const ch = chars[i];
      if(/\s/.test(ch)){
        let j = i + 1;
        while(j < chars.length && /\s/.test(chars[j])) j += 1;
        out.push(chars.slice(i, j).join(''));
        i = j;
        continue;
      }
      if(/[A-Za-z0-9]/.test(ch)){
        let j = i + 1;
        while(j < chars.length && /[A-Za-z0-9'鈥檁-]/.test(chars[j])) j += 1;
        out.push(chars.slice(i, j).join(''));
        i = j;
        continue;
      }
      out.push(ch);
      i += 1;
    }
    return out;
  }

  function wrapByWidth(ctx, text, maxWidth){
    const source = String(text || '').replace(/\r/g, '');
    const rows = source.split('\n');
    const lines = [];

    for(const row of rows){
      const current = row || '';
      if(!current.trim()){
        lines.push('');
        continue;
      }

      const tokens = tokenizeForWrap(current);
      let buffer = '';
      for(const token of tokens){
        const next = buffer + token;
        if(!buffer || ctx.measureText(next).width <= maxWidth){
          buffer = next;
          continue;
        }

        const clean = buffer.trimEnd();
        lines.push(clean);
        const tokenTrim = token.trimStart();
        if(ctx.measureText(tokenTrim).width <= maxWidth){
          buffer = tokenTrim;
          continue;
        }

        let charBuf = '';
        for(const ch of Array.from(tokenTrim)){
          const attempt = charBuf + ch;
          if(!charBuf || ctx.measureText(attempt).width <= maxWidth){
            charBuf = attempt;
          }else{
            lines.push(charBuf.trimEnd());
            charBuf = ch;
          }
        }
        buffer = charBuf;
      }
      if(buffer) lines.push(buffer.trimEnd());
    }
    return lines.length ? lines : [''];
  }

  function truncateLineWordAware(line){
    const input = String(line || '').trimEnd();
    if(!input) return '...';
    const ws = input.lastIndexOf(' ');
    if(ws > 6) return `${input.slice(0, ws).trimEnd()}...`;
    return `${input.slice(0, Math.max(0, input.length - 1)).trimEnd()}...`;
  }

  function measureTextBlock(ctx, options){
    const text = String(options.text || '');
    const maxWidth = Math.max(1, Number(options.maxWidth) || 1);
    const maxLines = Math.max(1, Number(options.maxLines) || 1);
    const fontSize = Math.max(1, Number(options.fontSize) || 1);
    const lineHeightRatio = Number(options.lineHeightRatio || 1.3);
    const fontWeight = Number(options.fontWeight || 600);
    const fontFamily = options.fontFamily || FONT_STACK_BODY;
    const ellipsisMode = options.ellipsisMode || 'word';

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const wrapped = wrapByWidth(ctx, text, maxWidth);
    const overflow = wrapped.length > maxLines;
    const lines = wrapped.slice(0, maxLines);

    if(overflow && lines.length){
      lines[lines.length - 1] = ellipsisMode === 'char'
        ? (String(lines[lines.length - 1] || '').slice(0, Math.max(0, String(lines[lines.length - 1] || '').length - 1)) + '...')
        : truncateLineWordAware(lines[lines.length - 1]);
    }

    const lineHeight = Math.round(fontSize * lineHeightRatio);
    return {
      lines,
      lineHeight,
      height: lines.length * lineHeight,
      isOverflow: overflow,
      rawLineCount: wrapped.length,
    };
  }

  function fitPrimaryQuote(ctx, quoteText, cfg){
    const maxSize = clamp(cfg.maxSize, 18, 72);
    const minSize = Math.max(18, cfg.minSize);
    let size = maxSize;
    let metrics = null;
    while(size >= minSize){
      metrics = measureTextBlock(ctx, {
        text: quoteText,
        maxWidth: cfg.maxWidth,
        maxLines: cfg.maxLines,
        fontSize: size,
        lineHeightRatio: cfg.lineHeightRatio,
        fontWeight: cfg.fontWeight,
        fontFamily: cfg.fontFamily || FONT_STACK_QUOTE,
        ellipsisMode: 'word',
      });
      if(!metrics.isOverflow) break;
      size -= 2;
    }
    if(!metrics){
      metrics = measureTextBlock(ctx, {
        text: quoteText,
        maxWidth: cfg.maxWidth,
        maxLines: cfg.maxLines,
        fontSize: minSize,
        lineHeightRatio: cfg.lineHeightRatio,
        fontWeight: cfg.fontWeight,
        fontFamily: cfg.fontFamily || FONT_STACK_QUOTE,
        ellipsisMode: 'word',
      });
    }
    return { size: Math.max(minSize, size), metrics };
  }

  function fitSecondaryBlock(ctx, cfg){
    if(!cfg.text) return null;
    let size = clamp(cfg.startSize, cfg.minSize, cfg.maxSize);
    let maxLines = cfg.maxLines;
    let metrics = null;

    while(size >= cfg.minSize){
      metrics = measureTextBlock(ctx, {
        text: cfg.text,
        maxWidth: cfg.maxWidth,
        maxLines,
        fontSize: size,
        lineHeightRatio: cfg.lineHeightRatio,
        fontWeight: cfg.fontWeight,
        fontFamily: cfg.fontFamily,
        ellipsisMode: cfg.ellipsisMode || 'word',
      });
      if(metrics.height <= cfg.maxHeight) return { size, maxLines, metrics, hidden: false };
      size -= cfg.step;
    }

    while(maxLines > 1){
      maxLines -= 1;
      metrics = measureTextBlock(ctx, {
        text: cfg.text,
        maxWidth: cfg.maxWidth,
        maxLines,
        fontSize: cfg.minSize,
        lineHeightRatio: cfg.lineHeightRatio,
        fontWeight: cfg.fontWeight,
        fontFamily: cfg.fontFamily,
        ellipsisMode: cfg.ellipsisMode || 'word',
      });
      if(metrics.height <= cfg.maxHeight) return { size: cfg.minSize, maxLines, metrics, hidden: false };
    }

    if(cfg.allowAutoHide) return { hidden: true };

    metrics = measureTextBlock(ctx, {
      text: cfg.text,
      maxWidth: cfg.maxWidth,
      maxLines: 1,
      fontSize: cfg.minSize,
      lineHeightRatio: cfg.lineHeightRatio,
      fontWeight: cfg.fontWeight,
      fontFamily: cfg.fontFamily,
      ellipsisMode: cfg.ellipsisMode || 'word',
    });
    return { size: cfg.minSize, maxLines: 1, metrics, hidden: false };
  }

  function buildModules(sentence, settings){
    const isIphoneRatio = settings.ratio === 'iphone';
    const quoteOverride = String(settings.quoteTextOverride || '');
    const quoteRaw = String((quoteOverride && quoteOverride.trim() ? quoteOverride : (sentence?.text || ''))).trim();
    const quote = settings.enhanceContent ? enhanceTextFlow(quoteRaw) : quoteRaw;
    if(!quote) throw new Error('Quote text is empty and cannot be exported.');

    const trOverride = String(settings.translationTextOverride || '');
    const translationRaw = settings.showTranslation
      ? String((trOverride && trOverride.trim() ? trOverride : (sentence?.translation || ''))).trim()
      : '';
    const translation = settings.enhanceContent ? enhanceTextFlow(translationRaw) : translationRaw;
    const sourceAuto = getDomainText(sentence?.url || sentence?.sourceUrl || sentence?.pageUrl || '');
    const source = settings.showSource
      ? toReadableSource(settings.sourceTextOverride || sourceAuto)
      : '';
    const annotationBase = settings.annotationTextOverride || String(sentence?.note || '');
    const annotationRaw = settings.showAnnotation ? String(annotationBase || '') : '';
    const annotation = settings.enhanceContent ? enhanceTextFlow(annotationRaw) : annotationRaw;

    const mode = String(settings.watermarkMode || 'signature');
    const desktopShowBrandFooter = (!isIphoneRatio && settings.showWatermark && mode === 'signature');
    const desktopExtraWatermarkMode = (!isIphoneRatio && settings.showWatermark && mode !== 'signature') ? mode : '';

    return {
      quote,
      translation,
      annotation,
      source,
      watermark: isIphoneRatio ? '' : desktopExtraWatermarkMode,
      brandFooter: desktopShowBrandFooter ? (BRAND_NAME + ' · ' + BRAND_TAGLINE) : '',
    };
  }

  function makeLayoutEngine(ctx, canvasWidth, canvasHeight, settings, template, modules){
    const dims = resolveCanvasDims(settings);
    const layoutKey = resolveLayoutKey(settings, dims);
    const ratioCfg = RATIO_LAYOUT[layoutKey] || RATIO_LAYOUT['1:1'];
    const isTall = dims.height / Math.max(1, dims.width) > 1.6;
    const isIphoneRatio = settings.ratio === 'iphone';
    const isDesktopRatio = settings.ratio === '16:9' || settings.ratio === '4k' || (settings.ratio === 'custom' && dims.width >= dims.height);
    const lockscreenEnabled = isIphoneRatio && settings.lockscreenTuning !== false;
    const quoteLenRaw = String(modules.quote || '').length;
    const quoteLen = quoteLenRaw;
    const lockscreenShort = lockscreenEnabled ? clamp((110 - quoteLen) / 110, 0, 1) : 0;
    const lockscreenLong = lockscreenEnabled ? clamp((quoteLen - 160) / 180, 0, 1) : 0;
    let lenTier = 'short';
    if(quoteLen > 280) lenTier = 'xlong';
    else if(quoteLen > 170) lenTier = 'long';
    else if(quoteLen > 90) lenTier = 'medium';
    const densityMap = {
      compact: { width: 0.92, space: 0.9 },
      standard: { width: 1, space: 1 },
      airy: { width: 0.82, space: 1.12 },
    };
    const density = densityMap[settings.density] || densityMap.standard;

    const quoteLenAfter = String(modules.quote || '').length;

    const padding = clamp(canvasWidth * ratioCfg.paddingFactor, 32, 64);
    const contentWidth = canvasWidth - padding * 2;
    const contentHeight = canvasHeight - padding * 2;
    // iPhone lockscreen: keep a stronger safe zone for date + large clock area.
    const topReserve = lockscreenEnabled
      ? Math.round(contentHeight * ({
        short: 0.392,
        medium: 0.418,
        long: 0.446,
        xlong: 0.472,
      }[lenTier] || 0.418))
      : 0;
    const bottomReserveLock = lockscreenEnabled
      ? Math.round(contentHeight * ({
        short: 0.052,
        medium: 0.056,
        long: 0.062,
        xlong: 0.068,
      }[lenTier] || 0.056))
      : 0;
    const desktopTaskbarReserve = (isDesktopRatio && settings.desktopTaskbarSafe !== false)
      ? clamp(Math.round((Number(settings.desktopTaskbarPx || 112) * (canvasHeight / 1080))), 0, Math.round(contentHeight * 0.28))
      : 0;
    const bottomReserve = bottomReserveLock + desktopTaskbarReserve;
    const workingHeight = Math.max(240, contentHeight - topReserve - bottomReserve);

    const desktopFrameless = isDesktopRatio && (settings.desktopFrame === 'none' || settings.desktopFrame === 'auto');
    const surfaceBg = desktopFrameless
      ? String(template.background?.from || template.background?.to || template.card?.bg || '#0f172a')
      : String(template.card?.bg || template.background?.from || '#ffffff');
    const quoteStyle = template.quoteStyle || {};
    const translationStyle = template.translationStyle || {};
    const annotationStyle = template.annotationStyle || {};
    const sourceStyle = template.sourceStyle || {};
    const phonePalette = isIphoneRatio ? getPhoneTextPalette(template) : null;
    const quoteColor = phonePalette
      ? phonePalette.quote
      : pickReadableColor(quoteStyle.color || '#111827', surfaceBg, '#eef2ff', '#1f2937', 4.2);
    const translationColor = phonePalette
      ? phonePalette.translation
      : pickReadableColor(translationStyle.color || '#475569', surfaceBg, '#cfdbff', '#374151', 3.7);
    const annotationColor = phonePalette
      ? phonePalette.annotation
      : pickReadableColor(annotationStyle.color || '#6b7280', surfaceBg, '#bac8ef', '#4b5563', 3.3);
    const sourceColor = phonePalette
      ? phonePalette.source
      : pickReadableColor(sourceStyle.color || '#64748b', surfaceBg, '#b4c2e8', '#4b5563', 3.3);
    const fonts = getFontStacks(settings);

    const boost = Math.max(0, Number(settings.fontAdjust || 0));
    const sizeRangeMap = { compact: 0.94, standard: 1, roomy: 1.12 };
    const sizeRangeScale = sizeRangeMap[String(settings.textSizeRange || 'standard')] || 1;
    const shortTextFactor = clamp((150 - quoteLen) / 150, 0, 1);
    const lockscreenQuoteBoost = 1 + (lockscreenShort * 0.13) - (lockscreenLong * 0.02);
    const lockscreenSpacingBoost = 1 + (lockscreenShort * 0.12) - (lockscreenLong * 0.08);
    const fillStrengthMap = { light: 0.65, medium: 1, strong: 1.35 };
    const fillStrength = fillStrengthMap[String(settings.shortFillLevel || 'medium')] || 1;
    // Larger manual font-adjust should also give text more horizontal room,
    // otherwise long quotes get stuck at tiny sizes.
    const widthBoost = clamp((boost * 0.030) + Math.max(0, (quoteLenAfter - 160) / 1050) + (lockscreenLong * 0.12), 0, 0.40);
    const iphoneWidthLift = lockscreenEnabled ? 0.12 : (isIphoneRatio ? 0.05 : 0);
    const desktopWidthScaleMap = { narrow: 1.10, standard: 1.28, wide: 1.48 };
    const desktopWidthScale = desktopWidthScaleMap[String(settings.desktopTextWidth || 'standard')] || 1.00;
    const baseContentRatio = isIphoneRatio ? Math.max(0.88, (template.contentWidthRatio || 0.86)) : (template.contentWidthRatio || 0.86);
    const densityWidth = isIphoneRatio ? (1 + ((density.width || 1) - 1) * 0.35) : density.width;
    const desktopBaseRatio = isDesktopRatio ? Math.max(0.84, Math.min(1.30, desktopWidthScale)) : 1;
    const effectiveWidthRatio = clamp(((baseContentRatio * densityWidth * (isTall ? 0.92 : 1) * desktopBaseRatio) + widthBoost + iphoneWidthLift + (isDesktopRatio ? 0.08 : 0)), isIphoneRatio ? 0.84 : (isDesktopRatio ? 0.58 : 0.72), 0.99);
    let contentInnerWidth = contentWidth * effectiveWidthRatio;
    let contentX = padding + (contentWidth - contentInnerWidth) / 2;
    if(isDesktopRatio){
      const anchor = String(settings.desktopAnchor || 'left-middle');
      const sideGutter = Math.round(contentWidth * 0.045);
      const usableWidth = Math.max(120, contentWidth - sideGutter * 2);
      const clampedInner = Math.min(contentInnerWidth, usableWidth);
      if(clampedInner < contentInnerWidth) contentInnerWidth = clampedInner;
      if(anchor.startsWith('left')){
        contentX = padding + sideGutter;
      }else if(anchor.startsWith('right')){
        contentX = padding + contentWidth - contentInnerWidth - sideGutter;
      }else{
        contentX = padding + (contentWidth - contentInnerWidth) / 2;
      }
    }

    const spacingBoost = (1 + shortTextFactor * (isTall ? 0.20 : 0.13) * fillStrength) * (isIphoneRatio ? lockscreenSpacingBoost : 1);
    const spacingBase = Math.round(clamp(workingHeight * 0.022, 12, 34) * (template.spacingScale || 1) * density.space * (isTall ? 1.1 : 1) * spacingBoost);
    const spacing = {
      quoteToTranslation: spacingBase,
      translationToAnnotation: spacingBase,
      annotationToSource: Math.max(10, Math.round(spacingBase * 0.9)),
      sourceToFooter: Math.max(10, Math.round(spacingBase * 0.8)),
    };

    const footerSize = isDesktopRatio
      ? clamp(
        calculateFontSize('footer', contentInnerWidth, workingHeight) * 0.50,
        canvasWidth >= 3200 ? 24 : 18,
        canvasWidth >= 3200 ? 38 : 30
      )
      : clamp(calculateFontSize('footer', contentInnerWidth, workingHeight) * 0.30, 14, 18);
    const footerLineHeight = Math.round(footerSize * 1.25);

    const desktopShortFillBoost = isDesktopRatio ? (1 + shortTextFactor * 0.24 * fillStrength) : 1;
    const shortQuoteBoost = (1 + shortTextFactor * (isTall ? 0.26 : 0.18) * fillStrength) * (isIphoneRatio ? lockscreenQuoteBoost : 1) * desktopShortFillBoost;
    const iphoneBaseLift = lockscreenEnabled ? 1.12 : (isIphoneRatio ? 1.06 : 1);
    const maxQuoteCap = isDesktopRatio
      ? (settings.ratio === '4k' ? 178 : 138)
      : 96;
    const fontAdjustRaw = Number(settings.fontAdjust || 0);
    const effectiveFontAdjust = (isDesktopRatio && fontAdjustRaw < 0) ? Math.round(fontAdjustRaw * 0.45) : fontAdjustRaw;
    const quoteMaxSize = clamp(((Math.min(canvasWidth / 10, maxQuoteCap) * (quoteStyle.quoteScale || 1) * iphoneBaseLift) + effectiveFontAdjust + (isTall ? 4 : 0)) * shortQuoteBoost * sizeRangeScale, 20, maxQuoteCap);
    // Let positive font-adjust truly "force bigger text":
    // when space is not enough, prefer truncation over shrinking below the adjusted floor.
    const iphoneTierMin = ({
      short: 30,
      medium: 24,
      long: 18,
      xlong: 15,
    }[lenTier] || 22);
    const quoteMinSize = clamp((isIphoneRatio ? (iphoneTierMin + Math.max(0, boost) * 1.2) : (18 + (boost * 2))) * sizeRangeScale, isIphoneRatio ? 14 : 18, 62);
    const baseSizeCap = isDesktopRatio
      ? (settings.ratio === '4k' ? 152 : 114)
      : 68;
    const desktopBaseLift = isDesktopRatio ? 1.16 : 1;
    const quoteBaseSize = (clamp(contentInnerWidth / ratioCfg.quoteBaseDiv, 28, baseSizeCap) * (quoteStyle.quoteScale || 1) * shortQuoteBoost * iphoneBaseLift * desktopBaseLift * sizeRangeScale * (lockscreenEnabled ? 1.08 : 1)) + effectiveFontAdjust;

    const iphoneTierMaxLines = ({
      short: 10,
      medium: 14,
      long: 18,
      xlong: 22,
    }[lenTier] || ratioCfg.quoteMaxLines);
    const genericDynamicLines = Math.max(0, Math.floor((quoteLenAfter - 140) / 28));
    const quoteMaxLines = isIphoneRatio
      ? Math.min(24, iphoneTierMaxLines + Math.floor(boost / 2))
      : (isDesktopRatio
        ? Math.min(settings.ratio === '4k' ? 64 : 48, ratioCfg.quoteMaxLines + 18 + Math.floor(boost / 2) + genericDynamicLines)
        : Math.min(isTall ? 38 : 32, ratioCfg.quoteMaxLines + 12 + Math.floor(boost / 2) + genericDynamicLines));
    const desktopLongMin = quoteLenAfter > 300 ? 12 : (quoteLenAfter > 230 ? 13 : 14);
    const quoteFit = fitPrimaryQuote(ctx, modules.quote, {
      maxWidth: contentInnerWidth,
      maxLines: quoteMaxLines,
      maxSize: Math.min(quoteMaxSize, quoteBaseSize),
      minSize: isIphoneRatio ? quoteMinSize : (isDesktopRatio ? clamp(11 + (boost * 0.7), 9, 52) : clamp(12 + boost, 11, 38)),
      lineHeightRatio: lockscreenEnabled ? 1.24 : (quoteLenAfter > 280 ? 1.20 : (quoteStyle.lineHeightMultiplier || 1.28)),
      fontWeight: quoteStyle.fontWeight || 760,
      fontFamily: fonts.quote,
    });

    const quoteHeight = quoteFit.metrics.height;
    const fixedBottomReserve = footerLineHeight + spacing.sourceToFooter + Math.round(workingHeight * ratioCfg.extraBottom) + Math.round(footerLineHeight * 0.42);
    const availableSecondary = Math.max(0, workingHeight - quoteHeight - fixedBottomReserve - spacing.quoteToTranslation);

    let remain = availableSecondary;

    const forceCompactSecondary = (lockscreenEnabled && quoteLenAfter > 140) || (isDesktopRatio && quoteLenAfter > 260);
    const forceHideSecondary = lockscreenEnabled && quoteLenAfter > 180;
    let translationFit = null;
    if(modules.translation){
      const startSize = clamp(quoteFit.size * clamp(translationStyle.scale || 0.62, 0.56, 0.68) * sizeRangeScale, 14, quoteFit.size * 0.7);
      translationFit = fitSecondaryBlock(ctx, {
        text: modules.translation,
        maxWidth: contentInnerWidth,
        maxHeight: Math.max(30, remain * (modules.annotation || modules.source ? 0.55 : 0.8)),
        maxLines: isIphoneRatio
          ? Math.max(1, Math.min(ratioCfg.translationMaxLines, ({
            short: 4,
            medium: 3,
            long: 2,
            xlong: 2,
          }[lenTier] || ratioCfg.translationMaxLines)))
          : Math.min(14, ratioCfg.translationMaxLines + (quoteLenAfter > 220 ? 4 : 2)),
        startSize,
        minSize: 11,
        maxSize: startSize,
        step: 1,
        lineHeightRatio: translationStyle.lineHeightMultiplier || 1.34,
        fontWeight: translationStyle.fontWeight || 520,
        fontFamily: fonts.body,
        ellipsisMode: 'word',
        allowAutoHide: settings.allowAutoHideSecondary || forceCompactSecondary || forceHideSecondary,
      });
      if(translationFit && !translationFit.hidden){
        remain = Math.max(0, remain - translationFit.metrics.height - spacing.translationToAnnotation);
      }
    }

    let annotationFit = null;
    if(modules.annotation){
      const startSize = clamp(quoteFit.size * 0.55 * sizeRangeScale, 14, quoteFit.size * 0.68);
      annotationFit = fitSecondaryBlock(ctx, {
        text: modules.annotation,
        maxWidth: contentInnerWidth,
        maxHeight: Math.max(28, remain * (modules.source ? 0.64 : 0.9)),
        maxLines: isIphoneRatio
          ? Math.max(1, Math.min(ratioCfg.annotationMaxLines, (lenTier === 'xlong' ? 1 : 2)))
          : Math.min(10, ratioCfg.annotationMaxLines + (quoteLenAfter > 220 ? 3 : 2)),
        startSize,
        minSize: 10,
        maxSize: startSize,
        step: 1,
        lineHeightRatio: annotationStyle.lineHeightMultiplier || 1.34,
        fontWeight: annotationStyle.fontWeight || 500,
        fontFamily: fonts.body,
        ellipsisMode: 'char',
        allowAutoHide: settings.allowAutoHideSecondary || forceCompactSecondary || forceHideSecondary,
      });
      if(annotationFit && !annotationFit.hidden){
        remain = Math.max(0, remain - annotationFit.metrics.height - spacing.annotationToSource);
      }
    }

    let sourceFit = null;
    if(modules.source){
      const startSize = clamp(quoteFit.size * 0.42, 12, 28);
      sourceFit = fitSecondaryBlock(ctx, {
        text: modules.source,
        maxWidth: contentInnerWidth,
        maxHeight: Math.max(24, remain),
        maxLines: ratioCfg.sourceMaxLines,
        startSize,
        minSize: 10,
        maxSize: startSize,
        step: 1,
        lineHeightRatio: sourceStyle.lineHeightMultiplier || 1.3,
        fontWeight: sourceStyle.fontWeight || 520,
        fontFamily: fonts.body,
        ellipsisMode: 'word',
        allowAutoHide: settings.allowAutoHideSecondary || forceCompactSecondary || forceHideSecondary,
      });
    }

    const blocks = [];
    blocks.push({ key: 'quote', size: quoteFit.size, metrics: quoteFit.metrics, weight: quoteStyle.fontWeight || 760, family: fonts.quote, color: quoteColor });
    if(translationFit && !translationFit.hidden){
      blocks.push({ key: 'translation', size: translationFit.size, metrics: translationFit.metrics, weight: translationStyle.fontWeight || 520, family: fonts.body, color: translationColor });
    }
    if(annotationFit && !annotationFit.hidden){
      blocks.push({ key: 'annotation', size: annotationFit.size, metrics: annotationFit.metrics, weight: annotationStyle.fontWeight || 500, family: fonts.body, color: annotationColor });
    }
    if(sourceFit && !sourceFit.hidden){
      blocks.push({ key: 'source', size: sourceFit.size, metrics: sourceFit.metrics, weight: sourceStyle.fontWeight || 520, family: fonts.body, color: sourceColor });
    }

    let totalContentHeight = footerLineHeight;
    for(let i = 0; i < blocks.length; i += 1){
      totalContentHeight += blocks[i].metrics.height;
      if(i < blocks.length - 1){
        if(blocks[i].key === 'quote') totalContentHeight += spacing.quoteToTranslation;
        else if(blocks[i].key === 'translation') totalContentHeight += spacing.translationToAnnotation;
        else totalContentHeight += spacing.annotationToSource;
      }
    }
    if(blocks.length) totalContentHeight += spacing.sourceToFooter;

    const opticalAdjust = quoteFit.size * 0.11;
    const freeSpace = Math.max(0, workingHeight - totalContentHeight);
    const occupancy = totalContentHeight / Math.max(1, workingHeight);
    let centerFactor = boost >= 4 ? 0.34 : (isTall ? 0.34 : 0.42);
    if(isTall){
      if(occupancy < 0.56) centerFactor = 0.20;
      else if(occupancy < 0.66) centerFactor = 0.27;
      else centerFactor = 0.32;
    }
    if(isIphoneRatio){
      centerFactor = ({
        short: 0.22,
        medium: 0.24,
        long: 0.27,
        xlong: 0.30,
      }[lenTier] || 0.24);
    }else if(isDesktopRatio){
      const anchor = String(settings.desktopAnchor || 'left-middle');
      if(anchor.endsWith('top')) centerFactor = 0;
      else if(anchor.endsWith('bottom')) centerFactor = 1;
      else centerFactor = 0.5;
    }
    // Avoid moving text block back into clock area.
    const phoneLiftUp = 0;
    const baseStartY = padding + topReserve + (freeSpace * centerFactor) - phoneLiftUp;
    const maxStartY = padding + topReserve + Math.max(0, workingHeight - totalContentHeight);
    const lockscreenGuardTop = isIphoneRatio
      ? (padding + Math.round(contentHeight * ({
        short: 0.43,
        medium: 0.45,
        long: 0.47,
        xlong: 0.49,
      }[lenTier] || 0.45)))
      : (padding + topReserve + 4);
    let startY = clamp(baseStartY + (opticalAdjust * 0.72) + (isTall ? workingHeight * 0.008 : 0), Math.max(padding + topReserve + 4, lockscreenGuardTop), maxStartY);
    if(isDesktopRatio){
      const anchor = String(settings.desktopAnchor || 'left-middle');
      const anchorBand = anchor.endsWith('top') ? 0.12 : (anchor.endsWith('bottom') ? 0.78 : 0.45);
      const targetY = padding + topReserve + Math.round(workingHeight * anchorBand);
      const desiredTop = targetY - Math.round(quoteFit.metrics.height * 0.22);
      startY = clamp(desiredTop, padding + topReserve + 4, maxStartY);
    }

    const layoutDebug = {
      canvas: { w: canvasWidth, h: canvasHeight, padding, topReserve, bottomReserve, desktopTaskbarReserve },
      quote: { size: quoteFit.size, lines: quoteFit.metrics.lines.length, rawLines: quoteFit.metrics.rawLineCount, maxLines: quoteMaxLines, height: quoteFit.metrics.height, lengthRaw: quoteLenRaw, lengthAfter: quoteLenAfter },
      translation: translationFit && !translationFit.hidden ? { size: translationFit.size, lines: translationFit.metrics.lines.length, rawLines: translationFit.metrics.rawLineCount, maxLines: translationFit.maxLines, height: translationFit.metrics.height } : null,
      annotation: annotationFit && !annotationFit.hidden ? { size: annotationFit.size, lines: annotationFit.metrics.lines.length, rawLines: annotationFit.metrics.rawLineCount, maxLines: annotationFit.maxLines, height: annotationFit.metrics.height } : null,
      source: sourceFit && !sourceFit.hidden ? { size: sourceFit.size, lines: sourceFit.metrics.lines.length, rawLines: sourceFit.metrics.rawLineCount, maxLines: sourceFit.maxLines, height: sourceFit.metrics.height } : null,
      footer: { size: footerSize, height: footerLineHeight },
      totalHeight: totalContentHeight,
      startY,
      contentBlockTopOffset: startY - padding,
      lockscreen: isIphoneRatio ? { short: lockscreenShort, long: lockscreenLong, topReserve, bottomReserve } : null,
      measureCount: (quoteFit.metrics.rawLineCount || 0)
        + (translationFit?.metrics?.rawLineCount || 0)
        + (annotationFit?.metrics?.rawLineCount || 0)
        + (sourceFit?.metrics?.rawLineCount || 0),
    };

    const lineColor = phonePalette
      ? phonePalette.line
      : pickReadableColor(template.footerStyle?.lineColor || '#d9e0f3', surfaceBg, '#b7c5f0', '#42526f', 2.2);
    const footerColor = phonePalette
      ? phonePalette.footer
      : pickReadableColor(template.footerStyle?.color || '#64748b', surfaceBg, '#d8e4ff', '#334155', 3.1);

    return {
      contentX,
      contentInnerWidth,
      startY,
      spacing,
      footerLineHeight,
      footerSize,
      blocks,
      layoutDebug,
      fonts,
      lineColor,
      footerColor,
      footerWeight: template.footerStyle?.fontWeight || 650,
      footerInsetRight: isDesktopRatio ? Math.max(16, Math.round(contentInnerWidth * 0.016)) : 0,
      phoneLogoColor: phonePalette ? phonePalette.logo : 'rgba(41, 43, 92, 0.38)',
    };
  }

  function getQualityReport(rawSettings, layoutDebug){
    const settings = normalizeSettings(rawSettings);
    const template = TEMPLATE_CONFIG[settings.template] || TEMPLATE_CONFIG.light;
    const debug = layoutDebug || null;
    const warnings = [];
    const isIphoneRatio = settings.ratio === 'iphone';
    const canvasW = Number(debug?.canvas?.w || 0);
    const canvasH = Number(debug?.canvas?.h || 0);
    const isDesktopRatio = settings.ratio === '16:9' || settings.ratio === '4k' || (settings.ratio === 'custom' && canvasW >= canvasH);
    if(!debug) return { level: 'unknown', warnings: ['暂无质量数据。'], metrics: {} };

    const quoteSize = Number(debug?.quote?.size || 0);
    if(quoteSize > 0 && quoteSize < 24){
      warnings.push('主句字号偏小（' + quoteSize + 'px），建议增大字号或减少次级内容。');
    }
    const quoteLines = Number(debug?.quote?.lines || 0);
    const quoteRawLines = Number(debug?.quote?.rawLines || 0);
    if(quoteRawLines > 0 && quoteLines > 0 && quoteRawLines > quoteLines){
      warnings.push('主句出现截断（' + quoteLines + '/' + quoteRawLines + ' 行），建议改“宽文本”或提高文本密度。');
    }

    const used = Number(debug?.totalHeight || 0);
    const usage = canvasH > 0 ? used / canvasH : 0;
    if(usage > 0.9){
      warnings.push('内容密度偏高，建议关闭来源/批注或降低字号。');
    }
    if(isDesktopRatio && usage < 0.50){
      warnings.push('桌面壁纸内容占比偏低，建议改为“宽文本”或增大字号。');
    }

    const infoLines = (debug?.translation?.lines || 0) + (debug?.annotation?.lines || 0) + (debug?.source?.lines || 0);
    if(infoLines >= 8){
      warnings.push('次级信息行数较多，层级可能拥挤。');
    }
    const secTruncated = (
      (Number(debug?.translation?.rawLines || 0) > Number(debug?.translation?.lines || 0)) ||
      (Number(debug?.annotation?.rawLines || 0) > Number(debug?.annotation?.lines || 0)) ||
      (Number(debug?.source?.rawLines || 0) > Number(debug?.source?.lines || 0))
    );
    if(secTruncated){
      warnings.push('次级信息存在截断，建议关闭批注/来源或减少文本长度。');
    }

    if(isIphoneRatio){
      const contentTop = Number(debug?.contentBlockTopOffset || 0);
      const topGuard = canvasH * 0.255;
      if(contentTop < topGuard){
        warnings.push('锁屏顶部冲突风险：正文过于接近时间区域。');
      }
    }

    const quoteColor = template.quoteStyle?.color || '#111827';
    const cardBg = template.card?.bg || '#ffffff';
    const ratio = contrastRatio(quoteColor, cardBg);
    if(ratio != null && ratio < 4.3){
      warnings.push('文字对比度偏低（' + ratio.toFixed(2) + '），建议换高对比模板。');
    }

    const footerSize = Number(debug?.footer?.size || 0);
    if(settings.showWatermark && isDesktopRatio){
      const watermarkMin = canvasW >= 3200 ? 26 : 20;
      if(footerSize > 0 && footerSize < watermarkMin){
        warnings.push('水印可见性偏弱，建议切换水印模式或增大内容尺寸。');
      }
    }
    if(settings.showWatermark && isIphoneRatio && canvasW > 0){
      const expectedMark = Math.round(canvasW * 0.05);
      if(expectedMark < 20){
        warnings.push('锁屏水印可能偏弱，建议提高水印强度。');
      }
    }

    const hasBlocking = warnings.some(w => w.includes('冲突风险'));
    const level = hasBlocking ? 'high' : (warnings.length >= 3 ? 'high' : warnings.length >= 1 ? 'medium' : 'ok');
    return {
      level,
      warnings,
      metrics: {
        quoteSize,
        usage,
        contrast: ratio,
      },
    };
  }

  function drawWatermark(ctx, mode, template, quoteSize, card, stacks){
    if(!mode) return;
    const wm = template.watermarkStyle || {};
    const surfaceBg = String(card?.bg || template.card?.bg || template.background?.from || '#111827');
    const color = pickReadableColor(wm.color || '#7c3aed', surfaceBg, '#edf3ff', '#2b3b55', 2.6);
    const alphaBoost = (card?.w || 0) >= 3200 ? 0.16 : ((card?.w || 0) >= 1800 ? 0.12 : 0.08);
    const taskbarLift = Math.max(0, Number(card?.taskbarReserve || 0));
    const inset = Math.max(24, Math.round(Math.min(card.w, card.h) * 0.035)) + Math.round(taskbarLift * 0.68);

    if(mode === 'backgroundLogo'){
      ctx.save();
      ctx.globalAlpha = Math.min(0.028, wm.backgroundOpacity ?? 0.028);
      ctx.fillStyle = color;
      ctx.font = `800 ${Math.round(card.w * 0.05)}px ${stacks.quote || FONT_STACK_QUOTE}`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(BRAND_NAME, card.x + card.w - inset, card.y + card.h * 0.86);
      ctx.restore();
      return;
    }

    if(mode === 'cornerLogo'){
      ctx.save();
      ctx.globalAlpha = wm.cornerOpacity ?? 0.18;
      ctx.fillStyle = color;
      const sz = Math.max(card.w >= 3200 ? 34 : (card.w >= 1800 ? 24 : 16), Math.round(card.w * 0.06));
      ctx.font = `800 ${sz}px ${stacks.quote || FONT_STACK_QUOTE}`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(BRAND_NAME, card.x + card.w - inset, card.y + card.h - inset);
      ctx.restore();
      return;
    }

    if(mode === 'monogram'){
      ctx.save();
      ctx.globalAlpha = Math.max((wm.signatureOpacity ?? 0.30), 0.34 + alphaBoost);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      const size = Math.max(card.w >= 3200 ? 30 : (card.w >= 1800 ? 22 : 16), Math.round(quoteSize * 0.24));
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h - inset - Math.round(size * 0.65);
      ctx.lineWidth = Math.max(1.5, Math.round(size * 0.08));
      ctx.beginPath();
      ctx.arc(cx, cy, Math.round(size * 0.7), 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = `800 ${size}px ${stacks.quote || FONT_STACK_QUOTE}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', cx, cy + 1);
      ctx.restore();
      return;
    }

    if(mode === 'capsule'){
      ctx.save();
      ctx.globalAlpha = Math.max((wm.signatureOpacity ?? 0.30), 0.34 + alphaBoost);
      const textSize = Math.max(card.w >= 3200 ? 28 : (card.w >= 1800 ? 20 : 12), Math.round(quoteSize * 0.2));
      ctx.font = `700 ${textSize}px ${stacks.quote || FONT_STACK_QUOTE}`;
      const label = BRAND_NAME;
      const tw = ctx.measureText(label).width;
      const padX = Math.max(10, Math.round(textSize * 0.8));
      const h = Math.max(22, Math.round(textSize * 1.8));
      const w = Math.round(tw + padX * 2);
      const x = Math.round(card.x + card.w / 2 - w / 2);
      const y = Math.round(card.y + card.h - inset - h);
      roundedRectPath(ctx, x, y, w, h, Math.round(h / 2));
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + w / 2, y + h / 2);
      ctx.restore();
      return;
    }

    if(mode === 'dotline'){
      ctx.save();
      ctx.globalAlpha = Math.max((wm.signatureOpacity ?? 0.30), 0.34 + alphaBoost);
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      const textSize = Math.max(card.w >= 3200 ? 24 : (card.w >= 1800 ? 18 : 11), Math.round(quoteSize * 0.19));
      ctx.font = `700 ${textSize}px ${stacks.quote || FONT_STACK_QUOTE}`;
      ctx.fillText('· ' + BRAND_NAME.split('').join(' ') + ' ·', card.x + card.w / 2, card.y + card.h - inset);
      ctx.restore();
      return;
    }

    ctx.save();
    ctx.globalAlpha = Math.max((wm.signatureOpacity ?? 0.30), 0.34 + alphaBoost);
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const sizeFloor = card.w >= 3200 ? 34 : (card.w >= 1800 ? 24 : 18);
    const titleSize = Math.max(sizeFloor, Math.round(quoteSize * 0.24));
    const baseY = card.y + card.h - inset;
    // Signature mode uses a compact mono watermark so footer brand line remains primary.
    ctx.font = `700 ${titleSize}px ${stacks.quote || FONT_STACK_QUOTE}`;
    ctx.fillText(BRAND_NAME, card.x + card.w / 2, baseY);
    ctx.restore();
  }

  function drawAnnotationEmphasis(ctx, block, x, y, width){
    // Emphasis uses a compact side-strip box near annotation text,
    // avoiding full-width shading that feels too heavy.
    ctx.save();
    ctx.font = `${block.weight} ${block.size}px ${block.family}`;
    const maxLineWidth = (block.metrics.lines || []).reduce((m, line)=>{
      const w = ctx.measureText(String(line || '')).width;
      return Math.max(m, w);
    }, 0);
    ctx.restore();

    const padX = 12;
    const bgY = y + 1;
    const bgH = Math.max(10, block.metrics.height - 2);
    const bgX = x;
    const bgW = Math.max(46, Math.min(width, Math.ceil(maxLineWidth + padX * 2)));
    ctx.save();
    roundedRectPath(ctx, bgX, bgY, bgW, bgH, 10);
    ctx.fillStyle = 'rgba(100, 116, 139, 0.08)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    roundedRectPath(ctx, bgX + 6, bgY + 6, 3, Math.max(8, bgH - 12), 2);
    ctx.fillStyle = 'rgba(99, 102, 241, 0.56)';
    ctx.fill();
    ctx.restore();
  }

  function drawIphoneBottomWatermark(ctx, mode, template, canvas, card, stacks){
    const wm = template.watermarkStyle || {};
    const phonePalette = getPhoneTextPalette(template);
    const bg = String(template?.background?.from || template?.background?.to || '#0f172a');
    const color = pickReadableColor(wm.color || phonePalette.footer || '#e6ecff', bg, '#e6ecff', '#2f3d5d', 2.6);
    const baseY = card.y + card.h - Math.round(canvas.height * 0.067);
    const centerX = card.x + (card.w / 2);
    const opacity = Math.max(0.72, Number(wm.signatureOpacity ?? 0.30));

    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.globalAlpha = opacity;
    ctx.shadowColor = 'rgba(8,12,28,0.46)';
    ctx.shadowBlur = Math.max(4, Math.round(canvas.width * 0.005));
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    if(mode === 'monogram'){
      const size = Math.max(18, Math.round(canvas.width * 0.042));
      const cy = baseY - Math.round(size * 0.52);
      ctx.lineWidth = Math.max(1.6, Math.round(size * 0.08));
      ctx.beginPath();
      ctx.arc(centerX, cy, Math.round(size * 0.7), 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = `800 ${size}px ${stacks.brand || FONT_STACK_BRAND}`;
      ctx.textBaseline = 'middle';
      ctx.fillText('H', centerX, cy + 1);
      ctx.restore();
      return;
    }

    if(mode === 'capsule'){
      const fs = Math.max(15, Math.round(canvas.width * 0.03));
      ctx.font = `760 ${fs}px ${stacks.brand || FONT_STACK_BRAND}`;
      const label = BRAND_NAME;
      const tw = ctx.measureText(label).width;
      const px = Math.max(12, Math.round(fs * 0.7));
      const h = Math.max(24, Math.round(fs * 1.75));
      const w = Math.round(tw + px * 2);
      const x = Math.round(centerX - w / 2);
      const y = Math.round(baseY - h);
      roundedRectPath(ctx, x, y, w, h, Math.round(h / 2));
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x + w / 2, y + h / 2);
      ctx.restore();
      return;
    }

    if(mode === 'dotline'){
      const fs = Math.max(13, Math.round(canvas.width * 0.026));
      ctx.font = `760 ${fs}px ${stacks.brand || FONT_STACK_BRAND}`;
      ctx.fillText('· ' + BRAND_NAME.split('').join(' ') + ' ·', centerX, baseY);
      ctx.restore();
      return;
    }

    if(mode === 'cornerLogo'){
      const fs = Math.max(15, Math.round(canvas.width * 0.032));
      ctx.font = `780 ${fs}px ${stacks.brand || FONT_STACK_BRAND}`;
      ctx.textAlign = 'center';
      ctx.fillText(BRAND_NAME, centerX, baseY);
      ctx.restore();
      return;
    }

    if(mode === 'backgroundLogo'){
      ctx.globalAlpha = wm.backgroundOpacity ?? 0.07;
      ctx.font = `800 ${Math.max(80, Math.round(canvas.width * 0.19))}px ${stacks.brand || FONT_STACK_BRAND}`;
      ctx.textBaseline = 'middle';
      ctx.fillText(BRAND_NAME, centerX, card.y + card.h * 0.72);
      ctx.globalAlpha = opacity;
      ctx.textBaseline = 'alphabetic';
      ctx.font = `800 ${Math.max(20, Math.round(canvas.width * 0.05))}px ${stacks.brand || FONT_STACK_BRAND}`;
      ctx.fillText(BRAND_NAME, centerX, baseY);
      ctx.restore();
      return;
    }

    const brandSize = Math.max(24, Math.round(canvas.width * 0.056));
    const taglineSize = Math.max(12, Math.round(canvas.width * 0.024));
    const lineGap = Math.max(5, Math.round(canvas.width * 0.009));
    ctx.font = `800 ${brandSize}px ${stacks.brand || FONT_STACK_BRAND}`;
    ctx.fillText(BRAND_NAME, centerX, baseY - taglineSize - lineGap);
    ctx.globalAlpha = Math.max(0.14, opacity * 0.72);
    ctx.font = `700 ${taglineSize}px ${stacks.body || FONT_STACK_BODY}`;
    ctx.fillText(BRAND_TAGLINE, centerX, baseY);
    ctx.restore();
  }

  function drawCard(sentence, rawSettings, targetCanvas){
    const settings = normalizeSettings(rawSettings);
    const dims = resolveCanvasDims(settings);
    const template = TEMPLATE_CONFIG[settings.template] || TEMPLATE_CONFIG.light;
    const modules = buildModules(sentence, settings);
    const isIphoneRatio = settings.ratio === 'iphone';
    const isDesktopRatio = settings.ratio === '16:9' || settings.ratio === '4k' || (settings.ratio === 'custom' && dims.width >= dims.height);
    const desktopFrameless = isDesktopRatio && (settings.desktopFrame === 'none' || settings.desktopFrame === 'auto');
    const desktopCardForced = isDesktopRatio && settings.desktopFrame === 'card';
    const useCardSurface = !isIphoneRatio && (!isDesktopRatio || desktopCardForced || !desktopFrameless);

    const canvas = targetCanvas || document.createElement('canvas');
    canvas.width = dims.width;
    canvas.height = dims.height;
    const ctx = canvas.getContext('2d');
    if(!ctx) throw new Error('Canvas is not available in current environment.');

    fillBackground(ctx, canvas.width, canvas.height, template.background);

    const ratioCfg = RATIO_LAYOUT[settings.ratio] || RATIO_LAYOUT['1:1'];
    const pad = isIphoneRatio ? 0 : (desktopFrameless ? 0 : clamp(canvas.width * ratioCfg.paddingFactor, 32, 64));
    const card = {
      x: pad,
      y: pad,
      w: canvas.width - pad * 2,
      h: canvas.height - pad * 2,
      r: desktopFrameless ? 0 : (template.card?.radius || 16),
      taskbarReserve: (isDesktopRatio && settings.desktopTaskbarSafe !== false)
        ? clamp(Math.round((Number(settings.desktopTaskbarPx || 112) * (canvas.height / 1080))), 0, Math.round(canvas.height * 0.2))
        : 0,
    };

    if(useCardSurface){
      ctx.save();
      ctx.shadowColor = template.card?.shadow || 'rgba(15, 23, 42, 0.12)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      roundedRectPath(ctx, card.x, card.y, card.w, card.h, card.r);
      ctx.fillStyle = template.card?.bg || '#fff';
      ctx.fill();
      ctx.restore();

      if(template.card?.borderColor){
        ctx.save();
        roundedRectPath(ctx, card.x, card.y, card.w, card.h, card.r);
        ctx.strokeStyle = template.card.borderColor;
        ctx.lineWidth = Number(template.card.borderWidth || 1);
        ctx.stroke();
        ctx.restore();
      }

      drawPaperTexture(ctx, card, template.texture);
    }

    const layoutEngine = makeLayoutEngine(ctx, card.w, card.h, settings, template, modules);

    drawWatermark(ctx, modules.watermark, template, layoutEngine.blocks[0]?.size || 28, card, layoutEngine.fonts || {});

    const baseX = card.x + layoutEngine.contentX;
    const baseY = card.y;
    let y = baseY + layoutEngine.startY;

    for(let i = 0; i < layoutEngine.blocks.length; i += 1){
      const block = layoutEngine.blocks[i];
      if(block.key === 'annotation' && settings.annotationStyle === 'emphasis'){
        drawAnnotationEmphasis(ctx, block, baseX, y, layoutEngine.contentInnerWidth);
      }
      ctx.fillStyle = block.color;
      ctx.font = `${block.weight} ${block.size}px ${block.family}`;
      ctx.textBaseline = 'top';
      const lines = block.metrics.lines;
      for(const line of lines){
        ctx.fillText(line, baseX, y);
        y += block.metrics.lineHeight;
      }
      if(i < layoutEngine.blocks.length - 1){
        if(block.key === 'quote') y += layoutEngine.spacing.quoteToTranslation;
        else if(block.key === 'translation') y += layoutEngine.spacing.translationToAnnotation;
        else y += layoutEngine.spacing.annotationToSource;
      }
    }

    y += layoutEngine.spacing.sourceToFooter;
    if(modules.source || modules.brandFooter){
      const lineY = y - Math.round(layoutEngine.spacing.sourceToFooter * 0.45);
      const lineRight = baseX + layoutEngine.contentInnerWidth - (layoutEngine.footerInsetRight || 0);
      ctx.strokeStyle = layoutEngine.lineColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(baseX, lineY);
      ctx.lineTo(lineRight, lineY);
      ctx.stroke();
    }
    if(modules.brandFooter){
      ctx.fillStyle = layoutEngine.footerColor;
      ctx.font = `${layoutEngine.footerWeight} ${layoutEngine.footerSize}px ${(layoutEngine.fonts?.brand || FONT_STACK_BRAND)}`;
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'right';
      ctx.fillText(modules.brandFooter, baseX + layoutEngine.contentInnerWidth - (layoutEngine.footerInsetRight || 0), y + layoutEngine.footerLineHeight);
    }
    if(isIphoneRatio && settings.showWatermark){
      drawIphoneBottomWatermark(ctx, settings.watermarkMode, template, canvas, card, layoutEngine.fonts || {});
    }

    canvas.__layoutDebug = layoutEngine.layoutDebug;
    if(settings.debugLayout){
      console.debug('[QuoteCardLayout]', layoutEngine.layoutDebug);
    }
    return canvas;
  }

  function getTimestamp(){
    const d = new Date();
    const pad = (n)=>String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
  }

  function sanitizeFilenamePart(input){
    return String(input || '')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function resolveFilename(settings, options){
    const d = new Date();
    const pad = (n)=>String(n).padStart(2, '0');
    const date = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    const time = `${pad(d.getHours())}${pad(d.getMinutes())}`;
    const datetime = `${date}-${time}`;
    const pattern = String(options?.filenamePattern || settings?.filenamePattern || '').trim();
    const fallbackPrefix = String(options?.filenamePrefix || 'hord-quote');
    const index = Number(options?.index || settings?.batchIndex || 0);
    const indexText = index > 0 ? String(index).padStart(2, '0') : '';
    const dims = resolveCanvasDims(settings || {});
    const ratioText = (settings?.ratio === 'custom')
      ? `custom-${dims.width}x${dims.height}`
      : String(settings?.ratio || '1:1').replace(':', 'x');

    if(!pattern){
      return `${sanitizeFilenamePart(fallbackPrefix)}-${datetime}.png`;
    }
    const resolved = pattern
      .replace(/\{date\}/g, date)
      .replace(/\{time\}/g, time)
      .replace(/\{datetime\}/g, datetime)
      .replace(/\{template\}/g, sanitizeFilenamePart(settings?.template || 'light'))
      .replace(/\{ratio\}/g, sanitizeFilenamePart(ratioText))
      .replace(/\{index\}/g, indexText)
      .replace(/\{brand\}/g, 'hord');
    const safe = sanitizeFilenamePart(resolved) || `${sanitizeFilenamePart(fallbackPrefix)}-${datetime}`;
    return safe.endsWith('.png') ? safe : `${safe}.png`;
  }

  async function saveCanvasAsPng(canvas, filename){
    const blob = await new Promise((resolve, reject)=>{
      canvas.toBlob((b)=>{
        if(b) resolve(b);
        else reject(new Error('Failed to generate image blob. Please retry.'));
      }, 'image/png');
    });
    const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent || '')
      || ((navigator.platform === 'MacIntel') && (navigator.maxTouchPoints > 1));
    if(isIOS){
      try{
        const file = new File([blob], filename, { type: 'image/png' });
        if(navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share){
          await navigator.share({ files: [file], title: filename });
          return;
        }
      }catch(_){}
      // Safari fallback: open image in a new tab and let user long-press to save.
      const fallbackUrl = URL.createObjectURL(blob);
      const opened = window.open(fallbackUrl, '_blank');
      if(opened){
        setTimeout(()=> URL.revokeObjectURL(fallbackUrl), 60 * 1000);
        return;
      }
      // If popup blocked, continue to generic download attempt below.
    }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    try{
      anchor.click();
    }finally{
      setTimeout(()=>{
        URL.revokeObjectURL(url);
        anchor.remove();
      }, 160);
    }
  }

  const IPHONE_MOCKUP_ASSETS = {
    frame: 'assets/iphone17-mockup.png',
    inHand: 'assets/iphone17-inhand-mockup.png',
  };
  const mockupAssetCache = new Map();
  const mockupScreenRectCache = new Map();

  function getLockScreenText(){
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return { time, date };
  }

  function loadImageAsset(path){
    if(mockupAssetCache.has(path)) return mockupAssetCache.get(path);
    const task = new Promise((resolve, reject)=>{
      const img = new Image();
      img.onload = ()=>resolve(img);
      img.onerror = ()=>reject(new Error(`加载素材失败: ${path}`));
      img.src = new URL(path, window.location.href).toString();
    });
    mockupAssetCache.set(path, task);
    return task;
  }

  function detectScreenRectFromTransparency(img){
    const key = `${img.naturalWidth}x${img.naturalHeight}:${img.src}`;
    if(mockupScreenRectCache.has(key)) return mockupScreenRectCache.get(key);

    const maxDim = 960;
    const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
    const sw = Math.max(10, Math.round(img.naturalWidth * scale));
    const sh = Math.max(10, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if(!ctx){
      mockupScreenRectCache.set(key, null);
      return null;
    }
    ctx.drawImage(img, 0, 0, sw, sh);
    const data = ctx.getImageData(0, 0, sw, sh).data;
    const total = sw * sh;
    const transparent = new Uint8Array(total);
    for(let i = 0; i < total; i += 1){
      transparent[i] = data[(i * 4) + 3] < 20 ? 1 : 0;
    }

    // Flood-fill edge transparent pixels to separate outside background.
    const outside = new Uint8Array(total);
    const qx = new Int32Array(total);
    const qy = new Int32Array(total);
    let head = 0;
    let tail = 0;
    const push = (x, y)=>{
      const idx = y * sw + x;
      if(outside[idx] || !transparent[idx]) return;
      outside[idx] = 1;
      qx[tail] = x;
      qy[tail] = y;
      tail += 1;
    };
    for(let x = 0; x < sw; x += 1){
      push(x, 0);
      push(x, sh - 1);
    }
    for(let y = 0; y < sh; y += 1){
      push(0, y);
      push(sw - 1, y);
    }
    while(head < tail){
      const x = qx[head];
      const y = qy[head];
      head += 1;
      if(x > 0) push(x - 1, y);
      if(x < sw - 1) push(x + 1, y);
      if(y > 0) push(x, y - 1);
      if(y < sh - 1) push(x, y + 1);
    }

    let minX = sw;
    let minY = sh;
    let maxX = -1;
    let maxY = -1;
    let count = 0;
    for(let y = 1; y < sh - 1; y += 1){
      for(let x = 1; x < sw - 1; x += 1){
        const idx = y * sw + x;
        if(!transparent[idx] || outside[idx]) continue;
        count += 1;
        if(x < minX) minX = x;
        if(y < minY) minY = y;
        if(x > maxX) maxX = x;
        if(y > maxY) maxY = y;
      }
    }
    if(count < total * 0.002 || maxX <= minX || maxY <= minY){
      mockupScreenRectCache.set(key, null);
      return null;
    }
    const rect = {
      x: minX / sw,
      y: minY / sh,
      w: (maxX - minX + 1) / sw,
      h: (maxY - minY + 1) / sh,
    };
    mockupScreenRectCache.set(key, rect);
    return rect;
  }

  function drawWallpaperIntoRect(ctx, wallpaperCanvas, rect, cornerRadius = 0){
    const wr = wallpaperCanvas.width / Math.max(1, wallpaperCanvas.height);
    const rr = rect.w / Math.max(1, rect.h);
    let sx = 0;
    let sy = 0;
    let sw = wallpaperCanvas.width;
    let sh = wallpaperCanvas.height;
    if(wr > rr){
      sw = Math.round(sh * rr);
      sx = Math.round((wallpaperCanvas.width - sw) / 2);
    }else{
      sh = Math.round(sw / rr);
      sy = Math.round((wallpaperCanvas.height - sh) / 2);
    }
    ctx.save();
    if(cornerRadius > 0){
      roundedRectPath(ctx, rect.x, rect.y, rect.w, rect.h, cornerRadius);
      ctx.clip();
    }
    ctx.drawImage(wallpaperCanvas, sx, sy, sw, sh, rect.x, rect.y, rect.w, rect.h);
    ctx.restore();
  }

  function getTopAreaLuma(wallpaperCanvas){
    try{
      const sample = document.createElement('canvas');
      const sw = 96;
      const sh = 96;
      sample.width = sw;
      sample.height = sh;
      const sctx = sample.getContext('2d');
      if(!sctx) return 0.5;
      // Sample lockscreen header zone for adaptive clock contrast.
      sctx.drawImage(
        wallpaperCanvas,
        0, 0, wallpaperCanvas.width, Math.max(1, Math.round(wallpaperCanvas.height * 0.30)),
        0, 0, sw, sh
      );
      const img = sctx.getImageData(0, 0, sw, sh).data;
      let acc = 0;
      const n = sw * sh;
      for(let i = 0; i < img.length; i += 4){
        const r = img[i] / 255;
        const g = img[i + 1] / 255;
        const b = img[i + 2] / 255;
        acc += (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
      }
      return acc / Math.max(1, n);
    }catch(_){
      return 0.5;
    }
  }

  function drawLockscreenPreviewOverlay(ctx, rect, wallpaperCanvas){
    const txt = getLockScreenText();
    const luma = getTopAreaLuma(wallpaperCanvas);
    const isLightBg = luma > 0.70;
    const color = isLightBg ? 'rgba(22, 28, 45, 0.84)' : 'rgba(255,255,255,0.90)';
    const shadow = isLightBg ? 'rgba(255,255,255,0.16)' : 'rgba(8,12,24,0.30)';
    const dateY = rect.y + Math.round(rect.h * 0.095);
    const timeY = rect.y + Math.round(rect.h * 0.132);
    const dateSize = Math.max(16, Math.round(rect.w * 0.047));
    const dateWeight = 610;
    const timeWeight = 585;
    const timeTargetWidth = rect.w * 0.76;
    let timeSize = Math.max(80, Math.round(rect.w * 0.214));
    ctx.save();
    ctx.font = `${timeWeight} ${timeSize}px ${FONT_STACK_QUOTE}`;
    let measured = ctx.measureText(txt.time).width;
    if(measured > timeTargetWidth){
      const shrink = clamp(timeTargetWidth / Math.max(1, measured), 0.76, 1);
      timeSize = Math.floor(timeSize * shrink);
    }
    ctx.restore();
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
    ctx.shadowColor = shadow;
    ctx.shadowBlur = Math.round(rect.w * 0.010);
    ctx.font = `${dateWeight} ${dateSize}px ${FONT_STACK_QUOTE}`;
    ctx.fillText(txt.date, rect.x + (rect.w / 2), dateY);
    ctx.font = `${timeWeight} ${timeSize}px ${FONT_STACK_QUOTE}`;
    ctx.fillText(txt.time, rect.x + (rect.w / 2), timeY);
    ctx.restore();
  }

  function drawLockscreenSafeAreaOverlay(ctx, width, height){
    const top = Math.round(height * 0.245);
    const bottom = Math.round(height * 0.112);
    const side = Math.round(width * 0.073);
    const innerW = Math.max(0, width - side * 2);
    const innerH = Math.max(0, height - top - bottom);
    ctx.save();
    ctx.fillStyle = 'rgba(10, 14, 30, 0.18)';
    ctx.fillRect(0, 0, width, top);
    ctx.fillRect(0, height - bottom, width, bottom);
    ctx.fillRect(0, top, side, innerH);
    ctx.fillRect(width - side, top, side, innerH);
    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 5]);
    ctx.strokeRect(side + 0.5, top + 0.5, innerW - 1, innerH - 1);
    ctx.setLineDash([]);
    ctx.font = `700 ${Math.max(10, Math.round(width * 0.03))}px ${FONT_STACK_BODY}`;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.textBaseline = 'top';
    ctx.fillText('Safe Area', side + 10, top + Math.round(width * 0.02));
    ctx.restore();
  }

  async function buildIphoneMockupCanvas(wallpaperCanvas, assetPath, calibratedRect, useAutoDetect = false){
    try{
      const asset = await loadImageAsset(assetPath);
      const out = document.createElement('canvas');
      out.width = asset.naturalWidth || asset.width;
      out.height = asset.naturalHeight || asset.height;
      const ctx = out.getContext('2d');
      if(!ctx) return wallpaperCanvas;
      const autoRect = useAutoDetect ? detectScreenRectFromTransparency(asset) : null;
      const nRect = autoRect || calibratedRect;
      const rect = {
        x: Math.round(out.width * nRect.x),
        y: Math.round(out.height * nRect.y),
        w: Math.round(out.width * nRect.w),
        h: Math.round(out.height * nRect.h),
      };
      const cornerRadius = Math.round(Math.min(rect.w, rect.h) * Math.max(0, Number(nRect.r || 0)));
      drawWallpaperIntoRect(ctx, wallpaperCanvas, rect, cornerRadius);
      drawLockscreenPreviewOverlay(ctx, rect, wallpaperCanvas);
      ctx.drawImage(asset, 0, 0, out.width, out.height);
      return out;
    }catch(_){
      return wallpaperCanvas;
    }
  }

  async function exportPng(sentence, settings, options){
    const normalized = normalizeSettings(settings);
    await ensureFontsLoaded(normalized);
    const canvas = drawCard(sentence, normalized);
    const filename = resolveFilename(normalized, options || {});
    await saveCanvasAsPng(canvas, filename);
    if(options?.withMockup){
      const mockup = await buildIphoneMockupCanvas(canvas, IPHONE_MOCKUP_ASSETS.frame, { x: 0.2066, y: 0.0486, w: 0.6072, h: 0.8974, r: 0.095 });
      const mockupName = filename.replace(/\.png$/i, '-mockup.png');
      await saveCanvasAsPng(mockup, mockupName);
      const inHand = await buildIphoneMockupCanvas(canvas, IPHONE_MOCKUP_ASSETS.inHand, { x: 0.2822, y: 0.0475, w: 0.4635, h: 0.8186, r: 0.090 });
      const inHandName = filename.replace(/\.png$/i, '-inhand.png');
      await saveCanvasAsPng(inHand, inHandName);
    }
    return filename;
  }

  async function exportWallpaperBundle(sentence, settings, options){
    const normalized = normalizeSettings(Object.assign({}, settings || {}, { template: 'iphoneWallpaper', ratio: 'iphone' }));
    await ensureFontsLoaded(normalized);
    const canvas = drawCard(sentence, normalized);
    const filename = resolveFilename(normalized, options || {});
    await saveCanvasAsPng(canvas, filename);
    const mockup = await buildIphoneMockupCanvas(canvas, IPHONE_MOCKUP_ASSETS.frame, { x: 0.2066, y: 0.0486, w: 0.6072, h: 0.8974, r: 0.095 });
    const mockupName = filename.replace(/\.png$/i, '-mockup.png');
    await saveCanvasAsPng(mockup, mockupName);
    const inHand = await buildIphoneMockupCanvas(canvas, IPHONE_MOCKUP_ASSETS.inHand, { x: 0.2822, y: 0.0475, w: 0.4635, h: 0.8186, r: 0.090 });
    const inHandName = filename.replace(/\.png$/i, '-inhand.png');
    await saveCanvasAsPng(inHand, inHandName);
    return { wallpaper: filename, mockup: mockupName, inHand: inHandName };
  }

  async function copyPngToClipboard(sentence, settings){
    const normalized = normalizeSettings(settings);
    await ensureFontsLoaded(normalized);
    const canvas = drawCard(sentence, normalized);
    if(!navigator.clipboard || typeof navigator.clipboard.write !== 'function' || typeof ClipboardItem === 'undefined'){
      throw new Error('Clipboard image copy is not supported in this browser.');
    }
    const blob = await new Promise((resolve, reject)=>{
      canvas.toBlob((b)=>{
        if(b) resolve(b);
        else reject(new Error('Failed to generate image blob. Please retry.'));
      }, 'image/png');
    });
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  }

  function renderPreview(sentence, rawSettings, canvas){
    if(!canvas) return;
    const settings = normalizeSettings(rawSettings);
    const dims = resolveCanvasDims(settings);

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const requestedScale = Number(settings.previewScale || 1);
    const scale = clamp(Number.isFinite(requestedScale) ? requestedScale : 1, 0.65, 1.25);
    const clientWidth = Math.max(220, Math.floor(Number(settings.previewMaxWidth || 0) || canvas.clientWidth || 360));
    const fitMode = settings.previewFit !== false || settings.previewScaleMode === 'fit';
    const maxHeight = Math.max(0, Math.floor(Number(settings.previewMaxHeight || 0)));
    let baseWidth = clientWidth;
    if(fitMode && maxHeight > 0){
      const byHeight = Math.floor(maxHeight * (dims.width / dims.height) * 0.98);
      const byWidth = Math.floor(clientWidth * 0.98);
      baseWidth = Math.max(180, Math.min(byWidth, byHeight || byWidth));
    }
    const width = Math.max(180, Math.floor(baseWidth * (fitMode ? 1 : scale)));
    const height = Math.floor(width * (dims.height / dims.width));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.height = `${height}px`;
    canvas.style.width = `${width}px`;

    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ensureFontsLoaded(settings);
    const full = drawCard(sentence, settings);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(full, 0, 0, width, height);
    if(settings.previewSafeArea && settings.ratio === 'iphone'){
      drawLockscreenSafeAreaOverlay(ctx, width, height);
    }
    canvas.__layoutDebug = full.__layoutDebug || null;
  }

  global.QuoteCardExporter = {
    BRAND_NAME,
    BRAND_TAGLINE,
    DEFAULT_FEATURES,
    DEFAULT_SETTINGS,
    PRO_TEMPLATE_KEYS,
    MAIN_FONT_OPTIONS,
    CJK_FONT_OPTIONS,
    TEMPLATE_CONFIG,
    RATIO_MAP,
    RATIO_LAYOUT,
    WATERMARK_MODES,
    normalizeSettings,
    getUiState,
    calculateFontSize,
    getDomainText,
    toReadableSource,
    measureTextBlock,
    getQualityReport,
    getFontStacks,
    ensureFontsLoaded,
    resolveFilename,
    drawCard,
    exportPng,
    exportWallpaperBundle,
    copyPngToClipboard,
    renderPreview,
    getTimestamp,
  };
})(globalThis);
