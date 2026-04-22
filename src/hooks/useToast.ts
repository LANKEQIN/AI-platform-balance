import { useState, useCallback, useRef, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// 递增计数器，确保ID唯一
let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // 存储定时器引用，组件卸载时清理
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // 组件卸载时清理所有定时器
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // 使用计数器+时间戳生成唯一ID，避免碰撞
    const id = `${Date.now()}-${++toastCounter}`;
    setToasts(prev => [...prev, { id, message, type }]);

    // 3秒后自动移除
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      timersRef.current.delete(id);
    }, 3000);
    timersRef.current.set(id, timer);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    // 清除对应的定时器，避免无效触发
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // 一键清除所有toast
  const clearAllToasts = useCallback(() => {
    setToasts([]);
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts
  };
}
