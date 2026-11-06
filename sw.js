// Handle clicks before the messaging SDK registers its listeners.
self.addEventListener('notificationclick',event=>{event.stopImmediatePropagation();event.notification.close();event.waitUntil((async()=>{const url=self.registration.scope;const pages=await self.clients.matchAll({type:'window',includeUncontrolled:true});const page=pages.find(c=>c.url.startsWith(url));if(page){await page.focus();page.postMessage({type:'OPEN_REMINDERS'});}else await self.clients.openWindow(url+'?reminders=1');})());});
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_PUSH')self.skipWaiting();});
importScripts('./fcm-worker.js');
/* App files only; financial data never enters the HTTP cache. */
const CACHE='finance-pwa-v8-focus-1';
const FILES=['./','./index.html','./storage.js','./reminder-core.js','./experience.js','./fcm-client.js','./fcm-worker.js','./hash-support.js','./app.js','./upgrade.css','./manifest.webmanifest','./icon-192.png','./icon-512.png','./setup.html','./GoogleDriveBackupV3.gs'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('finance-pwa-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;const allowed=FILES.map(p=>new URL(p,self.registration.scope).pathname);if(!allowed.includes(u.pathname))return;e.respondWith((async()=>{const c=await caches.open(CACHE);if(e.request.mode==='navigate'&&u.searchParams.has('v')){try{return await fetch(e.request);}catch{}}const cached=await c.match(e.request,{ignoreSearch:true});if(cached)return cached;return fetch(e.request);})());});
