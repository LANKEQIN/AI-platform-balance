import React, { useEffect, useRef, useState } from 'react';

const VisualEffects: React.FC = () => {
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number>(0);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastMoveTimeRef = useRef(0);

  // 减少粒子数量：40 → 15，降低 GPU 占用
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
      'rgba(103, 232, 249, 0.4)',
      'rgba(20, 184, 166, 0.4)',
      'rgba(6, 182, 212, 0.3)',
      'rgba(34, 211, 238, 0.3)'
    ];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1.5,
      duration: Math.random() * 25 + 30,
      delay: Math.random() * 15,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  });

  // 合并鼠标事件：光标追踪 + 卡片3D效果统一用一个 rAF 循环处理
  useEffect(() => {
    const THROTTLE_MS = 50;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTimeRef.current < THROTTLE_MS) return;
      lastMoveTimeRef.current = now;

      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // 使用 rAF 批量更新 DOM，避免布局抖动
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (cursorGlowRef.current) {
            cursorGlowRef.current.style.transform = `translate(${mousePosRef.current.x - 150}px, ${mousePosRef.current.y - 150}px)`;
            cursorGlowRef.current.style.opacity = '1';
          }
          rafIdRef.current = 0;
        });
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
  }, []);

  // 点击涟漪效果 - 限制同时存在的涟漪数量
  useEffect(() => {
    const MAX_RIPPLES = 3;

    const handleClick = (e: MouseEvent) => {
      if (!rippleContainerRef.current) return;

      // 限制涟漪数量，防止 DOM 节点堆积
      const existing = rippleContainerRef.current.children;
      if (existing.length >= MAX_RIPPLES) return;

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
  }, []);

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
              pointerEvents: 'none',
              boxShadow: `0 0 ${particle.size}px ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* 鼠标追踪光效 - 缩小尺寸：400px → 300px，降低渲染面积 */}
      <div
        ref={cursorGlowRef}
        style={{
          position: 'fixed',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          willChange: 'transform'
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

      {/* 背景极光效果 - 简化渐变，减少重绘 */}
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
            radial-gradient(ellipse at 10% 10%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 90%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)
          `,
          animation: 'auroraPulse 25s ease-in-out infinite alternate',
          contain: 'strict'
        }}
      />

      {/* 粒子动画样式 */}
      <style>{`
        @keyframes particleFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0.2;
          }
        }

        @keyframes rippleExpand {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(10);
            opacity: 0;
          }
        }

        @keyframes auroraPulse {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(30deg);
          }
        }
      `}</style>
    </>
  );
};

export default VisualEffects;
