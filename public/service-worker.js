// public/service-worker.js

const CACHE_NAME = "reminder-app-v1";
const ASSETS_TO_CACHE = [
  "/",                 // index.html
  "/index.html",
  "/app.css",
  "/app.mjs",
  "/manifest.json",
  "/icons/icon_1.png"
];

// ---------------------------
// INSTALL - cache app shell
// ---------------------------
self.addEventListener("install", event => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("[SW] Caching app shell...");
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting(); // activate immediately
});

// ---------------------------
// ACTIVATE - clean old caches
// ---------------------------
self.addEventListener("activate", event => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // take control immediately
});

// ---------------------------
// FETCH - serve cached or network
// ---------------------------
self.addEventListener("fetch", event => {
  console.log("[SW] Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => cachedResponse || fetch(event.request))
      .catch(() => {
        // fallback to index.html for navigations (offline)
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      })
  );
});