import { useState, useEffect, useCallback } from 'react';
import { Platform } from '../types/platform';
import { useStorage } from './useStorage';

export function usePlatforms() {
  const storage = useStorage();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化加载平台
  useEffect(() => {
    setPlatforms(storage.getPlatforms());
    setLoading(false);
  }, [storage]);

  // 保存平台并更新状态
  const saveAndUpdate = useCallback((newPlatforms: Platform[]) => {
    storage.savePlatforms(newPlatforms);
    setPlatforms(newPlatforms);
  }, [storage]);

  // 更新单个平台
  const updatePlatform = useCallback((platformId: string, updates: Partial<Platform>) => {
    const newPlatforms = platforms.map(p => 
      p.id === platformId ? { ...p, ...updates } : p
    );
    saveAndUpdate(newPlatforms);
  }, [platforms, saveAndUpdate]);

  // 添加平台
  const addPlatform = useCallback((platform: Omit<Platform, 'id' | 'enabled'>) => {
    const newPlatform: Platform = {
      ...platform,
      id: 'custom_' + Date.now(),
      enabled: true
    };
    saveAndUpdate([...platforms, newPlatform]);
  }, [platforms, saveAndUpdate]);

  // 删除平台
  const deletePlatform = useCallback((platformId: string) => {
    saveAndUpdate(platforms.filter(p => p.id !== platformId));
  }, [platforms, saveAndUpdate]);

  // 重置为默认
  const resetToDefault = useCallback((): Platform[] => {
    const defaultPlatforms = storage.resetToDefault();
    setPlatforms(defaultPlatforms);
    return defaultPlatforms;
  }, [storage]);

  return {
    platforms,
    loading,
    setPlatforms: saveAndUpdate,
    updatePlatform,
    addPlatform,
    deletePlatform,
    resetToDefault
  };
}
