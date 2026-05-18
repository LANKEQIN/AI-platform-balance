import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // 禁用开发服务器的 HTTP 缓存，确保每次都加载最新代码
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    },
    // 启用 HMR（热模块替换）确保代码修改实时生效
    hmr: {
      overlay: true  // 显示错误覆盖层
    }
  },
  // 优化依赖构建配置
  optimizeDeps: {
    // 强制在启动时重新构建依赖
    force: false
  },
  base: './'  // 使用相对路径，确保直接打开HTML文件也能正常加载
})
