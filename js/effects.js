/**
 * 炫酷视觉效果管理器
 * 包含粒子背景、鼠标追踪光效、卡片3D效果等
 * 已优化：解决性能卡顿问题
 */

const VisualEffects = {
    particlesContainer: null,
    cursorGlow: null,
    particleCount: 30,
    particles: [],
    enabled: true,
    intervalId: null,
    boundHandlers: {},

    /**
     * 初始化所有视觉效果
     */
    init: function() {
        const effectsMode = StorageManager.getEffectsMode();
        this.enabled = effectsMode === 'cool';

        if (!this.enabled) {
            return;
        }

        this.createParticlesContainer();
        this.createCursorGlow();
        this.initParticles();
        this.initCardEffects();
    },

    /**
     * 创建粒子容器
     */
    createParticlesContainer: function() {
        this.particlesContainer = document.getElementById('particles-container');
        if (!this.particlesContainer) {
            this.particlesContainer = document.createElement('div');
            this.particlesContainer.id = 'particles-container';
            document.body.appendChild(this.particlesContainer);
        }
    },

    /**
     * 创建鼠标追踪光效
     */
    createCursorGlow: function() {
        this.cursorGlow = document.createElement('div');
        this.cursorGlow.className = 'cursor-glow';
        document.body.appendChild(this.cursorGlow);

        this.boundHandlers.cursorMove = Utils.throttle((e) => {
            if (!this.cursorGlow) return;
            this.cursorGlow.style.left = e.clientX + 'px';
            this.cursorGlow.style.top = e.clientY + 'px';
        }, 16);

        this.boundHandlers.cursorLeave = () => {
            if (this.cursorGlow) this.cursorGlow.style.opacity = '0';
        };

        this.boundHandlers.cursorEnter = () => {
            if (this.cursorGlow) this.cursorGlow.style.opacity = '1';
        };

        document.addEventListener('mousemove', this.boundHandlers.cursorMove);
        document.addEventListener('mouseleave', this.boundHandlers.cursorLeave);
        document.addEventListener('mouseenter', this.boundHandlers.cursorEnter);
    },

    /**
     * 初始化粒子系统
     */
    initParticles: function() {
        // 清除旧粒子
        this.particles.forEach(p => p.remove());
        this.particles = [];

        // 创建初始粒子
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle(true);
        }

        // 持续生成新粒子（延长间隔提升性能）
        this.intervalId = setInterval(() => {
            if (this.particles.length < this.particleCount) {
                this.createParticle(false);
            }
        }, 800);  // 从500ms延长到800ms
    },

    /**
     * 创建单个粒子
     * @param {boolean} randomPosition 是否随机初始位置
     */
    createParticle: function(randomPosition = false) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机大小（稍微增大提升视觉效果）
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // 随机水平位置
        particle.style.left = Math.random() * 100 + '%';

        // 随机动画时长（延长动画时间减少CPU消耗）
        const duration = Math.random() * 12 + 15;
        particle.style.animationDuration = duration + 's';

        // 随机延迟
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';

        // 简化颜色（减少计算）
        const colors = [
            'rgba(103, 232, 249, 0.5)',
            'rgba(20, 184, 166, 0.5)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // 如果是随机位置，则从任意位置开始
        if (randomPosition) {
            particle.style.top = Math.random() * 100 + '%';
        }

        this.particlesContainer.appendChild(particle);
        this.particles.push(particle);

        // 动画结束后移除粒子
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }, (duration + delay) * 1000);
    },

    /**
     * 初始化卡片效果（3D倾斜 + 鼠标追踪光效）
     */
    initCardEffects: function() {
        // 使用节流处理鼠标移动
        this.boundHandlers.cardHover = this.throttle((e) => {
            const card = e.target.closest('.platform-card');
            if (card) {
                this.handleCardHover(card, e);
            }
        }, 16);  // ~60fps

        this.boundHandlers.cardLeave = (e) => {
            const card = e.target.closest('.platform-card');
            if (card) {
                this.resetCardTransform(card);
            }
        };

        document.addEventListener('mousemove', this.boundHandlers.cardHover);
        document.addEventListener('mouseleave', this.boundHandlers.cardLeave, true);
    },

    /**
     * 处理卡片悬停效果
     * @param {HTMLElement} card 卡片元素
     * @param {MouseEvent} e 鼠标事件
     */
    handleCardHover: function(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // 计算3D倾斜角度（简化计算）
        const rotateX = Math.round((y - centerY) / 20);
        const rotateY = Math.round((centerX - x) / 20);

        // 应用变换
        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    },

    /**
     * 重置卡片变换
     * @param {HTMLElement} card 卡片元素
     */
    resetCardTransform: function(card) {
        card.style.transform = '';
    },

    /**
     * 创建点击涟漪效果
     * @param {HTMLElement} element 目标元素
     * @param {MouseEvent} e 鼠标事件
     */
    createRipple: function(element, e) {
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 1000;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    },

    /**
     * 添加按钮涟漪效果
     */
    initButtonRipples: function() {
        this.boundHandlers.rippleClick = (e) => {
            const button = e.target.closest('.btn');
            if (button) {
                this.createRipple(button, e);
            }
        };

        document.addEventListener('click', this.boundHandlers.rippleClick);
    },

    /**
     * 启用特效
     */
    enable: function() {
        if (this.enabled) return;

        this.enabled = true;
        this.createParticlesContainer();
        this.createCursorGlow();
        this.initParticles();
        this.initCardEffects();
        this.initButtonRipples();

        document.body.classList.remove('effects-disabled');
    },

    /**
     * 禁用特效
     */
    disable: function() {
        if (!this.enabled) return;

        this.enabled = false;

        // 清除粒子定时器
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // 移除事件监听器（防止累积）
        if (this.boundHandlers.cursorMove) {
            document.removeEventListener('mousemove', this.boundHandlers.cursorMove);
        }
        if (this.boundHandlers.cursorLeave) {
            document.removeEventListener('mouseleave', this.boundHandlers.cursorLeave);
        }
        if (this.boundHandlers.cursorEnter) {
            document.removeEventListener('mouseenter', this.boundHandlers.cursorEnter);
        }
        if (this.boundHandlers.cardHover) {
            document.removeEventListener('mousemove', this.boundHandlers.cardHover);
        }
        if (this.boundHandlers.cardLeave) {
            document.removeEventListener('mouseleave', this.boundHandlers.cardLeave, true);
        }
        if (this.boundHandlers.rippleClick) {
            document.removeEventListener('click', this.boundHandlers.rippleClick);
        }

        // 清空处理函数引用
        this.boundHandlers = {};

        // 移除粒子容器和光效
        if (this.particlesContainer) {
            this.particlesContainer.remove();
            this.particlesContainer = null;
        }
        if (this.cursorGlow) {
            this.cursorGlow.remove();
            this.cursorGlow = null;
        }

        // 清除粒子 DOM 元素并清空数组
        this.particles.forEach(p => p.remove());
        this.particles = [];

        // 移除卡片特效
        document.querySelectorAll('.platform-card').forEach(card => {
            card.style.transform = '';
        });

        document.body.classList.add('effects-disabled');
    },

    /**
     * 页面卸载时的清理
     */
    cleanup: function() {
        this.disable();

        if (this.boundHandlers.pageHide) {
            window.removeEventListener('pagehide', this.boundHandlers.pageHide);
            this.boundHandlers.pageHide = null;
        }
    },

    /**
     * 初始化页面卸载监听
     */
    initCleanup: function() {
        this.boundHandlers.pageHide = () => {
            this.cleanup();
        };
        window.addEventListener('pagehide', this.boundHandlers.pageHide);
    },

    /**
     * 切换特效模式
     * @param {string} mode 'cool' 或 'simple'
     */
    setMode: function(mode) {
        if (mode === 'simple') {
            this.disable();
        } else {
            this.enable();
        }
    }
};

// 添加涟漪动画样式
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// 页面加载完成后初始化（根据存储的特效模式）
document.addEventListener('DOMContentLoaded', () => {
    const effectsMode = StorageManager.getEffectsMode();
    if (effectsMode === 'cool') {
        VisualEffects.init();
        VisualEffects.initButtonRipples();
        VisualEffects.initCleanup();
    } else {
        document.body.classList.add('effects-disabled');
    }
});