import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  base: './'  // 使用相对路径，确保直接打开HTML文件也能正常加载
})
