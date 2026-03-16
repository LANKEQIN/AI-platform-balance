/**
 * Service Worker
 * 提供离线缓存支持
 */

const CACHE_NAME = 'ai-platforms-v1';
const CACHE_URLS = [
    './',
    './index.html',
    './css/style.css',
    './js/config.js',
    './js/storage.js',
    './js/app.js',
    './manifest.json'
];

/**
 * 安装事件 - 缓存静态资源
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('缓存已打开');
                return cache.addAll(CACHE_URLS);
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
 * 请求拦截 - 优先使用缓存
 */
self.addEventListener('fetch', (event) => {
    // 只处理GET请求
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 缓存命中，返回缓存
                if (response) {
                    return response;
                }

                // 没有缓存，从网络获取
                return fetch(event.request).then((response) => {
                    // 检查是否是有效响应
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // 克隆响应并缓存
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // 网络失败时返回离线页面（如果有的话）
                return caches.match('./index.html');
            })
    );
});
