import { useCallback, useRef } from 'react';
import { Platform, STORAGE_KEYS, CONFIG_VERSION } from '../types/platform';
import { DEFAULT_PLATFORMS } from '../config/platforms';

function isValidPlatform(obj: any): obj is Platform {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.icon === 'string' &&
    typeof obj.enabled === 'boolean'
  );
}

export function useStorage() {
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDataRef = useRef<string>('');

  const checkVersion = useCallback((): boolean => {
    try {
      const savedVersion = localStorage.getItem(STORAGE_KEYS.CONFIG_VERSION);
      if (savedVersion !== String(CONFIG_VERSION)) {
        localStorage.removeItem(STORAGE_KEYS.PLATFORMS_CONFIG);
        localStorage.setItem(STORAGE_KEYS.CONFIG_VERSION, String(CONFIG_VERSION));
        return true;
      }
    } catch (error) {
      console.error('检查配置版本失败:', error);
    }
    return false;
  }, []);

  const mergeWithDefaults = useCallback((savedConfig: Platform[]): Platform[] => {
    const merged: Platform[] = [];
    const savedIds = new Set(savedConfig.map(p => p.id));

    savedConfig.forEach(platform => {
      merged.push(platform);
    });

    DEFAULT_PLATFORMS.forEach(defaultPlatform => {
      if (!savedIds.has(defaultPlatform.id)) {
        merged.push(JSON.parse(JSON.stringify(defaultPlatform)));
      }
    });

    return merged;
  }, []);

  const getPlatforms = useCallback((): Platform[] => {
    try {
      checkVersion();
      const savedConfig = localStorage.getItem(STORAGE_KEYS.PLATFORMS_CONFIG);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (Array.isArray(parsed)) {
          const validPlatforms = parsed.filter(isValidPlatform);
          return mergeWithDefaults(validPlatforms);
        }
      }
    } catch (error) {
      console.error('读取平台配置失败:', error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PLATFORMS));
  }, [checkVersion, mergeWithDefaults]);

  const flushSave = useCallback(() => {
    if (saveTimerRef.current !== null) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.PLATFORMS_CONFIG, pendingDataRef.current);
    } catch (error) {
      console.error('保存平台配置失败:', error);
    }
  }, []);

  const savePlatforms = useCallback((platforms: Platform[]): boolean => {
    try {
      const data = JSON.stringify(platforms);
      pendingDataRef.current = data;

      if (saveTimerRef.current !== null) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(() => {
        flushSave();
      }, 100);

      return true;
    } catch (error) {
      console.error('序列化平台配置失败:', error);
      return false;
    }
  }, [flushSave]);

  const updatePlatform = useCallback((platformId: string, updates: Partial<Platform>): boolean => {
    const platforms = getPlatforms();
    const index = platforms.findIndex(p => p.id === platformId);
    if (index !== -1) {
      platforms[index] = { ...platforms[index], ...updates };
      return savePlatforms(platforms);
    }
    return false;
  }, [getPlatforms, savePlatforms]);

  const addPlatform = useCallback((platform: Omit<Platform, 'id' | 'enabled'>): boolean => {
    const platforms = getPlatforms();
    const newPlatform: Platform = {
      ...platform,
      id: 'custom_' + Date.now(),
      enabled: true
    };
    platforms.push(newPlatform);
    return savePlatforms(platforms);
  }, [getPlatforms, savePlatforms]);

  const deletePlatform = useCallback((platformId: string): boolean => {
    const platforms = getPlatforms();
    const filtered = platforms.filter(p => p.id !== platformId);
    return savePlatforms(filtered);
  }, [getPlatforms, savePlatforms]);

  const getTheme = useCallback((): 'light' | 'dark' => {
    const value = localStorage.getItem(STORAGE_KEYS.THEME);
    return value === 'dark' ? 'dark' : 'light';
  }, []);

  const saveTheme = useCallback((theme: 'light' | 'dark'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, []);

  const resetToDefault = useCallback((): Platform[] => {
    localStorage.removeItem(STORAGE_KEYS.PLATFORMS_CONFIG);
    localStorage.setItem(STORAGE_KEYS.CONFIG_VERSION, String(CONFIG_VERSION));
    return JSON.parse(JSON.stringify(DEFAULT_PLATFORMS));
  }, []);

  const getViewMode = useCallback((): 'grid' | 'list' => {
    const value = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return value === 'list' ? 'list' : 'grid';
  }, []);

  const saveViewMode = useCallback((mode: 'grid' | 'list'): void => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  }, []);

  const getEffectsMode = useCallback((): 'cool' | 'simple' => {
    const value = localStorage.getItem(STORAGE_KEYS.EFFECTS_MODE);
    return value === 'cool' ? 'cool' : 'simple';
  }, []);

  const saveEffectsMode = useCallback((mode: 'cool' | 'simple'): void => {
    localStorage.setItem(STORAGE_KEYS.EFFECTS_MODE, mode);
  }, []);

  const exportConfig = useCallback((): string => {
    const config = {
      platforms: getPlatforms(),
      theme: getTheme(),
      viewMode: getViewMode(),
      effectsMode: getEffectsMode(),
      exportTime: new Date().toISOString(),
      version: CONFIG_VERSION
    };
    return JSON.stringify(config, null, 2);
  }, [getPlatforms, getTheme, getViewMode, getEffectsMode]);

  const validateImportConfig = useCallback((config: any): { valid: boolean; message: string; data: any } => {
    if (!config || typeof config !== 'object') {
      return { valid: false, message: '配置文件格式无效', data: null };
    }

    if (!config.platforms || !Array.isArray(config.platforms)) {
      return { valid: false, message: '配置文件缺少 platforms 字段或格式错误', data: null };
    }

    const invalidPlatforms: number[] = [];
    config.platforms.forEach((platform: any, index: number) => {
      if (!isValidPlatform(platform)) {
        invalidPlatforms.push(index + 1);
      }
    });

    if (invalidPlatforms.length > 0) {
      return {
        valid: false,
        message: `第 ${invalidPlatforms.slice(0, 3).join(', ')}${invalidPlatforms.length > 3 ? '...' : ''} 个平台数据不完整或格式错误`,
        data: null
      };
    }

    return {
      valid: true,
      message: '验证通过',
      data: {
        platformsCount: config.platforms.length,
        theme: config.theme === 'dark' ? 'dark' : 'light',
        viewMode: config.viewMode === 'list' ? 'list' : 'grid'
      }
    };
  }, []);

  const importConfig = useCallback((jsonString: string): { success: boolean; message: string; data?: any; platforms?: Platform[] } => {
    try {
      if (!jsonString || typeof jsonString !== 'string') {
        return { success: false, message: '配置数据不能为空' };
      }

      const trimmed = jsonString.trim();
      if (trimmed.length === 0) {
        return { success: false, message: '配置数据不能为空' };
      }

      const config = JSON.parse(trimmed);
      const validation = validateImportConfig(config);
      if (!validation.valid) {
        return { success: false, message: validation.message };
      }

      const saveResult = savePlatforms(config.platforms);
      if (!saveResult) {
        return { success: false, message: '保存配置失败，请重试' };
      }

      if (config.theme === 'dark' || config.theme === 'light') {
        saveTheme(config.theme);
      }
      if (config.viewMode === 'grid' || config.viewMode === 'list') {
        saveViewMode(config.viewMode);
      }
      if (config.effectsMode === 'cool' || config.effectsMode === 'simple') {
        saveEffectsMode(config.effectsMode);
      }

      return {
        success: true,
        message: '配置导入成功',
        platforms: config.platforms,
        data: {
          platformsCount: config.platforms.length,
          theme: config.theme || 'light',
          viewMode: config.viewMode || 'grid',
          effectsMode: config.effectsMode || 'simple'
        }
      };
    } catch (error) {
      let errorMessage = '导入配置失败';
      if (error instanceof SyntaxError) {
        errorMessage = '配置文件格式无效，不是有效的JSON格式';
      } else if (error instanceof Error && error.message) {
        errorMessage = `导入失败: ${error.message}`;
      }

      console.error('导入配置失败:', error);
      return { success: false, message: errorMessage };
    }
  }, [savePlatforms, saveTheme, saveViewMode, saveEffectsMode, validateImportConfig]);

  const getHasVisited = useCallback((): boolean => {
    return sessionStorage.getItem(STORAGE_KEYS.HAS_VISITED) === 'true';
  }, []);

  const setHasVisited = useCallback((): void => {
    sessionStorage.setItem(STORAGE_KEYS.HAS_VISITED, 'true');
  }, []);

  return {
    getPlatforms,
    savePlatforms,
    updatePlatform,
    addPlatform,
    deletePlatform,
    getTheme,
    saveTheme,
    resetToDefault,
    getViewMode,
    saveViewMode,
    exportConfig,
    importConfig,
    getHasVisited,
    setHasVisited,
    getEffectsMode,
    saveEffectsMode,
    flushSave
  };
}
