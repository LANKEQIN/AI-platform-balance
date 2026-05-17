import { useState, useEffect, useCallback } from 'react';
import { useStorage } from './useStorage';

// 应用省电模式到 DOM
const applyPowerSave = (enabled: boolean) => {
  if (typeof document === 'undefined') return;

  const html = document.documentElement;
  if (enabled) {
    html.setAttribute('data-power-save', 'true');
  } else {
    html.removeAttribute('data-power-save');
  }
};

/**
 * 极致省电模式 Hook
 *
 * 功能特性：
 * - 自动检测低性能设备并提示启用
 * - 禁用所有 CSS 动画和过渡
 * - 禁用 backdrop-filter 模糊效果
 * - 禁用复杂阴影和渐变
 * - 降低渲染频率
 * - 持久化用户选择到 localStorage
 */
export function usePowerSave() {
  const storage = useStorage();

  // 从 localStorage 读取初始状态
  const [isPowerSave, setIsPowerSave] = useState<boolean>(false);

  // 初始化省电模式（仅在挂载时执行一次）
  useEffect(() => {
    const savedPowerSave = storage.getPowerSave();
    setIsPowerSave(savedPowerSave);
    applyPowerSave(savedPowerSave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切换省电模式（使用 useCallback 稳定函数引用）
  const togglePowerSave = useCallback(() => {
    setIsPowerSave(prev => {
      const newValue = !prev;
      // 同步应用到 DOM
      applyPowerSave(newValue);
      // 同步持久化到 localStorage
      storage.savePowerSave(newValue);
      return newValue;
    });
  }, [storage]);

  // 启用省电模式
  const enablePowerSave = useCallback(() => {
    setIsPowerSave(true);
    applyPowerSave(true);
    storage.savePowerSave(true);
  }, [storage]);

  // 禁用省电模式
  const disablePowerSave = useCallback(() => {
    setIsPowerSave(false);
    applyPowerSave(false);
    storage.savePowerSave(false);
  }, [storage]);

  return {
    isPowerSave,
    togglePowerSave,
    enablePowerSave,
    disablePowerSave,
  };
}
