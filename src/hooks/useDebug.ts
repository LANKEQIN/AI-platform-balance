import { useEffect, useRef } from 'react';
import { STORAGE_KEYS, CONFIG_VERSION } from '../types/platform';

/**
 * 应用调试工具 Hook
 *
 * 将应用内部状态和操作暴露到 window.__debug 对象，
 * 方便在浏览器 F12 控制台中排查问题。
 *
 * 使用方式：
 *   __debug.help()           - 显示帮助信息
 *   __debug.state()          - 查看当前应用状态快照
 *   __debug.test.powerSave() - 测试省电模式切换回调
 *   __debug.test.theme()     - 测试主题切换回调
 *   __debug.storage.check()  - 检查 localStorage 键值
 *   __debug.storage.read()   - 读取所有 localStorage 数据
 *   __debug.storage.size()   - 计算 localStorage 占用大小
 *   __debug.health()         - 运行健康检查
 *   __debug.dom.check()      - 检查关键 DOM 属性
 */

interface DebugStateSnapshot {
  theme: string;
  isPowerSave: boolean;
  viewMode: string;
  searchKeyword: string;
  currentCategory: string;
  isSelectMode: boolean;
  isDragEnabled: boolean;
  platformsCount: number;
  groupsCount: number;
  selectedIdsCount: number;
  showLanding: boolean;
  loading: boolean;
}

