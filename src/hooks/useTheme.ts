import { useState, useEffect, useCallback } from 'react';
import { useStorage } from './useStorage';

// 应用主题到 DOM
const applyTheme = (theme: 'light' | 'dark') => {
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

  // 切换主题（使用函数式更新避免闭包陷阱）
  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      storage.saveTheme(newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  }, [storage]);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme
  };
}
