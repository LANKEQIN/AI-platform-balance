# UI 重构实现计划：现代极简 + 品牌青

日期：2026-08-29 · 规格：[2026-08-29-ui-redesign-minimal-design.md](../specs/2026-08-29-ui-redesign-minimal-design.md)（已获批准）

## 目标

将玻璃拟态 UI 重做为现代极简风（Linear/Vercel 式）：纯色底 + 细边线 + 品牌青点缀，保留明暗双主题与全部功能。删除粒子特效（VisualEffects）及 effects-mode 逻辑、死代码 PoetryDisplay。

## 核心策略

1. **中央重定义 tokens**：重写 `index.css` 的 CSS 变量与集中类（`.surface` 替代 `.glass`、`.text-primary/.text-secondary/.text-muted` 语义文本类、`.btn` 系列改为极简样式）
2. **tailwind primary 色板改 teal**：现有 `bg-primary-500`、`ring-primary-500`、`focus:border-primary-400` 等类自动变青，无需逐处修改
3. **逐组件替换类名**：硬编码 `text-white/*`、`glass`、`bg-gradient-to-*` → 语义变量类
4. **不改动**：数据结构、Hooks 逻辑、localStorage 键名（`ai_platforms_effects_mode` 变孤儿键）、`CONFIG_VERSION`、全部交互功能

## 文件结构

| 操作 | 文件 |
|---|---|
| 重写 | `src/index.css`、`src/components/LandingPage.tsx` |
| 修改 | `tailwind.config.js`、`src/App.tsx`、`src/hooks/useStorage.ts`、`src/types/platform.ts`、12 个组件 |
| 删除 | `src/components/VisualEffects.tsx`、`src/components/PoetryDisplay.tsx` |
| 更新 | `.trae/rules/api项目规则.md` |

---

## 任务 1：重写 index.css（设计 Tokens + 集中类）

**操作**：整文件重写 `src/index.css` 为以下内容。

要点：
- 新 tokens：`--bg-page` / `--bg-surface` / `--border` / `--text-primary` / `--text-secondary` / `--text-muted` / `--accent` / `--accent-hover` / `--accent-contrast` / `--accent-soft`，`[data-theme="dark"]` 覆盖
- body 直接用 `var(--bg-page)` 纯色；**删除 body::before/::after 渐变与光晕层**
- `.surface` 替代 `.glass`（白/深卡底 + 细边线 + 微投影，无模糊）
- `.btn-primary` 实青底白字、`.btn-secondary` 表面底细边、`.btn-danger` 实红底白字、`.btn-icon` 方形表面按钮
- `.form-input/.form-select` 表面底细边，focus 青色 ring
- 删除 keyframes：gradientShift / auroraMove / shine / glowPulse / bounceSoft / cardBreath / iconWobble / fadeInUpStagger / pulseSoft；保留 fadeInUp / scaleIn
- 省电模式段大幅精简：极简风本身无动画无模糊，仅保留 banner 显隐、禁用过渡动画、去阴影、header/main 下移

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ==================== 设计 Tokens - 现代极简 ==================== */
:root {
  /* 表面与背景 */
  --bg-page: #fafafa;
  --bg-surface: #ffffff;
  --bg-surface-hover: #f5f5f5;
  --border: #eaeaea;
  --border-strong: #d4d4d4;

  /* 文字 */
  --text-primary: #171717;
  --text-secondary: #737373;
  --text-muted: #a3a3a3;

  /* 品牌青点缀 */
  --accent: #0d9488;
  --accent-hover: #0f766e;
  --accent-contrast: #ffffff;
  --accent-soft: #f0fdfa;

  /* 危险色 */
  --danger: #dc2626;
  --danger-hover: #b91c1c;

  /* 阴影（微投影） */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 10px;

  /* 动画时间 */
  --duration-fast: 150ms;
  --duration-normal: 200ms;

  /* 触控目标最小尺寸 */
  --touch-target-min: 44px;

  /* z-index 层级 */
  --z-sticky: 100;
  --z-dropdown: 200;
  --z-modal: 1000;
  --z-toast: 2000;
}