interface DebugCallbacks {
  togglePowerSave: () => void;
  toggleTheme: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  setSearchKeyword: (keyword: string) => void;
  setCurrentCategory: (category: string) => void;
  setIsSelectMode: (mode: boolean) => void;
  setIsDragEnabled: (enabled: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

interface DebugConfig {
  platformsCount: number;
  groupsCount: number;
}

export function useDebug(
  state: DebugStateSnapshot,
  callbacks: DebugCallbacks,
  config: DebugConfig
) {
  // 用 ref 持有最新的状态和回调，避免频繁注册/注销
  const stateRef = useRef(state);
  const callbacksRef = useRef(callbacks);
  const configRef = useRef(config);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    // 仅在开发环境注册调试工具，避免生产环境暴露内部状态
    if (!import.meta.env.DEV) {
      return;
    }

    // 构建状态快照
    const getState = (): DebugStateSnapshot => ({ ...stateRef.current });

    // 构建回调测试工具
    const test = {
      // 测试省电模式切换
      powerSave: () => {
        const before = stateRef.current.isPowerSave;
        console.log(`[Debug] 省电模式当前状态: ${before}`);
        console.log('[Debug] 尝试调用 togglePowerSave...');
        try {
          callbacksRef.current.togglePowerSave();
          // 延迟检查状态是否变化
          setTimeout(() => {
            const after = stateRef.current.isPowerSave;
            const domAttr = document.documentElement.getAttribute('data-power-save');
            if (after !== before) {
              console.log(`%c[Debug] ✅ 省电模式切换成功: ${before} → ${after}`, 'color: #10b981');
              console.log(`[Debug] DOM 属性 data-power-save = "${domAttr}"`);
            } else {
              console.log(`%c[Debug] ❌ 省电模式切换失败: 状态未变化，仍为 ${after}`, 'color: #ef4444');
              console.log('[Debug] 可能原因: togglePowerSave 回调未正确执行，或 React 状态更新被阻止');
              console.log('[Debug] DOM 属性 data-power-save =', domAttr);
            }
          }, 100);
        } catch (err) {
          console.error('[Debug] ❌ togglePowerSave 调用异常:', err);
        }
      },

      // 测试主题切换
      theme: () => {
        const before = stateRef.current.theme;
        console.log(`[Debug] 主题当前状态: ${before}`);
        console.log('[Debug] 尝试调用 toggleTheme...');
        try {
          callbacksRef.current.toggleTheme();
          setTimeout(() => {
            const after = stateRef.current.theme;
            const domAttr = document.documentElement.getAttribute('data-theme');
            if (after !== before) {
              console.log(`%c[Debug] ✅ 主题切换成功: ${before} → ${after}`, 'color: #10b981');
              console.log(`[Debug] DOM 属性 data-theme = "${domAttr}"`);
            } else {
              console.log(`%c[Debug] ❌ 主题切换失败: 状态未变化，仍为 ${after}`, 'color: #ef4444');
            }
          }, 100);
        } catch (err) {
          console.error('[Debug] ❌ toggleTheme 调用异常:', err);
        }
      },

      // 测试 Toast 显示
      toast: () => {
        console.log('[Debug] 尝试调用 showToast...');
        try {
          callbacksRef.current.showToast('调试测试消息 - Toast', 'success');
          console.log('%c[Debug] ✅ showToast 调用成功，请观察是否出现 Toast 提示', 'color: #10b981');
        } catch (err) {
          console.error('[Debug] ❌ showToast 调用异常:', err);
        }
      },

      // 测试视图模式切换
      viewMode: () => {
        const before = stateRef.current.viewMode;
        const next = before === 'grid' ? 'list' : 'grid';
        console.log(`[Debug] 视图模式当前: ${before}，切换到: ${next}`);
        try {
          callbacksRef.current.setViewMode(next);
          setTimeout(() => {
            const after = stateRef.current.viewMode;
            if (after === next) {
              console.log(`%c[Debug] ✅ 视图模式切换成功: ${before} → ${after}`, 'color: #10b981');
            } else {
              console.log(`%c[Debug] ❌ 视图模式切换失败: 期望 ${next}，实际 ${after}`, 'color: #ef4444');
            }
          }, 100);
        } catch (err) {
          console.error('[Debug] ❌ setViewMode 调用异常:', err);
        }
      },

      // 检查指定按钮的 DOM 状态
      button: (ariaLabel: string) => {
        const btn = document.querySelector(`button[aria-label="${ariaLabel}"]`);
        if (!btn) {
          console.log(`%c[Debug] ❌ 未找到 aria-label="${ariaLabel}" 的按钮`, 'color: #ef4444');
          return;
        }
        const rect = btn.getBoundingClientRect();
        const styles = window.getComputedStyle(btn);
        console.log(`%c[Debug] ✅ 找到按钮: "${ariaLabel}"`, 'color: #10b981');
        console.log('[Debug] 按钮信息:', {
          标签内容: btn.textContent?.trim(),
          可见: rect.width > 0 && rect.height > 0,
          尺寸: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
          位置: `(${Math.round(rect.x)}, ${Math.round(rect.y)})`,
          disabled: (btn as HTMLButtonElement).disabled,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          pointerEvents: styles.pointerEvents,
          zIndex: styles.zIndex,
          onClick: !!(btn as HTMLButtonElement).onclick || btn.getAttribute('role') !== null,
        });
        // 检查按钮是否被遮挡
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const topEl = document.elementFromPoint(centerX, centerY);
        const isObscured = topEl !== btn && !btn.contains(topEl);
        if (isObscured) {
          console.log(`%c[Debug] ⚠️ 按钮可能被遮挡! 最上层元素:`, 'color: #f59e0b', topEl);
        } else {
          console.log('[Debug] 按钮未被遮挡');
        }
      },
    };

    // localStorage 诊断工具
    const storage = {
      // 检查所有预期的 localStorage 键
      check: () => {
        console.log('[Debug] localStorage 键值检查:');
        const keys = Object.values(STORAGE_KEYS) as string[];
        keys.forEach(key => {
          const value = localStorage.getItem(key);
          const status = value !== null ? '✅' : '⚠️ (空)';
          console.log(`  ${status} ${key} = ${value !== null ? (value.length > 80 ? value.slice(0, 80) + '...' : value) : 'null'}`);
        });
        console.log(`[Debug] CONFIG_VERSION (代码) = ${CONFIG_VERSION}`);
        const savedVersion = localStorage.getItem(STORAGE_KEYS.CONFIG_VERSION);
        if (savedVersion !== String(CONFIG_VERSION)) {
          console.log(`%c[Debug] ⚠️ 配置版本不匹配! localStorage=${savedVersion}, 代码=${CONFIG_VERSION}`, 'color: #f59e0b');
        }
      },

      // 读取指定键
      get: (key: string) => {
        const value = localStorage.getItem(key);
        if (value === null) {
          console.log(`[Debug] "${key}" 不存在`);
          return null;
        }
        try {
          const parsed = JSON.parse(value);
          console.log(`[Debug] "${key}" (JSON):`, parsed);
          return parsed;
        } catch {
          console.log(`[Debug] "${key}" (字符串):`, value);
          return value;
        }
      },

      // 计算占用大小
      size: () => {
        let total = 0;
        const details: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) {
            const value = localStorage.getItem(key) || '';
            const size = new Blob([key + value]).size;
            total += size;
            details[key] = formatBytes(size);
          }
        }
        console.log(`[Debug] localStorage 总占用: ${formatBytes(total)}`);
        console.log('[Debug] 各键占用:', details);
        return { total, details };
      },

      // 删除指定键
      remove: (key: string) => {
        const existed = localStorage.getItem(key) !== null;
        localStorage.removeItem(key);
        console.log(`[Debug] ${existed ? '已删除' : '不存在'}: ${key}`);
      },

      // 清空所有应用相关键
      clearApp: () => {
        const keys = Object.values(STORAGE_KEYS) as string[];
        keys.forEach(key => localStorage.removeItem(key));
        console.log('%c[Debug] ✅ 已清空所有应用 localStorage 数据，刷新页面后将恢复默认配置', 'color: #10b981');
      },
    };

