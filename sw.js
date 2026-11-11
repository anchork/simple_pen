// Service worker: caches the whole app for offline use.
// release.js fills in the version and the file list (the placeholders below).
const CACHE = 'simple-pen-673ad20f8d6f';
const FILES = ['./', "README.md", "favicon.ico", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "index.html", "kha.a1897fc11ae4.js", "manifest.webmanifest"];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys()
        .then(keys => Promise.all(keys.filter(k => k.startsWith('simple-pen-') && k !== CACHE).map(k => caches.delete(k))))
        .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
    if (req.mode === 'navigate') {
        // pages: network first (picks up new releases), cached copy when offline
        event.respondWith(fetch(req).catch(() => caches.match('./', {ignoreSearch: true})));
        return;
    }
    // assets: cache first
    event.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req)));
});
