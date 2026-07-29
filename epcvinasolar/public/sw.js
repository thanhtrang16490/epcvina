// EPCVINA Solar — Progressive Web App Service Worker
// Caching strategies: Cache-first (static), Stale-while-revalidate (pages), Network-first (API)

const CACHE_VERSION = 'epcvina-sw-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;

// Max entries for dynamic caches (LRU eviction)
const MAX_PAGE_ENTRIES = 50;
const MAX_IMAGE_ENTRIES = 100;

// Static assets to precache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.json',
];

// ─── INSTALL ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// ─── ACTIVATE ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => {
              console.log('[SW] Removing old cache:', key);
              return caches.delete(key);
            })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ─── FETCH ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip external requests (analytics, chat widgets, etc.)
  if (url.hostname !== self.location.hostname) {
    // Cache Google Fonts with stale-while-revalidate
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
      event.respondWith(fontCacheStrategy(event.request));
      return;
    }
    return; // Let other external requests pass through
  }

  // Route-based caching strategies
  if (isImageRequest(url)) {
    event.respondWith(imageCacheStrategy(event.request));
  } else if (isPageRequest(url)) {
    event.respondWith(pageCacheStrategy(event.request));
  } else {
    event.respondWith(staticCacheStrategy(event.request));
  }
});

// ─── CACHING STRATEGIES ─────────────────────────────────────────────────────

// Static assets: Cache-first (CSS, JS, fonts from own domain)
async function staticCacheStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // If it's a navigation request, return offline page
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Pages: Stale-while-revalidate (serve cached immediately, update in background)
async function pageCacheStrategy(request) {
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(request);

  // Fetch from network in background and update cache
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
        // Enforce max entries
        trimCache(PAGE_CACHE, MAX_PAGE_ENTRIES);
      }
      return response;
    })
    .catch(() => {
      // If network fails and no cache, return offline page
      return caches.match('/offline.html');
    });

  // Return cache immediately if available (fast!), otherwise wait for network
  return cached || (await fetchPromise);
}

// Images: Cache-first with persistent storage
async function imageCacheStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      trimCache(IMAGE_CACHE, MAX_IMAGE_ENTRIES);
    }
    return response;
  } catch {
    // Return a minimal 1x1 transparent pixel as last resort
    return new Response(
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65, 84, 120, 1, 99, 0, 2, 0, 0, 5, 0, 1, 13, 10, 41, 170, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]),
      { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } }
    );
  }
}

// Fonts: Stale-while-revalidate with separate cache
async function fontCacheStrategy(request) {
  const cache = await caches.open(FONT_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408, statusText: 'Font unavailable' });
  }
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function isImageRequest(url) {
  return url.pathname.match(/\.(webp|jpe?g|png|gif|svg|ico|avif)$/i);
}

function isPageRequest(url) {
  // Navigation requests or HTML-like paths
  return url.pathname === '/' ||
    !url.pathname.match(/\.(js|css|webp|jpe?g|png|gif|svg|ico|avif|json|xml|txt)$/i);
}

// Trim cache to max entries (simple FIFO)
async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
  }
}

// ─── BACKGROUND SYNC ────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  return Promise.resolve();
}

// ─── PUSH NOTIFICATIONS ─────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'EPCVINA Solar';
  const options = {
    body: data.body || event.data?.text() || 'Có thông báo mới',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click — open URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if open
      for (const client of clients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      // Open new window
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

// Push notifications (optional)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/favicon.svg',
    badge: '/favicon.svg',
  };

  event.waitUntil(
    self.registration.showNotification('EPCVINA Solar', options)
  );
});
