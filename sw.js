/* App files only; financial data never enters the HTTP cache. */
const CACHE='finance-pwa-v7-durable-1';
const FILES=['./','./index.html','./storage.js','./hash-support.js','./app.js','./upgrade.css','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('finance-pwa-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;const allowed=FILES.map(p=>new URL(p,self.registration.scope).pathname);if(!allowed.includes(u.pathname))return;e.respondWith((async()=>{const c=await caches.open(CACHE),cached=await c.match(e.request,{ignoreSearch:true});if(cached)return cached;return fetch(e.request);})());});