/* 深色模式 tokens */
[data-theme="dark"] {
  --bg-page: #0a0a0a;
  --bg-surface: #141414;
  --bg-surface-hover: #1f1f1f;
  --border: #262626;
  --border-strong: #404040;

  --text-primary: #fafafa;
  --text-secondary: #a3a3a3;
  --text-muted: #737373;

  --accent: #14b8a6;
  --accent-hover: #2dd4bf;
  --accent-contrast: #0a0a0a;
  --accent-soft: rgba(20, 184, 166, 0.1);

  --danger: #ef4444;
  --danger-hover: #f87171;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* ==================== 基础样式 ==================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  /* 防止布局抖动 */
  overflow-y: scroll;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background var(--duration-normal) ease, color var(--duration-normal) ease;
}

/* 防止闪烁的优化 */
img, video, iframe, canvas, svg {
  display: block;
  max-width: 100%;
}

/* ==================== 语义化文本类 ==================== */
.text-primary {
  color: var(--text-primary);
}

.text-secondary {
  color: var(--text-secondary);
}

.text-muted {
  color: var(--text-muted);
}

/* ==================== 表面类（替代原玻璃拟态 .glass） ==================== */
.surface {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--duration-normal) ease,
              box-shadow var(--duration-normal) ease,
              background var(--duration-normal) ease;
}

/* 可交互表面的悬停态 */
.surface-hover:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}

/* ==================== 按钮 ==================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--duration-fast) ease,
              border-color var(--duration-fast) ease,
              color var(--duration-fast) ease;
  white-space: nowrap;
  min-height: var(--touch-target-min);
  min-width: var(--touch-target-min);
  color: var(--text-primary);
  background: var(--bg-surface);
}

.btn:hover {
  background: var(--bg-surface-hover);
  border-color: var(--border-strong);
}

.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 主按钮：品牌青实底 */
.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;
}

.btn-primary:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
}

/* 次按钮：表面底细边（与 .btn 默认一致，显式声明便于阅读） */
.btn-secondary {
  background: var(--bg-surface);
  border-color: var(--border);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: var(--bg-surface-hover);
  border-color: var(--border-strong);
}

/* 危险按钮：实红底 */
.btn-danger {
  background: var(--danger);
  border-color: var(--danger);
  color: #ffffff;
  font-weight: 600;
}

.btn-danger:hover {
  background: var(--danger-hover);
  border-color: var(--danger-hover);
}

