# 🚀 AI平台余额快捷入口

<p align="center">
  <img src="https://img.shields.io/badge/纯前端-HTML5%2BCSS3%2BJS-blue?style=flat-square" alt="Tech Stack">
  <img src="https://img.shields.io/badge/无需后端-LocalStorage-green?style=flat-square" alt="Storage">
  <img src="https://img.shields.io/badge/零依赖-开箱即用-orange?style=flat-square" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/开源-MIT-yellow?style=flat-square" alt="License">
</p>

<p align="center">
  <b>一站式管理所有 AI 平台余额，告别繁琐的逐个登录查看</b>
</p>

<p align="center">
  <a href="#-功能特性">功能特性</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-使用指南">使用指南</a> •
  <a href="#-技术架构">技术架构</a> •
  <a href="#-路线图">路线图</a>
</p>

---

## ✨ 功能特性

<table>
<tr>
<td width="50%">

### 🎯 核心功能
- **📊 平台卡片展示** - 网格/列表双视图展示 AI 平台
- **🔗 一键直达** - 点击即可跳转到余额页面
- **✏️ 自定义链接** - 支持修改默认链接地址
- **🔍 智能搜索** - 快速定位目标平台 (`Ctrl+K`)
- **🌓 深色模式** - 护眼深色主题一键切换
- **🏷️ 分类筛选** - 按分类快速过滤平台
- **⭐ 收藏功能** - 收藏常用平台置顶显示

</td>
<td width="50%">

### 🚀 进阶特性
- **➕ 添加/删除平台** - 自定义管理平台列表
- **� 数据导入导出** - JSON 格式配置备份与恢复
- **⚡ 特效模式** - 炫酷的粒子特效切换
- **� PWA 支持** - 可添加到桌面离线使用
- **� 本地持久化** - localStorage 自动保存配置
- **♿ 无障碍支持** - 完善的 ARIA 标签和键盘导航
- **🌐 国际化准备** - 纯中文界面

</td>
</tr>
</table>

---

## 🚀 快速开始

### 方式一：直接打开（推荐）

```bash
# 克隆仓库
git clone https://github.com/yourusername/ai-platform-balance.git

# 进入目录
cd ai-platform-balance

# 直接用浏览器打开 index.html
# 或者使用本地服务器
python -m http.server 3000
```

### 方式二：下载使用