    // DOM 检查工具
    const dom = {
      // 检查关键 DOM 属性
      check: () => {
        const html = document.documentElement;
        const body = document.body;
        console.log('[Debug] DOM 属性检查:');
        console.log('  data-theme =', html.getAttribute('data-theme') || '(未设置，默认 light)');
        console.log('  data-power-save =', html.getAttribute('data-power-save') || '(未设置，省电模式关闭)');
        console.log('  body classes =', body.className || '(无)');
        console.log('  prefers-reduced-motion =', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        console.log('  viewport =', `${window.innerWidth}x${window.innerHeight}`);
        console.log('  devicePixelRatio =', window.devicePixelRatio);
      },

      // 查找所有按钮并报告可交互状态
      buttons: () => {
        const buttons = document.querySelectorAll('button');
        console.log(`[Debug] 页面共有 ${buttons.length} 个 <button> 元素:`);
        buttons.forEach((btn, i) => {
          const el = btn as HTMLButtonElement;
          const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 30) || '(无标签)';
          const disabled = el.disabled;
          const rect = el.getBoundingClientRect();
          const visible = rect.width > 0 && rect.height > 0;
          const style = window.getComputedStyle(el);
          const noPointer = style.pointerEvents === 'none';
          const flag = disabled ? '🚫' : noPointer ? '🚫' : !visible ? '👁️‍🗨️' : '✅';
          console.log(`  ${flag} [${i}] "${label}" | disabled=${disabled} visible=${visible} pointerEvents=${style.pointerEvents}`);
        });
      },

      // 检查元素是否存在
      find: (selector: string) => {
        const els = document.querySelectorAll(selector);
        if (els.length === 0) {
          console.log(`%c[Debug] ❌ 未找到匹配 "${selector}" 的元素`, 'color: #ef4444');
        } else {
          console.log(`[Debug] 找到 ${els.length} 个匹配 "${selector}" 的元素:`, els);
        }
        return els;
      },
    };

    // 健康检查
    const health = () => {
      console.log('%c========== 应用健康检查 ==========', 'color: #06b6d4; font-size: 14px; font-weight: bold');
      const issues: string[] = [];

      // 1. 检查 React 根节点
      const root = document.getElementById('root');
      if (!root || !root.hasChildNodes()) {
        issues.push('React 根节点为空，应用可能未挂载');
      }

      // 2. 检查 localStorage 可用性
      try {
        localStorage.setItem('__debug_test__', '1');
        localStorage.removeItem('__debug_test__');
      } catch {
        issues.push('localStorage 不可用（可能已满或被禁用）');
      }

      // 3. 检查关键状态
      const s = getState();
      if (s.platformsCount === 0 && !s.showLanding) {
        issues.push('平台列表为空且未显示落地页，可能数据加载异常');
      }
      if (s.isPowerSave) {
        const attr = document.documentElement.getAttribute('data-power-save');
        if (attr !== 'true') {
          issues.push(`省电模式状态(isPowerSave=true)与DOM属性(data-power-save="${attr}")不一致`);
        }
      }

      // 4. 检查主题一致性
      const themeAttr = document.documentElement.getAttribute('data-theme');
      if (s.theme === 'dark' && themeAttr !== 'dark') {
        issues.push(`主题状态(theme=dark)与DOM属性(data-theme="${themeAttr}")不一致`);
      } else if (s.theme === 'light' && themeAttr === 'dark') {
        issues.push(`主题状态(theme=light)与DOM属性(data-theme="${themeAttr}")不一致`);
      }

      // 5. 检查 Service Worker
      if (!('serviceWorker' in navigator)) {
        issues.push('浏览器不支持 Service Worker');
      }

      // 6. 检查性能
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (nav) {
        const loadTime = nav.loadEventEnd - nav.startTime;
        if (loadTime > 5000) {
          issues.push(`页面加载耗时 ${Math.round(loadTime)}ms，可能存在性能问题`);
        }
      }

      // 7. 检查配置版本
      const savedVersion = localStorage.getItem(STORAGE_KEYS.CONFIG_VERSION);
      if (savedVersion && savedVersion !== String(CONFIG_VERSION)) {
        issues.push(`配置版本不匹配: localStorage=${savedVersion}, 代码=${CONFIG_VERSION}，可能导致功能异常`);
      }

      // 8. 检查按钮
      const powerSaveBtn = document.querySelector('button[aria-label*="省电"]');
      if (!powerSaveBtn) {
        issues.push('未找到省电模式按钮 DOM 元素');
      } else {
        const rect = powerSaveBtn.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          issues.push('省电模式按钮尺寸为 0，可能被隐藏');
        }
        const style = window.getComputedStyle(powerSaveBtn);
        if (style.pointerEvents === 'none') {
          issues.push('省电模式按钮 pointer-events: none，无法点击');
        }
        if ((powerSaveBtn as HTMLButtonElement).disabled) {
          issues.push('省电模式按钮 disabled 属性为 true');
        }
      }

