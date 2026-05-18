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

  // 使用函数式初始化，直接从 localStorage 读取，确保首次渲染状态正确
  const [isPowerSave, setIsPowerSave] = useState<boolean>(() => {
    return storage.getPowerSave();
  });

  // 初始化时应用省电模式到 DOM（仅在挂载时执行一次）
  useEffect(() => {
    applyPowerSave(isPowerSave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 当省电模式状态变化时，同步到 DOM 和 localStorage
  useEffect(() => {
    applyPowerSave(isPowerSave);
    storage.savePowerSave(isPowerSave);
  }, [isPowerSave, storage]);

  // 切换省电模式（使用函数式更新，依赖为空数组确保引用稳定）
  const togglePowerSave = useCallback(() => {
    setIsPowerSave(prev => !prev);
  }, []);

  // 启用省电模式
  const enablePowerSave = useCallback(() => {
    setIsPowerSave(true);
  }, []);

  // 禁用省电模式
  const disablePowerSave = useCallback(() => {
    setIsPowerSave(false);
  }, []);

  return {
    isPowerSave,
    togglePowerSave,
    enablePowerSave,
    disablePowerSave,
  };
}
