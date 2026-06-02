/**
 * Service Worker
 * 提供离线缓存支持
 *
 * 缓存策略：
 * - HTML 文件：networkFirst（优先网络，确保获取最新版本）
 * - Vite 哈希资源（assets/xxx-abc123.js）：cacheFirst（文件名含哈希，内容变则文件名变，可安全缓存）
 * - 其他静态资源：staleWhileRevalidate（先返回缓存，后台更新）
 * - API 请求：networkFirst（优先网络，离线时回退缓存）
 */

const CACHE_NAME = 'ai-platforms-v4';

// Vite 构建产物中的资源文件名含哈希值，如 assets/index-abc123.js
const HASHED_ASSET_PATTERN = /\/assets\/[^/]+-[a-f0-9]{8,}\./;

function isHtmlRequest(url) {
  const pathname = new URL(url).pathname;
  return pathname.endsWith('/') || pathname.endsWith('.html');
}

function isHashedAsset(url) {
  return HASHED_ASSET_PATTERN.test(new URL(url).pathname);
}

function isApiRequest(url) {
  const pathname = new URL(url).pathname;
  return pathname.includes('/api/') || pathname.includes('/v1/');
}

/**
 * 安装事件 - 跳过等待，立即激活新版本
 */
self.addEventListener('install', () => {
  self.skipWaiting();
});

/**
 * 激活事件 - 清理旧缓存，立即接管所有客户端
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
 * 策略：networkFirst - 优先网络，失败回退缓存
 */
function networkFirst(event) {
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
}

/**
 * 策略：cacheFirst - 优先缓存，缓存不存在时请求网络
 */
function cacheFirst(event) {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
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
  );
}

/**
 * 策略：staleWhileRevalidate - 先返回缓存，同时后台请求网络更新缓存
 */
function staleWhileRevalidate(event) {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
  );
}

/**
 * 请求拦截 - 根据资源类型选择不同缓存策略
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // HTML 页面：始终优先从网络获取最新版本
  if (isHtmlRequest(url)) {
    networkFirst(event);
    return;
  }

  // Vite 哈希资源：缓存优先（文件名含哈希，内容变了文件名就变，不会拿到旧版本）
  if (isHashedAsset(url)) {
    cacheFirst(event);
    return;
  }

  // API 请求：优先网络
  if (isApiRequest(url)) {
    networkFirst(event);
    return;
  }

  // 其他静态资源：先返回缓存，后台静默更新
  staleWhileRevalidate(event);
});
