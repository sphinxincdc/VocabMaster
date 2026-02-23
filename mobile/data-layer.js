// data-layer.js
// Local-first asset metadata + deterministic merge utilities (Phase 1 foundation).
// Keep dependency-free (no external libs); safe for MV3 service worker via importScripts.
'use strict';

(function(){
  const U64_MASK = 0xffffffffffffffffn;
  const FNV64_OFFSET_A = 0xcbf29ce484222325n;
  const FNV64_OFFSET_B = 0x84222325cbf29ce4n; // alt seed (just a different constant)
  const FNV64_PRIME = 0x100000001b3n;

  const te = new TextEncoder();

  function u64Hex(x){
    return (x & U64_MASK).toString(16).padStart(16, '0');
  }

  function fnv1a64Init(seed){
    return (seed ?? FNV64_OFFSET_A) & U64_MASK;
  }

  function fnv1a64Update(hash, bytes){
    let h = hash & U64_MASK;
    for(let i = 0; i < bytes.length; i++){
      h ^= BigInt(bytes[i]);
      h = (h * FNV64_PRIME) & U64_MASK;
    }
    return h;
  }

  function fnv1a64OfString(str, seed){
    const bytes = te.encode(String(str ?? ''));
    return fnv1a64Update(fnv1a64Init(seed), bytes);
  }

  // Deterministic order for IDs without O(n log n) full sort:
  // - radix-sort by 64-bit FNV hash (8 passes of 8 bits)
  // - if hash collisions occur, tie-break by lex order within that tiny group.
  function orderIdsDeterministic(ids){
    const arr = [];
    for(let i = 0; i < ids.length; i++){
      const id = String(ids[i] ?? '');
      if(!id) continue;
      arr.push({ id, h: fnv1a64OfString(id, FNV64_OFFSET_A) });
    }
    // radix sort by 8-bit chunks (LSB -> MSB)
    let cur = arr;
    for(let pass = 0; pass < 8; pass++){
      const buckets = Array.from({length:256}, ()=>[]);
      const shift = BigInt(pass * 8);
      for(let i = 0; i < cur.length; i++){
        const it = cur[i];
        const b = Number((it.h >> shift) & 0xffn);
        buckets[b].push(it);
      }
      const next = [];
      for(let b = 0; b < 256; b++){
        const buck = buckets[b];
        for(let j = 0; j < buck.length; j++) next.push(buck[j]);
      }
      cur = next;
    }
    // collision tie-break (rare)
    const out = [];
    for(let i = 0; i < cur.length; i++){
      const start = i;
      const h = cur[i].h;
      while(i + 1 < cur.length && cur[i + 1].h === h) i++;
      if(i === start){
        out.push(cur[start].id);
        continue;
      }
      const group = cur.slice(start, i + 1).map(x=>x.id);
      group.sort((a,b)=>a.localeCompare(b));
      for(let k = 0; k < group.length; k++) out.push(group[k]);
    }
    return out;
  }

  function isObj(x){
    return !!x && typeof x === 'object' && !Array.isArray(x);
  }

  function normStr(x){
    return String(x ?? '').trim();
  }

  function normLower(x){
    return normStr(x).toLowerCase();
  }

  function uniq(arr){
    const out = [];
    const seen = new Set();
    for(const v of (arr || [])){
      const s = String(v ?? '').trim();
      if(!s || seen.has(s)) continue;
      seen.add(s);
      out.push(s);
    }
    return out;
  }

  function normTags(tags){
    if(!Array.isArray(tags)) return [];
    const out = [];
    const seen = new Set();
    for(const t0 of tags){
      const t = normStr(t0);
      if(!t) continue;
      const k = t.toLowerCase();
      if(seen.has(k)) continue;
      seen.add(k);
      out.push(t);
    }
    // tag list is small; sort for stability
    out.sort((a,b)=>a.localeCompare(b));
    return out;
  }

  function stableStringify(value){
    if(value === null) return 'null';
    const t = typeof value;
    if(t === 'number' || t === 'boolean') return JSON.stringify(value);
    if(t === 'string') return JSON.stringify(value);
    if(t !== 'object') return JSON.stringify(null);
    if(Array.isArray(value)){
      const parts = value.map(v=>stableStringify(v));
      return '[' + parts.join(',') + ']';
    }
    const keys = Object.keys(value).sort();
    const parts = [];
    for(const k of keys){
      const v = value[k];
      if(v === undefined) continue;
      parts.push(JSON.stringify(k) + ':' + stableStringify(v));
    }
    return '{' + parts.join(',') + '}';
  }

  function getWordStatus(db, w){
    const word = String(w ?? '');
    const metaSt = normLower(db?.vocabMeta?.[word]?.status);
    if(metaSt === 'yellow' || metaSt === 'green' || metaSt === 'red') return metaSt;
    if(Array.isArray(db?.greenList) && db.greenList.includes(word)) return 'green';
    if(Array.isArray(db?.yellowList) && db.yellowList.includes(word)) return 'yellow';
    return metaSt || 'red';
  }

  function isWordDeleted(db, w){
    return db?.vocabMeta?.[String(w ?? '')]?.isDeleted === true;
  }

  function getSentenceId(s){
    const id = Number(s?.id ?? s?.createdAt ?? 0);
    return Number.isFinite(id) && id > 0 ? id : 0;
  }

  function isSentenceDeleted(db, s){
    if(s?.isDeleted === true) return true;
    const sid = getSentenceId(s);
    if(!sid) return false;
    return db?.sentenceMeta?.[String(sid)]?.isDeleted === true;
  }

  function buildWordRecord(db, wordId){
    const id = normLower(wordId);
    const meta = isObj(db?.vocabMeta?.[id]) ? db.vocabMeta[id] : {};
    const fallbackDeviceId = String(db?.assetMetaV2?.deviceId || '');
    const createdAt = Number(meta.createdAt) || 0;
    const updatedAt = Number(meta.updatedAt) || createdAt || 0;
    const rec = {
      id,
      deviceId: normStr(meta.deviceId || fallbackDeviceId),
      word: id,
      meaning: normStr(db?.vocabDict?.[id] ?? ''),
      annotation: normStr(db?.vocabNotes?.[id] ?? ''),
      englishMeaning: Array.isArray(db?.vocabEn?.[id]) ? db.vocabEn[id].slice(0, 6).map(x=>normStr(x)).filter(Boolean) : [],
      tags: normTags(meta.tags),
      status: getWordStatus(db, id),
      isDeleted: meta.isDeleted === true,
      createdAt,
      updatedAt,
      reviewCount: Number(meta.reviewCount) || 0,
      lastReviewedAt: Number(meta.lastReviewAt) || 0,
      nextReviewAt: Number(meta.nextReviewAt) || 0,
      mastery: Number(meta.mastery) || 0,
      learnCount: Number(meta.learnCount) || 0,
      isFavorite: meta.isFavorite === true,
      sourceUrl: normStr(meta.sourceUrl ?? ''),
      sourceLabel: normStr(meta.sourceLabel ?? ''),
      phonetics: isObj(db?.vocabPhonetics?.[id]) ? {
        us: normStr(db.vocabPhonetics[id].us ?? ''),
        uk: normStr(db.vocabPhonetics[id].uk ?? ''),
      } : {us:'', uk:''},
      audio: isObj(db?.vocabAudio?.[id]) ? {
        us: normStr(db.vocabAudio[id].us ?? ''),
        uk: normStr(db.vocabAudio[id].uk ?? ''),
      } : {us:'', uk:''},
    };
    // Avoid bloating export with empty sub-objects
    if(!rec.phonetics.us && !rec.phonetics.uk) delete rec.phonetics;
    if(!rec.audio.us && !rec.audio.uk) delete rec.audio;
    if(!rec.englishMeaning.length) delete rec.englishMeaning;
    if(!rec.tags.length) delete rec.tags;
    if(!rec.annotation) delete rec.annotation;
    if(!rec.meaning) delete rec.meaning;
    if(!rec.deviceId) delete rec.deviceId;
    if(!rec.sourceUrl) delete rec.sourceUrl;
    if(!rec.sourceLabel) delete rec.sourceLabel;
    if(!rec.reviewCount) delete rec.reviewCount;
    if(!rec.lastReviewedAt) delete rec.lastReviewedAt;
    if(!rec.nextReviewAt) delete rec.nextReviewAt;
    if(!rec.mastery) delete rec.mastery;
    if(!rec.learnCount) delete rec.learnCount;
    if(!rec.isFavorite) delete rec.isFavorite;
    if(!rec.createdAt) delete rec.createdAt;
    if(!rec.updatedAt) delete rec.updatedAt;
    if(rec.status === 'red') delete rec.status;
    if(!rec.isDeleted) delete rec.isDeleted;
    return rec;
  }

  function buildQuoteRecord(db, s){
    const sid = getSentenceId(s);
    const meta = isObj(db?.sentenceMeta?.[String(sid)]) ? db.sentenceMeta[String(sid)] : {};
    const fallbackDeviceId = String(db?.assetMetaV2?.deviceId || '');
    const createdAt = Number(s?.createdAt ?? sid) || 0;
    const updatedAt = Number(s?.updatedAt ?? meta.updatedAt ?? createdAt) || 0;
    const rec = {
      id: String(sid || createdAt || 0),
      deviceId: normStr(meta.deviceId || fallbackDeviceId),
      text: normStr(s?.text ?? ''),
      translation: normStr(s?.translation ?? s?.trans ?? ''),
      annotation: normStr(s?.note ?? ''),
      url: normStr(s?.url ?? ''),
      title: normStr(s?.title ?? ''),
      sourceLabel: normStr(s?.sourceLabel ?? ''),
      isDeleted: (s?.isDeleted === true) || (meta.isDeleted === true),
      createdAt,
      updatedAt,
      reviewCount: Number(meta.reviewCount) || 0,
      lastReviewedAt: Number(meta.lastReviewedAt ?? meta.lastReviewAt) || 0,
      nextReviewAt: Number(meta.nextReviewAt) || 0,
      tags: normTags(meta.tags),
      isFavorite: meta.isFavorite === true,
    };
    if(!rec.translation) delete rec.translation;
    if(!rec.annotation) delete rec.annotation;
    if(!rec.url) delete rec.url;
    if(!rec.title) delete rec.title;
    if(!rec.sourceLabel) delete rec.sourceLabel;
    if(!rec.reviewCount) delete rec.reviewCount;
    if(!rec.lastReviewedAt) delete rec.lastReviewedAt;
    if(!rec.nextReviewAt) delete rec.nextReviewAt;
    if(!rec.tags.length) delete rec.tags;
    if(!rec.isFavorite) delete rec.isFavorite;
    if(!rec.createdAt) delete rec.createdAt;
    if(!rec.updatedAt) delete rec.updatedAt;
    if(!rec.deviceId) delete rec.deviceId;
    if(!rec.isDeleted) delete rec.isDeleted;
    return rec;
  }

  // Content hash over words+quotes only, deterministic and stable.
  // Uses a 128-bit FNV-based hash over canonical stable strings.
  function computeContentHashFromRecords(words, quotes){
    let ha = fnv1a64Init(FNV64_OFFSET_A);
    let hb = fnv1a64Init(FNV64_OFFSET_B);
    const feed = (kind, rec)=>{
      const id = String(rec?.id ?? '');
      const payload = stableStringify(rec);
      const bytes = te.encode(kind + '\n' + id + '\n' + payload + '\n');
      ha = fnv1a64Update(ha, bytes);
      hb = fnv1a64Update(hb, bytes);
    };
    for(const w of words) feed('w', w);
    for(const q of quotes) feed('q', q);
    return 'fnv128:' + u64Hex(ha) + u64Hex(hb);
  }

  function getAllWordIds(db){
    const ids = new Set();
    for(const w of (db?.vocabList || [])){
      const id = normLower(w);
      if(id) ids.add(id);
    }
    for(const k of Object.keys(db?.vocabDict || {})) ids.add(normLower(k));
    for(const k of Object.keys(db?.vocabNotes || {})) ids.add(normLower(k));
    for(const k of Object.keys(db?.vocabMeta || {})) ids.add(normLower(k));
    for(const k of Object.keys(db?.vocabEn || {})) ids.add(normLower(k));
    for(const k of Object.keys(db?.vocabPhonetics || {})) ids.add(normLower(k));
    for(const k of Object.keys(db?.vocabAudio || {})) ids.add(normLower(k));
    return Array.from(ids).filter(Boolean);
  }

  function getAllQuoteRecordsRaw(db){
    const arr = Array.isArray(db?.collectedSentences) ? db.collectedSentences : [];
    const out = [];
    for(const s of arr){
      if(!s) continue;
      if(typeof s === 'string'){
        const t = normStr(s);
        if(!t) continue;
        out.push({text:t, createdAt:0});
      }else if(isObj(s)){
        if(normStr(s.text)) out.push(s);
      }
    }
    return out;
  }

  function ensureAssetMetaV2(db, appVersion){
    if(!isObj(db)) return {changed:false};
    const nowVer = String(appVersion ?? '').trim();
    const meta = isObj(db.assetMetaV2) ? db.assetMetaV2 : null;
    let changed = false;
    if(!meta){
      db.assetMetaV2 = {};
      changed = true;
    }
    const m = db.assetMetaV2;
    if(Number(m.schemaVersion) !== 2){
      m.schemaVersion = 2;
      changed = true;
    }
    if(!m.assetId){
      m.assetId = crypto.randomUUID();
      changed = true;
    }
    if(!m.deviceId){
      m.deviceId = crypto.randomUUID();
      changed = true;
    }
    if(!Number.isFinite(Number(m.revision))){
      m.revision = 0;
      changed = true;
    }
    if(!Number.isFinite(Number(m.updatedAt))){
      m.updatedAt = 0;
      changed = true;
    }
    if(typeof m.dirty !== 'boolean'){
      m.dirty = false;
      changed = true;
    }
    if(nowVer && m.appVersion !== nowVer){
      m.appVersion = nowVer;
      changed = true;
    }
    if(!isObj(m.meta)) m.meta = {};
    const activeWordCount = (()=>{
      let c = 0;
      const ids = getAllWordIds(db);
      for(const id of ids){
        if(!isWordDeleted(db, id)) c++;
      }
      return c;
    })();
    const activeQuoteCount = (()=>{
      let c = 0;
      const raw = getAllQuoteRecordsRaw(db);
      for(const s of raw){
        if(!isSentenceDeleted(db, s)) c++;
      }
      return c;
    })();
    if(m.meta.totalWords !== activeWordCount){
      m.meta.totalWords = activeWordCount;
      changed = true;
    }
    if(m.meta.totalQuotes !== activeQuoteCount){
      m.meta.totalQuotes = activeQuoteCount;
      changed = true;
    }
    const laser = activeWordCount >= 1000;
    if(m.meta.laserModeEnabled !== laser){
      m.meta.laserModeEnabled = laser;
      changed = true;
    }
    // contentHash is computed on-demand; only fill if absent
    if(!m.contentHash){
      const ids = orderIdsDeterministic(getAllWordIds(db));
      const words = ids.map(id=>buildWordRecord(db, id));
      const quotesRaw = getAllQuoteRecordsRaw(db);
      const quoteIds = orderIdsDeterministic(quotesRaw.map(s=>String(getSentenceId(s) || Number(s.createdAt) || 0)));
      const byId = new Map();
      for(const s of quotesRaw){
        const sid = String(getSentenceId(s) || Number(s.createdAt) || 0);
        if(!sid || byId.has(sid)) continue;
        byId.set(sid, s);
      }
      const quotes = quoteIds.map(id=>buildQuoteRecord(db, byId.get(id) || {id:Number(id)||0, text:'', createdAt:Number(id)||0}));
      m.contentHash = computeContentHashFromRecords(words, quotes);
      changed = true;
    }
    return {changed};
  }

  function buildFlatView(db){
    const out = {
      vocabList: [],
      vocabDict: {},
      vocabNotes: {},
      vocabMeta: {},
      vocabEn: {},
      vocabPhonetics: {},
      vocabAudio: {},
      yellowList: [],
      greenList: [],
      collectedSentences: [],
      sentenceDict: {},
      sentenceNotes: {},
      sentenceMeta: {},
      difficultList: [],
    };

    const allWordIds = getAllWordIds(db);
    const activeWordSet = new Set();
    for(const id of allWordIds){
      if(isWordDeleted(db, id)) continue;
      activeWordSet.add(id);
      out.vocabList.push(id);
      if(db?.vocabDict?.[id] != null) out.vocabDict[id] = db.vocabDict[id];
      if(db?.vocabNotes?.[id] != null) out.vocabNotes[id] = db.vocabNotes[id];
      if(db?.vocabMeta?.[id] != null){
        const m = {...db.vocabMeta[id]};
        delete m.isDeleted;
        out.vocabMeta[id] = m;
      }
      if(db?.vocabEn?.[id] != null) out.vocabEn[id] = db.vocabEn[id];
      if(db?.vocabPhonetics?.[id] != null) out.vocabPhonetics[id] = db.vocabPhonetics[id];
      if(db?.vocabAudio?.[id] != null) out.vocabAudio[id] = db.vocabAudio[id];
    }
    // Lists
    const filt = (arr)=>uniq((arr||[]).map(normLower)).filter(x=>activeWordSet.has(x));
    out.yellowList = filt(db?.yellowList);
    out.greenList = filt(db?.greenList);
    out.difficultList = filt(db?.difficultList);

    // Sentences
    const raw = getAllQuoteRecordsRaw(db);
    const activeIds = new Set();
    for(const s of raw){
      if(isSentenceDeleted(db, s)) continue;
      const sid = getSentenceId(s) || Number(s.createdAt) || 0;
      if(!sid) continue;
      activeIds.add(String(sid));
      out.collectedSentences.push(s);
    }
    // Filter meta maps by active ids
    const keepKeys = (obj)=>{
      const o = {};
      for(const k of Object.keys(obj||{})){
        if(activeIds.has(String(k))) o[k] = obj[k];
      }
      return o;
    };
    // sentenceDict keys are not ids, so filter by embedded id/createdAt if possible.
    const sd = db?.sentenceDict || {};
    const sdOut = {};
    for(const k of Object.keys(sd)){
      const v = sd[k];
      const sid = String(getSentenceId(v) || Number(v?.createdAt) || Number(v?.id) || 0);
      if(sid && activeIds.has(sid)) sdOut[k] = v;
    }
    out.sentenceDict = sdOut;
    out.sentenceNotes = keepKeys(db?.sentenceNotes);
    out.sentenceMeta = keepKeys(db?.sentenceMeta);
    return out;
  }

  function buildPublicDbView(db){
    // UI/pages should not see tombstones by default.
    const flat = buildFlatView(db);
    return {
      ...db,
      ...flat,
    };
  }

  function exportAssetV2FromDb(db, appVersion){
    const metaEnsure = ensureAssetMetaV2(db, appVersion);
    // Export includes tombstones for deterministic file-sync.
    const wordIds = orderIdsDeterministic(getAllWordIds(db));
    const words = wordIds.map(id=>buildWordRecord(db, id));
    const raw = getAllQuoteRecordsRaw(db);
    const byId = new Map();
    for(const s of raw){
      const sid = String(getSentenceId(s) || Number(s.createdAt) || 0);
      if(!sid || byId.has(sid)) continue;
      byId.set(sid, s);
    }
    const quoteIds = orderIdsDeterministic(Array.from(byId.keys()));
    const quotes = quoteIds.map(id=>buildQuoteRecord(db, byId.get(id)));
    const contentHash = computeContentHashFromRecords(words, quotes);

    const m = db.assetMetaV2 || {};
    // Keep meta contentHash aligned for export; do not mutate revision/updatedAt here.
    m.contentHash = contentHash;
    if(!isObj(m.meta)) m.meta = {};
    m.meta.totalWords = Number(m.meta.totalWords) || 0;
    m.meta.totalQuotes = Number(m.meta.totalQuotes) || 0;
    m.meta.laserModeEnabled = m.meta.laserModeEnabled === true;

    const deletedCount = words.reduce((acc, w)=>acc + (w.isDeleted ? 1 : 0), 0) + quotes.reduce((acc, q)=>acc + (q.isDeleted ? 1 : 0), 0);
    return {
      schemaVersion: 2,
      assetId: String(m.assetId || ''),
      app: 'HORD',
      exportType: 'ASSET_FILE',
      deviceId: String(m.deviceId || ''),
      revision: Number(m.revision) || 0,
      updatedAt: Number(m.updatedAt) || 0,
      contentHash,
      lastSync: 0, // UI-only; must not participate in merge decisions
      appVersion: String(m.appVersion || appVersion || ''),
      words,
      quotes,
      meta: {
        totalWords: Number(m.meta.totalWords) || 0,
        totalQuotes: Number(m.meta.totalQuotes) || 0,
        laserModeEnabled: m.meta.laserModeEnabled === true,
      }
      ,
      metadata: {
        totalWords: Number(m.meta.totalWords) || 0,
        deletedCount,
        lastUpdatedBy: String(m.deviceId || ''),
      },
      // Reserved for future (do not use in sync decisions)
      encryptedLicenseKey: '',
      licenseExpiry: 0,
      deviceBindingId: '',
    };
  }

  function recomputeAssetMetaV2FromDb(db, appVersion){
    const ensured = ensureAssetMetaV2(db, appVersion);
    if(!isObj(db?.assetMetaV2)) return {changed:false};
    const wordIds = orderIdsDeterministic(getAllWordIds(db));
    const words = wordIds.map(id=>buildWordRecord(db, id));
    const raw = getAllQuoteRecordsRaw(db);
    const byId = new Map();
    for(const s of raw){
      const sid = String(getSentenceId(s) || Number(s.createdAt) || 0);
      if(!sid || byId.has(sid)) continue;
      byId.set(sid, s);
    }
    const quoteIds = orderIdsDeterministic(Array.from(byId.keys()));
    const quotes = quoteIds.map(id=>buildQuoteRecord(db, byId.get(id)));
    const nextHash = computeContentHashFromRecords(words, quotes);
    const m = db.assetMetaV2;
    let changed = ensured.changed;
    if(m.contentHash !== nextHash){
      m.contentHash = nextHash;
      changed = true;
    }
    if(!isObj(m.meta)) m.meta = {};
    const totalWords = words.reduce((acc, w)=> acc + (w.isDeleted ? 0 : 1), 0);
    const totalQuotes = quotes.reduce((acc, q)=> acc + (q.isDeleted ? 0 : 1), 0);
    const laser = totalWords >= 1000;
    if(m.meta.totalWords !== totalWords){ m.meta.totalWords = totalWords; changed = true; }
    if(m.meta.totalQuotes !== totalQuotes){ m.meta.totalQuotes = totalQuotes; changed = true; }
    if(m.meta.laserModeEnabled !== laser){ m.meta.laserModeEnabled = laser; changed = true; }
    return {changed};
  }

  function mergeWhitelistFill(base, other){
    const out = {...other, ...base}; // base wins but keeps extra fields from other
    const fillStr = (k)=>{
      const a = normStr(out[k] ?? '');
      if(a) return;
      const b = normStr(other[k] ?? '');
      if(b) out[k] = b;
    };
    fillStr('annotation');
    fillStr('translation');
    fillStr('meaning');
    // tags: union
    const at = Array.isArray(base.tags) ? base.tags : [];
    const bt = Array.isArray(other.tags) ? other.tags : [];
    const mergedTags = normTags([...at, ...bt]);
    if(mergedTags.length) out.tags = mergedTags;
    return out;
  }

  function compareByUpdatedAtThenDevice(a, b){
    const ta = Number(a?.updatedAt) || 0;
    const tb = Number(b?.updatedAt) || 0;
    if(ta !== tb) return ta > tb ? 1 : -1;
    const da = String(a?.deviceId || '');
    const db = String(b?.deviceId || '');
    if(da === db) return 0;
    return da > db ? 1 : -1; // lex
  }

  function mergeRecord(a, b){
    if(!a) return b;
    if(!b) return a;
    const delA = a.isDeleted === true;
    const delB = b.isDeleted === true;
    if(delA || delB){
      // delete wins; if both deleted, keep newer (or device tie-break).
      if(delA && !delB) return a;
      if(delB && !delA) return b;
      return compareByUpdatedAtThenDevice(a, b) >= 0 ? a : b;
    }
    const ta = Number(a.updatedAt) || 0;
    const tb = Number(b.updatedAt) || 0;
    if(ta !== tb){
      return ta > tb ? a : b;
    }
    // updatedAt tie: deterministic deviceId tie-break
    const pickA = compareByUpdatedAtThenDevice(a, b) >= 0;
    const base = pickA ? a : b;
    const other = pickA ? b : a;
    return mergeWhitelistFill(base, other);
  }

  function mergeAsset(local, external){
    const l = isObj(local) ? local : null;
    const e = isObj(external) ? external : null;
    if(!l || !e) return {ok:false, error:'bad_asset'};
    if(Number(l.schemaVersion) !== 2 || Number(e.schemaVersion) !== 2){
      return {ok:false, error:'schema_not_v2'};
    }
    const lRev = Number(l.revision) || 0;
    const eRev = Number(e.revision) || 0;
    const lHash = String(l.contentHash || '');
    const eHash = String(e.contentHash || '');
    if(lRev === eRev && lHash && eHash && lHash === eHash){
      return {ok:true, merged:l, changed:false};
    }
    const lm = new Map();
    const em = new Map();
    for(const it of (Array.isArray(l.words) ? l.words : [])){
      const id = normLower(it?.id);
      if(id) lm.set(id, it);
    }
    for(const it of (Array.isArray(e.words) ? e.words : [])){
      const id = normLower(it?.id);
      if(id) em.set(id, it);
    }
    const allIds = [];
    for(const k of lm.keys()) allIds.push(k);
    for(const k of em.keys()) if(!lm.has(k)) allIds.push(k);
    const orderedIds = orderIdsDeterministic(allIds);
    const mergedWords = [];
    for(const id of orderedIds){
      const mw = mergeRecord(lm.get(id), em.get(id));
      if(mw) mergedWords.push({...mw, id});
    }

    const lq = new Map();
    const eq = new Map();
    const normQId = (x)=>String(x ?? '').trim();
    for(const it of (Array.isArray(l.quotes) ? l.quotes : [])){
      const id = normQId(it?.id);
      if(id) lq.set(id, it);
    }
    for(const it of (Array.isArray(e.quotes) ? e.quotes : [])){
      const id = normQId(it?.id);
      if(id) eq.set(id, it);
    }
    const allQ = [];
    for(const k of lq.keys()) allQ.push(k);
    for(const k of eq.keys()) if(!lq.has(k)) allQ.push(k);
    const orderedQ = orderIdsDeterministic(allQ);
    const mergedQuotes = [];
    for(const id of orderedQ){
      const mq = mergeRecord(lq.get(id), eq.get(id));
      if(mq) mergedQuotes.push({...mq, id});
    }

    const merged = {
      schemaVersion: 2,
      assetId: String(l.assetId || e.assetId || ''),
      app: 'HORD',
      exportType: 'ASSET_FILE',
      deviceId: String(l.deviceId || e.deviceId || ''),
      revision: Math.max(lRev, eRev),
      updatedAt: Math.max(Number(l.updatedAt)||0, Number(e.updatedAt)||0),
      appVersion: String(l.appVersion || e.appVersion || ''),
      lastSync: 0,
      words: mergedWords,
      quotes: mergedQuotes,
      meta: {
        totalWords: mergedWords.reduce((acc, w)=> acc + (w.isDeleted ? 0 : 1), 0),
        totalQuotes: mergedQuotes.reduce((acc, q)=> acc + (q.isDeleted ? 0 : 1), 0),
        laserModeEnabled: mergedWords.reduce((acc, w)=> acc + (w.isDeleted ? 0 : 1), 0) >= 1000,
      }
    };
    merged.contentHash = computeContentHashFromRecords(mergedWords, mergedQuotes);
    merged.metadata = {
      totalWords: merged.meta.totalWords,
      deletedCount: mergedWords.reduce((acc, w)=> acc + (w.isDeleted ? 1 : 0), 0) + mergedQuotes.reduce((acc, q)=> acc + (q.isDeleted ? 1 : 0), 0),
      lastUpdatedBy: String(merged.deviceId || ''),
    };
    merged.encryptedLicenseKey = '';
    merged.licenseExpiry = 0;
    merged.deviceBindingId = '';

    const changed = !(lHash && merged.contentHash === lHash);
    return {ok:true, merged, changed};
  }

  globalThis.HordDataLayer = {
    stableStringify,
    orderIdsDeterministic,
    ensureAssetMetaV2,
    recomputeAssetMetaV2FromDb,
    buildFlatView,
    buildPublicDbView,
    exportAssetV2FromDb,
    computeContentHashFromRecords,
    mergeAsset,
  };
})();
