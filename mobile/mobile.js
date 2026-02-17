// mobile.js
// Phase 3 scaffold: a simple, local IndexedDB-backed web manager for HORD assets.
// - Works without File System Access API (mobile-friendly).
// - Manual import/export only. No auto cloud writeback.
'use strict';

(function(){
  const KEY = 'hord_mobile_asset_v2';
  const DEVICE_KEY = 'hord_mobile_device_id_v1';
  const LANG_KEY = 'hord_mobile_lang_v1';
  const THEME_KEY = 'hord_mobile_theme_v1';
  const BACKUP_KEY = 'hord_mobile_backups_v1';
  const MOBILE_QUOTE_EXPORT_PREFS_KEY = 'hord_mobile_quote_export_prefs_v1';
  const DAY = 24 * 60 * 60 * 1000;

  const $ = (id)=>document.getElementById(id);

  function toast(id, msg){
    const el = $(id);
    if(!el) return;
    el.textContent = String(msg || '');
  }

  const I18N = {
    en: {
      brand_title: 'HORD Mobile Manager',
      brand_tagline: 'Import / manage / export your vocabulary asset without File System Access API.',
      tab_home: 'Home',
      tab_words: 'Words',
      tab_quotes: 'Quotes',
      tab_review: 'Review',
      tab_debug: 'Debug',
      h_asset: 'Asset',
      h_words: 'Words',
      h_quotes: 'Quotes',
      h_review: 'Review',
      h_debug: 'Debug',
      btn_import: 'Import',
      btn_export: 'Export',
      btn_reset: 'Reset Local Copy',
      btn_refresh: 'Refresh',
      btn_select: 'Select',
      btn_all: 'All',
      btn_delete: 'Delete',
      btn_apply: 'Apply',
      btn_start: 'Start',
      pill_none: 'No asset loaded',
      pill_loaded: 'Asset loaded',
      stat_total_words: 'Total Words',
      stat_total_quotes: 'Total Quotes',
      stat_updated: 'Updated',
      ph_search_words: 'Search word / meaning / note',
      ph_search_quotes: 'Search quote / translation / note',
      ph_tags: 'Add tags (comma)',
      hint_words: 'Tap a word to view details. Delete is soft-delete.',
      hint_quotes: 'Tap an item to view. Delete is soft-delete.',
      lbl_session_size: 'Session size',
      rate_forgot: 'Forgot',
      rate_hard: 'Hard',
      rate_easy: 'Easy',
      toast_import_first: 'Import an asset first.',
      toast_import_ok: 'Import successful (merged if local copy existed). You can export anytime.',
      toast_import_cancel: 'Import cancelled.',
      toast_exported: 'Exported. Upload/replace your cloud file manually if needed.',
      toast_saved: 'Saved.',
      toast_tags_missing: 'Enter tags first.',
      toast_tags_applied: (n)=>`Tags applied to ${n} items.`,
      toast_deleted: (n, what)=>`Deleted (soft) ${n} ${what}.`,
      confirm_import_merge: (w,q)=>`Import preview\n\nIncoming: words=${w} quotes=${q}\n\nProceed with import?`,
      import_merge_summary: (lw, lq, iw, iq, rw, rq, changed)=>(
        `Import preview (merge)\n\n`+
        `Local:   words=${lw} quotes=${lq}\n`+
        `Incoming: words=${iw} quotes=${iq}\n`+
        `Result:  words=${rw} quotes=${rq}\n\n`+
        `Changes detected: ${changed ? 'YES' : 'NO'}\n\n`+
        `Proceed with import?`
      ),
      confirm_delete_words: (n)=>`Soft-delete ${n} words?`,
      confirm_delete_quotes: (n)=>`Soft-delete ${n} quotes?`,
      confirm_delete_one_word: 'Soft-delete this word?',
      confirm_delete_one_quote: 'Soft-delete this quote?',
      rv_words: 'Words',
      rv_quotes: 'Quotes',
      badge_due: 'DUE',
      laser_badge: 'Smart Focus Review (50-100)',
    },
    zh: {
      brand_title: '\u0048\u004f\u0052\u0044 \u624b\u673a\u7ba1\u7406\u5668',
      brand_tagline: '\u5bfc\u5165 / \u7ba1\u7406 / \u5bfc\u51fa\u4f60\u7684\u5355\u8bcd\u8d44\u4ea7\uff0c\u4e0d\u4f9d\u8d56\u6587\u4ef6\u7cfb\u7edf API\u3002',
      tab_home: '\u4e3b\u9875',
      tab_words: '\u5355\u8bcd',
      tab_quotes: '\u91d1\u53e5',
      tab_review: '\u590d\u4e60',
      tab_debug: '\u8c03\u8bd5',
      h_asset: '\u8d44\u4ea7',
      h_words: '\u5355\u8bcd',
      h_quotes: '\u91d1\u53e5',
      h_review: '\u590d\u4e60',
      h_debug: '\u8c03\u8bd5',
      btn_import: '\u5bfc\u5165',
      btn_export: '\u5bfc\u51fa',
      btn_reset: '\u91cd\u7f6e\u672c\u5730\u526f\u672c',
      btn_refresh: '\u5237\u65b0',
      btn_select: '\u9009\u62e9',
      btn_all: '\u5168\u9009',
      btn_delete: '\u5220\u9664',
      btn_apply: '\u5e94\u7528',
      btn_start: '\u5f00\u59cb',
      pill_none: '\u672a\u52a0\u8f7d\u8d44\u4ea7',
      pill_loaded: '\u8d44\u4ea7\u5df2\u52a0\u8f7d',
      stat_total_words: '\u5355\u8bcd\u603b\u6570',
      stat_total_quotes: '\u91d1\u53e5\u603b\u6570',
      stat_updated: '\u66f4\u65b0\u65f6\u95f4',
      ph_search_words: '\u641c\u7d22\uff1a\u5355\u8bcd / \u91ca\u4e49 / \u6279\u6ce8',
      ph_search_quotes: '\u641c\u7d22\uff1a\u91d1\u53e5 / \u7ffb\u8bd1 / \u6279\u6ce8',
      ph_tags: '\u6dfb\u52a0\u6807\u7b7e\uff08\u9017\u53f7\u5206\u9694\uff09',
      hint_words: '\u70b9\u51fb\u5355\u8bcd\u67e5\u770b\u8be6\u60c5\uff1b\u5220\u9664\u4e3a\u8f6f\u5220\u9664\u3002',
      hint_quotes: '\u70b9\u51fb\u6761\u76ee\u67e5\u770b\u8be6\u60c5\uff1b\u5220\u9664\u4e3a\u8f6f\u5220\u9664\u3002',
      lbl_session_size: '\u5355\u6b21\u6570\u91cf',
      rate_forgot: '\u5fd8\u4e86',
      rate_hard: '\u56f0\u96be',
      rate_easy: '\u7b80\u5355',
      toast_import_first: '\u8bf7\u5148\u5bfc\u5165\u8d44\u4ea7\u6587\u4ef6\u3002',
      toast_import_ok: '\u5bfc\u5165\u6210\u529f\uff08\u5982\u6709\u672c\u5730\u526f\u672c\u4f1a\u81ea\u52a8\u5408\u5e76\uff09\u3002',
      toast_import_cancel: '\u5df2\u53d6\u6d88\u5bfc\u5165\u3002',
      toast_exported: '\u5df2\u5bfc\u51fa\u3002',
      toast_saved: '\u5df2\u4fdd\u5b58\u3002',
      toast_tags_missing: '\u8bf7\u5148\u8f93\u5165\u6807\u7b7e\u3002',
      toast_tags_applied: (n)=>`\u5df2\u4e3a ${n} \u6761\u8bb0\u5f55\u6dfb\u52a0\u6807\u7b7e\u3002`,
      toast_deleted: (n, what)=>`\u5df2\u8f6f\u5220\u9664 ${n} \u6761${what}\u3002`,
      confirm_import_merge: (w,q)=>`\u5bfc\u5165\u9884\u89c8\n\n\u5bfc\u5165\uff1a\u5355\u8bcd=${w} \u91d1\u53e5=${q}\n\n\u7ee7\u7eed\u5bfc\u5165\uff1f`,
      confirm_delete_words: (n)=>`\u8f6f\u5220\u9664 ${n} \u4e2a\u5355\u8bcd\uff1f`,
      confirm_delete_quotes: (n)=>`\u8f6f\u5220\u9664 ${n} \u6761\u91d1\u53e5\uff1f`,
      confirm_delete_one_word: '\u8f6f\u5220\u9664\u8fd9\u4e2a\u5355\u8bcd\uff1f',
      confirm_delete_one_quote: '\u8f6f\u5220\u9664\u8fd9\u6761\u91d1\u53e5\uff1f',
      rv_words: '\u5355\u8bcd',
      rv_quotes: '\u91d1\u53e5',
      badge_due: '\u5f85\u590d\u4e60',
      laser_badge: '\u667a\u80fd\u7cbe\u9009\u590d\u4e60\uff0850-100\uff09',
    }
  };

  const I18N_OVERRIDE = {
    en: {
      brand_tagline: 'Import / manage / export your full knowledge asset without File System Access API.',
      tab_home: '\ud83d\udce6 Asset',
      tab_words: '\ud83d\udcd8 Vocabulary',
      tab_quotes: '\u2728 Quotes',
      tab_review: '\ud83e\udde0 Review',
      h_words: '\ud83d\udcd8 Vocabulary',
      h_quotes: '\u2728 Quotes Library',
      stat_total_words: 'Vocabulary Size',
      hint_quotes: 'Tap an item to view details. Delete is soft-delete.',
      rv_words: '\ud83d\udcd8 Words',
      rv_quotes: '\u2728 Quotes',
      rv_mode_both: 'CN + EN',
      rv_mode_cn: 'CN only',
      rv_mode_en: 'EN only',
      sync_guide_title: 'How to sync with Desktop',
      sync_guide_body: 'Desktop: export HORD asset JSON -> Mobile: Import -> after study Export and replace cloud file -> Desktop import/merge.',
      word_unit: 'words',
      quote_unit: 'quotes',
    },
    zh: {
      brand_title: '\u0048\u004f\u0052\u0044 \u624b\u673a\u7ba1\u7406\u5668',
      brand_tagline: '\u4e0d\u4f9d\u8d56\u6587\u4ef6\u7cfb\u7edf API\uff0c\u5bfc\u5165 / \u7ba1\u7406 / \u5bfc\u51fa\u5b8c\u6574\u8d44\u4ea7\u3002',
      tab_home: '\ud83d\udce6 \u8d44\u4ea7',
      tab_words: '\ud83d\udcd8 \u5355\u8bcd\u672c',
      tab_quotes: '\u2728 \u91d1\u53e5\u5e93',
      tab_review: '\ud83e\udde0 \u827e\u5bbe\u6d69\u65af\u590d\u4e60',
      tab_debug: '\u8c03\u8bd5',
      h_asset: '\u8d44\u4ea7\u6587\u4ef6',
      h_words: '\ud83d\udcd8 \u5355\u8bcd\u672c',
      h_quotes: '\u2728 \u91d1\u53e5\u5e93',
      h_review: '\ud83e\udde0 \u827e\u5bbe\u6d69\u65af\u590d\u4e60',
      h_debug: '\u8c03\u8bd5',
      btn_import: '\u5bfc\u5165',
      btn_export: '\u5bfc\u51fa',
      btn_reset: '\u91cd\u7f6e\u672c\u5730\u526f\u672c',
      btn_refresh: '\u5237\u65b0',
      btn_select: '\u9009\u62e9',
      btn_all: '\u5168\u9009',
      btn_delete: '\u5220\u9664',
      btn_apply: '\u5e94\u7528',
      btn_start: '\u5f00\u59cb',
      pill_none: '\u672a\u52a0\u8f7d\u8d44\u4ea7',
      pill_loaded: '\u8d44\u4ea7\u5df2\u52a0\u8f7d',
      stat_total_words: '\u5355\u8bcd\u603b\u6570',
      stat_total_quotes: '\u91d1\u53e5\u603b\u6570',
      stat_updated: '\u66f4\u65b0\u65f6\u95f4',
      ph_search_words: '\u641c\u7d22\uff1a\u5355\u8bcd / \u91ca\u4e49 / \u6279\u6ce8',
      ph_search_quotes: '\u641c\u7d22\uff1a\u91d1\u53e5 / \u7ffb\u8bd1 / \u6279\u6ce8',
      ph_tags: '\u6dfb\u52a0\u6807\u7b7e\uff08\u9017\u53f7\u5206\u9694\uff09',
      hint_words: '\u70b9\u51fb\u5355\u8bcd\u67e5\u770b\u8be6\u60c5\uff1b\u5220\u9664\u4e3a\u8f6f\u5220\u9664\u3002',
      hint_quotes: '\u70b9\u51fb\u6761\u76ee\u67e5\u770b\u8be6\u60c5\uff1b\u5220\u9664\u4e3a\u8f6f\u5220\u9664\u3002',
      lbl_session_size: '\u5355\u6b21\u6570\u91cf',
      rate_forgot: '\u5fd8\u4e86',
      rate_hard: '\u56f0\u96be',
      rate_easy: '\u7b80\u5355',
      toast_import_first: '\u8bf7\u5148\u5bfc\u5165\u8d44\u4ea7\u6587\u4ef6\u3002',
      toast_import_ok: '\u5bfc\u5165\u6210\u529f\uff08\u5982\u6709\u672c\u5730\u526f\u672c\u4f1a\u81ea\u52a8\u5408\u5e76\uff09\uff0c\u53ef\u968f\u65f6\u5bfc\u51fa\u3002',
      toast_import_cancel: '\u5df2\u53d6\u6d88\u5bfc\u5165\u3002',
      toast_exported: '\u5df2\u5bfc\u51fa\u3002\u53ef\u624b\u52a8\u4e0a\u4f20/\u8986\u76d6 OneDrive\u3001iCloud \u7b49\u4e91\u76d8\u6587\u4ef6\u3002',
      toast_saved: '\u5df2\u4fdd\u5b58\u3002',
      toast_tags_missing: '\u8bf7\u5148\u8f93\u5165\u6807\u7b7e\u3002',
      toast_tags_applied: (n)=>`\u5df2\u4e3a ${n} \u6761\u8bb0\u5f55\u6dfb\u52a0\u6807\u7b7e\u3002`,
      toast_deleted: (n, what)=>`\u5df2\u8f6f\u5220\u9664 ${n} \u6761${what}\u3002`,
      rv_words: '\u5355\u8bcd',
      rv_quotes: '\u91d1\u53e5',
      rv_mode_both: '\u4e2d\u82f1\u90fd\u663e\u793a',
      rv_mode_cn: '\u4ec5\u4e2d\u6587',
      rv_mode_en: '\u4ec5\u82f1\u6587',
      badge_due: '\u5f85\u590d\u4e60',
      laser_badge: '\u667a\u80fd\u7cbe\u9009\u590d\u4e60\uff0850-100\uff09',
      sync_guide_title: '\u5982\u4f55\u4e0e\u7535\u8111\u540c\u6b65',
      sync_guide_body: '\u7535\u8111\u7aef\u5bfc\u51fa HORD \u8d44\u4ea7 JSON -> \u624b\u673a\u7aef\u5bfc\u5165 -> \u5b66\u4e60\u540e\u5bfc\u51fa\u5e76\u8986\u76d6\u4e91\u76d8\u6587\u4ef6 -> \u7535\u8111\u7aef\u7acb\u5373\u8bfb\u53d6\u5408\u5e76\u3002',
      word_unit: '\u4e2a\u5355\u8bcd',
      quote_unit: '\u6761\u91d1\u53e5',
      import_merge_summary: (lw, lq, iw, iq, rw, rq, changed)=>(
        `\u5bfc\u5165\u9884\u89c8\uff08\u5408\u5e76\uff09\n\n`+
        `\u672c\u5730\uff1a\u5355\u8bcd=${lw} \u91d1\u53e5=${lq}\n`+
        `\u5bfc\u5165\uff1a\u5355\u8bcd=${iw} \u91d1\u53e5=${iq}\n`+
        `\u7ed3\u679c\uff1a\u5355\u8bcd=${rw} \u91d1\u53e5=${rq}\n\n`+
        `\u68c0\u6d4b\u5230\u53d8\u66f4\uff1a${changed ? '\u662f' : '\u5426'}\n\n`+
        `\u786e\u8ba4\u7ee7\u7eed\u5bfc\u5165\u5417\uff1f`
      ),
      confirm_import_merge: (w,q)=>`\u5bfc\u5165\u9884\u89c8\n\n\u5bfc\u5165\u5185\u5bb9\uff1a\u5355\u8bcd=${w}\uff0c\u91d1\u53e5=${q}\n\n\u7ee7\u7eed\u5bfc\u5165\u5417\uff1f`,
      confirm_delete_words: (n)=>`\u8f6f\u5220\u9664 ${n} \u4e2a\u5355\u8bcd\uff1f`,
      confirm_delete_quotes: (n)=>`\u8f6f\u5220\u9664 ${n} \u6761\u91d1\u53e5\uff1f`,
      confirm_delete_one_word: '\u8f6f\u5220\u9664\u8fd9\u4e2a\u5355\u8bcd\uff1f',
      confirm_delete_one_quote: '\u8f6f\u5220\u9664\u8fd9\u6761\u91d1\u53e5\uff1f',
    }
  };

  function getLang(){
    try{
      const v = String(localStorage.getItem(LANG_KEY) || '').trim().toLowerCase();
      if(v === 'zh' || v === 'en') return v;
    }catch(_){}
    const nav = String(navigator.language || '').toLowerCase();
    if(nav.startsWith('zh')) return 'zh';
    // Default to Chinese for first-run UX in this project.
    return 'zh';
  }

  function getThemeMode(){
    try{
      const v = String(localStorage.getItem(THEME_KEY) || '').trim().toLowerCase();
      if(v === 'light' || v === 'dark' || v === 'auto') return v;
    }catch(_){}
    return 'auto';
  }

  function resolveThemeMode(mode){
    const m = String(mode || '').toLowerCase();
    if(m === 'light' || m === 'dark') return m;
    const prefersDark = !!(globalThis.matchMedia && globalThis.matchMedia('(prefers-color-scheme: dark)').matches);
    return prefersDark ? 'dark' : 'light';
  }

  function detectVersionMeta(){
    const out = { tag: 'vweb', source: 'fallback' };
    try{
      if(globalThis.chrome?.runtime?.getManifest){
        const v = String(globalThis.chrome.runtime.getManifest().version || '').trim();
        if(v) return { tag: `v${v}`, source: 'manifest' };
      }
    }catch(_){}
    try{
      const q = new URLSearchParams(String(location.search || ''));
      const v = String(q.get('v') || '').trim();
      if(v) return { tag: `v${v}`, source: 'query:v' };
      const b = String(q.get('build') || '').trim();
      if(b) return { tag: `b${b}`, source: 'query:build' };
    }catch(_){}
    return out;
  }

  function applyTheme(){
    const visualMode = resolveThemeMode(themeMode);
    try{
      document.documentElement.setAttribute('data-theme', visualMode === 'dark' ? 'dark' : 'light');
    }catch(_){}
    const bt = $('btn-theme');
    if(bt){
      bt.textContent = themeMode === 'auto' ? '\ud83c\udf17' : (themeMode === 'dark' ? '\u2600\ufe0f' : '\ud83c\udf19');
      if(themeMode === 'auto'){
        bt.title = lang === 'zh'
          ? '\u4e3b\u9898\uff1a\u8ddf\u968f\u7cfb\u7edf\uff08\u70b9\u51fb\u5207\u6362\u5230\u6d45\u8272\uff09'
          : 'Theme: Auto (follow system). Tap to switch to light.';
      }else if(themeMode === 'dark'){
        bt.title = lang === 'zh'
          ? '\u4e3b\u9898\uff1a\u6df1\u8272\uff08\u70b9\u51fb\u5207\u6362\u5230\u8ddf\u968f\u7cfb\u7edf\uff09'
          : 'Theme: Dark. Tap to switch to auto.';
      }else{
        bt.title = lang === 'zh'
          ? '\u4e3b\u9898\uff1a\u6d45\u8272\uff08\u70b9\u51fb\u5207\u6362\u5230\u6df1\u8272\uff09'
          : 'Theme: Light. Tap to switch to dark.';
      }
    }
  }

  function setVersionTag(){
    const vm = detectVersionMeta();
    const el = $('mobile-version');
    if(el) el.textContent = vm.tag;
    const dbg = $('dbg-version');
    if(dbg){
      dbg.textContent = lang === 'zh'
        ? `版本：${vm.tag}（${vm.source}）`
        : `Version: ${vm.tag} (${vm.source})`;
    }
  }

  function themeModeLabel(mode){
    const m = String(mode || '').toLowerCase();
    if(lang === 'zh'){
      if(m === 'dark') return '\u6df1\u8272';
      if(m === 'light') return '\u6d45\u8272';
      return '\u8ddf\u968f\u7cfb\u7edf';
    }
    if(m === 'dark') return 'Dark';
    if(m === 'light') return 'Light';
    return 'Auto';
  }

  let lang = getLang();
  let themeMode = 'light';
  let wordsSortField = 'time';
  let wordsSortDir = 'desc';
  let quotesSortField = 'time';
  let quotesSortDir = 'desc';
  let quoteExportPrefs = {
    template: 'hordSignature',
    mainFont: 'inter',
    cjkFont: 'notoSansSC',
  };
  const quoteExportRuntime = {
    inFlight: false,
    cancelRequested: false,
    total: 0,
    done: 0,
    failed: 0,
    retried: 0,
    failedIds: [],
  };
  let activeWordAudio = null;
  let mediaThemeQuery = null;
  let mediaThemeBound = false;

  function pickMeaningFromEnglishMeaning(list){
    const arr = Array.isArray(list) ? list : [];
    if(!arr.length) return '';
    for(const it of arr){
      const s = String(it || '').trim();
      if(!s) continue;
      if(/[\u4e00-\u9fff]/.test(s)) return s;
    }
    return String(arr[0] || '').trim();
  }

  function getWordMeaning(rec){
    if(!rec || typeof rec !== 'object') return '';
    const m0 = String(rec.meaning || '').trim();
    if(m0) return m0;
    const cjkFromEn = pickMeaningFromEnglishMeaning(rec.englishMeaning);
    if(cjkFromEn) return cjkFromEn;
    const fallbacks = ['translation', 'cnMeaning', 'chineseMeaning', 'zh', 'definitionZh'];
    for(const k of fallbacks){
      const v = String(rec[k] || '').trim();
      if(v) return v;
    }
    return '';
  }

  function getWordEnglishMeaning(rec){
    if(!rec || typeof rec !== 'object') return '';
    const arr = Array.isArray(rec.englishMeaning) ? rec.englishMeaning.map(x=>String(x||'').trim()).filter(Boolean) : [];
    if(arr.length) return arr.join('; ');
    const candidates = ['definitionEn', 'enMeaning', 'explainEn'];
    for(const k of candidates){
      const v = String(rec[k] || '').trim();
      if(v) return v;
    }
    return '';
  }

  function getWordPhonetic(rec, accent){
    if(!rec || typeof rec !== 'object') return '';
    const k = String(accent || '').toLowerCase() === 'uk' ? 'uk' : 'us';
    const fromRoot = k === 'uk'
      ? String(rec.phoneticUK || rec.phoneticUk || '').trim()
      : String(rec.phoneticUS || rec.phoneticUs || '').trim();
    if(fromRoot) return fromRoot;
    const p = rec.phonetics && typeof rec.phonetics === 'object' ? rec.phonetics : {};
    return String(k === 'uk' ? (p.uk || p.UK || '') : (p.us || p.US || '')).trim();
  }

  function getWordAudioUrl(rec, accent){
    if(!rec || typeof rec !== 'object') return '';
    const k = String(accent || '').toLowerCase() === 'uk' ? 'uk' : 'us';
    const fromRoot = k === 'uk'
      ? String(rec.audioUK || rec.audioUk || '').trim()
      : String(rec.audioUS || rec.audioUs || '').trim();
    if(fromRoot) return fromRoot;
    const a = rec.audio && typeof rec.audio === 'object' ? rec.audio : {};
    return String(k === 'uk' ? (a.uk || a.UK || '') : (a.us || a.US || '')).trim();
  }

  function stopWordPronounce(){
    try{
      if(activeWordAudio){
        activeWordAudio.pause();
        activeWordAudio.currentTime = 0;
      }
    }catch(_){}
    activeWordAudio = null;
    try{
      if(globalThis.speechSynthesis) globalThis.speechSynthesis.cancel();
    }catch(_){}
    $('dlg-w-play-us')?.classList.remove('is-playing');
    $('dlg-w-play-uk')?.classList.remove('is-playing');
  }

  function bindThemeMediaWatcher(){
    if(mediaThemeBound) return;
    try{
      mediaThemeQuery = globalThis.matchMedia ? globalThis.matchMedia('(prefers-color-scheme: dark)') : null;
      if(!mediaThemeQuery) return;
      const onChange = ()=>{
        if(themeMode === 'auto') applyTheme();
      };
      if(typeof mediaThemeQuery.addEventListener === 'function'){
        mediaThemeQuery.addEventListener('change', onChange);
      }else if(typeof mediaThemeQuery.addListener === 'function'){
        mediaThemeQuery.addListener(onChange);
      }
      mediaThemeBound = true;
    }catch(_){}
  }

  function speakWordFallback(word, accent){
    try{
      const text = String(word || '').trim();
      if(!text || !globalThis.speechSynthesis || !globalThis.SpeechSynthesisUtterance) return false;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = String(accent || '').toLowerCase() === 'uk' ? 'en-GB' : 'en-US';
      u.rate = 0.9;
      globalThis.speechSynthesis.cancel();
      globalThis.speechSynthesis.speak(u);
      return true;
    }catch(_){
      return false;
    }
  }

  async function playWordPronounce(rec, accent){
    stopWordPronounce();
    const isUk = String(accent || '').toLowerCase() === 'uk';
    const btnOn = isUk ? $('dlg-w-play-uk') : $('dlg-w-play-us');
    const btnOff = isUk ? $('dlg-w-play-us') : $('dlg-w-play-uk');
    btnOff?.classList.remove('is-playing');
    btnOn?.classList.add('is-playing');
    const url = getWordAudioUrl(rec, accent);
    if(url){
      try{
        const a = new Audio(url);
        activeWordAudio = a;
        a.addEventListener('ended', ()=> stopWordPronounce(), { once: true });
        a.addEventListener('error', ()=> stopWordPronounce(), { once: true });
        await a.play();
        return true;
      }catch(_){}
    }
    const ok = speakWordFallback(rec?.word || rec?.id || '', accent);
    if(ok){
      toast('toast-dlg-word', lang === 'zh' ? '\u5df2\u4f7f\u7528\u7cfb\u7edf\u53d1\u97f3\u3002' : 'Using system pronunciation.');
      setTimeout(()=> stopWordPronounce(), 900);
    }
    return ok;
  }

  function sortRecords(arr, field, dir, kind){
    const list = Array.isArray(arr) ? arr.slice() : [];
    const mult = dir === 'asc' ? 1 : -1;
    list.sort((a, b)=>{
      if(field === 'alpha'){
        const ta = String(kind === 'quotes' ? (a?.text || '') : (a?.word || a?.id || '')).toLowerCase();
        const tb = String(kind === 'quotes' ? (b?.text || '') : (b?.word || b?.id || '')).toLowerCase();
        return ta.localeCompare(tb) * mult;
      }
      if(field === 'review'){
        return ((Number(a?.reviewCount) || 0) - (Number(b?.reviewCount) || 0)) * mult;
      }
      const ta = Number(a?.updatedAt || a?.createdAt || 0);
      const tb = Number(b?.updatedAt || b?.createdAt || 0);
      return (ta - tb) * mult;
    });
    return list;
  }

  function loadQuoteExportPrefs(){
    try{
      const raw = JSON.parse(String(localStorage.getItem(MOBILE_QUOTE_EXPORT_PREFS_KEY) || '{}'));
      if(raw && typeof raw === 'object'){
        quoteExportPrefs = Object.assign({}, quoteExportPrefs, raw);
      }
    }catch(_){}
  }
  function saveQuoteExportPrefs(){
    try{
      localStorage.setItem(MOBILE_QUOTE_EXPORT_PREFS_KEY, JSON.stringify(quoteExportPrefs));
    }catch(_){}
  }

  const SAVE_DEBOUNCE_MS = 1000;
  const persist = {
    timer: 0,
    dirty: false,
    inFlight: false,
    lastError: '',
  };

  function cloneJson(x){
    try{ return JSON.parse(JSON.stringify(x)); }catch(_){ return null; }
  }

  // Pro placeholders (mobile web stays free; keep capability shape consistent).
  function getCapabilities(){
    return { assetMode: false, laserMode: true, advancedTemplates: false };
  }
  function isProUser(){
    return false;
  }

  async function loadBackups(){
    try{
      const v = await globalThis.HordIdbKv.get(BACKUP_KEY);
      const arr = Array.isArray(v) ? v : [];
      return arr.filter(x=>x && typeof x === 'object' && x.ts && x.asset).slice(0, 3);
    }catch(_){
      return [];
    }
  }

  async function saveBackups(arr){
    try{
      await globalThis.HordIdbKv.set(BACKUP_KEY, Array.isArray(arr) ? arr.slice(0, 3) : []);
    }catch(_){}
  }

  async function pushBackup(asset, reason){
    if(!asset) return;
    const snap = cloneJson(asset);
    if(!snap) return;
    const item = {
      ts: Date.now(),
      reason: String(reason || ''),
      asset: snap,
    };
    const cur = await loadBackups();
    cur.unshift(item);
    await saveBackups(cur.slice(0, 3));
  }

  async function flushSave(asset){
    if(!asset) return false;
    if(!persist.dirty) return true;
    if(persist.inFlight) return false;
    persist.inFlight = true;
    try{
      await saveAsset(asset);
      persist.dirty = false;
      persist.lastError = '';
      try{ updateHomeUI(asset); }catch(_){}
      return true;
    }catch(e){
      persist.lastError = String(e && e.message || e || 'write_failed');
      persist.dirty = true;
      try{ updateHomeUI(asset); }catch(_){}
      return false;
    }finally{
      persist.inFlight = false;
    }
  }

  function scheduleSave(asset){
    if(!asset) return;
    persist.dirty = true;
    try{ updateHomeUI(asset); }catch(_){}
    if(persist.timer) clearTimeout(persist.timer);
    persist.timer = setTimeout(()=>{ flushSave(asset).catch(()=>{}); }, SAVE_DEBOUNCE_MS);
  }

  function t(key, ...args){
    const ovPack = I18N_OVERRIDE[lang] || null;
    if(ovPack && Object.prototype.hasOwnProperty.call(ovPack, key)){
      const v0 = ovPack[key];
      if(typeof v0 === 'function') return v0(...args);
      return String(v0 ?? key);
    }
    const pack = I18N[lang] || I18N.en;
    const v = pack[key] ?? I18N.en[key];
    if(typeof v === 'function') return v(...args);
    return String(v ?? key);
  }

  function applyI18n(){
    try{
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    }catch(_){}

    // Brand
    $('brandTitle') && ($('brandTitle').textContent = t('brand_title'));
    $('brandTagline') && ($('brandTagline').textContent = t('brand_tagline'));

    // Tabs
    $('tab-home') && ($('tab-home').textContent = t('tab_home'));
    $('tab-words') && ($('tab-words').textContent = t('tab_words'));
    $('tab-quotes') && ($('tab-quotes').textContent = t('tab_quotes'));
    $('tab-review') && ($('tab-review').textContent = t('tab_review'));
    $('tab-debug') && ($('tab-debug').textContent = t('tab_debug'));
    $('rv-words') && ($('rv-words').textContent = t('rv_words'));
    $('rv-quotes') && ($('rv-quotes').textContent = t('rv_quotes'));
    $('home-sync-guide')?.querySelector('div') && ($('home-sync-guide').querySelector('div').textContent = t('sync_guide_title'));
    $('home-sync-guide')?.querySelector('.small') && ($('home-sync-guide').querySelector('.small').textContent = t('sync_guide_body'));
    const rvMode = $('rv-meaning-mode');
    if(rvMode){
      const o0 = rvMode.querySelector('option[value="both"]'); if(o0) o0.textContent = t('rv_mode_both');
      const o1 = rvMode.querySelector('option[value="cn"]'); if(o1) o1.textContent = t('rv_mode_cn');
      const o2 = rvMode.querySelector('option[value="en"]'); if(o2) o2.textContent = t('rv_mode_en');
    }

    // Headings
    document.querySelector('#panel-home h2') && (document.querySelector('#panel-home h2').textContent = t('h_asset'));
    document.querySelector('#panel-words h2') && (document.querySelector('#panel-words h2').textContent = t('h_words'));
    document.querySelector('#panel-quotes h2') && (document.querySelector('#panel-quotes h2').textContent = t('h_quotes'));
    document.querySelector('#panel-review h2') && (document.querySelector('#panel-review h2').textContent = t('h_review'));
    document.querySelector('#panel-debug h2') && (document.querySelector('#panel-debug h2').textContent = t('h_debug'));

    // Buttons / labels
    $('btn-import') && ($('btn-import').textContent = t('btn_import'));
    $('btn-export') && ($('btn-export').textContent = t('btn_export'));
    $('btn-reset') && ($('btn-reset').textContent = t('btn_reset'));
    $('w-refresh') && ($('w-refresh').textContent = t('btn_refresh'));
    $('q-refresh') && ($('q-refresh').textContent = t('btn_refresh'));
    $('w-select') && ($('w-select').textContent = t('btn_select'));
    $('q-select') && ($('q-select').textContent = t('btn_select'));
    $('w-all') && ($('w-all').textContent = t('btn_all'));
    $('q-export-img') && ($('q-export-img').textContent = (lang === 'zh' ? '\ud83d\uddbc\ufe0f \u5bfc\u51fa\u56fe\u7247' : '\ud83d\uddbc\ufe0f Export Image'));
    $('w-sort-dir') && ($('w-sort-dir').textContent = wordsSortDir === 'asc' ? '↑' : '↓');
    $('q-sort-dir') && ($('q-sort-dir').textContent = quotesSortDir === 'asc' ? '↑' : '↓');
    const wSort = $('w-sort');
    if(wSort){
      const o0 = wSort.querySelector('option[value="time"]'); if(o0) o0.textContent = (lang === 'zh' ? '\u6309\u65f6\u95f4' : 'By time');
      const o1 = wSort.querySelector('option[value="alpha"]'); if(o1) o1.textContent = (lang === 'zh' ? '\u6309\u5b57\u6bcd' : 'A-Z');
      const o2 = wSort.querySelector('option[value="review"]'); if(o2) o2.textContent = (lang === 'zh' ? '\u6309\u590d\u4e60\u6b21\u6570' : 'By reviews');
    }
    const qSort = $('q-sort');
    if(qSort){
      const o0 = qSort.querySelector('option[value="time"]'); if(o0) o0.textContent = (lang === 'zh' ? '\u6309\u65f6\u95f4' : 'By time');
      const o1 = qSort.querySelector('option[value="alpha"]'); if(o1) o1.textContent = (lang === 'zh' ? '\u6309\u5b57\u6bcd' : 'A-Z');
      const o2 = qSort.querySelector('option[value="review"]'); if(o2) o2.textContent = (lang === 'zh' ? '\u6309\u590d\u4e60\u6b21\u6570' : 'By reviews');
    }
    $('w-batch-del') && ($('w-batch-del').textContent = t('btn_delete'));
    $('q-batch-del') && ($('q-batch-del').textContent = t('btn_delete'));
    $('q-export-cancel') && ($('q-export-cancel').textContent = (lang === 'zh' ? '\u53d6\u6d88\u5bfc\u51fa' : 'Cancel Export'));
    $('q-export-fail-title') && ($('q-export-fail-title').textContent = (lang === 'zh' ? '\u5931\u8d25\u9879' : 'Failed items'));
    $('q-export-retry-failed') && ($('q-export-retry-failed').textContent = (lang === 'zh' ? '\u4ec5\u91cd\u8bd5\u5931\u8d25\u9879' : 'Retry Failed'));
    $('w-batch-tag-apply') && ($('w-batch-tag-apply').textContent = t('btn_apply'));
    $('q-batch-tag-apply') && ($('q-batch-tag-apply').textContent = t('btn_apply'));
    $('q-exp-style-lbl') && ($('q-exp-style-lbl').textContent = (lang === 'zh' ? '\u5bfc\u51fa\u6837\u5f0f' : 'Export style'));
    $('lbl-session-size') && ($('lbl-session-size').textContent = t('lbl_session_size'));
    $('btn-start') && ($('btn-start').textContent = t('btn_start'));
    $('btn-backup-now') && ($('btn-backup-now').textContent = (lang === 'zh' ? '\u4fdd\u5b58\u5feb\u7167' : 'Save Snapshot'));
    $('btn-restore-backup') && ($('btn-restore-backup').textContent = (lang === 'zh' ? '\u6062\u590d\u5feb\u7167' : 'Restore Snapshot'));
    $('bk-hint') && ($('bk-hint').textContent = (lang === 'zh' ? '\u4ec5\u4fdd\u7559\u6700\u65b0 3 \u4efd\u5feb\u7167\uff0c\u6062\u590d\u4ec5\u5f71\u54cd\u672c\u5730\u3002' : 'Keeps the latest 3 snapshots. Restore is local-only.'));
    $('btn-dump') && ($('btn-dump').textContent = (lang === 'zh' ? '\u5bfc\u51fa JSON \u8c03\u8bd5' : 'Dump JSON'));
    $('btn-rehash') && ($('btn-rehash').textContent = (lang === 'zh' ? '\u91cd\u7b97 Hash' : 'Recompute Hash'));
    $('btn-cache-bust') && ($('btn-cache-bust').textContent = (lang === 'zh' ? '\u5f3a\u5237\u9875\u9762\uff08\u9632\u7f13\u5b58\uff09' : 'Reload (no cache)'));

    // Dialog labels + placeholders
    $('dlg-w-label') && ($('dlg-w-label').textContent = (lang === 'zh' ? '\u5355\u8bcd\u8be6\u60c5' : 'Word details'));
    $('dlg-q-label') && ($('dlg-q-label').textContent = (lang === 'zh' ? '\u7f16\u8f91\u91d1\u53e5' : 'Edit Quote'));
    $('dlg-w-del') && ($('dlg-w-del').textContent = t('btn_delete'));
    $('dlg-q-del') && ($('dlg-q-del').textContent = t('btn_delete'));
    $('dlg-w-close') && ($('dlg-w-close').textContent = (lang === 'zh' ? '\u5173\u95ed' : 'Close'));
    $('dlg-q-close') && ($('dlg-q-close').textContent = (lang === 'zh' ? '\u5173\u95ed' : 'Close'));
    $('dlg-q-save') && ($('dlg-q-save').textContent = (lang === 'zh' ? '\u4fdd\u5b58' : 'Save'));
    $('dlg-q-export') && ($('dlg-q-export').textContent = (lang === 'zh' ? '\ud83d\uddbc\ufe0f \u5bfc\u51fa\u56fe\u7247' : '\ud83d\uddbc\ufe0f Export Image'));
    $('dlg-w-meaning') && ($('dlg-w-meaning').placeholder = (lang === 'zh' ? '\u4e2d\u6587\u91ca\u4e49' : 'Chinese meaning'));
    $('dlg-w-english') && ($('dlg-w-english').placeholder = (lang === 'zh' ? '\u82f1\u6587\u91ca\u4e49' : 'English meaning'));
    $('dlg-w-note') && ($('dlg-w-note').placeholder = (lang === 'zh' ? '\u6279\u6ce8' : 'Note / Annotation'));
    $('dlg-w-play-us') && ($('dlg-w-play-us').textContent = '\ud83d\udd0a US');
    $('dlg-w-play-uk') && ($('dlg-w-play-uk').textContent = '\ud83d\udd0a UK');
    $('dlg-q-text') && ($('dlg-q-text').placeholder = (lang === 'zh' ? '\u91d1\u53e5\u539f\u6587' : 'Quote text'));
    $('dlg-q-translation') && ($('dlg-q-translation').placeholder = (lang === 'zh' ? '\u7ffb\u8bd1' : 'Translation'));
    $('dlg-q-note') && ($('dlg-q-note').placeholder = (lang === 'zh' ? '\u6279\u6ce8' : 'Note / Annotation'));
    $('dlg-q-url') && ($('dlg-q-url').placeholder = (lang === 'zh' ? '\u6765\u6e90\u94fe\u63a5\uff08\u53ef\u9009\uff09' : 'Source URL (optional)'));
    $('dlg-q-title2') && ($('dlg-q-title2').placeholder = (lang === 'zh' ? '\u9875\u9762\u6807\u9898\uff08\u53ef\u9009\uff09' : 'Page title (optional)'));
    $('dlg-q-tags') && ($('dlg-q-tags').placeholder = (lang === 'zh' ? '\u6807\u7b7e\uff08\u9017\u53f7\u5206\u9694\uff09' : 'Tags (comma separated)'));

    // Stats labels
    $('lbl-total-words') && ($('lbl-total-words').textContent = t('stat_total_words'));
    $('lbl-total-quotes') && ($('lbl-total-quotes').textContent = t('stat_total_quotes'));
    $('lbl-updated') && ($('lbl-updated').textContent = t('stat_updated'));

    // Placeholders / hints
    $('w-q') && ($('w-q').placeholder = t('ph_search_words'));
    $('q-q') && ($('q-q').placeholder = t('ph_search_quotes'));
    $('w-batch-tags') && ($('w-batch-tags').placeholder = t('ph_tags'));
    $('q-batch-tags') && ($('q-batch-tags').placeholder = t('ph_tags'));
    $('w-hint') && ($('w-hint').textContent = t('hint_words'));
    $('q-hint') && ($('q-hint').textContent = t('hint_quotes'));

    // Review buttons
    document.querySelector('.rate[data-q=\"0\"]') && (document.querySelector('.rate[data-q=\"0\"]').textContent = t('rate_forgot'));
    document.querySelector('.rate[data-q=\"3\"]') && (document.querySelector('.rate[data-q=\"3\"]').textContent = t('rate_hard'));
    document.querySelector('.rate[data-q=\"5\"]') && (document.querySelector('.rate[data-q=\"5\"]').textContent = t('rate_easy'));

    // Language toggle shows the target language label (what you switch to).
    const bl = $('btn-lang');
    if(bl){
      bl.textContent = (lang === 'zh') ? '\ud83c\uddec\ud83c\udde7' : '\ud83c\udde8\ud83c\uddf3';
      bl.title = (lang === 'zh') ? 'Switch to English' : '\u5207\u6362\u5230\u4e2d\u6587';
    }
    const rmh = $('review-mode-hint');
    if(rmh){
      rmh.textContent = lang === 'zh'
        ? '\u8bcd\u91cf\u8f83\u5927\u65f6\uff0c\u4f1a\u81ea\u52a8\u805a\u7126\u6700\u8be5\u590d\u4e60\u7684 50-100 \u9879\u3002'
        : 'When your library is large, review auto-focuses on the most important 50-100 items.';
    }
    applyTheme();
    setVersionTag();
    updateSortStatePills();
  }

  function initBrandAssets(){
    const img = document.querySelector('.logoImg');
    if(!(img instanceof HTMLImageElement)) return;
    if(img.dataset.brandInit === '1') return;
    img.dataset.brandInit = '1';
    img.addEventListener('error', ()=>{
      const cur = String(img.getAttribute('src') || '').trim();
      if(cur === 'icon128.png'){
        img.style.display = 'none';
        return;
      }
      img.setAttribute('src', 'icon128.png');
    }, { once: false });
  }

  function initQuoteExportControls(){
    loadQuoteExportPrefs();
    const exporter = globalThis.QuoteCardExporter || null;
    const mainSel = $('q-exp-main-font');
    const cjkSel = $('q-exp-cjk-font');
    const tplSel = $('q-exp-template');

    if(mainSel){
      const fontMap = exporter?.MAIN_FONT_OPTIONS && typeof exporter.MAIN_FONT_OPTIONS === 'object'
        ? exporter.MAIN_FONT_OPTIONS
        : {
            inter: { label: 'Inter' },
            playfair: { label: 'Playfair Display' },
            garamond: { label: 'EB Garamond' },
            lora: { label: 'Lora' },
          };
      const keys = Object.keys(fontMap);
      mainSel.textContent = '';
      for(const k of keys){
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = String(fontMap[k]?.label || k);
        mainSel.appendChild(opt);
      }
      mainSel.value = keys.includes(quoteExportPrefs.mainFont) ? quoteExportPrefs.mainFont : keys[0];
      quoteExportPrefs.mainFont = mainSel.value;
      mainSel.addEventListener('change', ()=>{
        quoteExportPrefs.mainFont = String(mainSel.value || 'inter');
        saveQuoteExportPrefs();
      });
    }

    if(cjkSel){
      const fontMap = exporter?.CJK_FONT_OPTIONS && typeof exporter.CJK_FONT_OPTIONS === 'object'
        ? exporter.CJK_FONT_OPTIONS
        : {
            notoSansSC: { label: 'Noto Sans SC' },
            notoSerifSC: { label: 'Noto Serif SC' },
            lxgwWenKai: { label: 'LXGW WenKai' },
          };
      const keys = Object.keys(fontMap);
      cjkSel.textContent = '';
      for(const k of keys){
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = String(fontMap[k]?.label || k);
        cjkSel.appendChild(opt);
      }
      cjkSel.value = keys.includes(quoteExportPrefs.cjkFont) ? quoteExportPrefs.cjkFont : keys[0];
      quoteExportPrefs.cjkFont = cjkSel.value;
      cjkSel.addEventListener('change', ()=>{
        quoteExportPrefs.cjkFont = String(cjkSel.value || 'notoSansSC');
        saveQuoteExportPrefs();
      });
    }

    if(tplSel){
      const keys = ['hordSignature', 'editorial', 'gradientSoft', 'nightCircuit'];
      tplSel.value = keys.includes(quoteExportPrefs.template) ? quoteExportPrefs.template : 'hordSignature';
      quoteExportPrefs.template = tplSel.value;
      tplSel.addEventListener('change', ()=>{
        quoteExportPrefs.template = String(tplSel.value || 'hordSignature');
        saveQuoteExportPrefs();
      });
    }
  }

  function fmtTime(ts){
    const t = Number(ts) || 0;
    if(!t) return '-';
    const d = new Date(t);
    if(!Number.isFinite(d.getTime())) return '-';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2,'0');
    const da = String(d.getDate()).padStart(2,'0');
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    return `${y}-${m}-${da} ${hh}:${mm}`;
  }

  function escapeHtml(str){
    return (str ?? '').toString()
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function clamp(n, min, max){
    const v = Number(n);
    if(!Number.isFinite(v)) return min;
    return Math.max(min, Math.min(max, v));
  }

  function debounce(fn, wait){
    let timer = 0;
    return (...args)=>{
      if(timer) clearTimeout(timer);
      timer = setTimeout(()=>fn(...args), wait);
    };
  }

  function sortFieldLabel(kind, field){
    const k = String(kind || 'words');
    const f = String(field || 'time');
    if(lang === 'zh'){
      if(f === 'alpha') return k === 'quotes' ? '\u91d1\u53e5 A-Z' : '\u5355\u8bcd A-Z';
      if(f === 'review') return '\u6309\u590d\u4e60\u6b21\u6570';
      return '\u6309\u65f6\u95f4';
    }
    if(f === 'alpha') return k === 'quotes' ? 'Quotes A-Z' : 'Words A-Z';
    if(f === 'review') return 'By reviews';
    return 'By time';
  }

  function updateSortStatePills(){
    const w = $('w-sort-state');
    if(w){
      w.textContent = lang === 'zh'
        ? `排序：${sortFieldLabel('words', wordsSortField)} ${wordsSortDir === 'asc' ? '↑' : '↓'}`
        : `Sort: ${sortFieldLabel('words', wordsSortField)} ${wordsSortDir === 'asc' ? '↑' : '↓'}`;
    }
    const q = $('q-sort-state');
    if(q){
      q.textContent = lang === 'zh'
        ? `排序：${sortFieldLabel('quotes', quotesSortField)} ${quotesSortDir === 'asc' ? '↑' : '↓'}`
        : `Sort: ${sortFieldLabel('quotes', quotesSortField)} ${quotesSortDir === 'asc' ? '↑' : '↓'}`;
    }
  }

  function isAssetLike(x){
    return !!x && typeof x === 'object' && !Array.isArray(x);
  }

  async function ensureDeviceId(){
    try{
      let id = await globalThis.HordIdbKv.get(DEVICE_KEY);
      id = String(id || '').trim();
      if(id) return id;
      const gen = (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function')
        ? globalThis.crypto.randomUUID()
        : `mob_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
      await globalThis.HordIdbKv.set(DEVICE_KEY, gen);
      return gen;
    }catch(_){
      return 'mobile';
    }
  }

  function activeWords(asset){
    const arr = Array.isArray(asset?.words) ? asset.words : [];
    const out = [];
    for(const rec of arr){
      const id = String(rec?.id || rec?.word || '').toLowerCase().trim();
      if(!id) continue;
      if(rec && rec.isDeleted === true) continue;
      out.push(rec);
    }
    return out;
  }

  function laserEnabled(asset){
    const w = activeWords(asset).length;
    return w >= 1000;
  }

  function computeContentHash(asset){
    if(!globalThis.HordDataLayer?.computeContentHashFromRecords) return '';
    const words = Array.isArray(asset?.words) ? asset.words : [];
    const quotes = Array.isArray(asset?.quotes) ? asset.quotes : [];
    return globalThis.HordDataLayer.computeContentHashFromRecords(words, quotes);
  }

  async function loadAsset(){
    try{
      const a = await globalThis.HordIdbKv.get(KEY);
      return isAssetLike(a) ? a : null;
    }catch(_){
      return null;
    }
  }

  async function saveAsset(asset){
    await globalThis.HordIdbKv.set(KEY, asset);
  }

  function updateHomeUI(asset){
    const has = !!asset;
    $('btn-export').disabled = !has;
    $('btn-reset').disabled = !has;
    $('btn-start').disabled = !has;
    $('btn-dump').disabled = !has;
    $('btn-rehash').disabled = !has;
    if($('w-refresh')) $('w-refresh').disabled = !has;
    if($('q-refresh')) $('q-refresh').disabled = !has;
    if($('w-select')) $('w-select').disabled = !has;
    if($('q-select')) $('q-select').disabled = !has;
    if($('w-sort')) $('w-sort').disabled = !has;
    if($('q-sort')) $('q-sort').disabled = !has;
    if($('w-sort-dir')) $('w-sort-dir').disabled = !has;
    if($('q-sort-dir')) $('q-sort-dir').disabled = !has;
    const qExp = $('q-export-img');
    if(qExp && !quoteExportRuntime.inFlight){
      qExp.disabled = !has;
    }

    const words = has ? activeWords(asset).length : 0;
    const quotes = has ? (Array.isArray(asset?.quotes) ? asset.quotes.filter(q=>q && q.isDeleted !== true).length : 0) : 0;
    $('s-words').textContent = String(words);
    $('s-quotes').textContent = String(quotes);
    $('s-updated').textContent = has ? fmtTime(asset.updatedAt) : '-';

    const pill = $('pill-status');
    if(pill){
      pill.textContent = has ? t('pill_loaded') : t('pill_none');
    }
    const guide = $('home-sync-guide');
    if(guide){
      guide.style.display = has ? 'none' : 'block';
    }
    const pd = $('pill-dirty');
    if(pd){
      if(!has){
        pd.style.display = 'none';
      }else if(persist.lastError){
        pd.classList.add('error');
        pd.classList.remove('warn');
        pd.textContent = (lang === 'zh' ? '\u4fdd\u5b58\u5931\u8d25' : 'Save failed');
        pd.title = persist.lastError;
        pd.style.display = 'inline-flex';
      }else if(persist.inFlight || persist.dirty){
        pd.classList.add('warn');
        pd.classList.remove('error');
        pd.textContent = (lang === 'zh' ? '\u4fdd\u5b58\u4e2d\u2026' : 'Saving...');
        pd.title = '';
        pd.style.display = 'inline-flex';
      }else{
        pd.style.display = 'none';
      }
    }
    const laser = has && laserEnabled(asset);
    const lp = $('pill-laser');
    if(lp){
      lp.style.display = laser ? 'inline-flex' : 'none';
      lp.textContent = t('laser_badge');
    }

    const rm = $('pill-review-mode');
    if(rm){
      rm.style.display = laser ? 'inline-flex' : 'none';
      rm.textContent = t('laser_badge');
    }

    const limitEl = $('limit');
    if(limitEl){
      if(laser){
        limitEl.min = '50';
        limitEl.max = '100';
        const v = clamp(limitEl.value || 50, 50, 100);
        limitEl.value = String(v);
      }else{
        limitEl.min = '1';
        limitEl.max = '200';
      }
    }
  }

  function setTab(tab){
    for(const id of ['home','words','quotes','review','debug']){
      const btn = document.querySelector(`.tab[data-tab="${id}"]`);
      if(btn) btn.dataset.active = id === tab ? '1' : '0';
      const panel = $(`panel-${id}`);
      if(panel) panel.style.display = id === tab ? 'block' : 'none';
    }
  }

  function normalizeImportedAsset(parsed, deviceId){
    if(!isAssetLike(parsed)) throw new Error('invalid_json');
    if(Number(parsed.schemaVersion) !== 2) throw new Error('schema_not_v2');
    if(parsed.exportType && String(parsed.exportType) !== 'ASSET_FILE') throw new Error('not_asset_file');

    parsed.app = String(parsed.app || 'HORD');
    parsed.exportType = 'ASSET_FILE';
    parsed.words = Array.isArray(parsed.words) ? parsed.words : [];
    parsed.quotes = Array.isArray(parsed.quotes) ? parsed.quotes : [];
    parsed.meta = (parsed.meta && typeof parsed.meta === 'object') ? parsed.meta : {};
    parsed.metadata = (parsed.metadata && typeof parsed.metadata === 'object') ? parsed.metadata : {};

    // Mobile manager is a separate device.
    parsed.deviceId = String(deviceId || parsed.deviceId || '').trim();
    return parsed;
  }

  function legacyToAssetV2(legacy, deviceId){
    if(!isAssetLike(legacy)) return null;

    // Legacy exports from Manager look like:
    // - vocab_words_*.json: { version, exportedAt, words:[{word, meaning, englishMeaning, note, ...}] }
    // - vocab_sentences_*.json: { version, exportedAt, sentences:[{text, translation, note, ...}] }
    // - vocab_*.json: { ...full payload... } (contains vocabDict/vocabMeta/collectedSentences etc)
    const hasWordsArray = Array.isArray(legacy.words) && legacy.words.some(x=>x && typeof x === 'object' && x.word);
    const hasSentencesArray = Array.isArray(legacy.sentences) && legacy.sentences.some(x=>x && typeof x === 'object' && x.text);
    const looksLikeFullDb =
      isAssetLike(legacy.vocabDict) ||
      Array.isArray(legacy.vocabList) ||
      Array.isArray(legacy.collectedSentences) ||
      isAssetLike(legacy.sentenceDict);

    if(looksLikeFullDb && globalThis.HordDataLayer?.exportAssetV2FromDb){
      // Treat legacy export as a db snapshot and let data-layer do the consistent v2 export mapping.
      const db = legacy.db && isAssetLike(legacy.db) ? legacy.db : legacy;
      const asset = globalThis.HordDataLayer.exportAssetV2FromDb(db, 'mobile');
      asset.deviceId = String(deviceId || asset.deviceId || '').trim();
      return asset;
    }

    if(!hasWordsArray && !hasSentencesArray) return null;

    const now = Date.now();
    const out = {
      schemaVersion: 2,
      assetId: (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') ? globalThis.crypto.randomUUID() : `asset_${Math.random().toString(16).slice(2)}`,
      app: 'HORD',
      exportType: 'ASSET_FILE',
      deviceId: String(deviceId || 'mobile'),
      revision: 1,
      updatedAt: now,
      contentHash: '',
      lastSync: 0,
      appVersion: String(legacy.version || legacy.appVersion || ''),
      words: [],
      quotes: [],
      meta: { totalWords: 0, totalQuotes: 0, laserModeEnabled: false },
      metadata: { totalWords: 0, deletedCount: 0, lastUpdatedBy: String(deviceId || 'mobile') },
      encryptedLicenseKey: '',
      licenseExpiry: 0,
      deviceBindingId: '',
    };

    if(hasWordsArray){
      for(const w0 of legacy.words){
        if(!w0 || typeof w0 !== 'object') continue;
        const id = String(w0.word || w0.id || '').toLowerCase().trim();
        if(!id) continue;
        const emRaw = Array.isArray(w0.englishMeaning) ? w0.englishMeaning : [];
        const em = emRaw.map(x=>String(x||'').trim()).filter(Boolean);
        // Legacy exports often leave "meaning" empty but have englishMeaning filled.
        // Keep meaning non-empty for UX, without changing schema.
        const meaning0 = String(w0.meaning || '').trim();
        const meaning = meaning0 || pickMeaningFromEnglishMeaning(em);
        const rec = {
          id,
          deviceId: out.deviceId,
          word: id,
          meaning,
          annotation: String(w0.note || w0.annotation || '').trim(),
          englishMeaning: em,
          tags: Array.isArray(w0.tags) ? w0.tags.map(x=>String(x||'').trim()).filter(Boolean) : [],
          status: String(w0.status || '').trim(),
          isDeleted: w0.isDeleted === true,
          createdAt: Number(w0.createdAt) || 0,
          updatedAt: Number(w0.updatedAt) || 0,
          reviewCount: Number(w0.reviewCount) || 0,
          lastReviewedAt: Number(w0.lastReviewedAt || w0.lastReviewAt) || 0,
          nextReviewAt: Number(w0.nextReviewAt) || 0,
          mastery: Number(w0.mastery) || 0,
          learnCount: Number(w0.learnCount) || 0,
          isFavorite: w0.isFavorite === true,
          sourceUrl: String(w0.sourceUrl || '').trim(),
          sourceLabel: String(w0.sourceLabel || '').trim(),
        };
        const us = String(w0.phoneticUS || '').trim();
        const uk = String(w0.phoneticUK || '').trim();
        if(us || uk) rec.phonetics = { us, uk };
        const aus = String(w0.audioUS || '').trim();
        const auk = String(w0.audioUK || '').trim();
        if(aus || auk) rec.audio = { us: aus, uk: auk };
        if(!rec.englishMeaning.length) delete rec.englishMeaning;
        if(!rec.tags.length) delete rec.tags;
        if(!rec.annotation) delete rec.annotation;
        if(!rec.meaning) delete rec.meaning;
        if(!rec.status) delete rec.status;
        if(!rec.isDeleted) delete rec.isDeleted;
        if(!rec.createdAt) delete rec.createdAt;
        if(!rec.updatedAt) delete rec.updatedAt;
        if(!rec.reviewCount) delete rec.reviewCount;
        if(!rec.lastReviewedAt) delete rec.lastReviewedAt;
        if(!rec.nextReviewAt) delete rec.nextReviewAt;
        if(!rec.mastery) delete rec.mastery;
        if(!rec.learnCount) delete rec.learnCount;
        if(!rec.isFavorite) delete rec.isFavorite;
        if(!rec.sourceUrl) delete rec.sourceUrl;
        if(!rec.sourceLabel) delete rec.sourceLabel;
        out.words.push(rec);
      }
    }

    if(hasSentencesArray){
      for(const s0 of legacy.sentences){
        if(!s0 || typeof s0 !== 'object') continue;
        const id = String(s0.id || s0.createdAt || '').trim();
        const text = String(s0.text || '').trim();
        if(!id && !text) continue;
        const rec = {
          id: id || String(Math.floor(Math.random() * 1e16)),
          deviceId: out.deviceId,
          text,
          translation: String(s0.translation || s0.trans || '').trim(),
          annotation: String(s0.note || s0.annotation || '').trim(),
          url: String(s0.url || '').trim(),
          title: String(s0.title || '').trim(),
          sourceLabel: String(s0.sourceLabel || '').trim(),
          isDeleted: s0.isDeleted === true,
          createdAt: Number(s0.createdAt) || 0,
          updatedAt: Number(s0.updatedAt) || 0,
          reviewCount: Number(s0.reviewCount) || 0,
          lastReviewedAt: Number(s0.lastReviewedAt || s0.lastReviewAt) || 0,
          nextReviewAt: Number(s0.nextReviewAt) || 0,
          tags: Array.isArray(s0.tags) ? s0.tags.map(x=>String(x||'').trim()).filter(Boolean) : [],
          isFavorite: s0.isFavorite === true,
        };
        if(!rec.translation) delete rec.translation;
        if(!rec.annotation) delete rec.annotation;
        if(!rec.url) delete rec.url;
        if(!rec.title) delete rec.title;
        if(!rec.sourceLabel) delete rec.sourceLabel;
        if(!rec.isDeleted) delete rec.isDeleted;
        if(!rec.createdAt) delete rec.createdAt;
        if(!rec.updatedAt) delete rec.updatedAt;
        if(!rec.reviewCount) delete rec.reviewCount;
        if(!rec.lastReviewedAt) delete rec.lastReviewedAt;
        if(!rec.nextReviewAt) delete rec.nextReviewAt;
        if(!rec.tags.length) delete rec.tags;
        if(!rec.isFavorite) delete rec.isFavorite;
        out.quotes.push(rec);
      }
    }

    out.meta.totalWords = out.words.reduce((acc, w)=>acc + (w.isDeleted ? 0 : 1), 0);
    out.meta.totalQuotes = out.quotes.reduce((acc, q)=>acc + (q.isDeleted ? 0 : 1), 0);
    out.meta.laserModeEnabled = out.meta.totalWords >= 1000;
    out.metadata.totalWords = out.meta.totalWords;
    out.metadata.deletedCount =
      out.words.reduce((acc, w)=>acc + (w.isDeleted ? 1 : 0), 0) +
      out.quotes.reduce((acc, q)=>acc + (q.isDeleted ? 1 : 0), 0);
    out.metadata.lastUpdatedBy = out.deviceId;
    out.contentHash = computeContentHash(out) || String(out.contentHash || '');
    return out;
  }

  async function importFromFile(file, deviceId){
    const text = await file.text();
    const parsed = JSON.parse(text);
    const incoming = (parsed && Number(parsed.schemaVersion) === 2)
      ? normalizeImportedAsset(parsed, deviceId)
      : (legacyToAssetV2(parsed, deviceId) || null);
    if(!incoming) throw new Error('unsupported_format');
    incoming.contentHash = computeContentHash(incoming) || String(incoming.contentHash || '');

    const local = await loadAsset();
    if(local && globalThis.HordDataLayer?.mergeAsset){
      const mr = globalThis.HordDataLayer.mergeAsset(local, incoming);
      if(!mr.ok) throw new Error(String(mr.error || 'merge_failed'));
      const localWords = activeWords(local).length;
      const localQuotes = (Array.isArray(local?.quotes) ? local.quotes.filter(q=>q && q.isDeleted !== true).length : 0);
      const incWords = activeWords(incoming).length;
      const incQuotes = (Array.isArray(incoming?.quotes) ? incoming.quotes.filter(q=>q && q.isDeleted !== true).length : 0);
      const mergedWords = activeWords(mr.merged).length;
      const mergedQuotes = (Array.isArray(mr.merged?.quotes) ? mr.merged.quotes.filter(q=>q && q.isDeleted !== true).length : 0);
      const summary = t(
        'import_merge_summary',
        localWords,
        localQuotes,
        incWords,
        incQuotes,
        mergedWords,
        mergedQuotes,
        !!mr.changed
      );
      if(!confirm(summary)){
        return local;
      }
      if(!mr.changed){
        await saveAsset(local);
        return local;
      }
      const now = Date.now();
      const merged = mr.merged;
      const maxRev = Math.max(Number(local.revision)||0, Number(incoming.revision)||0);
      merged.revision = maxRev + 1;
      merged.updatedAt = now;
      merged.deviceId = String(deviceId || merged.deviceId || '').trim();
      merged.contentHash = computeContentHash(merged) || String(merged.contentHash || '');
      merged.lastSync = 0;
      await saveAsset(merged);
      return merged;
    }

    const incWords = activeWords(incoming).length;
    const incQuotes = (Array.isArray(incoming?.quotes) ? incoming.quotes.filter(q=>q && q.isDeleted !== true).length : 0);
    if(!confirm(t('confirm_import_merge', incWords, incQuotes))){
      return null;
    }
    await saveAsset(incoming);
    return incoming;
  }

  function downloadJson(filename, obj){
    const blob = new Blob([JSON.stringify(obj, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 8000);
  }

  function nextIntervalMs(reviewCount){
    const mins = 60*1000, hrs = 60*mins, days = 24*hrs;
    const table = [5*mins, 30*mins, 12*hrs, 1*days, 2*days, 4*days, 7*days, 15*days];
    const i = Math.max(0, Math.min(table.length-1, (reviewCount||0)));
    return table[i];
  }

  function getNextReviewAt(meta, now){
    const next = Number(meta?.nextReviewAt) || 0;
    if(next) return next;
    const last = Number(meta?.lastReviewedAt || meta?.lastReviewAt) || 0;
    const c = Number(meta?.reviewCount) || 0;
    if(!last) return 0;
    return last + nextIntervalMs(c);
  }

  function buildDueWordIds(asset){
    const now = Date.now();
    const out = [];
    for(const rec of activeWords(asset)){
      const id = String(rec?.id || rec?.word || '').toLowerCase().trim();
      if(!id) continue;
      const meta = rec || {};
      const c = Number(meta.reviewCount) || 0;
      const next = getNextReviewAt(meta, now);
      const isNew = c === 0;
      const isDue = isNew || next === 0 || next <= now;
      if(!isDue) continue;
      out.push(id);
    }
    return out;
  }

  function buildDueQuoteIds(asset){
    const now = Date.now();
    const out = [];
    for(const rec of activeQuotes(asset)){
      const id = String(rec?.id || '').trim();
      if(!id) continue;
      const c = Number(rec?.reviewCount) || 0;
      const next = getNextReviewAt(rec || {}, now);
      const isNew = c === 0;
      const isDue = isNew || next === 0 || next <= now;
      if(!isDue) continue;
      out.push(id);
    }
    return out;
  }

  function buildMetaMapFromAsset(asset){
    const map = {};
    for(const rec of activeWords(asset)){
      const id = String(rec?.id || rec?.word || '').toLowerCase().trim();
      if(!id) continue;
      map[id] = {
        isFavorite: rec.isFavorite === true,
        learnCount: Number(rec.learnCount) || 0,
        reviewCount: Number(rec.reviewCount) || 0,
        lastReviewedAt: Number(rec.lastReviewedAt || rec.lastReviewAt) || 0,
        status: String(rec.status || ''),
      };
    }
    return map;
  }

  function buildQuoteMetaMapFromAsset(asset){
    const map = {};
    for(const rec of activeQuotes(asset)){
      const id = String(rec?.id || '').trim();
      if(!id) continue;
      // review-engine normalizes ids to lower-case, so pre-key by lower-case for lookup.
      map[id.toLowerCase()] = {
        isFavorite: rec.isFavorite === true,
        learnCount: 0,
        reviewCount: Number(rec.reviewCount) || 0,
        lastReviewedAt: Number(rec.lastReviewedAt || rec.lastReviewAt) || 0,
        status: '',
      };
    }
    return map;
  }

  function findWordRecord(asset, id){
    const key = String(id || '').toLowerCase().trim();
    if(!key) return null;
    const arr = Array.isArray(asset?.words) ? asset.words : [];
    for(const rec of arr){
      const rid = String(rec?.id || rec?.word || '').toLowerCase().trim();
      if(rid === key) return rec;
    }
    return null;
  }

  function removeWordRecord(asset0, id){
    const key = String(id || '').toLowerCase().trim();
    if(!key) return false;
    const arr = Array.isArray(asset0?.words) ? asset0.words : null;
    if(!arr) return false;
    for(let i = 0; i < arr.length; i += 1){
      const rec = arr[i];
      const rid = String(rec?.id || rec?.word || '').toLowerCase().trim();
      if(rid !== key) continue;
      arr.splice(i, 1);
      return true;
    }
    return false;
  }

  function commitWordRating(asset, wordId, quality){
    const now = Date.now();
    const rec = findWordRecord(asset, wordId);
    if(!rec) return { ok:false, error:'word_not_found' };
    if(rec.isDeleted === true) return { ok:false, error:'word_deleted' };

    const q = Number(quality) || 0;
    const prevCount = Number(rec.reviewCount) || 0;
    const nextCount = prevCount + 1;
    rec.reviewCount = nextCount;
    rec.lastReviewedAt = now;
    rec.updatedAt = now;

    // Next review schedule (same table as extension background OP_RATE_WORD)
    rec.nextReviewAt = now + nextIntervalMs(prevCount);

    // Mastery score (0~100), aligned with extension background OP_RATE_WORD behavior.
    const q01 = Number.isFinite(q) ? clamp(q, 0, 5) / 5 : 0;
    const prevMastery = Number(rec.mastery) || 0;
    const target = Math.round(q01 * 100);
    rec.mastery = clamp(Math.round(prevMastery * 0.82 + target * 0.18), 0, 100);

    // Difficult tracking (optional fields; safe additive).
    const isLow = Number.isFinite(q) ? q <= 2 : false;
    const lowStreak = isLow ? (Number(rec.lowStreak) || 0) + 1 : 0;
    rec.lowStreak = lowStreak;
    if(lowStreak >= 2){
      rec.isDifficult = true;
    }
    return { ok:true };
  }

  function commitQuoteRating(asset, quoteId, quality){
    const now = Date.now();
    const rec = findQuoteRecord(asset, quoteId);
    if(!rec) return { ok:false, error:'quote_not_found' };
    if(rec.isDeleted === true) return { ok:false, error:'quote_deleted' };

    const q = Number(quality) || 0;
    const prevCount = Number(rec.reviewCount) || 0;
    const nextCount = prevCount + 1;
    rec.reviewCount = nextCount;
    rec.lastReviewedAt = now;
    rec.updatedAt = now;
    rec.nextReviewAt = now + nextIntervalMs(prevCount);

    const q01 = Number.isFinite(q) ? clamp(q, 0, 5) / 5 : 0;
    const prevMastery = Number(rec.mastery) || 0;
    const target = Math.round(q01 * 100);
    rec.mastery = clamp(Math.round(prevMastery * 0.82 + target * 0.18), 0, 100);
    return { ok:true };
  }

  async function commitMutation(asset, mutateFn){
    const now = Date.now();
    const beforeHash = String(asset.contentHash || '');
    const beforeRev = Number(asset.revision) || 0;

    const ok = mutateFn();
    if(ok === false) return { ok:false, error:'mutation_rejected' };

    const nextHash = computeContentHash(asset);
    if(nextHash && nextHash === beforeHash){
      // No actual change; do not bump anything.
      return { ok:true, changed:false, revision: beforeRev, contentHash: beforeHash };
    }

    asset.contentHash = nextHash || beforeHash;
    asset.revision = beforeRev + 1;
    asset.updatedAt = now;
    asset.lastSync = asset.lastSync || 0; // keep UI-only field stable

    try{
      scheduleSave(asset);
      return { ok:true, changed:true, revision: asset.revision, contentHash: asset.contentHash };
    }catch(e){
      return { ok:false, error: String(e && e.message || e || 'write_failed') };
    }
  }

  function buildReviewQueue(asset, desiredLimit){
    const now = Date.now();
    const laser = laserEnabled(asset);
    const dueIds = buildDueWordIds(asset);
    if(!laser){
      const lim = clamp(desiredLimit, 1, 200);
      return dueIds.slice(0, lim);
    }

    const lim = clamp(desiredLimit, 50, 100);
    const metaMap = buildMetaMapFromAsset(asset);
    const k = Math.min(lim, 100, dueIds.length);
    if(globalThis.HordReviewEngine?.selectTopKWords){
      return globalThis.HordReviewEngine.selectTopKWords(dueIds, metaMap, now, k);
    }
    return dueIds.slice(0, k);
  }

  function buildQuoteReviewQueue(asset, desiredLimit){
    const now = Date.now();
    const laser = laserEnabled(asset);
    const dueIds = buildDueQuoteIds(asset);
    if(!laser){
      const lim = clamp(desiredLimit, 1, 200);
      return dueIds.slice(0, lim);
    }
    const lim = clamp(desiredLimit, 50, 100);
    const metaMap = buildQuoteMetaMapFromAsset(asset);
    const k = Math.min(lim, 100, dueIds.length);
    if(globalThis.HordReviewEngine?.selectTopKWords){
      return globalThis.HordReviewEngine.selectTopKWords(dueIds, metaMap, now, k);
    }
    return dueIds.slice(0, k);
  }

  async function main(){
    initBrandAssets();
    themeMode = getThemeMode();
    bindThemeMediaWatcher();
    applyTheme();
    let asset = await loadAsset();
    const deviceId = await ensureDeviceId();
    if(asset && (!asset.deviceId || String(asset.deviceId).trim() !== deviceId)){
      // Treat mobile manager as a separate device; align deviceId once.
      asset.deviceId = deviceId;
      await saveAsset(asset);
    }
    applyI18n();
    initQuoteExportControls();
    updateHomeUI(asset);

    let backups = await loadBackups();
    function renderBackups(){
      const sel = $('bk-select');
      const btnRestore = $('btn-restore-backup');
      const btnNow = $('btn-backup-now');
      if(btnNow) btnNow.disabled = !asset;
      if(!sel){
        if(btnRestore) btnRestore.disabled = true;
        return;
      }
      sel.innerHTML = '';
      sel.disabled = backups.length === 0;
      for(let i=0;i<backups.length;i++){
        const b = backups[i];
        const opt = document.createElement('option');
        const tag = b.reason ? ` · ${b.reason}` : '';
        const words = activeWords(b.asset).length;
        const quotes = Array.isArray(b.asset?.quotes) ? b.asset.quotes.filter(q=>q && q.isDeleted !== true).length : 0;
        opt.value = String(i);
        opt.textContent = `${fmtTime(b.ts)}${tag} · w=${words} q=${quotes}`;
        sel.appendChild(opt);
      }
      if(btnRestore) btnRestore.disabled = backups.length === 0;
    }

    renderBackups();

    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', ()=> setTab(btn.dataset.tab || 'home'));
    });

    const toTop = $('btn-to-top');
    const syncToTop = ()=>{
      if(!toTop) return;
      const y = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0);
      toTop.dataset.on = y > 560 ? '1' : '0';
    };
    window.addEventListener('scroll', syncToTop, { passive: true });
    syncToTop();
    toTop?.addEventListener('click', ()=>{
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $('btn-lang')?.addEventListener('click', ()=>{
      lang = (lang === 'zh') ? 'en' : 'zh';
      try{ localStorage.setItem(LANG_KEY, lang); }catch(_){}
      applyI18n();
      updateHomeUI(asset);
      renderBackups();
    });

    $('btn-theme')?.addEventListener('click', ()=>{
      if(themeMode === 'auto') themeMode = 'light';
      else if(themeMode === 'light') themeMode = 'dark';
      else themeMode = 'auto';
      try{ localStorage.setItem(THEME_KEY, themeMode); }catch(_){}
      applyTheme();
      toast('toast-home', lang === 'zh' ? `主题：${themeModeLabel(themeMode)}` : `Theme: ${themeModeLabel(themeMode)}`);
    });

    // Best-effort flush on backgrounding.
    try{
      document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'hidden') flushSave(asset).catch(()=>{}); });
      window.addEventListener('pagehide', ()=>{ flushSave(asset).catch(()=>{}); });
    }catch(_){}

    $('btn-import').addEventListener('click', async ()=>{
      toast('toast-home','');
      const f = $('file')?.files?.[0];
      if(!f){
        toast('toast-home', lang === 'zh' ? '\u8bf7\u5148\u9009\u62e9 JSON \u6587\u4ef6\u3002' : 'Pick a JSON file first.');
        return;
      }
      try{
        $('btn-import').disabled = true;
        await pushBackup(asset, 'before_import');
        backups = await loadBackups();
        renderBackups();
        const a = await importFromFile(f, deviceId);
        asset = a || asset;
        updateHomeUI(asset);
        renderBackups();
        scheduleSave(asset);
        toast('toast-home', a ? t('toast_import_ok') : t('toast_import_cancel'));
      }catch(e){
        toast('toast-home', `Import failed: ${String(e && e.message || e)}`);
      }finally{
        $('btn-import').disabled = false;
      }
    });

    $('btn-export').addEventListener('click', async ()=>{
      toast('toast-home','');
      if(!asset){
        toast('toast-home', lang === 'zh' ? '\u6ca1\u6709\u53ef\u5bfc\u51fa\u7684\u8d44\u4ea7\u3002' : 'No asset loaded.');
        return;
      }
      const name = `HORD_ASSET_${String(asset.assetId || 'asset').slice(0,8)}_${fmtTime(Date.now()).replace(/[:\\s]/g,'-')}.json`;
      const out = { ...asset, lastSync: Date.now() };
      downloadJson(name, out);
      toast('toast-home', t('toast_exported'));
    });

    $('btn-reset').addEventListener('click', async ()=>{
      toast('toast-home','');
      if(!confirm(lang === 'zh'
        ? '\u786e\u8ba4\u6e05\u7a7a\u672c\u5730\u526f\u672c\uff1f\u8fd9\u4ec5\u6e05\u9664\u6d4f\u89c8\u5668\u672c\u5730\u7f13\u5b58\uff0c\u4e0d\u4f1a\u5f71\u54cd\u4efb\u4f55\u4e91\u7aef\u6587\u4ef6\u3002'
        : 'Reset local copy? This only clears the browser local cache, not any cloud file.'
      )) return;
      try{
        await pushBackup(asset, 'before_reset');
        backups = await loadBackups();
        await globalThis.HordIdbKv.del(KEY);
        asset = null;
        updateHomeUI(asset);
        renderBackups();
        toast('toast-home', lang === 'zh' ? '\u672c\u5730\u526f\u672c\u5df2\u6e05\u9664\u3002' : 'Local copy cleared.');
      }catch(e){
        toast('toast-home', lang === 'zh' ? `\u6e05\u7a7a\u5931\u8d25\uff1a${String(e && e.message || e)}` : `Reset failed: ${String(e && e.message || e)}`);
      }
    });

    $('btn-backup-now')?.addEventListener('click', async ()=>{
      toast('toast-home','');
      try{
        await pushBackup(asset, 'manual');
        backups = await loadBackups();
        renderBackups();
        toast('toast-home', lang === 'zh' ? '\u5df2\u521b\u5efa\u5907\u4efd\u3002' : 'Backup created.');
      }catch(_){
        toast('toast-home', lang === 'zh' ? '\u5907\u4efd\u5931\u8d25\u3002' : 'Backup failed.');
      }
    });

    $('btn-restore-backup')?.addEventListener('click', async ()=>{
      toast('toast-home','');
      const sel = $('bk-select');
      const idx = Number(sel?.value || 0) || 0;
      const b = backups[idx];
      if(!b || !b.asset) return;
      if(!confirm(lang === 'zh'
        ? '\u786e\u8ba4\u6062\u590d\u9009\u4e2d\u5907\u4efd\uff1f\u8fd9\u5c06\u8986\u76d6\u4f60\u5f53\u524d\u672c\u5730\u526f\u672c\u3002'
        : 'Restore selected backup? This overwrites your current local copy.'
      )) return;
      try{
        await pushBackup(asset, 'before_restore');
        asset = cloneJson(b.asset);
        if(asset && (!asset.deviceId || String(asset.deviceId).trim() !== deviceId)){
          asset.deviceId = deviceId;
        }
        updateHomeUI(asset);
        renderBackups();
        await saveAsset(asset);
        persist.dirty = false;
        toast('toast-home', lang === 'zh' ? '\u5df2\u6062\u590d\u5907\u4efd\u3002' : 'Backup restored.');
      }catch(e){
        toast('toast-home', `Restore failed: ${String(e && e.message || e)}`);
      }
    });

    let queue = [];
    let qIdx = 0;
    let reviewTarget = 'words'; // 'words' | 'quotes'
    let reviewMeaningMode = String(localStorage.getItem('hord_mobile_review_meaning_mode_v1') || 'both');
    if(!['both','cn','en'].includes(reviewMeaningMode)) reviewMeaningMode = 'both';

    function setReviewTarget(t){
      reviewTarget = t === 'quotes' ? 'quotes' : 'words';
      const bw = $('rv-words');
      const bq = $('rv-quotes');
      if(bw) bw.dataset.active = reviewTarget === 'words' ? '1' : '0';
      if(bq) bq.dataset.active = reviewTarget === 'quotes' ? '1' : '0';
      toast('toast-review','');
      const card = $('review-card');
      if(card) card.dataset.on = '0';
      queue = [];
      qIdx = 0;
    }

    $('rv-words')?.addEventListener('click', ()=> setReviewTarget('words'));
    $('rv-quotes')?.addEventListener('click', ()=> setReviewTarget('quotes'));
    const rvModeEl = $('rv-meaning-mode');
    if(rvModeEl){
      rvModeEl.value = reviewMeaningMode;
      rvModeEl.addEventListener('change', ()=>{
        const v = String(rvModeEl.value || 'both');
        reviewMeaningMode = ['both','cn','en'].includes(v) ? v : 'both';
        try{ localStorage.setItem('hord_mobile_review_meaning_mode_v1', reviewMeaningMode); }catch(_){}
        if(reviewTarget === 'words') renderReview();
      });
    }

    // --- Words / Quotes ---
    let wordSelectMode = false;
    const selectedWords = new Set();
    let quoteSelectMode = false;
    const selectedQuotes = new Set();

    const VIRT_ROW_H = 98;
    const VIRT_OVERSCAN = 10;

    function ensureVirtHost(host){
      if(!host) return null;
      if(host._virt) return host._virt;
      host.textContent = '';
      const spacer = document.createElement('div');
      spacer.className = 'virtSpacer';
      const layer = document.createElement('div');
      layer.className = 'virtLayer';
      host.appendChild(spacer);
      host.appendChild(layer);
      const st = { spacer, layer, raf: 0, items: [], renderFn: null };
      host._virt = st;
      host.addEventListener('scroll', ()=>{
        if(st.raf) return;
        st.raf = requestAnimationFrame(()=>{
          st.raf = 0;
          try{ st.renderFn && st.renderFn(); }catch(_){}
        });
      }, { passive: true });
      return st;
    }

    function renderVirtual(host, items, buildRow){
      const st = ensureVirtHost(host);
      if(!st) return;
      st.items = Array.isArray(items) ? items : [];

      st.renderFn = ()=>{
        const total = st.items.length;
        st.spacer.style.height = String(total * VIRT_ROW_H) + 'px';
        const top = host.scrollTop || 0;
        const viewH = host.clientHeight || 0;
        const start = Math.max(0, Math.floor(top / VIRT_ROW_H) - VIRT_OVERSCAN);
        const end = Math.min(total, Math.ceil((top + viewH) / VIRT_ROW_H) + VIRT_OVERSCAN);

        st.layer.style.transform = `translateY(${start * VIRT_ROW_H}px)`;
        st.layer.textContent = '';
        for(let i=start;i<end;i++){
          const row = buildRow(st.items[i], i);
          if(!row) continue;
          row.classList.add('virtRow');
          row.style.top = String((i - start) * VIRT_ROW_H) + 'px';
          row.style.height = String(VIRT_ROW_H) + 'px';
          st.layer.appendChild(row);
        }
      };

      st.renderFn();
    }

    function buildWordRow(rec){
      const div = document.createElement('div');
      div.className = 'listItem';
      div.dataset.pick = wordSelectMode ? '1' : '0';
      const id0 = String(rec?.id || rec?.word || '').toLowerCase().trim();
      const title = String(rec?.word || rec?.id || '');
      const meaning = getWordMeaning(rec);
      const english = getWordEnglishMeaning(rec);
      const note = String(rec?.annotation || '');
      const badges = [];
      if(rec?.isFavorite === true) badges.push('<span class=\"badge fav\">\u2605</span>');
      if(isDueRec(rec || {})) badges.push(`<span class=\"badge due\">${escapeHtml(t('badge_due'))}</span>`);
      if(Array.isArray(rec?.tags) && rec.tags.length) badges.push(`<span class=\"badge\">${rec.tags.slice(0,3).join(', ')}</span>`);
      div.innerHTML =
        `${wordSelectMode ? `<input class=\"liPick\" type=\"checkbox\" ${selectedWords.has(id0) ? 'checked' : ''} aria-label=\"select\">` : ''}`+
        `<div class=\"liTop\"><div class=\"liTitle\">${escapeHtml(title)}</div><div class=\"liBadges\">${badges.join('')}</div></div>`+
        `<div class=\"liSub\">\ud83c\udde8\ud83c\uddf3 ${escapeHtml(meaning || (lang === 'zh' ? '\u6682\u65e0\u4e2d\u6587\u91ca\u4e49' : 'No Chinese meaning'))}</div>`+
        `<div class=\"liSub\">\ud83c\uddec\ud83c\udde7 ${escapeHtml(english || (lang === 'zh' ? '\u6682\u65e0\u82f1\u6587\u91ca\u4e49' : 'No English meaning'))}</div>`+
        `${note ? `<div class=\"liSub\">\ud83d\udcdd ${escapeHtml(note)}</div>` : ''}`;
      div.addEventListener('click', (e)=>{
        if(wordSelectMode){
          e.preventDefault();
          e.stopPropagation();
          toggleWordSelected(id0);
          renderWords();
          return;
        }
        openWordDialog(String(rec?.id || rec?.word || ''));
      });
      return div;
    }

    function buildQuoteRow(rec){
      const div = document.createElement('div');
      div.className = 'listItem';
      div.dataset.pick = quoteSelectMode ? '1' : '0';
      const id0 = String(rec?.id || '').trim();
      const title = String(rec?.text || '').slice(0, 120);
      const sub = String(rec?.translation || rec?.annotation || rec?.url || '');
      const badges = [];
      if(rec?.isFavorite === true) badges.push('<span class=\"badge fav\">\u2605</span>');
      badges.push(`<button class=\"badge exportBtn\" data-export-quote=\"1\" type=\"button\">${lang === 'zh' ? '\ud83d\uddbc\ufe0f \u5bfc\u51fa\u56fe\u7247' : '\ud83d\uddbc\ufe0f Export'}</button>`);
      if(Array.isArray(rec?.tags) && rec.tags.length) badges.push(`<span class=\"badge\">${rec.tags.slice(0,3).join(', ')}</span>`);
      div.innerHTML =
        `${quoteSelectMode ? `<input class=\"liPick\" type=\"checkbox\" ${selectedQuotes.has(id0) ? 'checked' : ''} aria-label=\"select\">` : ''}`+
        `<div class=\"liTop\"><div class=\"liTitle\">${escapeHtml(title || (lang === 'zh' ? '\uff08\u7a7a\uff09' : '(empty)'))}</div><div class=\"liBadges\">${badges.join('')}</div></div>`+
        `<div class=\"liSub\">${escapeHtml(sub || '')}</div>`;
      const exportBtn = div.querySelector('[data-export-quote=\"1\"]');
      if(exportBtn){
        exportBtn.addEventListener('click', (e)=>{
          e.preventDefault();
          e.stopPropagation();
          exportSelectedQuoteImages([rec]).catch(()=>{});
        });
      }
      div.addEventListener('click', (e)=>{
        if(quoteSelectMode){
          e.preventDefault();
          e.stopPropagation();
          toggleQuoteSelected(id0);
          renderQuotes();
          return;
        }
        openQuoteDialog(String(rec?.id || ''));
      });
      return div;
    }

    function setWordSelectMode(on){
      wordSelectMode = !!on;
      selectedWords.clear();
      const btn = $('w-select');
      if(btn) btn.textContent = wordSelectMode ? (lang === 'zh' ? '\u5b8c\u6210' : 'Done') : t('btn_select');
      const hint = $('w-hint');
      if(hint) hint.textContent = wordSelectMode
        ? (lang === 'zh' ? '\u9009\u4e2d\u6761\u76ee\u540e\u53ef\u6279\u91cf\u6807\u7b7e/\u5220\u9664\u3002' : 'Select items then batch tag/delete.')
        : t('hint_words');
      renderWords();
      updateWordBatchButtons();
    }

    function toggleWordSelected(id){
      const key = String(id || '').toLowerCase().trim();
      if(!key) return;
      if(selectedWords.has(key)) selectedWords.delete(key);
      else selectedWords.add(key);
      updateWordBatchButtons();
    }

    function updateWordBatchButtons(){
      const hasAsset = !!asset;
      const sel = selectedWords.size;
      const enable = hasAsset && wordSelectMode;
      const del = $('w-batch-del');
      const all = $('w-all');
      const apply = $('w-batch-tag-apply');
      if(all) all.disabled = !enable;
      if(del) del.disabled = !(enable && sel > 0);
      if(apply) apply.disabled = !(enable && sel > 0);
    }

    function setQuoteSelectMode(on){
      quoteSelectMode = !!on;
      selectedQuotes.clear();
      const btn = $('q-select');
      if(btn) btn.textContent = quoteSelectMode ? (lang === 'zh' ? '\u5b8c\u6210' : 'Done') : t('btn_select');
      const hint = $('q-hint');
      if(hint) hint.textContent = quoteSelectMode
        ? (lang === 'zh' ? '\u9009\u4e2d\u6761\u76ee\u540e\u53ef\u6279\u91cf\u6807\u7b7e/\u5220\u9664/\u5bfc\u51fa\u56fe\u7247\u3002' : 'Select items then batch tag/delete/export images.')
        : t('hint_quotes');
      renderQuotes();
      updateQuoteBatchButtons();
    }

    function toggleQuoteSelected(id){
      const key = String(id || '').trim();
      if(!key) return;
      if(selectedQuotes.has(key)) selectedQuotes.delete(key);
      else selectedQuotes.add(key);
      updateQuoteBatchButtons();
    }

    function updateQuoteBatchButtons(){
      const hasAsset = !!asset;
      const sel = selectedQuotes.size;
      const enable = hasAsset && quoteSelectMode;
      const del = $('q-batch-del');
      const exp = $('q-export-img');
      const apply = $('q-batch-tag-apply');
      if(exp) exp.disabled = !!quoteExportRuntime.inFlight;
      if(del) del.disabled = !(enable && sel > 0);
      if(apply) apply.disabled = !(enable && sel > 0);
    }

    function setQuoteExportUi(isRunning){
      quoteExportRuntime.inFlight = !!isRunning;
      const btnExport = $('q-export-img');
      const btnCancel = $('q-export-cancel');
      const pgWrap = $('q-export-progress-wrap');
      const pgFill = $('q-export-progress-fill');
      const pgText = $('q-export-progress-text');
      const failWrap = $('q-export-fail-wrap');
      const retryBtn = $('q-export-retry-failed');
      if(btnExport){
        btnExport.textContent = isRunning
          ? (lang === 'zh'
              ? `\ud83d\uddbc\ufe0f \u5bfc\u51fa\u4e2d ${quoteExportRuntime.done}/${quoteExportRuntime.total}`
              : `\ud83d\uddbc\ufe0f Exporting ${quoteExportRuntime.done}/${quoteExportRuntime.total}`)
          : (lang === 'zh' ? '\ud83d\uddbc\ufe0f \u5bfc\u51fa\u56fe\u7247' : '\ud83d\uddbc\ufe0f Export Image');
        if(!isRunning) btnExport.disabled = false;
      }
      if(btnCancel){
        btnCancel.style.display = isRunning ? '' : 'none';
        btnCancel.disabled = !isRunning;
      }
      if(pgWrap){
        pgWrap.style.display = isRunning ? '' : 'none';
      }
      if(pgFill){
        const p = quoteExportRuntime.total > 0
          ? Math.max(0, Math.min(100, Math.round((quoteExportRuntime.done / quoteExportRuntime.total) * 100)))
          : 0;
        pgFill.style.width = `${p}%`;
      }
      if(pgText){
        pgText.textContent = isRunning
          ? (lang === 'zh'
              ? `\u8fdb\u5ea6 ${quoteExportRuntime.done}/${quoteExportRuntime.total} · \u5931\u8d25 ${quoteExportRuntime.failed}`
              : `Progress ${quoteExportRuntime.done}/${quoteExportRuntime.total} · Failed ${quoteExportRuntime.failed}`)
          : '';
      }
      if(failWrap){
        const hasFails = Array.isArray(quoteExportRuntime.failedIds) && quoteExportRuntime.failedIds.length > 0;
        failWrap.style.display = (!isRunning && hasFails) ? '' : 'none';
      }
      if(retryBtn){
        retryBtn.disabled = isRunning || !(Array.isArray(quoteExportRuntime.failedIds) && quoteExportRuntime.failedIds.length > 0);
      }
      updateQuoteBatchButtons();
    }

    function renderQuoteExportFailures(){
      const ul = $('q-export-fail-list');
      if(!ul) return;
      ul.textContent = '';
      const ids = Array.isArray(quoteExportRuntime.failedIds) ? quoteExportRuntime.failedIds : [];
      const maxShow = 60;
      for(let i = 0; i < Math.min(ids.length, maxShow); i += 1){
        const id = String(ids[i] || '').trim();
        if(!id) continue;
        const rec = findQuoteRecord(asset, id);
        const title = String(rec?.text || id).trim().slice(0, 110);
        const li = document.createElement('li');
        li.textContent = title || id;
        ul.appendChild(li);
      }
      if(ids.length > maxShow){
        const li = document.createElement('li');
        li.textContent = lang === 'zh'
          ? `... \u53e6\u6709 ${ids.length - maxShow} \u6761`
          : `... and ${ids.length - maxShow} more`;
        ul.appendChild(li);
      }
    }

    async function exportSelectedQuoteImages(listOverride){
      toast('toast-quotes', '');
      if(quoteExportRuntime.inFlight){
        toast('toast-quotes', lang === 'zh' ? '\u5bfc\u51fa\u8fdb\u884c\u4e2d\uff0c\u8bf7\u7b49\u5f85\u6216\u70b9\u51fb\u53d6\u6d88\u3002' : 'Export is running. Wait or cancel.');
        return;
      }
      if(!asset){
        toast('toast-quotes', lang === 'zh' ? '\u8bf7\u5148\u5bfc\u5165\u8d44\u4ea7\u6587\u4ef6\u3002' : 'Import an asset first.');
        return;
      }
      const exporter = globalThis.QuoteCardExporter;
      if(!exporter || typeof exporter.exportPng !== 'function'){
        toast('toast-quotes', lang === 'zh' ? '\u5bfc\u51fa\u6a21\u5757\u672a\u52a0\u8f7d\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5\u3002' : 'Exporter not loaded. Refresh and try again.');
        return;
      }
      let list = Array.isArray(listOverride)
        ? listOverride.filter(rec=>rec && rec.isDeleted !== true)
        : [];
      if(!list.length){
        if(quoteSelectMode && selectedQuotes.size > 0){
          list = Array.from(selectedQuotes).map(id=>findQuoteRecord(asset, id)).filter(rec=>rec && rec.isDeleted !== true);
        } else if(dlgQuoteId){
          const rec = findQuoteRecord(asset, dlgQuoteId);
          if(rec && rec.isDeleted !== true) list = [rec];
        }
      }
      if(!list.length){
        toast('toast-quotes', lang === 'zh' ? '\u8bf7\u5148\u6253\u5f00\u4e00\u6761\u91d1\u53e5\u6216\u9009\u4e2d\u91d1\u53e5\u540e\u518d\u5bfc\u51fa\u3002' : 'Open a quote or select quotes before export.');
        return;
      }
      quoteExportRuntime.cancelRequested = false;
      quoteExportRuntime.total = list.length;
      quoteExportRuntime.done = 0;
      quoteExportRuntime.failed = 0;
      quoteExportRuntime.retried = 0;
      quoteExportRuntime.failedIds = [];
      renderQuoteExportFailures();
      setQuoteExportUi(true);
      const baseSettings = exporter.normalizeSettings
        ? exporter.normalizeSettings({
            ratio: '9:16',
            template: String(quoteExportPrefs.template || 'hordSignature'),
            mainFont: String(quoteExportPrefs.mainFont || 'inter'),
            cjkFont: String(quoteExportPrefs.cjkFont || 'notoSansSC'),
            showTranslation: true,
            showSource: true,
            showAnnotation: true,
            capabilities: getCapabilities(),
            isProUser: false,
          })
        : {
            ratio: '9:16',
            template: 'hordSignature',
            showTranslation: true,
            showSource: true,
            showAnnotation: true,
          };
      try{
        for(let i = 0; i < list.length; i += 1){
          if(quoteExportRuntime.cancelRequested){
            toast('toast-quotes', lang === 'zh'
              ? `\u5df2\u53d6\u6d88\uff0c\u5df2\u5bfc\u51fa ${quoteExportRuntime.done}/${quoteExportRuntime.total} \u5f20\u3002`
              : `Cancelled. Exported ${quoteExportRuntime.done}/${quoteExportRuntime.total}.`);
            return;
          }
          const rec = list[i];
          const sentence = {
            text: String(rec.text || '').trim(),
            translation: String(rec.translation || '').trim(),
            note: String(rec.annotation || '').trim(),
            url: String(rec.url || '').trim(),
            title: String(rec.title || '').trim(),
            sourceLabel: String(rec.sourceLabel || '').trim(),
          };
          let ok = false;
          for(let attempt = 1; attempt <= 2; attempt += 1){
            try{
              await exporter.exportPng(sentence, baseSettings, {
                filenamePrefix: 'hord-mobile-quote',
                index: i + 1,
                filenamePattern: 'hord-mobile-{date}-{index}',
                withMockup: false,
              });
              ok = true;
              break;
            }catch(err){
              if(attempt === 1){
                quoteExportRuntime.retried += 1;
                continue;
              }
              quoteExportRuntime.failed += 1;
              quoteExportRuntime.failedIds.push(String(rec?.id || '').trim());
            }
          }
          if(!ok){
            quoteExportRuntime.done = i + 1;
            setQuoteExportUi(true);
            continue;
          }
          quoteExportRuntime.done = i + 1;
          setQuoteExportUi(true);
        }
        const successCount = Math.max(0, list.length - quoteExportRuntime.failed);
        toast('toast-quotes', lang === 'zh'
          ? `\u5bfc\u51fa\u5b8c\u6210\uff1a\u6210\u529f ${successCount}\uff0c\u5931\u8d25 ${quoteExportRuntime.failed}\uff0c\u91cd\u8bd5 ${quoteExportRuntime.retried}\u3002`
          : `Export done: success ${successCount}, failed ${quoteExportRuntime.failed}, retried ${quoteExportRuntime.retried}.`);
      }catch(e){
        toast('toast-quotes', lang === 'zh'
          ? `\u5bfc\u51fa\u5931\u8d25\uff1a${String(e && e.message || e || 'unknown')}`
          : `Export failed: ${String(e && e.message || e || 'unknown')}`);
      }finally{
        quoteExportRuntime.cancelRequested = false;
        quoteExportRuntime.total = 0;
        quoteExportRuntime.done = 0;
        renderQuoteExportFailures();
        setQuoteExportUi(false);
      }
    }

    const isDueRec = (rec)=>{
      const now = Date.now();
      const c = Number(rec?.reviewCount) || 0;
      const next = getNextReviewAt(rec || {}, now);
      const isNew = c === 0;
      return isNew || next === 0 || next <= now;
    };

    function renderWords(){
      const list = $('w-list');
      if(!list) return;
      toast('toast-words','');
      if(!asset){
        $('w-count').textContent = '0';
        toast('toast-words', t('toast_import_first'));
        list.textContent = '';
        return;
      }
      const q = String($('w-q')?.value || '').trim().toLowerCase();
      const items = activeWords(asset);
      const filtered = q
        ? items.filter(r=>{
            const w = String(r.word || r.id || '').toLowerCase();
            const m = getWordMeaning(r).toLowerCase();
            const n = String(r.annotation || '').toLowerCase();
            const t = Array.isArray(r.tags) ? r.tags.join(' ').toLowerCase() : '';
            return w.includes(q) || m.includes(q) || n.includes(q) || t.includes(q);
          })
        : items;
      const sorted = sortRecords(filtered, wordsSortField, wordsSortDir, 'words');
      $('w-count').textContent = String(sorted.length);
      list.textContent = '';
      const frag = document.createDocumentFragment();
      for(const rec of sorted){
        const row = buildWordRow(rec);
        if(row) frag.appendChild(row);
      }
      list.appendChild(frag);
    }

  function activeQuotes(asset0){
    const arr = Array.isArray(asset0?.quotes) ? asset0.quotes : [];
    const out = [];
    for(const rec of arr){
      if(!rec || rec.isDeleted === true) continue;
      out.push(rec);
    }
    return out;
  }

  function findQuoteRecord(asset0, id){
    const key = String(id || '').trim();
    if(!key) return null;
    const arr = Array.isArray(asset0?.quotes) ? asset0.quotes : [];
    for(const rec of arr){
      if(!rec) continue;
      const rid = String(rec.id || '').trim();
      if(rid === key) return rec;
    }
    return null;
  }

    function renderQuotes(){
      const list = $('q-list');
      if(!list) return;
      toast('toast-quotes','');
      if(!asset){
        $('q-count').textContent = '0';
        toast('toast-quotes', t('toast_import_first'));
        list.textContent = '';
        return;
      }
      const q = String($('q-q')?.value || '').trim().toLowerCase();
      const items = activeQuotes(asset);
      const filtered = q
        ? items.filter(r=>{
            const t = String(r.text || '').toLowerCase();
            const tr = String(r.translation || '').toLowerCase();
            const n = String(r.annotation || '').toLowerCase();
            return t.includes(q) || tr.includes(q) || n.includes(q);
          })
        : items;
      const sorted = sortRecords(filtered, quotesSortField, quotesSortDir, 'quotes');
      $('q-count').textContent = String(sorted.length);
      list.textContent = '';
      const frag = document.createDocumentFragment();
      for(const rec of sorted){
        const row = buildQuoteRow(rec);
        if(row) frag.appendChild(row);
      }
      list.appendChild(frag);
    }

    // --- Word dialog ---
    let dlgWordId = '';
    function openWordDialog(id){
      toast('toast-dlg-word','');
      if(!asset) return;
      const rec = findWordRecord(asset, id);
      if(!rec) return;
      dlgWordId = String(id || '');
    $('dlg-w-title').textContent = String(rec.word || rec.id || id);
    $('dlg-w-meaning').value = getWordMeaning(rec);
    $('dlg-w-english').value = getWordEnglishMeaning(rec);
    $('dlg-w-note').value = String(rec.annotation || '');
    const phUs = getWordPhonetic(rec, 'us');
    const phUk = getWordPhonetic(rec, 'uk');
    $('dlg-w-phon-us').textContent = `US: ${phUs || '-'}`;
    $('dlg-w-phon-uk').textContent = `UK: ${phUk || '-'}`;
    $('dlg-w-meta').textContent = lang === 'zh'
      ? `\u66f4\u65b0\uff1a${fmtTime(rec.updatedAt)} \u00b7 \u590d\u4e60\uff1a${Number(rec.reviewCount)||0}`
      : `Updated: ${fmtTime(rec.updatedAt)} · Reviews: ${Number(rec.reviewCount)||0}`;
      const dlg = $('dlg-word');
      if(dlg && typeof dlg.showModal === 'function') dlg.showModal();
    }

    function closeWordDialog(){
      stopWordPronounce();
      const dlg = $('dlg-word');
      if(dlg && typeof dlg.close === 'function') dlg.close();
      dlgWordId = '';
    }

    function parseTags(s){
      const raw = String(s || '');
      const parts = raw.split(',').map(x=>x.trim()).filter(Boolean);
      const out = [];
      const seen = new Set();
      for(const p of parts){
        const k = p.toLowerCase();
        if(seen.has(k)) continue;
        seen.add(k);
        out.push(p);
      }
      out.sort((a,b)=>a.localeCompare(b));
      return out;
    }

    $('dlg-w-close')?.addEventListener('click', closeWordDialog);
    $('dlg-word')?.addEventListener('click', (e)=>{
      const dlg = $('dlg-word');
      if(!dlg) return;
      if(e.target === dlg) closeWordDialog();
    });
    $('dlg-w-play-us')?.addEventListener('click', async ()=>{
      toast('toast-dlg-word','');
      if(!asset || !dlgWordId) return;
      const rec = findWordRecord(asset, dlgWordId);
      if(!rec) return;
      const ok = await playWordPronounce(rec, 'us');
      if(!ok) toast('toast-dlg-word', lang === 'zh' ? '\u65e0\u53ef\u7528\u53d1\u97f3\u3002' : 'No pronunciation available.');
    });
    $('dlg-w-play-uk')?.addEventListener('click', async ()=>{
      toast('toast-dlg-word','');
      if(!asset || !dlgWordId) return;
      const rec = findWordRecord(asset, dlgWordId);
      if(!rec) return;
      const ok = await playWordPronounce(rec, 'uk');
      if(!ok) toast('toast-dlg-word', lang === 'zh' ? '\u65e0\u53ef\u7528\u53d1\u97f3\u3002' : 'No pronunciation available.');
    });
    $('dlg-w-del')?.addEventListener('click', async ()=>{
      toast('toast-dlg-word','');
      if(!asset || !dlgWordId) return;
      if(!confirm(t('confirm_delete_one_word'))) return;
      const mr = await commitMutation(asset, ()=>{
        return removeWordRecord(asset, dlgWordId);
      });
      if(!mr.ok){
        toast('toast-dlg-word', lang === 'zh' ? `\u5220\u9664\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Delete failed: ${mr.error || 'unknown'}`);
        return;
      }
      closeWordDialog();
      updateHomeUI(asset);
      renderWords();
      toast('toast-words', lang === 'zh' ? '\u5df2\u5220\u9664\u3002' : 'Deleted.');
    });

    // --- Quote dialog ---
    let dlgQuoteId = '';
    function openQuoteDialog(id){
      toast('toast-dlg-quote','');
      if(!asset) return;
      const rec = findQuoteRecord(asset, id);
      if(!rec || rec.isDeleted === true) return;
      dlgQuoteId = String(id || '');
      $('dlg-q-title').textContent = String(rec.text || '').slice(0, 120) || '(empty)';
      $('dlg-q-text').value = String(rec.text || '');
      $('dlg-q-translation').value = String(rec.translation || '');
      $('dlg-q-note').value = String(rec.annotation || '');
      $('dlg-q-url').value = String(rec.url || '');
      $('dlg-q-title2').value = String(rec.title || '');
    $('dlg-q-tags').value = Array.isArray(rec.tags) ? rec.tags.join(', ') : '';
    $('dlg-q-meta').textContent = lang === 'zh'
      ? `\u66f4\u65b0\uff1a${fmtTime(rec.updatedAt)} \u00b7 \u590d\u4e60\uff1a${Number(rec.reviewCount)||0}`
      : `Updated: ${fmtTime(rec.updatedAt)} · Reviews: ${Number(rec.reviewCount)||0}`;
      const dlg = $('dlg-quote');
      if(dlg && typeof dlg.showModal === 'function') dlg.showModal();
    }

    function closeQuoteDialog(){
      const dlg = $('dlg-quote');
      if(dlg && typeof dlg.close === 'function') dlg.close();
      dlgQuoteId = '';
    }

    $('dlg-q-close')?.addEventListener('click', closeQuoteDialog);
    $('dlg-quote')?.addEventListener('click', (e)=>{
      const dlg = $('dlg-quote');
      if(!dlg) return;
      if(e.target === dlg) closeQuoteDialog();
    });
    $('dlg-q-save')?.addEventListener('click', async ()=>{
      toast('toast-dlg-quote','');
      if(!asset || !dlgQuoteId) return;
      const text = String($('dlg-q-text')?.value || '').trim();
      const translation = String($('dlg-q-translation')?.value || '').trim();
      const note = String($('dlg-q-note')?.value || '').trim();
      const url = String($('dlg-q-url')?.value || '').trim();
      const title2 = String($('dlg-q-title2')?.value || '').trim();
      const tags = parseTags($('dlg-q-tags')?.value || '');
      const mr = await commitMutation(asset, ()=>{
        const rec = findQuoteRecord(asset, dlgQuoteId);
        if(!rec || rec.isDeleted === true) return false;
        rec.text = text;
        rec.translation = translation;
        rec.annotation = note;
        rec.url = url;
        rec.title = title2;
        rec.tags = tags;
        rec.updatedAt = Date.now();
        return true;
      });
      if(!mr.ok){
        toast('toast-dlg-quote', lang === 'zh' ? `\u4fdd\u5b58\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Save failed: ${mr.error || 'unknown'}`);
        return;
      }
      updateHomeUI(asset);
      renderQuotes();
      toast('toast-dlg-quote', t('toast_saved'));
    });

    $('dlg-q-export')?.addEventListener('click', async ()=>{
      toast('toast-dlg-quote','');
      if(!asset || !dlgQuoteId) return;
      const rec = findQuoteRecord(asset, dlgQuoteId);
      if(!rec || rec.isDeleted === true){
        toast('toast-dlg-quote', lang === 'zh' ? '\u8be5\u91d1\u53e5\u5df2\u4e0d\u5b58\u5728\u3002' : 'Quote no longer exists.');
        return;
      }
      await exportSelectedQuoteImages([rec]);
      toast('toast-dlg-quote', lang === 'zh' ? '\u5df2\u89e6\u53d1\u5bfc\u51fa\u3002' : 'Export started.');
    });

    $('dlg-q-del')?.addEventListener('click', async ()=>{
      toast('toast-dlg-quote','');
      if(!asset || !dlgQuoteId) return;
      if(!confirm(t('confirm_delete_one_quote'))) return;
      const mr = await commitMutation(asset, ()=>{
        const rec = findQuoteRecord(asset, dlgQuoteId);
        if(!rec || rec.isDeleted === true) return false;
        rec.isDeleted = true;
        rec.updatedAt = Date.now();
        return true;
      });
      if(!mr.ok){
        toast('toast-dlg-quote', lang === 'zh' ? `\u5220\u9664\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Delete failed: ${mr.error || 'unknown'}`);
        return;
      }
      closeQuoteDialog();
      updateHomeUI(asset);
      renderQuotes();
      toast('toast-quotes', lang === 'zh' ? '\u5df2\u8f6f\u5220\u9664\u3002' : 'Deleted (soft-delete).');
    });

    function renderReview(){
      const card = $('review-card');
      const prog = $('review-progress');
      const wEl = $('q-word');
      const mEl = $('q-meaning');
      if(!asset || !queue.length || qIdx >= queue.length){
        if(card) card.dataset.on = '0';
        if(prog) prog.textContent = queue.length ? `${queue.length} / ${queue.length}` : '0 / 0';
        toast('toast-review',
          queue.length
            ? (lang === 'zh' ? '\u672c\u6b21\u590d\u4e60\u5df2\u5b8c\u6210\u3002' : 'Session finished.')
            : (reviewTarget === 'quotes'
                ? (lang === 'zh' ? '\u6682\u65e0\u5230\u671f\u91d1\u53e5\u3002' : 'No due quotes found.')
                : (lang === 'zh' ? '\u6682\u65e0\u5230\u671f\u5355\u8bcd\u3002' : 'No due words found.'))
        );
        return;
      }
      const id = queue[qIdx];
      const rec = reviewTarget === 'quotes'
        ? (findQuoteRecord(asset, id) || {})
        : (findWordRecord(asset, id) || {});
      if(card) card.dataset.on = '1';
      if(prog) prog.textContent = `${qIdx + 1} / ${queue.length}`;
      if(reviewTarget === 'quotes'){
        if(wEl) wEl.textContent = (lang === 'zh' ? '\u91d1\u53e5' : 'Quote');
        const text = String(rec.text || '').trim();
        const tr = String(rec.translation || '').trim();
        const note = String(rec.annotation || '').trim();
        if(mEl) mEl.textContent = (text + (tr ? `\n\n${tr}` : '') + (note ? `\n\n${note}` : '')).trim() || (lang === 'zh' ? '\uff08\u7a7a\u91d1\u53e5\uff09' : '(empty quote)');
      }else{
        if(wEl) wEl.textContent = String(rec.word || rec.id || id);
        const cn = String(getWordMeaning(rec) || '').trim();
        const en = String(getWordEnglishMeaning(rec) || '').trim();
        let lines = '';
        if(reviewMeaningMode === 'cn'){
          lines = cn || (lang === 'zh' ? '\uff08\u6682\u65e0\u4e2d\u6587\u91ca\u4e49\uff09' : '(no Chinese meaning)');
        }else if(reviewMeaningMode === 'en'){
          lines = en || (lang === 'zh' ? '\uff08\u6682\u65e0\u82f1\u6587\u91ca\u4e49\uff09' : '(no English meaning)');
        }else{
          const p1 = `CN: ${cn || (lang === 'zh' ? '\u6682\u65e0' : 'N/A')}`;
          const p2 = `EN: ${en || (lang === 'zh' ? '\u6682\u65e0' : 'N/A')}`;
          lines = `${p1}\n\n${p2}`;
        }
        if(mEl) mEl.textContent = lines;
      }
    }

    $('btn-start').addEventListener('click', ()=>{
      toast('toast-review','');
      if(!asset){
        toast('toast-review', t('toast_import_first'));
        return;
      }
      const desired = Number($('limit')?.value || 20) || 20;
      const laser = laserEnabled(asset);
      const lim = laser ? clamp(desired, 50, 100) : clamp(desired, 1, 200);
      if($('limit')) $('limit').value = String(lim);
      queue = reviewTarget === 'quotes'
        ? buildQuoteReviewQueue(asset, lim)
        : buildReviewQueue(asset, lim);
      qIdx = 0;
      renderReview();
      if(!queue.length){
        toast('toast-review', reviewTarget === 'quotes'
          ? (lang === 'zh' ? '\u6682\u65e0\u5230\u671f\u91d1\u53e5\uff0c\u53ef\u7a0d\u540e\u518d\u8bd5\u6216\u5bfc\u5165\u66f4\u591a\u91d1\u53e5\u3002' : 'No due quotes found. Try later or import more quotes.')
          : (lang === 'zh' ? '\u6682\u65e0\u5230\u671f\u5355\u8bcd\uff0c\u53ef\u7a0d\u540e\u518d\u8bd5\u6216\u5bfc\u5165\u66f4\u5927\u7684\u8d44\u4ea7\u3002' : 'No due words found. Try later or import a larger asset.'));
      }
    });

    document.querySelectorAll('.rate').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        toast('toast-review','');
        if(!asset || !queue.length || qIdx >= queue.length) return;
        const q = Number(btn.dataset.q || 0) || 0;
        const id = queue[qIdx];

      const mr = await commitMutation(asset, ()=>{
        const r = reviewTarget === 'quotes'
          ? commitQuoteRating(asset, id, q)
          : commitWordRating(asset, id, q);
        return r.ok;
      });
      if(!mr.ok){
        toast('toast-review', lang === 'zh' ? `\u4fdd\u5b58\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Save failed: ${mr.error || 'unknown'}`);
        return;
      }

        qIdx += 1;
        updateHomeUI(asset);
        renderReview();
      });
    });

    $('btn-dump').addEventListener('click', ()=>{
      const out = $('debug-out');
      if(!out) return;
      const caps = getCapabilities();
      const summary = asset
        ? `${lang === 'zh' ? '\u5355\u8bcd' : 'words'}=${activeWords(asset).length}, ${lang === 'zh' ? '\u91d1\u53e5' : 'quotes'}=${activeQuotes(asset).length}, rev=${Number(asset.revision)||0}`
        : (lang === 'zh' ? '\u65e0\u8d44\u4ea7' : 'no asset');
      const runtime = `runtime: dirty=${persist.dirty} inFlight=${persist.inFlight} lastError=${persist.lastError || '-'}\n`+
        `capabilities: ${JSON.stringify(caps)} isPro=${isProUser()}\n`+
        `summary: ${summary}`;
      out.textContent = runtime + '\n\n' + (asset ? JSON.stringify(asset, null, 2) : (lang === 'zh' ? '(\u65e0\u8d44\u4ea7)' : '(no asset)'));
      setTab('debug');
    });

    $('btn-rehash').addEventListener('click', async ()=>{
      const out = $('debug-out');
      if(!asset){
        if(out) out.textContent = (lang === 'zh' ? '(\u65e0\u8d44\u4ea7)' : '(no asset)');
        return;
      }
      const h = computeContentHash(asset);
      if(h){
        asset.contentHash = h;
        await saveAsset(asset);
        updateHomeUI(asset);
        if(out) out.textContent = (lang === 'zh' ? `contentHash \u5df2\u66f4\u65b0\uff1a\n${h}` : `contentHash updated:\n${h}`);
      }else{
        if(out) out.textContent = lang === 'zh'
          ? 'contentHash \u8ba1\u7b97\u4e0d\u53ef\u7528\uff08\u53ef\u80fd\u662f data-layer.js \u672a\u52a0\u8f7d\uff09'
          : 'contentHash compute unavailable (data-layer.js missing?)';
      }
    });
    $('btn-cache-bust')?.addEventListener('click', ()=>{
      try{
        const u = new URL(String(location.href));
        u.searchParams.set('v', String(Date.now()));
        location.replace(u.toString());
      }catch(_){
        location.reload();
      }
    });

    // Words/Quotes wiring
    const wRef = $('w-refresh');
    if(wRef){
      wRef.addEventListener('click', renderWords);
      wRef.disabled = !asset;
    }
    const debouncedRenderWords = debounce(()=>{ renderWords(); }, 90);
    $('w-q')?.addEventListener('input', debouncedRenderWords);
    const wSort = $('w-sort');
    if(wSort){
      wSort.value = wordsSortField;
      wSort.addEventListener('change', ()=>{
        wordsSortField = String(wSort.value || 'time');
        renderWords();
        updateSortStatePills();
        toast('toast-words', lang === 'zh'
          ? `\u6392\u5e8f\uff1a${sortFieldLabel('words', wordsSortField)}`
          : `Sort: ${sortFieldLabel('words', wordsSortField)}`);
      });
    }
    const wSortDir = $('w-sort-dir');
    if(wSortDir){
      wSortDir.textContent = wordsSortDir === 'asc' ? '↑' : '↓';
      wSortDir.addEventListener('click', ()=>{
        wordsSortDir = wordsSortDir === 'asc' ? 'desc' : 'asc';
      wSortDir.textContent = wordsSortDir === 'asc' ? '↑' : '↓';
        renderWords();
        updateSortStatePills();
        toast('toast-words', wordsSortDir === 'asc'
          ? (lang === 'zh' ? '\u65b9\u5411\uff1a\u5347\u5e8f' : 'Direction: ascending')
          : (lang === 'zh' ? '\u65b9\u5411\uff1a\u964d\u5e8f' : 'Direction: descending'));
      });
    }

    const wSel = $('w-select');
    if(wSel){
      wSel.disabled = !asset;
      wSel.addEventListener('click', ()=> setWordSelectMode(!wordSelectMode));
    }
    const wAll = $('w-all');
    if(wAll){
      wAll.disabled = true;
      wAll.addEventListener('click', ()=>{
        if(!asset || !wordSelectMode) return;
        const q = String($('w-q')?.value || '').trim().toLowerCase();
        const items = activeWords(asset);
        const filtered = q
          ? items.filter(r=>{
              const w = String(r.word || r.id || '').toLowerCase();
              const m = getWordMeaning(r).toLowerCase();
              const n = String(r.annotation || '').toLowerCase();
              const t = Array.isArray(r.tags) ? r.tags.join(' ').toLowerCase() : '';
              return w.includes(q) || m.includes(q) || n.includes(q) || t.includes(q);
            })
          : items;
        selectedWords.clear();
        // Deterministic cap to avoid UI freeze on huge selections.
        for(const rec of filtered.slice(0, 5000)){
          const id0 = String(rec.id || rec.word || '').toLowerCase().trim();
          if(id0) selectedWords.add(id0);
        }
        updateWordBatchButtons();
        renderWords();
      });
    }
    $('w-batch-tag-apply')?.addEventListener('click', async ()=>{
      toast('toast-words','');
      if(!asset || !wordSelectMode || selectedWords.size === 0) return;
      const tags = parseTags($('w-batch-tags')?.value || '');
      if(!tags.length){
        toast('toast-words', t('toast_tags_missing'));
        return;
      }
      const ids = Array.from(selectedWords);
      const mr = await commitMutation(asset, ()=>{
        let changed = false;
        for(const id of ids){
          const rec = findWordRecord(asset, id);
          if(!rec || rec.isDeleted === true) continue;
          const cur = Array.isArray(rec.tags) ? rec.tags.slice() : [];
          const curSet = new Set(cur.map(x=>String(x||'').toLowerCase()));
          for(const t of tags){
            const k = t.toLowerCase();
            if(curSet.has(k)) continue;
            curSet.add(k);
            cur.push(t);
            changed = true;
          }
          if(changed){
            cur.sort((a,b)=>String(a).localeCompare(String(b)));
            rec.tags = cur;
            rec.updatedAt = Date.now();
          }
        }
        return changed;
      });
      if(!mr.ok){
        toast('toast-words', lang === 'zh' ? `\u6279\u91cf\u6807\u7b7e\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Batch tag failed: ${mr.error || 'unknown'}`);
        return;
      }
      toast('toast-words', t('toast_tags_applied', selectedWords.size));
      setWordSelectMode(false);
      updateHomeUI(asset);
    });
    $('w-batch-del')?.addEventListener('click', async ()=>{
      toast('toast-words','');
      if(!asset || !wordSelectMode || selectedWords.size === 0) return;
      if(!confirm(t('confirm_delete_words', selectedWords.size))) return;
      const ids = Array.from(selectedWords);
      const mr = await commitMutation(asset, ()=>{
        let changed = false;
        for(const id of ids){
          if(removeWordRecord(asset, id)) changed = true;
        }
        return changed;
      });
      if(!mr.ok){
        toast('toast-words', lang === 'zh' ? `\u6279\u91cf\u5220\u9664\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Batch delete failed: ${mr.error || 'unknown'}`);
        return;
      }
      toast('toast-words', lang === 'zh' ? `\u5df2\u5220\u9664 ${selectedWords.size} \u4e2a\u5355\u8bcd\u3002` : `Deleted ${selectedWords.size} words.`);
      setWordSelectMode(false);
      updateHomeUI(asset);
    });
    const qRef = $('q-refresh');
    if(qRef){
      qRef.addEventListener('click', renderQuotes);
      qRef.disabled = !asset;
    }
    const debouncedRenderQuotes = debounce(()=>{ renderQuotes(); }, 90);
    $('q-q')?.addEventListener('input', debouncedRenderQuotes);
    const qSort = $('q-sort');
    if(qSort){
      qSort.value = quotesSortField;
      qSort.addEventListener('change', ()=>{
        quotesSortField = String(qSort.value || 'time');
        renderQuotes();
        updateSortStatePills();
        toast('toast-quotes', lang === 'zh'
          ? `\u6392\u5e8f\uff1a${sortFieldLabel('quotes', quotesSortField)}`
          : `Sort: ${sortFieldLabel('quotes', quotesSortField)}`);
      });
    }
    const expMain = $('q-exp-main-font');
    if(expMain){
      expMain.title = (lang === 'zh' ? '\u82f1\u6587\u5b57\u4f53' : 'Main font');
    }
    const expCjk = $('q-exp-cjk-font');
    if(expCjk){
      expCjk.title = (lang === 'zh' ? '\u4e2d\u6587\u5b57\u4f53' : 'CJK font');
    }
    const expTpl = $('q-exp-template');
    if(expTpl){
      const tplMap = lang === 'zh'
        ? {
            hordSignature: 'HORD \u54c1\u724c',
            editorial: 'Editorial \u6742\u5fd7',
            gradientSoft: 'Gradient \u6e10\u53d8',
            nightCircuit: 'Night \u591c\u95f4',
          }
        : {
            hordSignature: 'HORD Signature',
            editorial: 'Editorial',
            gradientSoft: 'Gradient Soft',
            nightCircuit: 'Night Circuit',
          };
      Array.from(expTpl.options || []).forEach((opt)=>{
        const key = String(opt.value || '');
        if(tplMap[key]) opt.textContent = tplMap[key];
      });
    }
    const qSortDir = $('q-sort-dir');
    if(qSortDir){
      qSortDir.textContent = quotesSortDir === 'asc' ? '↑' : '↓';
      qSortDir.addEventListener('click', ()=>{
        quotesSortDir = quotesSortDir === 'asc' ? 'desc' : 'asc';
      qSortDir.textContent = quotesSortDir === 'asc' ? '↑' : '↓';
        renderQuotes();
        updateSortStatePills();
        toast('toast-quotes', quotesSortDir === 'asc'
          ? (lang === 'zh' ? '\u65b9\u5411\uff1a\u5347\u5e8f' : 'Direction: ascending')
          : (lang === 'zh' ? '\u65b9\u5411\uff1a\u964d\u5e8f' : 'Direction: descending'));
      });
    }

    const qSel = $('q-select');
    if(qSel){
      qSel.disabled = !asset;
      qSel.addEventListener('click', ()=> setQuoteSelectMode(!quoteSelectMode));
    }
    const qExportImg = $('q-export-img');
    if(qExportImg){
      qExportImg.disabled = true;
      qExportImg.addEventListener('click', ()=>{ exportSelectedQuoteImages().catch(()=>{}); });
    }
    const qExportCancel = $('q-export-cancel');
    if(qExportCancel){
      qExportCancel.addEventListener('click', ()=>{
        if(!quoteExportRuntime.inFlight) return;
        quoteExportRuntime.cancelRequested = true;
        qExportCancel.disabled = true;
      });
    }
    const qExportRetryFailed = $('q-export-retry-failed');
    if(qExportRetryFailed){
      qExportRetryFailed.addEventListener('click', ()=>{
        if(quoteExportRuntime.inFlight) return;
        const ids = Array.isArray(quoteExportRuntime.failedIds) ? quoteExportRuntime.failedIds : [];
        const retryList = ids
          .map(id => findQuoteRecord(asset, id))
          .filter(rec => rec && rec.isDeleted !== true);
        if(!retryList.length){
          toast('toast-quotes', lang === 'zh' ? '\u6ca1\u6709\u53ef\u91cd\u8bd5\u7684\u5931\u8d25\u9879\u3002' : 'No failed items to retry.');
          return;
        }
        exportSelectedQuoteImages(retryList).catch(()=>{});
      });
    }
    $('q-batch-tag-apply')?.addEventListener('click', async ()=>{
      toast('toast-quotes','');
      if(!asset || !quoteSelectMode || selectedQuotes.size === 0) return;
      const tags = parseTags($('q-batch-tags')?.value || '');
      if(!tags.length){
        toast('toast-quotes', t('toast_tags_missing'));
        return;
      }
      const ids = Array.from(selectedQuotes);
      const mr = await commitMutation(asset, ()=>{
        let changed = false;
        for(const id of ids){
          const rec = findQuoteRecord(asset, id);
          if(!rec || rec.isDeleted === true) continue;
          const cur = Array.isArray(rec.tags) ? rec.tags.slice() : [];
          const curSet = new Set(cur.map(x=>String(x||'').toLowerCase()));
          for(const t of tags){
            const k = t.toLowerCase();
            if(curSet.has(k)) continue;
            curSet.add(k);
            cur.push(t);
            changed = true;
          }
          if(changed){
            cur.sort((a,b)=>String(a).localeCompare(String(b)));
            rec.tags = cur;
            rec.updatedAt = Date.now();
          }
        }
        return changed;
      });
      if(!mr.ok){
        toast('toast-quotes', lang === 'zh' ? `\u6279\u91cf\u6807\u7b7e\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Batch tag failed: ${mr.error || 'unknown'}`);
        return;
      }
      toast('toast-quotes', t('toast_tags_applied', selectedQuotes.size));
      setQuoteSelectMode(false);
      updateHomeUI(asset);
    });
    $('q-batch-del')?.addEventListener('click', async ()=>{
      toast('toast-quotes','');
      if(!asset || !quoteSelectMode || selectedQuotes.size === 0) return;
      if(!confirm(t('confirm_delete_quotes', selectedQuotes.size))) return;
      const ids = Array.from(selectedQuotes);
      const mr = await commitMutation(asset, ()=>{
        let changed = false;
        for(const id of ids){
          const rec = findQuoteRecord(asset, id);
          if(!rec || rec.isDeleted === true) continue;
          rec.isDeleted = true;
          rec.updatedAt = Date.now();
          changed = true;
        }
        return changed;
      });
      if(!mr.ok){
        toast('toast-quotes', lang === 'zh' ? `\u6279\u91cf\u5220\u9664\u5931\u8d25\uff1a${mr.error || 'unknown'}` : `Batch delete failed: ${mr.error || 'unknown'}`);
        return;
      }
      toast('toast-quotes', t('toast_deleted', selectedQuotes.size, t('quote_unit')));
      setQuoteSelectMode(false);
      updateHomeUI(asset);
    });

    // initial render when switching tabs
    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const t = btn.dataset.tab;
        if(t === 'words') renderWords();
        if(t === 'quotes') renderQuotes();
      });
    });
  }

  main().catch((e)=>{
    toast('toast-home', `Fatal error: ${String(e && e.message || e)}`);
  });
})();


