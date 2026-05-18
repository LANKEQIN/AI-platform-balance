import { useState, useEffect, useCallback } from 'react';
import { useStorage } from './useStorage';

// 应用主题到 DOM
const applyTheme = (theme: 'light' | 'dark') => {
  // 防止 SSR 环境下出错
  if (typeof document === 'undefined') return;
  
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

export function useTheme() {
  const storage = useStorage();
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // 初始化主题（仅在挂载时执行一次）
  useEffect(() => {
    const savedTheme = storage.getTheme();
    setThemeState(savedTheme);
    applyTheme(savedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当主题变化时，同步到 DOM 和 localStorage
  useEffect(() => {
    applyTheme(theme);
    storage.saveTheme(theme);
  }, [theme, storage]);

  // 切换主题（使用函数式更新，依赖为空数组确保引用稳定）
  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme
  };
}
