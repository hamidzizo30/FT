// Friday League service worker
// - pages/code: network first (updates show up right away), cache as offline fallback
// - images (avatars, icons): cache first, refreshed quietly in the background
const CACHE = "friday-league-v10";
const IMG_CACHE = "friday-league-img-v1";
const AVATARS = ["mohamed","hamid","chellali","yacine","islam","hicham","redouane","imad","ghani"].map(n => `./avatar-${n}.png`);
const SHELL = ["./", "./index.html", "./manifest.webmanifest"];
const ICONS = ["./icon-192-trophy.png", "./icon-512-trophy.png", "./maskable-512-trophy.png", "./apple-touch-icon-trophy.png", "./favicon-48-trophy.png"];

self.addEventListener("install", e => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then(c => c.addAll(SHELL)),
    caches.open(IMG_CACHE).then(c => Promise.all([...AVATARS, ...ICONS].map(u => c.add(u).catch(() => {}))))
  ]).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== IMG_CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Firebase & fonts go straight to the network

  // images: serve from cache instantly, update the cache in the background
  if (/\.(png|jpe?g|webp|svg|gif)$/i.test(url.pathname)) {
    e.respondWith(caches.open(IMG_CACHE).then(async c => {
      const hit = await c.match(req, { ignoreSearch: true });
      const refresh = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => null);
      if (hit) { e.waitUntil(refresh); return hit; }
      return (await refresh) || Response.error();
    }));
    return;
  }

  // everything else: network first, cache fallback
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
