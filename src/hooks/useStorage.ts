import { useCallback } from 'react';
import { Platform, STORAGE_KEYS, CONFIG_VERSION, PlatformGroup, DEFAULT_GROUPS } from '../types/platform';
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

function isValidGroup(obj: any): obj is PlatformGroup {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.icon === 'string'
  );
}

export function useStorage() {
  const checkVersion = useCallback((): boolean => {
    try {
      const savedVersion = localStorage.getItem(STORAGE_KEYS.CONFIG_VERSION);
      if (savedVersion !== String(CONFIG_VERSION)) {
        localStorage.removeItem(STORAGE_KEYS.PLATFORMS_CONFIG);
        localStorage.removeItem(STORAGE_KEYS.GROUPS_CONFIG);
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

  // 合并分组与默认分组
  const mergeGroupsWithDefaults = useCallback((savedGroups: PlatformGroup[]): PlatformGroup[] => {
    const merged: PlatformGroup[] = [];
    const savedIds = new Set(savedGroups.map(g => g.id));

    savedGroups.forEach(group => {
      merged.push(group);
    });

    DEFAULT_GROUPS.forEach(defaultGroup => {
      if (!savedIds.has(defaultGroup.id)) {
        merged.push(JSON.parse(JSON.stringify(defaultGroup)));
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

  const savePlatforms = useCallback((platforms: Platform[]): boolean => {
    try {
      const data = JSON.stringify(platforms);
      localStorage.setItem(STORAGE_KEYS.PLATFORMS_CONFIG, data);
      return true;
    } catch (error) {
      console.error('保存平台配置失败:', error);
      return false;
    }
  }, []);

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

  const getHasVisited = useCallback((): boolean => {
    return sessionStorage.getItem(STORAGE_KEYS.HAS_VISITED) === 'true';
  }, []);

  const setHasVisited = useCallback((): void => {
    sessionStorage.setItem(STORAGE_KEYS.HAS_VISITED, 'true');
  }, []);

  // 分组相关方法
  const getGroups = useCallback((): PlatformGroup[] => {
    try {
      const savedGroups = localStorage.getItem(STORAGE_KEYS.GROUPS_CONFIG);
      if (savedGroups) {
        const parsed = JSON.parse(savedGroups);
        if (Array.isArray(parsed)) {
          const validGroups = parsed.filter(isValidGroup);
          return mergeGroupsWithDefaults(validGroups);
        }
      }
    } catch (error) {
      console.error('读取分组配置失败:', error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_GROUPS));
  }, [mergeGroupsWithDefaults]);

  const saveGroups = useCallback((groups: PlatformGroup[]): boolean => {
    try {
      const data = JSON.stringify(groups);
      localStorage.setItem(STORAGE_KEYS.GROUPS_CONFIG, data);
      return true;
    } catch (error) {
      console.error('保存分组配置失败:', error);
      return false;
    }
  }, []);

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
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
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

  const addGroup = useCallback((group: Omit<PlatformGroup, 'id' | 'sortOrder'>): boolean => {
    const groups = getGroups();
    const newGroup: PlatformGroup = {
      ...group,
      id: 'group_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      sortOrder: groups.length
    };
    groups.push(newGroup);
    return saveGroups(groups);
  }, [getGroups, saveGroups]);

  const updateGroup = useCallback((groupId: string, updates: Partial<PlatformGroup>): boolean => {
    const groups = getGroups();
    const index = groups.findIndex(g => g.id === groupId);
    if (index !== -1) {
      groups[index] = { ...groups[index], ...updates };
      return saveGroups(groups);
    }
    return false;
  }, [getGroups, saveGroups]);

  const deleteGroup = useCallback((groupId: string): boolean => {
    if (groupId === 'default') {
      console.error('不能删除默认分组');
      return false;
    }
    const groups = getGroups();
    const filteredGroups = groups.filter(g => g.id !== groupId);
    
    // 将该分组下的平台移到默认分组
    const platforms = getPlatforms();
    const updatedPlatforms = platforms.map(p => 
      p.groupId === groupId ? { ...p, groupId: 'default' } : p
    );
    
    // 先保存平台，再保存分组，两个都成功才返回 true
    const platformsSaved = savePlatforms(updatedPlatforms);
    if (!platformsSaved) {
      return false;
    }
    const groupsSaved = saveGroups(filteredGroups);
    return groupsSaved;
  }, [getGroups, saveGroups, getPlatforms, savePlatforms]);

  const exportConfig = useCallback((): string => {
    const config = {
      platforms: getPlatforms(),
      groups: getGroups(),
      theme: getTheme(),
      viewMode: getViewMode(),
      effectsMode: getEffectsMode(),
      exportTime: new Date().toISOString(),
      version: CONFIG_VERSION
    };
    return JSON.stringify(config, null, 2);
  }, [getPlatforms, getGroups, getTheme, getViewMode, getEffectsMode]);

  const validateImportConfig = useCallback((config: any): { valid: boolean; message: string; data: any } => {
    if (!config || typeof config !== 'object') {
      return { valid: false, message: '配置文件格式无效', data: null };
    }

    if (!config.platforms || !Array.isArray(config.platforms)) {
      return { valid: false, message: '配置文件缺少 platforms 字段或格式错误', data: null };
    }

    // 验证分组（可选，但如果有则必须有效）
    let groupsCount = 0;
    if (config.groups && Array.isArray(config.groups)) {
      const invalidGroups: number[] = [];
      config.groups.forEach((group: any, index: number) => {
        if (!isValidGroup(group)) {
          invalidGroups.push(index + 1);
        }
      });
      if (invalidGroups.length > 0) {
        return {
          valid: false,
          message: `第 ${invalidGroups.slice(0, 3).join(', ')}${invalidGroups.length > 3 ? '...' : ''} 个分组数据不完整或格式错误`,
          data: null
        };
      }
      groupsCount = config.groups.length;
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
        groupsCount,
        theme: config.theme === 'dark' ? 'dark' : 'light',
        viewMode: config.viewMode === 'list' ? 'list' : 'grid'
      }
    };
  }, []);

  const importConfig = useCallback((jsonString: string): { success: boolean; message: string; data?: any; platforms?: Platform[]; groups?: PlatformGroup[] } => {
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
        return { success: false, message: '保存平台配置失败，请重试' };
      }

      // 保存分组（如果有）
      let groupsSaved = true;
      if (config.groups && Array.isArray(config.groups)) {
        groupsSaved = saveGroups(config.groups);
        if (!groupsSaved) {
          console.error('保存分组配置失败');
        }
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
        groups: config.groups,
        data: {
          platformsCount: config.platforms.length,
          groupsCount: config.groups?.length || 0,
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
  }, [savePlatforms, saveGroups, saveTheme, saveViewMode, saveEffectsMode, validateImportConfig]);

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
    // 分组相关
    getGroups,
    saveGroups,
    addGroup,
    updateGroup,
    deleteGroup
  };
}
