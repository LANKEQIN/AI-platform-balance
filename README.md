# AI平台余额快捷入口 - React版本

这是一个将原纯HTML/JS项目重构为React的版本。

## 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架

## 项目结构

```
react-app/
├── src/
│   ├── components/          # React组件
│   │   ├── Header.tsx       # 头部组件
│   │   ├── Toolbar.tsx      # 工具栏组件
│   │   ├── PlatformCard.tsx # 平台卡片组件
│   │   ├── Modal.tsx        # 模态框基础组件
│   │   ├── EditPlatformModal.tsx  # 编辑平台弹窗
│   │   ├── AddPlatformModal.tsx   # 添加平台弹窗
│   │   ├── BatchToolbar.tsx       # 批量操作工具栏
│   │   ├── ToastContainer.tsx     # Toast提示容器
│   │   ├── EmptyState.tsx   # 空状态组件
│   │   └── Footer.tsx       # 页脚组件
│   ├── hooks/               # 自定义Hooks
│   │   ├── useStorage.ts    # 存储管理Hook
│   │   ├── usePlatforms.ts  # 平台状态Hook
│   │   ├── useTheme.ts      # 主题切换Hook
│   │   └── useToast.ts      # Toast提示Hook
│   ├── config/              # 配置文件
│   │   └── platforms.ts     # 预设平台配置
│   ├── types/               # TypeScript类型定义
│   │   └── platform.ts      # 平台相关类型
│   ├── App.tsx              # 主应用组件
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
├── index.html               # HTML模板
├── package.json             # 项目依赖
├── tsconfig.json            # TypeScript配置
├── vite.config.ts           # Vite配置
├── tailwind.config.js       # Tailwind配置
└── postcss.config.js        # PostCSS配置
```

## 功能特性

- ✅ 平台卡片展示（网格/列表视图）
- ✅ 点击访问平台余额页面
- ✅ 编辑平台信息
- ✅ 添加新平台
- ✅ 删除自定义平台
- ✅ 收藏平台
- ✅ 搜索平台
- ✅ 分类筛选
- ✅ 批量选择和打开
- ✅ 配置导入/导出
- ✅ 主题切换（浅色/深色）
- ✅ localStorage数据持久化
- ✅ 拖拽排序 - 手动调整平台顺序
- ✅ 平台分组 - 创建自定义分组管理平台
- ✅ 分组折叠 - 分组可展开/折叠
- ✅ 分组管理 - 添加、编辑、删除分组

## 快速开始

```bash
# 进入项目目录
cd react-app

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 开发说明

- 开发服务器默认运行在 `http://localhost:3000`
- 所有数据存储在浏览器的localStorage中
- 配置版本号在 `src/types/platform.ts` 中定义
