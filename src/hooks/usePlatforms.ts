import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from '../types/platform';
import { useStorage } from './useStorage';

export function usePlatforms() {
  const storage = useStorage();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const platformsRef = useRef<Platform[]>([]);

  // 同步 ref 以避免回调依赖 platforms 导致的重新渲染
  useEffect(() => {
    platformsRef.current = platforms;
  }, [platforms]);

  // 初始化加载平台
  useEffect(() => {
    setPlatforms(storage.getPlatforms());
    setLoading(false);
  }, [storage]);

  // 保存平台并更新状态
  const saveAndUpdate = useCallback((newPlatforms: Platform[]): boolean => {
    const result = storage.savePlatforms(newPlatforms);
    if (result) {
      setPlatforms(newPlatforms);
    }
    return result;
  }, [storage]);

  // 更新单个平台
  const updatePlatform = useCallback((platformId: string, updates: Partial<Platform>) => {
    const currentPlatforms = platformsRef.current;
    const newPlatforms = currentPlatforms.map(p => 
      p.id === platformId ? { ...p, ...updates } : p
    );
    saveAndUpdate(newPlatforms);
  }, [saveAndUpdate]);

  // 添加平台
  const addPlatform = useCallback((platform: Omit<Platform, 'id' | 'enabled'>) => {
    const currentPlatforms = platformsRef.current;
    const newPlatform: Platform = {
      ...platform,
      id: 'custom_' + Date.now(),
      enabled: true
    };
    saveAndUpdate([...currentPlatforms, newPlatform]);
  }, [saveAndUpdate]);

  // 删除平台
  const deletePlatform = useCallback((platformId: string) => {
    const currentPlatforms = platformsRef.current;
    saveAndUpdate(currentPlatforms.filter(p => p.id !== platformId));
  }, [saveAndUpdate]);

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
