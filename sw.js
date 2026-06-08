const CACHE = 'manmantie-v3';
const ASSETS = [
  './',
  './index.html',
  './pet.html',
  './manifest.json',
  './icon.svg',
  './assets/pets/cat.png',
  './assets/pets/dog.png',
  './assets/pets/rabbit.png',
  './assets/pets/snake.png',
  './assets/pets/hamster.png',
  './assets/pets/fox.png',
  './assets/pets/bear.png',
  './assets/pets/redpanda.png',
  './assets/eggs/egg_plain.png',
  './assets/eggs/egg_rainbow.png',
  './assets/eggs/egg_heart.png',
  './assets/eggs/egg_blue.png',
  './assets/eggs/egg_green.png',
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // 仅缓存 GET 请求
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // 缓存同源资源
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
