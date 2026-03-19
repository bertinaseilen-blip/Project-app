const CACHE_NAME = "reminder-app-v2";
const filesToCache = [
 "/",
  "/index.html",
  "/app.css",
  "/app.mjs",
  "/manifest.json",
  "/icons/icon_1.png",
  "/localization/en.json",
  "/localization/no.json"
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files");
      return cache.addAll(filesToCache);
    }),
  );

   self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: "You are offline" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" }
          }
        );
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});