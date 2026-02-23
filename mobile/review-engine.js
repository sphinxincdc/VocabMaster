// review-engine.js
// Shared review selection utilities (plugin + mobile).
// Laser mode uses Top-K selection without full-array sort (O(n log K), K<=100).
'use strict';

(function(){
  const DAY = 24 * 60 * 60 * 1000;

  function clamp(v, min, max){
    const n = Number(v);
    if(!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function wordScore(meta, now){
    const m = meta && typeof meta === 'object' ? meta : {};
    const isFavorite = m.isFavorite === true;
    const learnCount = Number(m.learnCount) || 0;
    const reviewCount = Number(m.reviewCount) || 0;
    const lastReviewedAt = Number(m.lastReviewAt || m.lastReviewedAt) || 0;
    const statusRaw = String(m.status || '').toLowerCase();
    const status = statusRaw === 'learning' ? 'yellow' : statusRaw;

    let s = 0;
    if(isFavorite) s += 10;
    if(learnCount < 2) s += 5;
    if(reviewCount < 3) s += 5;
    if(lastReviewedAt && (now - lastReviewedAt) > 7 * DAY) s += 8;
    if(status === 'learning' || status === 'yellow') s += 5;
    if(reviewCount > 20) s -= 3;
    return s;
  }

  // A small min-heap ordered by (score asc, word desc) so the "worst" item is popped first.
  // This keeps selection deterministic without relying on full sort.
  class MinHeap {
    constructor(cmp){
      this.a = [];
      this.cmp = cmp;
    }
    size(){ return this.a.length; }
    peek(){ return this.a[0]; }
    push(x){
      const a = this.a;
      a.push(x);
      this._up(a.length - 1);
    }
    replaceTop(x){
      const a = this.a;
      a[0] = x;
      this._down(0);
    }
    pop(){
      const a = this.a;
      if(!a.length) return null;
      const top = a[0];
      const last = a.pop();
      if(a.length){
        a[0] = last;
        this._down(0);
      }
      return top;
    }
    _up(i){
      const a = this.a, cmp = this.cmp;
      while(i > 0){
        const p = (i - 1) >> 1;
        if(cmp(a[i], a[p]) >= 0) break;
        const t = a[i]; a[i] = a[p]; a[p] = t;
        i = p;
      }
    }
    _down(i){
      const a = this.a, cmp = this.cmp;
      const n = a.length;
      for(;;){
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if(l < n && cmp(a[l], a[m]) < 0) m = l;
        if(r < n && cmp(a[r], a[m]) < 0) m = r;
        if(m === i) break;
        const t = a[i]; a[i] = a[m]; a[m] = t;
        i = m;
      }
    }
    toArray(){
      return this.a.slice();
    }
  }

  function selectTopKWords(words, metaMap, now, k){
    const K = clamp(k, 1, 100);
    const meta = metaMap && typeof metaMap === 'object' ? metaMap : {};
    const seen = new Set();
    const daySeed = Math.floor((Number(now) || Date.now()) / DAY);

    function tieScore(word){
      // Deterministic pseudo-random tie breaker (changes daily, same across devices that day).
      const s = `${String(word || '')}|${daySeed}`;
      let h = 2166136261 >>> 0;
      for(let i = 0; i < s.length; i++){
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619) >>> 0;
      }
      return h;
    }

    const cmp = (a, b)=>{
      if(a.score !== b.score) return a.score - b.score; // min first
      if(a.tie !== b.tie) return a.tie - b.tie; // min first
      // final deterministic fallback
      if(a.word === b.word) return 0;
      return a.word > b.word ? -1 : 1;
    };
    const heap = new MinHeap(cmp);

    for(const w0 of (words || [])){
      const w = String(w0 || '').toLowerCase().trim();
      if(!w || seen.has(w)) continue;
      seen.add(w);
      const s = wordScore(meta[w], now);
      const item = { word: w, score: s, tie: tieScore(w) };
      if(heap.size() < K){
        heap.push(item);
        continue;
      }
      const top = heap.peek();
      // Keep better candidates by (score, tie, word).
      if(
        s > top.score ||
        (s === top.score && (item.tie > top.tie || (item.tie === top.tie && w < top.word)))
      ){
        heap.replaceTop(item);
      }
    }

    const out = heap.toArray();
    // K is small; sorting is fine and improves UX ordering. Still within O(K log K), K<=100.
    out.sort((a,b)=> b.score - a.score || b.tie - a.tie || a.word.localeCompare(b.word));
    return out.map(x=>x.word);
  }

  globalThis.HordReviewEngine = {
    wordScore,
    selectTopKWords,
  };
})();
