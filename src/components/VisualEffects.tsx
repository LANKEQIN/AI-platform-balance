import React, { useEffect, useRef, useState, useCallback } from 'react';

interface VisualEffectsProps {
  enabled: boolean;
}

const VisualEffects: React.FC<VisualEffectsProps> = ({ enabled }) => {
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  const [particles, setParticles] = useState<Array<{ id: number; left: number; top: number; size: number; duration: number; delay: number; color: string }>>([]);

  const PARTICLE_COUNT = 30;

  // 生成随机粒子
  const generateParticle = useCallback((randomPosition = false) => {
    const colors = [
      'rgba(103, 232, 249, 0.5)',
      'rgba(20, 184, 166, 0.5)'
    ];
    return {
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      top: randomPosition ? Math.random() * 100 : 110,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 12 + 15,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }, []);

  // 初始化粒子
  useEffect(() => {
    if (!enabled) {
      setParticles([]);
      return;
    }

    const initialParticles = Array.from({ length: PARTICLE_COUNT }, () => generateParticle(true));
    setParticles(initialParticles);
  }, [enabled, generateParticle]);

  // 定期添加新粒子
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        if (prev.length < PARTICLE_COUNT) {
          return [...prev, generateParticle(false)];
        }
        return prev;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [enabled, generateParticle]);

  // 鼠标追踪光效
  useEffect(() => {
    if (!enabled) return;

    let lastMoveTime = 0;
    const THROTTLE_MS = 16;

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
  }, [enabled]);

  // 卡片3D效果
  useEffect(() => {
    if (!enabled) return;

    let lastCardMoveTime = 0;
    const THROTTLE_MS = 16;

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
  }, [enabled]);

  if (!enabled) return null;

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
            className="particle"
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
            onAnimationEnd={() => {
              setParticles(prev => prev.filter(p => p.id !== particle.id));
            }}
          />
        ))}
      </div>

      {/* 鼠标追踪光效 */}
      <div
        ref={cursorGlowRef}
        className="cursor-glow"
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
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* 粒子动画样式 */}
      <style>{`
        @keyframes particleFloat {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default VisualEffects;
