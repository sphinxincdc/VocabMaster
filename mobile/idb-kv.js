// idb-kv.js
// Tiny IndexedDB KV helper for storing structured-cloneable objects (e.g. FileSystemFileHandle).
'use strict';

(function(){
  const DB_NAME = 'hord_asset_idb_v1';
  const STORE = 'kv';
  const DB_VERSION = 1;

  let dbp = null;

  function openDb(){
    if(dbp) return dbp;
    dbp = new Promise((resolve, reject)=>{
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = ()=>{
        const db = req.result;
        if(!db.objectStoreNames.contains(STORE)){
          db.createObjectStore(STORE);
        }
      };
      req.onsuccess = ()=>resolve(req.result);
      req.onerror = ()=>reject(req.error || new Error('idb_open_failed'));
    });
    return dbp;
  }

  async function withStore(mode, fn){
    const db = await openDb();
    return await new Promise((resolve, reject)=>{
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      let out;
      try{ out = fn(store); }catch(e){ reject(e); return; }
      tx.oncomplete = ()=>resolve(out);
      tx.onerror = ()=>reject(tx.error || new Error('idb_tx_failed'));
      tx.onabort = ()=>reject(tx.error || new Error('idb_tx_aborted'));
    });
  }

  async function get(key){
    const k = String(key || '');
    if(!k) return undefined;
    const db = await openDb();
    return await new Promise((resolve, reject)=>{
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(k);
      req.onsuccess = ()=>resolve(req.result);
      req.onerror = ()=>reject(req.error || new Error('idb_get_failed'));
    });
  }

  async function set(key, value){
    const k = String(key || '');
    if(!k) throw new Error('idb_key_empty');
    return await withStore('readwrite', (store)=>store.put(value, k));
  }

  async function del(key){
    const k = String(key || '');
    if(!k) return;
    return await withStore('readwrite', (store)=>store.delete(k));
  }

  globalThis.HordIdbKv = { get, set, del };
})();

