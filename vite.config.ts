import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 端口 5273：原 5173 落在 Windows 保留端口范围(5104-5203)内导致 EACCES 权限拒绝
    port: 5273,
    // 强制绑定 IPv4，避免 localhost 解析到 IPv6(::1) 触发权限问题
    host: '127.0.0.1',
    open: true,  // 自动打开浏览器
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
