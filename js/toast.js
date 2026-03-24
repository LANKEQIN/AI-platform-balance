/**
 * Toast 提示管理器模块
 * 负责显示操作结果的友好提示
 */

const ToastManager = {
    container: null,
    maxToasts: 5,
    toastQueue: [],
    showingToasts: 0,

    init() {
        this.container = document.getElementById('toastContainer');
    },

    show(message, type = 'info', duration = 3000) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">×</button>
        `;

        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.hide(toast);
        });

        toast.addEventListener('animationend', () => {
            if (toast.classList.contains('hiding') && toast.parentNode) {
                toast.parentNode.removeChild(toast);
                this.showingToasts--;
                this.processQueue();
            }
        });

        if (this.showingToasts >= this.maxToasts) {
            this.toastQueue.push({ toast, duration });
            return;
        }

        this.container.appendChild(toast);
        this.showingToasts++;

        setTimeout(() => {
            this.hide(toast);
        }, duration);
    },

    hide(toast) {
        if (!toast || !toast.parentNode) return;

        toast.classList.add('hiding');
    },

    processQueue() {
        if (this.toastQueue.length > 0 && this.showingToasts < this.maxToasts) {
            const item = this.toastQueue.shift();
            this.container.appendChild(item.toast);
            this.showingToasts++;

            setTimeout(() => {
                this.hide(item.toast);
            }, item.duration);
        }
    },

    /**
     * 清除所有Toast
     */
    clearAll() {
        const toasts = this.container.querySelectorAll('.toast');
        toasts.forEach(toast => {
            this.hide(toast);
        });
        this.toastQueue = [];
        this.showingToasts = 0;
    },

    /**
     * 显示成功提示
     * @param {string} message 提示消息
     * @param {number} duration 显示时长（毫秒）
     */
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    },

    /**
     * 显示错误提示
     * @param {string} message 提示消息
     * @param {number} duration 显示时长（毫秒）
     */
    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    },

    /**
     * 显示警告提示
     * @param {string} message 提示消息
     * @param {number} duration 显示时长（毫秒）
     */
    warning(message, duration = 4000) {
        this.show(message, 'warning', duration);
    },

    /**
     * 显示信息提示
     * @param {string} message 提示消息
     * @param {number} duration 显示时长（毫秒）
     */
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
};
