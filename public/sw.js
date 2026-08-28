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

const CACHE_NAME = 'ai-platforms-v5';

// Vite 构建产物中的资源文件名含哈希值，如 assets/index-Dq2g0OqY.js
// 注意：Vite 5 的哈希是 base64url 编码（含大小写字母、数字、-、_），不是纯小写十六进制
const HASHED_ASSET_PATTERN = /\/assets\/[^/]+-[A-Za-z0-9_-]{8,}\./;

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
          if (cachedResponse) {
            return cachedResponse;
          }
          // 仅页面导航回退到 index.html；API 等请求不能返回 HTML，应明确返回 503
          if (isHtmlRequest(event.request.url)) {
            return caches.match('./index.html').then((fallback) => {
              return fallback || new Response('离线状态，页面尚未缓存', {
                status: 503,
                statusText: 'Offline',
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
              });
            });
          }
          return new Response('离线状态，且无缓存数据', {
            status: 503,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
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
