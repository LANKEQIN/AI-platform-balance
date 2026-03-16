/**
 * 炫酷视觉效果管理器
 * 包含粒子背景、鼠标追踪光效、卡片3D效果等
 */

const VisualEffects = {
    particlesContainer: null,
    cursorGlow: null,
    particleCount: 50,
    particles: [],

    /**
     * 初始化所有视觉效果
     */
    init: function() {
        this.createParticlesContainer();
        this.createCursorGlow();
        this.initParticles();
        this.initCardEffects();
        this.initScrollEffects();
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

        // 鼠标移动追踪
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                this.cursorGlow.style.left = e.clientX + 'px';
                this.cursorGlow.style.top = e.clientY + 'px';
            });
        });

        // 鼠标离开/进入页面
        document.addEventListener('mouseleave', () => {
            this.cursorGlow.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursorGlow.style.opacity = '1';
        });
    },

    /**
     * 初始化粒子系统
     */
    initParticles: function() {
        // 创建初始粒子
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle(true);
        }

        // 持续生成新粒子
        setInterval(() => {
            if (this.particles.length < this.particleCount) {
                this.createParticle(false);
            }
        }, 500);
    },

    /**
     * 创建单个粒子
     * @param {boolean} randomPosition 是否随机初始位置
     */
    createParticle: function(randomPosition = false) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // 随机大小
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // 随机水平位置
        particle.style.left = Math.random() * 100 + '%';

        // 随机动画时长
        const duration = Math.random() * 15 + 10;
        particle.style.animationDuration = duration + 's';

        // 随机延迟
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';

        // 随机透明度
        particle.style.opacity = Math.random() * 0.5 + 0.3;

        // 随机颜色变化 - 青色系
        const colors = [
            'rgba(255, 255, 255, 0.6)',
            'rgba(34, 211, 238, 0.6)',
            'rgba(20, 184, 166, 0.6)',
            'rgba(103, 232, 249, 0.6)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;

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
        // 使用事件委托处理动态添加的卡片
        document.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.platform-card');
            if (card) {
                this.handleCardHover(card, e);
            }
        });

        document.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.platform-card');
            if (card) {
                this.resetCardTransform(card);
            }
        }, true);
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

        // 计算3D倾斜角度
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        // 应用变换
        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // 更新光效位置
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
    },

    /**
     * 重置卡片变换
     * @param {HTMLElement} card 卡片元素
     */
    resetCardTransform: function(card) {
        card.style.transform = '';
    },

    /**
     * 初始化滚动效果
     */
    initScrollEffects: function() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },

    /**
     * 处理滚动事件
     */
    handleScroll: function() {
        const scrollY = window.scrollY;
        const cards = document.querySelectorAll('.platform-card');

        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // 当卡片进入视口时添加动画
            if (rect.top < windowHeight * 0.9) {
                card.style.animationPlayState = 'running';
            }
        });
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
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn');
            if (button) {
                this.createRipple(button, e);
            }
        });
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    VisualEffects.init();
    VisualEffects.initButtonRipples();
});
