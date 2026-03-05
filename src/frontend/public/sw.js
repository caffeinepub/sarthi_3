const CACHE_NAME = 'sarthi-v3';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/generated/sarthi-icon-192.dim_192x192.png',
  '/assets/generated/sarthi-icon-512.dim_512x512.png',
  '/assets/generated/sarthi-logo.dim_256x256.png',
  '/assets/generated/dashboard-hero.dim_1200x400.png',
  '/assets/generated/quiz-illustration.dim_600x400.png',
  '/assets/generated/scholarship-illustration.dim_600x400.png',
  '/assets/generated/internship-illustration.dim_600x400.png',
  '/assets/generated/chatbot-avatar.dim_128x128.png',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass: Internet Computer canister API calls (preserve auth)
  if (
    url.hostname.endsWith('.ic0.app') ||
    url.hostname.endsWith('.icp0.io') ||
    url.hostname.endsWith('.raw.ic0.app') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('canister')
  ) {
    return;
  }

  // Bypass: non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // HTML navigation: network-first with offline fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match('/') || caches.match(request);
        })
    );
    return;
  }

  // Static assets (images, icons, fonts): cache-first
  if (
    url.pathname.startsWith('/assets/') ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // JS/CSS bundles: cache-first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