      // 输出结果
      if (issues.length === 0) {
        console.log('%c✅ 健康检查通过，未发现明显问题', 'color: #10b981; font-size: 12px');
      } else {
        console.log(`%c⚠️ 发现 ${issues.length} 个潜在问题:`, 'color: #f59e0b; font-size: 12px');
        issues.forEach((issue, i) => {
          console.log(`  ${i + 1}. ${issue}`);
        });
      }

      console.log('%c=====================================', 'color: #06b6d4; font-size: 14px; font-weight: bold');
      return issues;
    };

    // 帮助信息
    const help = () => {
      console.log(`
%c🔧 AI平台余额快捷入口 - 调试工具
%chttps://github.com

%c状态检查:
  __debug.state()            查看当前应用状态快照
  __debug.health()           运行健康检查（推荐优先使用）

%c回调测试:
  __debug.test.powerSave()   测试省电模式切换
  __debug.test.theme()       测试主题切换
  __debug.test.toast()       测试 Toast 提示
  __debug.test.viewMode()    测试视图模式切换
  __debug.test.button(label) 检查指定按钮的 DOM 状态
                              例: __debug.test.button('开启极致省电模式')

%clocalStorage 诊断:
  __debug.storage.check()    检查所有 localStorage 键
  __debug.storage.get(key)   读取指定键值
  __debug.storage.size()     计算 localStorage 占用大小
  __debug.storage.remove(key) 删除指定键
  __debug.storage.clearApp() 清空所有应用数据

%cDOM 检查:
  __debug.dom.check()        检查关键 DOM 属性
  __debug.dom.buttons()      列出所有按钮及其可交互状态
  __debug.dom.find(selector) 查找 DOM 元素

%c快速排查省电模式按钮无反应:
  1. __debug.health()                           先跑个健康检查
  2. __debug.test.button('开启极致省电模式')      检查按钮DOM状态
  3. __debug.test.powerSave()                   测试回调是否触发
  4. __debug.storage.check()                    检查存储是否正常
      `.trim(),
        'color: #06b6d4; font-size: 16px; font-weight: bold',
        'color: #94a3b8; font-size: 11px',
        'color: #a78bfa; font-weight: bold',
        'color: #34d399; font-weight: bold',
        'color: #fbbf24; font-weight: bold',
        'color: #60a5fa; font-weight: bold',
        'color: #f87171; font-weight: bold'
      );
    };

    // 注册到全局
    (window as any).__debug = {
      state: getState,
      test,
      storage,
      dom,
      health,
      help,
    };

    // 首次提示
    console.log(
      '%c🔧 调试工具已加载! 输入 __debug.help() 查看使用说明',
      'color: #06b6d4; font-weight: bold'
    );

    // 卸载时清理
    return () => {
      delete (window as any).__debug;
    };
  }, []); // 仅挂载时注册一次，通过 ref 获取最新值
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
