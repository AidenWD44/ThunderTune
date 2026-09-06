const CACHE = "thundertune-v1.3.0";
const ASSETS = ["./","./index.html","./styles.css","./app.js","./manifest.json","./service-worker.js","./icons/icon-192.png","./icons/icon-512.png"];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", event => { if (event.request.method !== "GET") return; event.respondWith(caches.match(event.request).then(cached => { const network = fetch(event.request).then(response => { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response; }).catch(() => cached || caches.match("./index.html")); return cached || network; })); });
