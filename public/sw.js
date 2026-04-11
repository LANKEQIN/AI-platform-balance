/**
 * Service Worker
 * 提供离线缓存支持
 */

const CACHE_NAME = 'ai-platforms-v3';
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

const STATIC_EXTENSIONS = ['.html', '.css', '.js', '.json', '.png', '.svg', '.woff2'];

function isStaticRequest(url) {
  const pathname = new URL(url).pathname;
  return STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext));
}

function isApiRequest(url) {
  const pathname = new URL(url).pathname;
  return pathname.includes('/api/') || pathname.includes('/v1/');
}

/**
 * 安装事件 - 缓存静态资源
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('缓存已打开');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

/**
 * 请求拦截 - 静态资源 cacheFirst，API/动态请求 networkFirst
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  if (isApiRequest(url)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }

  if (isStaticRequest(url)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match('./index.html');
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || caches.match('./index.html');
      });
    })
  );
});
