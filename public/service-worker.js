const CACHE_NAME = "reminder-app-v1";
const filesToCashe = [
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
      return cache.addAll(filesToCashe);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});