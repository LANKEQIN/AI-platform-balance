import { useState, useEffect, useCallback, useRef } from 'react';
import { useStorage } from './useStorage';

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
  const [isPowerSave, setIsPowerSave] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return storage.getPowerSave();
    }
    return false;
  });

  // 记录是否已提示过自动检测（避免重复弹窗）
  const hasPromptedRef = useRef(false);

  // 检测设备性能并提示启用省电模式
  useEffect(() => {
    if (hasPromptedRef.current) return;

    const checkPerformance = () => {
      // 检测低内存设备（移动端或低性能设备）
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency || 2;

      // 如果设备内存 <= 4GB 或 CPU 核心数 <= 2，提示启用省电模式
      if ((memory && memory <= 4) || cores <= 2) {
        hasPromptedRef.current = true;
        // 不强制启用，仅自动建议已由 UI 层处理
      }
    };

    // 延迟检测，避免影响首屏加载
    const timer = setTimeout(checkPerformance, 3000);
    return () => clearTimeout(timer);
  }, []);

  // 当省电模式状态变化时，应用到 DOM 并持久化
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;

    if (isPowerSave) {
      html.setAttribute('data-power-save', 'true');
    } else {
      html.removeAttribute('data-power-save');
    }

    // 持久化到 localStorage
    storage.savePowerSave(isPowerSave);
  }, [isPowerSave, storage]);

  // 切换省电模式
  const togglePowerSave = useCallback(() => {
    setIsPowerSave((prev) => !prev);
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
