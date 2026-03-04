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
- **📊 平台卡片展示** - 直观展示所有 AI 平台
- **🔗 一键直达** - 点击即可跳转到余额页面
- **✏️ 自定义链接** - 支持修改默认链接地址
- **🔍 智能搜索** - 快速定位目标平台
- **🌓 深色模式** - 护眼深色主题切换

</td>
<td width="50%">

### 🚀 进阶特性
- **📈 余额记录** - 手动记录余额变化历史
- **📉 趋势图表** - 可视化余额消耗趋势
- **🔔 低余额提醒** - 阈值提醒防止余额不足
- **📤 数据导出** - JSON 格式备份与恢复
- **⚡ 快捷键支持** - `Ctrl+K` 快速搜索

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
3. 选择分类（大模型/图像生成/其他）
4. 点击保存即可

### 编辑平台链接

1. 点击平台卡片上的 **编辑图标**
2. 修改链接地址
3. 点击保存，配置自动持久化到本地

### 记录余额

1. 进入编辑弹窗的 **"历史记录"** 标签页
2. 输入当前余额数值
3. 系统自动生成趋势图表

### 数据备份

```javascript
// 导出配置
const config = localStorage.getItem('ai_platforms_config');
const blob = new Blob([config], { type: 'application/json' });
// 下载文件...

// 导入配置
localStorage.setItem('ai_platforms_config', importedConfig);
```

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
│  │  平台管理    │ │  数据持久化  │ │  图表渲染       │   │
│  │  Platform   │ │  Storage    │ │  Chart Render   │   │
│  │  Manager    │ │  Manager    │ │                 │   │
│  └─────────────┘ └─────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                      数据存储层                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Browser LocalStorage                │   │
│  │  • ai_platforms_config  - 平台配置              │   │
│  │  • ai_platforms_theme   - 主题设置              │   │
│  │  • balance_records      - 余额历史              │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 结构 | HTML5 | 语义化标签，SEO友好 |
| 样式 | CSS3 | CSS变量主题，Grid/Flex布局 |
| 逻辑 | ES6+ | 模块化开发，Async/Await |
| 存储 | localStorage | 本地持久化，零后端依赖 |
| 图表 | Chart.js | 轻量级图表库（可选） |

---

## 📁 项目结构

```
ai-platform-balance/
├── 📄 index.html              # 主入口文件
├── 📁 css/
│   └── 🎨 style.css           # 全局样式 + 主题变量
├── 📁 js/
│   ├── ⚙️ config.js           # 平台预设配置
│   ├── 💾 storage.js          # localStorage 封装
│   └── 🚀 app.js              # 核心业务逻辑
├── 📁 assets/
│   └── 📁 icons/              # 平台图标资源
├── 📄 README.md               # 项目说明文档
├── 📄 PROJECT_PLAN.md         # V1 项目计划
└── 📄 PROJECT_PLAN_V2.md      # V2 功能规划
```

---

## 🗺️ 路线图

### ✅ 已实现 (V1)
- [x] 平台卡片展示
- [x] 自定义链接编辑
- [x] 深色/浅色主题切换
- [x] 本地配置持久化
- [x] 搜索过滤功能

### 🚧 开发中 (V2)
- [ ] 余额历史记录
- [ ] 趋势图表展示
- [ ] 低余额提醒
- [ ] 数据导入导出
- [ ] 批量操作功能
- [ ] 快捷键支持

### 📋 规划中 (V3)
- [ ] 云端同步
- [ ] 自动余额抓取
- [ ] 多设备同步
- [ ] PWA 离线支持

---

## 🤝 支持的 AI 平台

<table>
<tr>
<td align="center"><b>🌋 火山引擎</b></td>
<td align="center"><b>🔍 DeepSeek</b></td>
<td align="center"><b>🌙 月之暗面</b></td>
<td align="center"><b>🧠 智谱 AI</b></td>
</tr>
<tr>
<td align="center"><b>☁️ 阿里百炼</b></td>
<td align="center"><b>🤝 魔搭社区</b></td>
<td align="center"><b>⚡ Minimax</b></td>
<td align="center"><b>💎 硅基流动</b></td>
</tr>
</table>

> 持续更新中，欢迎 [提交 Issue](https://github.com/yourusername/ai-platform-balance/issues) 添加更多平台！

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