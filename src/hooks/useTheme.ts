import { useState, useEffect } from 'react';
import { useStorage } from './useStorage';

export function useTheme() {
  const storage = useStorage();
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  // 初始化主题
  useEffect(() => {
    const savedTheme = storage.getTheme();
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, [storage]);

  // 应用主题到 DOM
  const applyTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // 切换主题
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    storage.saveTheme(newTheme);
    applyTheme(newTheme);
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme
  };
}
