import { useState, useEffect, useCallback } from 'react';
import { Platform, STORAGE_KEYS, CONFIG_VERSION } from '../types/platform';
import { DEFAULT_PLATFORMS } from '../config/platforms';

// 存储管理器 Hook
export function useStorage() {
  // 检查配置版本
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

  // 合并默认配置和用户配置
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

  // 获取平台配置
  const getPlatforms = useCallback((): Platform[] => {
    try {
      checkVersion();
      const savedConfig = localStorage.getItem(STORAGE_KEYS.PLATFORMS_CONFIG);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        return mergeWithDefaults(parsed);
      }
    } catch (error) {
      console.error('读取平台配置失败:', error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PLATFORMS));
  }, [checkVersion, mergeWithDefaults]);

  // 保存平台配置
  const savePlatforms = useCallback((platforms: Platform[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLATFORMS_CONFIG, JSON.stringify(platforms));
      return true;
    } catch (error) {
      console.error('保存平台配置失败:', error);
      return false;
    }
  }, []);

  // 更新单个平台
  const updatePlatform = useCallback((platformId: string, updates: Partial<Platform>): boolean => {
    const platforms = getPlatforms();
    const index = platforms.findIndex(p => p.id === platformId);
    if (index !== -1) {
      platforms[index] = { ...platforms[index], ...updates };
      return savePlatforms(platforms);
    }
    return false;
  }, [getPlatforms, savePlatforms]);

  // 添加新平台
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

  // 删除平台
  const deletePlatform = useCallback((platformId: string): boolean => {
    const platforms = getPlatforms();
    const filtered = platforms.filter(p => p.id !== platformId);
    return savePlatforms(filtered);
  }, [getPlatforms, savePlatforms]);

  // 获取主题
  const getTheme = useCallback((): 'light' | 'dark' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
  }, []);

  // 保存主题
  const saveTheme = useCallback((theme: 'light' | 'dark'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, []);

  // 重置为默认配置
  const resetToDefault = useCallback((): Platform[] => {
    localStorage.removeItem(STORAGE_KEYS.PLATFORMS_CONFIG);
    localStorage.setItem(STORAGE_KEYS.CONFIG_VERSION, String(CONFIG_VERSION));
    return JSON.parse(JSON.stringify(DEFAULT_PLATFORMS));
  }, []);

  // 获取视图模式
  const getViewMode = useCallback((): 'grid' | 'list' => {
    return (localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as 'grid' | 'list') || 'grid';
  }, []);

  // 保存视图模式
  const saveViewMode = useCallback((mode: 'grid' | 'list'): void => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  }, []);

  // 获取特效模式
  const getEffectsMode = useCallback((): 'cool' | 'simple' => {
    return (localStorage.getItem(STORAGE_KEYS.EFFECTS_MODE) as 'cool' | 'simple') || 'simple';
  }, []);

  // 保存特效模式
  const saveEffectsMode = useCallback((mode: 'cool' | 'simple'): void => {
    localStorage.setItem(STORAGE_KEYS.EFFECTS_MODE, mode);
  }, []);

  // 导出配置
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

  // 验证导入配置
  const validateImportConfig = useCallback((config: any): { valid: boolean; message: string; data: any } => {
    if (!config || typeof config !== 'object') {
      return { valid: false, message: '配置文件格式无效', data: null };
    }

    if (!config.platforms || !Array.isArray(config.platforms)) {
      return { valid: false, message: '配置文件缺少 platforms 字段或格式错误', data: null };
    }

    const invalidPlatforms: number[] = [];
    config.platforms.forEach((platform: any, index: number) => {
      if (!platform.id || !platform.name) {
        invalidPlatforms.push(index + 1);
      }
    });

    if (invalidPlatforms.length > 0) {
      return {
        valid: false,
        message: `第 ${invalidPlatforms.slice(0, 3).join(', ')}${invalidPlatforms.length > 3 ? '...' : ''} 个平台数据不完整（缺少必填字段）`,
        data: null
      };
    }

    return {
      valid: true,
      message: '验证通过',
      data: {
        platformsCount: config.platforms.length,
        theme: config.theme || 'light',
        viewMode: config.viewMode || 'grid'
      }
    };
  }, []);

  // 导入配置
  const importConfig = useCallback((jsonString: string): { success: boolean; message: string; data?: any } => {
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

      savePlatforms(config.platforms);
      if (config.theme) {
        saveTheme(config.theme);
      }
      if (config.viewMode) {
        saveViewMode(config.viewMode);
      }
      if (config.effectsMode) {
        saveEffectsMode(config.effectsMode);
      }

      return {
        success: true,
        message: '配置导入成功',
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

  // 获取是否已访问过
  const getHasVisited = useCallback((): boolean => {
    return localStorage.getItem(STORAGE_KEYS.HAS_VISITED) === 'true';
  }, []);

  // 保存访问状态
  const setHasVisited = useCallback((): void => {
    localStorage.setItem(STORAGE_KEYS.HAS_VISITED, 'true');
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
    saveEffectsMode
  };
}
