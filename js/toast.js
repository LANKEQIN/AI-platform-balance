/**
 * Toast 提示管理器模块
 * 负责显示操作结果的友好提示
 */

const ToastManager = {
    container: null,

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

        this.container.appendChild(toast);

        setTimeout(() => {
            this.hide(toast);
        }, duration);
    },

    hide(toast) {
        if (toast && toast.parentNode) {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }
};
