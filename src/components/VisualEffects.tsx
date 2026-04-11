import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 性能优化版视觉特效组件
 * 
 * 优化策略：
 * 1. 减少粒子数量（从15降到8）
 * 2. 简化粒子动画，避免复杂的 wobble 效果
 * 3. 使用单个光标光效而非两个
 * 4. 降低拖尾粒子生成频率
 * 5. 减少涟漪数量和复杂度
 * 6. 移除背景极光动画
 * 7. 使用 requestAnimationFrame 批量更新
 * 8. 检测性能并智能降级
 */
const VisualEffects: React.FC = () => {
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const trailingParticlesContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number>(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastTrailTimeRef = useRef(0);
  
  // 性能检测：检测是否启用所有特效
  const [enableFullEffects, setEnableFullEffects] = useState(true);

  // 减少粒子数量，从15降到8，营造效果但保持性能
  const [particles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    size: number;
    duration: number;
    delay: number;
    color: string;
  }>>(() => {
    const colors = [
      'rgba(103, 232, 249, 0.5)',
      'rgba(20, 184, 166, 0.5)',
      'rgba(6, 182, 212, 0.4)',
      'rgba(34, 211, 238, 0.4)'
    ];
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  });

  // 检测性能：简单的帧率检测
  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const checkPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        // 如果帧率低于30，自动降级特效
        if (fps < 30) {
          setEnableFullEffects(false);
        }
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (enableFullEffects) {
        requestAnimationFrame(checkPerformance);
      }
    };
    
    const timer = setTimeout(() => {
      checkPerformance();
    }, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [enableFullEffects]);

  // 鼠标事件处理 - 使用 requestAnimationFrame 批量更新
  useEffect(() => {
    let isAnimating = false;
    
    const updateCursor = () => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate(${mousePosRef.current.x - 150}px, ${mousePosRef.current.y - 150}px)`;
        cursorGlowRef.current.style.opacity = '1';
      }
      isAnimating = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // 使用 requestAnimationFrame 确保流畅
      if (!isAnimating) {
        isAnimating = true;
        rafIdRef.current = requestAnimationFrame(updateCursor);
      }

      // 拖尾粒子 - 降低频率从50ms到100ms
      if (enableFullEffects && now - lastTrailTimeRef.current > 100) {
        lastTrailTimeRef.current = now;
        createTrailingParticle(e.clientX, e.clientY);
      }
    };

    const handleMouseLeave = () => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enableFullEffects]);

  // 创建拖尾粒子 - 简化版
  const createTrailingParticle = useCallback((x: number, y: number) => {
    if (!trailingParticlesContainerRef.current) return;
    
    const colors = [
      'rgba(103, 232, 249, 0.6)',
      'rgba(20, 184, 166, 0.6)'
    ];
    
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.background = color;
    particle.style.borderRadius = '50%';
    particle.style.position = 'fixed';
    particle.style.pointerEvents = 'none';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.animation = 'trailParticle 0.6s ease-out forwards';
    particle.style.zIndex = '9997';
    
    trailingParticlesContainerRef.current.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
  }, []);

  // 点击涟漪效果 - 简化版
  useEffect(() => {
    const MAX_RIPPLES = 3;

    const handleClick = (e: MouseEvent) => {
      if (!rippleContainerRef.current || !enableFullEffects) return;

      const existing = rippleContainerRef.current.children;
      if (existing.length >= MAX_RIPPLES) return;

      // 只创建一个涟漪
      const ripple = document.createElement('div');
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.background = 'radial-gradient(circle, rgba(20, 184, 166, 0.4) 0%, transparent 70%)';
      ripple.style.borderRadius = '50%';
      ripple.style.position = 'fixed';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.animation = 'rippleExpand 0.5s ease-out forwards';
      ripple.style.zIndex = '9999';
      
      rippleContainerRef.current.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [enableFullEffects]);

  return (
    <>
      {/* 粒子容器 */}
      <div
        id="particles-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
          contain: 'strict'
        }}
      >
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particle.color,
              borderRadius: '50%',
              animation: `particleFloat ${particle.duration}s linear ${particle.delay}s infinite`,
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>

      {/* 鼠标追踪光效 - 单个优化版 */}
      <div
        ref={cursorGlowRef}
        style={{
          position: 'fixed',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(6, 182, 212, 0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform',
          mixBlendMode: 'screen'
        }}
      />

      {/* 拖尾粒子容器 */}
      <div
        ref={trailingParticlesContainerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9996,
          overflow: 'hidden'
        }}
      />

      {/* 点击涟漪容器 */}
      <div
        ref={rippleContainerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          overflow: 'hidden'
        }}
      />

      {/* 简化的背景效果 - 无动画 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: -1,
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(20, 184, 166, 0.10) 0%, transparent 50%)
          `,
          contain: 'strict'
        }}
      />

      {/* 粒子动画样式 - 简化版 */}
      <style>{`
        @keyframes particleFloat {
          0% {
            transform: translateY(0);
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh);
            opacity: 0.4;
          }
        }

        @keyframes rippleExpand {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(12);
            opacity: 0;
          }
        }

        @keyframes trailParticle {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100%) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default VisualEffects;
