/**
 * 通用工具函数模块
 * 包含防抖、节流等通用工具函数
 */

/**
 * 防抖函数 - 限制函数在指定时间间隔内只执行一次
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait = 300) {
    let timeout = null;
    return function(...args) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

/**
 * 节流函数 - 限制函数在指定时间间隔内只执行一次
 * @param {Function} func 要执行的函数
 * @param {number} limit 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit = 100) {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * 安全打开 URL，防止钓鱼攻击
 * 使用 rel="noopener noreferrer" 防止新页面访问 window.opener
 * @param {string} url 要打开的 URL
 */
function openUrlSafely(url) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * 生成唯一ID
 * @param {string} prefix ID前缀
 * @returns {string} 唯一ID
 */
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 深度克隆对象
 * @param {Object} obj 要克隆的对象
 * @returns {Object} 克隆后的对象
 */
function deepClone(obj) {
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch {
        return null;
    }
}

/**
 * 格式化URL显示
 * @param {string} url 原始URL
 * @param {number} maxLength 最大显示长度
 * @returns {string} 格式化后的URL
 */
function formatUrlDisplay(url, maxLength = 50) {
    if (!url) return '';
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

/**
 * 检查对象是否为空
 * @param {Object} obj 要检查的对象
 * @returns {boolean} 是否为空
 */
function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
}

/**
 * 限制数字在范围内
 * @param {number} num 要限制的数字
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 限制后的数字
 */
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/**
 * 随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number} 随机整数
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 休眠指定时间
 * @param {number} ms 毫秒
 * @returns {Promise}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出工具函数
const Utils = {
    debounce,
    throttle,
    openUrlSafely,
    generateId,
    deepClone,
    formatUrlDisplay,
    isEmptyObject,
    clamp,
    randomInt,
    sleep
};

// 兼容旧代码，将函数挂载到window
window.Utils = Utils;
