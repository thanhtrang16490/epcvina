// Service Worker for Mobile Performance Optimization
// Caches static assets for faster repeat visits

const CACHE_NAME = 'epcvina-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/styles/globals.css',
  '/favicon.svg',
  '/logo-epcvina-solar.png',
  '/hero-bg-768.webp',
  '/hero-bg-1280.webp',
  '/hero-bg-1920.webp',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests (analytics, fonts, etc)
  if (event.request.url.includes('googletagmanager') || 
      event.request.url.includes('google-analytics') ||
      event.request.url.includes('fonts.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Background sync for offline support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  // Sync data when online
  return Promise.resolve();
}

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/logo-epcvina-solar.png',
    badge: '/favicon.svg',
  };

  event.waitUntil(
    self.registration.showNotification('EPCVINA Solar', options)
  );
});
