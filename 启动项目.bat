@echo off
chcp 65001 >nul
echo ========================================
echo    AI平台余额管理工具 - 一键启动
echo ========================================
echo.

REM 检查是否已安装 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [信息] 检测到 Node.js
node -v
echo.

REM ========================================
REM 全面清除缓存模块
REM ========================================
echo [信息] 开始全面清除缓存...

REM 1. 清除 Vite 依赖预构建缓存
if exist "node_modules\.vite" (
    echo [信息] 清除 Vite 依赖缓存...
    rmdir /s /q "node_modules\.vite" 2>nul
    if exist "node_modules\.vite" (
        echo [警告] Vite 依赖缓存清除可能不完整（有文件被占用）
    ) else (
        echo [信息] Vite 依赖缓存已清除
    )
)

REM 2. 清除 Vite 配置缓存文件（使用更可靠的 for 循环）
echo [信息] 清除 Vite 配置缓存...
for %%f in (vite.config.ts.timestamp-*.mjs) do (
    del /q "%%f" 2>nul
)

REM 3. 清除 esbuild 缓存（如果存在）
if exist "node_modules\.cache" (
    echo [信息] 清除 esbuild 缓存...
    rmdir /s /q "node_modules\.cache" 2>nul
)

REM 4. 清除 TypeScript 编译缓存
if exist "node_modules\.tsbuildinfo" (
    echo [信息] 清除 TypeScript 编译缓存...
    del /q "node_modules\.tsbuildinfo" 2>nul
)

REM 5. 清除项目根目录下可能存在的 .vite 缓存
if exist ".vite" (
    echo [信息] 清除项目根目录 Vite 缓存...
    rmdir /s /q ".vite" 2>nul
)

echo [信息] 缓存清除完成
echo.

REM ========================================
REM 依赖检查和安装
REM ========================================
if not exist "node_modules" (
    echo [信息] 正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo.
)

REM ========================================
REM 启动开发服务器
REM ========================================
echo [信息] 正在启动开发服务器...
echo.
echo ========================================
echo    服务器启动后将自动打开浏览器
echo    访问地址: http://localhost:5173
echo    提示: 开发模式已禁用 Service Worker 缓存
echo ========================================
echo.

REM 启动 Vite 开发服务器并异步打开浏览器
start "" cmd /c "timeout /t 3 >nul && start http://localhost:5173"
call npm run dev

pause
