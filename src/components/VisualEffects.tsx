import React, { useEffect, useRef, useState, useCallback } from 'react';

const VisualEffects: React.FC = () => {
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const rippleContainerRef = useRef<HTMLDivElement>(null);
  
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
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 20 + 25,
      delay: Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
  });

  // 鼠标追踪光效
  useEffect(() => {
    let lastMoveTime = 0;
    const THROTTLE_MS = 32;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMoveTime < THROTTLE_MS) return;
      lastMoveTime = now;

      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = e.clientX + 'px';
        cursorGlowRef.current.style.top = e.clientY + 'px';
        cursorGlowRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.opacity = '1';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // 点击涟漪效果
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.background = 'radial-gradient(circle, rgba(20, 184, 166, 0.5) 0%, transparent 70%)';
      ripple.style.borderRadius = '50%';
      ripple.style.position = 'fixed';
      ripple.style.pointerEvents = 'none';
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      ripple.style.animation = 'rippleExpand 0.6s ease-out forwards';
      ripple.style.zIndex = '9999';
      ripple.style.opacity = '1';

      if (rippleContainerRef.current) {
        rippleContainerRef.current.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // 卡片3D效果
  useEffect(() => {
    let lastCardMoveTime = 0;
    const THROTTLE_MS = 32;

    const handleCardHover = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastCardMoveTime < THROTTLE_MS) return;
      lastCardMoveTime = now;

      const card = (e.target as HTMLElement).closest('.platform-card');
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = Math.round((y - centerY) / 20);
        const rotateY = Math.round((centerX - x) / 20);

        (card as HTMLElement).style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    };

    const handleCardLeave = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest('.platform-card');
      if (card) {
        (card as HTMLElement).style.transform = '';
      }
    };

    document.addEventListener('mousemove', handleCardHover);
    document.addEventListener('mouseleave', handleCardLeave, true);

    return () => {
      document.removeEventListener('mousemove', handleCardHover);
      document.removeEventListener('mouseleave', handleCardLeave, true);
    };
  }, []);

  return (
    <>
      {/* 粒子容器 */}
      <div
        ref={particlesContainerRef}
        id="particles-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
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
              boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}`
            }}
          />
        ))}
      </div>

      {/* 鼠标追踪光效 */}
      <div
        ref={cursorGlowRef}
        style={{
          position: 'fixed',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          opacity: 0,
          transition: 'opacity 0.5s ease',
          mixBlendMode: 'screen'
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

      {/* 背景极光效果 */}
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
            radial-gradient(ellipse at 10% 10%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 90%, rgba(20, 184, 166, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(34, 211, 238, 0.08) 0%, transparent 40%)
          `,
          animation: 'auroraPulse 20s ease-in-out infinite alternate'
        }}
      />

      {/* 粒子动画样式 */}
      <style>{`
        @keyframes particleFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0.3;
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

        @keyframes auroraPulse {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(40deg);
          }
        }
      `}</style>
    </>
  );
};

export default VisualEffects;