/* 图标按钮：方形表面按钮 */
.btn-icon {
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  padding: 0;
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* ==================== 表单 ==================== */
.form-input,
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: border-color var(--duration-fast) ease, box-shadow var(--duration-fast) ease;
  min-height: var(--touch-target-min);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

/* 下拉选项适配深色底 */
.form-select option {
  background: var(--bg-surface);
  color: var(--text-primary);
}

/* ==================== 动画定义（精简保留） ==================== */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-up {
  animation: fadeInUp var(--duration-normal) ease-out;
}

.animate-scale-in {
  animation: scaleIn var(--duration-normal) ease-out;
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ==================== 极致省电模式 ==================== */
/**
 * 极简风本身已无渐变/无模糊/微动画，
 * 省电模式仅需：禁用全部过渡与动画、移除阴影、显示顶部横幅
 */
[data-power-save="true"] *,
[data-power-save="true"] *::before,
[data-power-save="true"] *::after {
  animation: none !important;
  transition: none !important;
}

/* 省电模式切换按钮：保留过渡，确保用户能感知状态变化 */
[data-power-save="true"] .power-save-toggle,
[data-power-save="true"] .power-save-toggle::before,
[data-power-save="true"] .power-save-toggle::after {
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
}

[data-power-save="true"] {
  scroll-behavior: auto !important;
}

/* 移除全部阴影（横幅与切换按钮除外，保留视觉反馈） */
[data-power-save="true"] *:not(.power-save-toggle):not(.power-save-banner) {
  box-shadow: none !important;
}

/* 省电模式切换按钮：确保始终可点击 */
.power-save-toggle {
  position: relative !important;
  z-index: 9999 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
}

/* 省电模式已激活时：切换按钮保持琥珀色实底，清晰标识当前状态 */
[data-power-save="true"] .power-save-toggle.bg-amber-active {
  background: #f59e0b !important;
  border-color: #f59e0b !important;
  color: #ffffff !important;
}

/* ==================== 省电模式顶部横幅 ==================== */
.power-save-banner {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  background: #f59e0b !important;
  color: #ffffff !important;
  text-align: center !important;
  padding: 6px 16px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  z-index: 9999 !important;
  display: none !important;
  pointer-events: none !important;
}

[data-power-save="true"] .power-save-banner {
  display: block !important;
}

/* 省电模式下 header 与主内容下移，避开固定横幅 */
[data-power-save="true"] header {
  margin-top: 32px;
}

[data-power-save="true"] main,
[data-power-save="true"] section:first-of-type {
  margin-top: 32px;
}
```

**验证**：`npm run build` 通过（CSS 语法无误）。

---

## 任务 2：精简 tailwind.config.js

**操作**：整文件重写 `tailwind.config.js` 为以下内容。

要点：primary 色板 indigo → teal（组件中 `bg-primary-500`/`ring-primary-500`/`focus:border-primary-400`/`text-primary-400` 自动变青）；删 accent 粉色板（仅 AddPlatformModal 用 `text-pink-500`，任务 8 中改为 `text-red-500`）；删 gradient-shift/aurora-move 动画；保留 cardFloatIn/modalSlideIn。

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['attribute', 'data-theme'],
  theme: {
    extend: {
      colors: {
        // 品牌青色板（与 index.css 的 --accent tokens 一致）
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      animation: {
        'card-float-in': 'cardFloatIn 0.4s ease backwards',
        'modal-slide-in': 'modalSlideIn 0.25s ease forwards',
      },
      keyframes: {
        cardFloatIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        modalSlideIn: {
          from: { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
```

**验证**：`npm run build` 通过。

---

## 任务 3：移除特效与 effects-mode 逻辑

**操作 3.1**：`src/App.tsx` 删除两处：

- 删除第 24 行：`import VisualEffects from './components/VisualEffects';`
- 删除第 419-420 行注释与渲染：

```tsx
      {/* 视觉特效组件 - 省电模式下不渲染以节省性能 */}
      {!isPowerSave && <VisualEffects />}
```

**操作 3.2**：删除文件 `src/components/VisualEffects.tsx`、`src/components/PoetryDisplay.tsx`（死代码，仅自身引用）。

**操作 3.3**：`src/types/platform.ts` 删除 STORAGE_KEYS 中一行：

```typescript
  EFFECTS_MODE: 'ai_platforms_effects_mode',
```

（孤儿 localStorage 键 `ai_platforms_effects_mode` 无需迁移清理。）

**操作 3.4**：`src/hooks/useStorage.ts` 移除 effects-mode 相关代码（共 7 处）：

1. `resetToDefault` 中删除第 125 行：`localStorage.removeItem(STORAGE_KEYS.EFFECTS_MODE);`
2. 删除整个 `getEffectsMode` 与 `saveEffectsMode`（第 140-147 行）：

```typescript
  const getEffectsMode = useCallback((): 'cool' | 'simple' => {
    const value = localStorage.getItem(STORAGE_KEYS.EFFECTS_MODE);
    return value === 'cool' ? 'cool' : 'simple';
  }, []);

  const saveEffectsMode = useCallback((mode: 'cool' | 'simple'): void => {
    localStorage.setItem(STORAGE_KEYS.EFFECTS_MODE, mode);
  }, []);
```

3. `exportConfig` 中删除 `effectsMode: getEffectsMode(),` 行，依赖数组移除 `getEffectsMode`
4. `importConfig` 中删除：

```typescript
      if (config.effectsMode === 'cool' || config.effectsMode === 'simple') {
        saveEffectsMode(config.effectsMode);
      }
```

5. `importConfig` 返回对象中删除 `effectsMode: config.effectsMode || 'simple',` 行
6. `importConfig` 依赖数组移除 `saveEffectsMode`
7. `useMemo` 返回对象与依赖数组中移除 `getEffectsMode`、`saveEffectsMode`

**验证**：`npm run build` 通过；grep `EFFECTS_MODE|EffectsMode|effectsMode|VisualEffects|PoetryDisplay` 在 src 下无残留。

---

## 任务 4：重写 LandingPage（极简风）

**操作**：整文件重写 `src/components/LandingPage.tsx` 为以下内容。逻辑（诗歌/名言随机索引、省电开关 props）完全保留，仅重做 JSX 样式。

```tsx
import React, { useState, useCallback } from 'react';
import { poetryDatabase, quotesDatabase } from '../config/poetry';

interface LandingPageProps {
  onStart: () => void;
  isPowerSave?: boolean;
  onTogglePowerSave?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, isPowerSave = false, onTogglePowerSave }) => {
  // 只维护索引作为唯一数据源，内容从索引派生，避免状态不同步
  const [poetryIndex, setPoetryIndex] = useState<number>(() =>
    Math.floor(Math.random() * poetryDatabase.length)
  );
  const [quoteIndex, setQuoteIndex] = useState<number>(() =>
    Math.floor(Math.random() * quotesDatabase.length)
  );

  // 从索引派生当前内容，保证 index 与内容始终一致
  const currentPoetry = poetryDatabase[poetryIndex];
  const currentQuote = quotesDatabase[quoteIndex];

  // 随机切换古诗词（避开当前索引）
  const getRandomPoetry = useCallback((avoidIndex?: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * poetryDatabase.length);
    } while (poetryDatabase.length > 1 && newIndex === avoidIndex);
    setPoetryIndex(newIndex);
  }, []);

  // 随机切换名人名言（避开当前索引）
  const getRandomQuote = useCallback((avoidIndex?: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotesDatabase.length);
    } while (quotesDatabase.length > 1 && newIndex === avoidIndex);
    setQuoteIndex(newIndex);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 省电模式顶部横幅 */}
      <div className="power-save-banner">
        🔋 极致省电模式已启用 - 性能优先
      </div>

      {/* 省电模式浮动切换按钮 */}
      {onTogglePowerSave && (
        <button
          onClick={() => onTogglePowerSave?.()}
          className={`power-save-toggle fixed right-4 z-50 px-4 py-2 rounded-full text-sm font-medium border ${
            isPowerSave
              ? 'bg-amber-active bg-amber-500 border-amber-500 text-white'
              : 'surface text-secondary hover:text-primary'
          } ${isPowerSave ? 'top-10' : 'top-4'}`}
          aria-label={isPowerSave ? '关闭极致省电模式' : '开启极致省电模式'}
          title={isPowerSave ? '已开启极致省电模式 - 点击关闭' : '开启极致省电模式（禁用动画/模糊/阴影，提升流畅度）'}
        >
          {isPowerSave ? '⚡ 省电模式' : '🔌 省电模式'}
        </button>
      )}

      {/* Hero 区域 */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* 主标题 */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary tracking-tight">
              AI平台余额
              <br />
              快捷入口
            </h1>
            <p className="text-xl md:text-2xl text-secondary max-w-2xl mx-auto leading-relaxed">
              一站式管理所有AI平台，快速访问余额查询页面，提升工作效率
            </p>
          </div>

          {/* 主要 CTA 按钮 */}
          <div className="mb-12">
            <button
              onClick={onStart}
              className="btn btn-primary text-lg px-10 py-4 rounded-xl"
            >
              🚀 立即开始
            </button>
          </div>

          {/* 古诗词和名人名言卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {/* 古诗词卡片 */}
            <div className="surface surface-hover rounded-xl p-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📜</span>
                  <span className="text-primary font-semibold">古诗词</span>
                </div>
                <button
                  onClick={() => getRandomPoetry(poetryIndex)}
                  className="btn btn-icon text-sm"
                  aria-label="刷新古诗词"
                  title="换一首"
                >
                  🔄
                </button>
              </div>

              {currentPoetry && (
                <div className="text-center">
                  <p className="text-xl font-medium mb-2 text-primary">
                    {currentPoetry.line1}
                  </p>
                  {currentPoetry.line2 && (
                    <p className="text-lg text-secondary mb-4">
                      {currentPoetry.line2}
                    </p>
                  )}
                  {currentPoetry.author && (
                    <p className="text-sm text-muted italic">
                      —— {currentPoetry.author}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 名人名言卡片 */}
            <div className="surface surface-hover rounded-xl p-6 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <span className="text-primary font-semibold">名人名言</span>
                </div>
                <button
                  onClick={() => getRandomQuote(quoteIndex)}
                  className="btn btn-icon text-sm"
                  aria-label="刷新名人名言"
                  title="换一条"
                >
                  🔄
                </button>
              </div>

              {currentQuote && (
                <div className="text-center">
                  <p className="text-xl font-medium mb-2 text-primary">
                    {currentQuote.line1}
                  </p>
                  {currentQuote.line2 && (
                    <p className="text-lg text-secondary mb-4">
                      {currentQuote.line2}
                    </p>
                  )}
                  {currentQuote.author && (
                    <p className="text-sm text-muted italic">
                      —— {currentQuote.author}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 功能特性 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div className="surface surface-hover rounded-xl p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2 text-primary">快速访问</h3>
              <p className="text-sm text-secondary">
                一键跳转到各平台余额页面，无需反复搜索和登录
              </p>
            </div>

            <div className="surface surface-hover rounded-xl p-6">
              <div className="text-3xl mb-3">🔧</div>
              <h3 className="text-lg font-semibold mb-2 text-primary">自定义配置</h3>
              <p className="text-sm text-secondary">
                自由添加、编辑平台链接，支持批量操作和配置导入导出
              </p>
            </div>

            <div className="surface surface-hover rounded-xl p-6">
              <div className="text-3xl mb-3">🌙</div>
              <h3 className="text-lg font-semibold mb-2 text-primary">深色模式</h3>
              <p className="text-sm text-secondary">
                支持浅色/深色主题切换，护眼设计，夜间使用更舒适
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 px-6 text-center text-muted text-sm">
        <p>AI平台余额快捷入口 © 2026 | 数据安全存储于本地</p>
      </footer>
    </div>
  );
};

export default LandingPage;
```

**验证**：`npm run build` 通过；落地页浅/深主题下为纯色底 + 白/深卡片。

---

## 任务 5：改造 Header

**操作**：修改 `src/components/Header.tsx` 以下 6 处（逻辑不变，仅类名）。

**5.1** 第 76-77 行，header 容器改为白/深底细边条，删除顶部渐变光线：

旧：
```tsx
    <header className="glass backdrop-blur-xl py-4 px-6 shadow-md border-b border-white/20 sticky top-0 z-[100] flex justify-between items-center flex-wrap gap-4 transition-all duration-250">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
```

新：
```tsx
    <header className="bg-[var(--bg-surface)] py-4 px-6 border-b border-[var(--border)] sticky top-0 z-[100] flex justify-between items-center flex-wrap gap-4">
```

**5.2** 第 79 行，标题去渐变文字：

旧：
```tsx
      <h1 className="text-2xl font-bold bg-gradient-to-br from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
```

新：
```tsx
      <h1 className="text-2xl font-bold text-primary tracking-tight">
```

**5.3** 第 89 行，搜索框改极简：

旧：
```tsx
            className="pl-4 pr-10 py-2 border border-white/20 rounded-2xl glass backdrop-blur-lg text-white text-sm w-56 transition-all duration-250 shadow-sm focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/25 focus:bg-white/18"
```

新：
```tsx
            className="pl-4 pr-10 py-2 border border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-primary text-sm w-56 transition-colors placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
```

**5.4** 第 97 行，清空搜索按钮文字色：

旧：`className="absolute right-2.5 w-11 h-11 border-none bg-transparent text-white/60 text-lg ...`
新：将 `text-white/60` 改为 `text-muted`。

**5.5** 第 150、155、165 行，下拉菜单去玻璃化：

旧：
```tsx
              className="absolute right-0 top-full mt-2 glass backdrop-blur-xl rounded-xl shadow-lg border border-white/20 min-w-40 overflow-hidden z-[200]"
```
新：
```tsx
              className="absolute right-0 top-full mt-2 surface rounded-lg min-w-40 overflow-hidden z-[200]"
```

两个菜单项 `text-white/90 hover:bg-white/10` → `text-primary hover:bg-[var(--bg-surface-hover)]`；重置项 `text-red-400 hover:bg-white/10` → `text-red-500 hover:bg-[var(--bg-surface-hover)]`。

**5.6** 第 187 行，省电按钮激活态改用实色类（配合 index.css 的 `.bg-amber-active`）：

旧：
```tsx
          className={`btn btn-icon power-save-toggle ${isPowerSave ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none' : ''}`}
```
新：
```tsx
          className={`btn btn-icon power-save-toggle ${isPowerSave ? 'bg-amber-active bg-amber-500 border-amber-500 text-white' : ''}`}
```

**验证**：`npm run build` 通过。

---

## 任务 6：改造 Toolbar

**操作**：修改 `src/components/Toolbar.tsx`。

新极简风下文本色走 CSS 变量，不再需要 `isDark` 三元。props 接口保留（App.tsx 仍传 `theme`，避免改动调用方），但删除 `isDark` 变量。三个分类胶囊与两个视图按钮的类名统一为：

- 选中态：`bg-primary-600 border-primary-600 text-white shadow-sm`（teal-600=#0d9488，深浅主题均可读；深色下 tailwind primary-500 更亮，此处统一用 600 保证对比度）
- 未选中态：`surface text-secondary hover:text-primary hover:border-[var(--border-strong)]`

**6.1** 删除第 19 行 `const isDark = theme === 'dark';`，`theme` prop 保留在解构中但不再使用——由于 tsconfig 开启 `noUnusedLocals`，将解构中的 `theme` 移除，同时从 interface 中保留 `theme` 字段（调用方仍传入，接口不变更）。

具体：interface 保持不变；解构改为：

```tsx
const Toolbar: React.FC<ToolbarProps> = ({
  currentCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange
}) => {
```

**6.2** 「全部」胶囊（第 29-45 行）类名改为：

```tsx
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              currentCategory === 'all'
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'surface text-secondary hover:text-primary'
            }`}
```

**6.3** 动态分类胶囊（第 48-67 行）类名同样替换（条件 `currentCategory === category.id`）。

**6.4** 「已收藏」胶囊（第 70-86 行）类名同样替换（条件 `currentCategory === 'starred'`）。

**6.5** 视图切换两按钮（第 91-118 行）类名改为：

```tsx
            className={`w-11 h-11 rounded-lg transition-colors border flex items-center justify-center ${
              viewMode === 'grid'
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'surface text-secondary hover:text-primary'
            }`}
```

（`list` 按钮条件为 `viewMode === 'list'`，其余相同。）

**验证**：`npm run build` 通过（无未使用变量报错）。

---

## 任务 7：改造 PlatformCard 与 SortablePlatformCard

**操作 7.1**：修改 `src/components/PlatformCard.tsx` 共 8 处：

1. 第 35 行卡片容器：
   旧：`platform-card relative glass rounded-2xl p-6 shadow-lg`
   新：`platform-card relative surface surface-hover rounded-xl p-6`
2. 第 37 行选中 ring 保留 `ring-2 ring-primary-500`，删除 `ring-offset-2 ring-offset-transparent`（深色底上 offset 无意义且底色已变）：
   新：`${isSelected ? 'ring-2 ring-primary-500' : ''}`
3. 第 49-50 行复选框未选中态：
   旧：`bg-white/10 border-white/30 hover:bg-white/20 hover:scale-105`
   新：`bg-[var(--bg-surface)] border-[var(--border-strong)] hover:border-primary-500`
   （选中态 `bg-primary-500 border-primary-500 text-white scale-110` 保留）
4. 第 82 行图标容器改浅青底：
   旧：`w-12 h-12 rounded-xl bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-2xl shadow-sm flex-shrink-0`
   新：`w-12 h-12 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-2xl flex-shrink-0`
5. 第 87 行标题：`text-white` → `text-primary`
6. 第 90 行分类标签：
   旧：`text-xs text-white/70 bg-primary-500/25 px-2 py-0.5 rounded-full font-medium inline-block`
   新：`text-xs text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-500/10 px-2 py-0.5 rounded-full font-medium inline-block`
7. 第 101 行 URL：`text-white/60 ... hover:text-white/80` → `text-muted ... hover:text-secondary`
8. 第 106-107 行备注区：
   旧：`mt-2 p-2 rounded-lg bg-white/5 border border-white/10` / `text-xs text-white/70 line-clamp-3`
   新：`mt-2 p-2 rounded-lg bg-[var(--accent-soft)] border border-[var(--border)]` / `text-xs text-secondary line-clamp-3`
9. 第 121 行访问按钮：
   旧：`flex-1 btn bg-gradient-to-br from-green-500 to-emerald-400 text-white border-none shadow-[0_4px_15px_rgba(16,185,129,0.4)]`
   新：`flex-1 btn btn-primary`
10. 第 128 行编辑按钮：
    旧：`btn glass glass-hover`
    新：`btn btn-secondary`

**操作 7.2**：修改 `src/components/SortablePlatformCard.tsx` 第 101 行拖拽手柄图标色：

旧：`<span className="text-white/70 select-none">⋮⋮</span>`
新：`<span className="text-muted select-none">⋮⋮</span>`

**验证**：`npm run build` 通过。

---

## 任务 8：改造 Modal 与 4 个弹窗

**操作 8.1**：`src/components/Modal.tsx` 4 处：

1. 第 57 行遮罩：`bg-black/50 backdrop-blur-md` → `bg-black/40`
2. 第 64 行内容容器：
   旧：`relative glass backdrop-blur-2xl rounded-2xl w-[90%] ${width || 'max-w-[480px]'} shadow-xl shadow-glow border border-white/20 animate-modal-slide-in overflow-hidden max-h-[90vh] overflow-y-auto`
   新：`relative surface rounded-xl w-[90%] ${width || 'max-w-[480px]'} animate-modal-slide-in overflow-hidden max-h-[90vh] overflow-y-auto`
3. 删除第 66-67 行顶部光泽层：
```tsx
        {/* 顶部光泽 */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/8 to-transparent pointer-events-none" />
```
4. 第 70-75 行头部：分隔线 `border-white/20` → `border-[var(--border)]`；标题 `text-white` → `text-primary`；关闭按钮：
   旧：`w-11 h-11 border-none glass text-2xl text-white cursor-pointer rounded-xl flex items-center justify-center transition-all duration-150 hover:bg-white/18 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2`
   新：`w-11 h-11 border-none bg-transparent text-2xl text-secondary cursor-pointer rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-primary focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2`
5. 第 90 行底部分隔线：`border-white/20` → `border-[var(--border)]`

**操作 8.2**：`src/components/AddPlatformModal.tsx` — 4 处 label 文字 `text-white` → `text-primary`（第 71、89、113、132、150 行共 5 处）；必填星号 `text-pink-500` → `text-red-500`（第 72、90 行 2 处，因 accent 粉色板已删）。

**操作 8.3**：`src/components/EditPlatformModal.tsx` — label `text-white` → `text-primary`（第 140、155、183、202、234 行 5 处）；第 175-176 行默认链接提示 `text-white/60` → `text-muted`、`text-white/80` → `text-secondary`；第 226 行复选框 `border-white/30 bg-white/10` → `border-[var(--border-strong)] bg-[var(--bg-surface)]`；第 228 行 `text-white` → `text-primary`。

**操作 8.4**：`src/components/ConfirmModal.tsx` 第 49 行：`text-white/90` → `text-primary`。

**操作 8.5**：`src/components/GroupManagerModal.tsx` 8 处：

1. 第 89 行表单容器：`glass rounded-xl p-4` → `surface rounded-xl p-4`
2. 第 90、152 行标题 `text-white` → `text-primary`
3. 第 95、105 行 label `text-white/70` → `text-secondary`
4. 第 101 行输入框：
   旧：`w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-primary-400`
   新：`w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-primary placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary-500`
5. 第 113-114 行图标选中/未选中态：
   选中：`bg-primary-500 ring-2 ring-white/30` → `bg-primary-500 ring-2 ring-primary-500/30`
   未选中：`bg-white/10 hover:bg-white/20` → `bg-[var(--bg-surface-hover)] hover:bg-[var(--border)]`
6. 第 127 行保存按钮：`btn bg-gradient-to-br from-primary-500 to-primary-400 text-white` → `btn btn-primary`
7. 第 133 行取消按钮：`btn glass glass-hover` → `btn btn-secondary`
8. 第 141 行添加按钮：`btn bg-gradient-to-br from-green-500 to-emerald-400 text-white` → `btn btn-primary`
9. 第 157 行分组项容器：`glass rounded-lg p-3` → `surface rounded-lg p-3`
10. 第 161、164 行分组名 `text-white` → `text-primary`；`(默认)` 标记 `text-white/50` → `text-muted`
11. 第 171 行编辑按钮：`glass glass-hover ... text-white/70 hover:text-white` → `surface ... text-secondary hover:text-primary`
12. 第 179 行删除按钮：`bg-red-500/20 hover:bg-red-500/40 ... text-red-400 hover:text-red-300` → `bg-red-500/10 hover:bg-red-500/20 ... text-red-500`

**验证**：`npm run build` 通过；5 个弹窗浅/深主题下白/深底可读。

---

## 任务 9：改造 BatchToolbar / ToastContainer / EmptyState / Footer

**操作 9.1**：`src/components/BatchToolbar.tsx` 2 处：

1. 第 18 行容器：
   旧：`fixed bottom-6 left-1/2 -translate-x-1/2 glass backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-6 py-3 flex items-center gap-4 z-[150]`
   新：`fixed bottom-6 left-1/2 -translate-x-1/2 surface rounded-xl px-6 py-3 flex items-center gap-4 z-[150]`
2. 第 23-24 行文字：`text-white/90` → `text-secondary`；`text-white font-bold` → `text-primary font-bold`

**操作 9.2**：`src/components/ToastContainer.tsx` — 保持不变（彩色实底 Toast 在极简风中成立，语义色 success/error/warning/info 已是纯色）。

**操作 9.3**：`src/components/EmptyState.tsx` 4 处：

1. 第 9 行容器：`glass backdrop-blur-2xl rounded-2xl border border-white/20 shadow-lg` → `surface rounded-xl`
2. 第 11 行图标 `text-white/70` → `text-muted`
3. 第 15 行标题 `text-white` → `text-primary`
4. 第 18 行描述 `text-white/65` → `text-secondary`

**操作 9.4**：`src/components/Footer.tsx` 2 处：

1. 第 12 行 `text-white/60` → `text-muted`
2. 第 17 行 `text-white/40 hover:text-white/70` → `text-muted hover:text-secondary`

**操作 9.5**：`src/App.tsx` 内联文字色 6 处：

1. 第 475 行加载提示 `text-white/70` → `text-secondary`
2. 第 509、588、616 行分组标题按钮 `text-white/90` → `text-primary`（第 588、616 行的 `hover:text-white` → `hover:text-[var(--accent)]`）
3. 第 514、592、620 行数量标记 `text-white/50` → `text-muted`
4. 第 599 行空分组提示 `text-white/50` → `text-muted`

**验证**：`npm run build` 通过；grep `text-white|glass|bg-gradient` 在 src 下仅剩合理残留（Toast 白字、省电按钮白字、btn 类内）。

---

## 任务 10：更新项目规则文档

**操作**：修改 `.trae/rules/api项目规则.md` 3 处：

1. 「5.1 已实现功能」清单中删除 `视觉特效（粒子动画）` 一行
2. 「4.1 localStorage 键名」表格中删除 `ai_platforms_effects_mode` 一行
3. 「3.4 样式规范」中 `UI 风格为**玻璃拟态（Glassmorphism）**` 改为 `UI 风格为**现代极简**（纯色底 + 细边线 + 品牌青点缀）`

**验证**：文档与实际代码一致。

---

## 任务 11：整体验证

1. `npm run build` 通过，无 TS/CSS 错误
2. `npm run dev` 启动后目视检查：
   - 落地页：浅/深主题纯色底、诗歌/名言卡片可刷新、CTA 进入主界面
   - 主界面：双主题切换、搜索、分类筛选、视图切换
   - 5 个弹窗（添加/编辑/分组管理/重置确认/导入）样式与功能
   - 拖拽排序、批量选择与批量打开
   - 省电模式：横幅显示、切换按钮琥珀色、动画消失
   - 收藏、Toast、空状态、页脚「重新查看落地页」
3. grep 残留检查：`glass|backdrop-blur|bg-gradient|text-white/` 在 src 下无意外残留

## 自审清单

- [x] 所有 14 个在用组件均有对应任务
- [x] 每个任务含精确的旧/新代码或完整新文件，无占位符
- [x] 不改数据结构、Hooks 逻辑、localStorage 键名、CONFIG_VERSION
- [x] 无测试任务（遵循用户规则）
- [x] 中文注释保留
- [x] 单文件均远低于 2000 行