1. 点击 [Releases](https://github.com/yourusername/ai-platform-balance/releases) 下载最新版本
2. 解压后双击 `index.html` 即可使用

> 💡 **无需安装任何依赖，无需配置后端，开箱即用！**

---

## 📖 使用指南

### 添加自定义平台

1. 点击右上角 **"+ 添加平台"** 按钮
2. 填写平台名称和余额页面链接
3. 选择分类（大模型/AI平台/其他）
4. 点击保存即可

### 编辑平台链接

1. 点击平台卡片上的 **编辑图标**
2. 修改链接地址
3. 点击保存，配置自动持久化到本地

### 切换视图

1. 点击工具栏右侧的 **▦/☰** 按钮
2. 可以在网格视图和列表视图之间切换
3. 视图模式会自动保存

### 收藏平台

1. 点击平台卡片上的 **星标图标** 或在编辑弹窗中勾选"收藏此平台"
2. 收藏的平台会显示在列表最前面
3. 可通过工具栏的 **"已收藏"** 筛选按钮快速查看

### 数据备份

点击右上角 **⋮** 菜单：
- **导出配置** - 下载 JSON 格式的完整配置
- **导入配置** - 从 JSON 文件恢复配置
- **重置配置** - 恢复默认平台列表

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户界面层                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │
│  │  平台卡片    │ │  搜索栏     │ │  主题切换       │   │
│  │  Platform   │ │  Search     │ │  Theme Toggle   │   │
│  │  Cards      │ │  Bar        │ │                 │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                      业务逻辑层                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │
│  │  平台管理    │ │  数据持久化  │ │  特效引擎       │   │
│  │  Platform   │ │  Storage    │ │  Effects       │   │
│  │  Manager    │ │  Manager    │ │                 │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                      数据存储层                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Browser LocalStorage                │   │
│  │  • ai_platforms_config  - 平台配置              │   │
│  │  • ai_platforms_theme   - 主题设置              │   │
│  │  • ai_platforms_view    - 视图模式              │   │
│  │  • ai_effects_enabled   - 特效开关              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 结构 | HTML5 | 语义化标签，ARIA无障碍支持 |
| 样式 | CSS3 | CSS变量主题，Grid/Flex布局 |
| 逻辑 | ES6+ | 模块化开发，中文注释 |
| 存储 | localStorage | 本地持久化，零后端依赖 |
| PWA | Service Worker | 离线支持，桌面快捷方式 |

---

## 📁 项目结构

```
API Balance/
├── 📄 index.html              # 主入口文件
├── 📄 landing.html            # PWA落地页
├── 📄 service-worker.js       # Service Worker（PWA支持）
├── � manifest.json           # PWA清单文件
├── 📄 css/
│   └── 🎨 style.css          # 全局样式 + 主题变量
├── 📁 js/
│   ├── ⚙️ config.js          # 平台预设配置
│   ├── 💾 storage.js         # localStorage 封装
│   ├── ✨ effects.js        # 特效引擎（粒子效果）
│   ├── 🚀 app.js            # 核心业务逻辑
│   └── � poetry.js         # 诗意文案模块
├── 📄 README.md              # 项目说明文档
├── 📄 PROJECT_PLAN.md        # V1 项目计划
├── 📄 PROJECT_PLAN_V2.md     # V2 功能规划
└── 📄 LICENSE                # MIT 开源协议
```

---

## 🗺️ 路线图

### ✅ 已实现
- [x] 平台卡片展示（网格/列表双视图）
- [x] 自定义链接编辑
- [x] 深色/浅色主题切换
- [x] 本地配置持久化
- [x] 搜索过滤功能
- [x] 分类筛选功能
- [x] 收藏功能
- [x] 添加/删除平台
- [x] 数据导入导出
- [x] PWA 离线支持
- [x] 特效模式
- [x] 快捷键支持 (Ctrl+K)

### 🚧 规划中
- [ ] 余额历史记录
- [ ] 趋势图表展示
- [ ] 低余额提醒
- [ ] 批量操作功能
- [ ] 拖拽排序
- [ ] 使用统计

### 📋 未来展望
- [ ] 云端同步
- [ ] 自动余额抓取
- [ ] 多设备同步
- [ ] 浏览器扩展版本

---

## 🤝 支持的 AI 平台

<table>
<tr>
<td align="center"><b>🌋 火山引擎</b></td>
<td align="center"><b>🔍 DeepSeek</b></td>
<td align="center"><b>🌙 月之暗面</b></td>
<td align="center"><b>🧠 智谱</b></td>
</tr>
<tr>
<td align="center"><b>☁️ 阿里百炼</b></td>
<td align="center"><b>🤝 魔搭社区</b></td>
<td align="center"><b>⚡ Minimax</b></td>
<td align="center"><b>💎 硅基流动</b></td>
</tr>
<tr>
<td align="center"><b>🛤️ OpenRouter</b></td>
<td align="center"><b>💬 ChatGPT</b></td>
<td align="center"><b>🤖 Grok</b></td>
<td align="center"><b>✋ Manus</b></td>
</tr>
</table>

> 持续更新中，默认预置 20+ 热门 AI 平台

---

## 🛠️ 开发指南

### 本地开发

```bash
# 启动本地服务器
python -m http.server 3000

# 或 Node.js
npx serve .

# 访问 http://localhost:3000
```

### 代码规范

- **HTML**: 语义化标签，kebab-case 类名
- **CSS**: CSS变量管理主题，BEM命名规范
- **JS**: ES6+ 语法，模块化组织，中文注释

---