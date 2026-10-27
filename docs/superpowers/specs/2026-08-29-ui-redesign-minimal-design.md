# UI 重构设计：现代极简 + 品牌青

日期：2026-08-29 · 状态：已获用户批准

## 背景

当前 UI 为玻璃拟态（青色渐变背景 + 毛玻璃模糊 + 粒子特效）。本次重构只重做视觉层，**所有功能、数据结构、localStorage 键、Hooks 逻辑完全保留**。

## 已确认的 6 项决策

1. 风格：现代极简（Linear / Vercel 式，纯色底 + 细边线）
2. 布局：保持顶部结构（Header + Toolbar + 分组网格）
3. 点缀色：品牌青（浅色 `#0d9488` / 深色 `#14b8a6`）
4. 粒子特效：移除（删除 `VisualEffects.tsx` 及 `effects-mode` 逻辑）
5. 落地页：保留并重做为极简风，诗歌卡片保留新样式
6. 主题：保留明暗双主题（沿用 `data-theme` 切换机制）

## 设计 Tokens

| Token | 浅色 | 深色 |
|---|---|---|
| 页面底 | `#fafafa` | `#0a0a0a` |
| 卡片/表面 | `#ffffff` | `#141414` |
| 边线 | `#eaeaea` | `#262626` |
| 主文字 | `#171717` | `#fafafa` |
| 次文字 | `#737373` | `#a3a3a3` |
| 点缀青 | `#0d9488` | `#14b8a6` |
| 点缀浅底 | `#f0fdfa` | `rgba(20,184,166,.1)` |

圆角 8–10px；微投影；无渐变、无模糊。图标底色统一浅青。

## 组件改造（14 个在用组件重绘，仅改样式类）

- **Header**：白底细边条；搜索框带 `⌘K` 提示；「+ 添加平台」青色实心主按钮；导入/导出等其余图标按钮白/深底细边
- **Toolbar**：胶囊分类（选中=青底白字）；右侧网格/列表分段切换
- **PlatformCard / SortablePlatformCard**：白卡细边，悬停=青描边 + 微投影；网格/列表两视图同步
- **Modal（基础封装）+ 4 个弹窗**（AddPlatform / EditPlatform / Confirm / GroupManager）：白底细边圆角，青色主按钮，遮罩改半透明纯色
- **BatchToolbar / ToastContainer / EmptyState / Footer**：去玻璃化，统一 tokens
- **LandingPage**：白底极简重做，诗歌/名言卡片新样式

## 技术路径

1. 重写 [index.css](../../../src/index.css) 的 CSS 变量（`--bg-*`、`--text-*`、`--accent-*`、`--glass-*` 指向新值；现有 `dark:` 组件类自动生效，双主题机制不变）
2. 精简 [tailwind.config.js](../../../tailwind.config.js)：移除 `backgroundImage` 渐变、`backdropBlur`、粒子动画；`accent` 色板改为品牌青
3. [App.tsx](../../../src/App.tsx)：移除 `VisualEffects` 引入与渲染、`getEffectsMode` 及 `useEffectsMode` 状态
4. 删除 `VisualEffects.tsx`、`PoetryDisplay.tsx`（死代码）
5. 更新 `.trae/rules/api项目规则.md`：功能清单移除「视觉特效」
6. 逐组件替换样式类（玻璃类 → 极简类）

## 不改动

- 平台/分组数据结构、`CONFIG_VERSION`、localStorage 键（`ai_platforms_effects_mode` 变孤儿键，无需迁移）
- 省电模式（继续禁用动画）与全部交互功能（拖拽、批量、搜索、快捷键等）

## 错误处理

样式层重构无新增失败路径；保留现有数据守卫与 Toast 提示。

## 验证

`npm run dev` 目视检查：双主题切换、5 个弹窗、拖拽排序、批量模式、落地页、省电模式；`npm run build` 通过；Electron 模式正常。
