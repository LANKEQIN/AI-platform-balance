/**
 * Service Worker
 * 提供离线缓存支持
 */

const CACHE_NAME = 'ai-platforms-v2';
const CACHE_URLS = [
  './',
  './index.html',
  './manifest.json'
];

/**
 * 安装事件 - 缓存静态资源
 */
self.addEventListener('install', (event) =&gt; {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) =&gt; {
        console.log('缓存已打开');
        return cache.addAll(CACHE_URLS);
      })
      .then(() =&gt; {
        self.skipWaiting();
      })
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) =&gt; {
  event.waitUntil(
    caches.keys().then((cacheNames) =&gt; {
      return Promise.all(
        cacheNames.map((cacheName) =&gt; {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() =&gt; {
      self.clients.claim();
    })
  );
});

/**
 * 请求拦截 - 优先使用缓存
 */
self.addEventListener('fetch', (event) =&gt; {
  // 只处理GET请求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) =&gt; {
        // 缓存命中，返回缓存
        if (response) {
          return response;
        }

        // 没有缓存，从网络获取
        return fetch(event.request).then((response) =&gt; {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // 克隆响应并缓存
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) =&gt; {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() =&gt; {
        // 网络失败时返回离线页面
        return caches.match('./index.html');
      })
  );
});
