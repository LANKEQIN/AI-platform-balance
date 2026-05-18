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

REM 清除 Vite 缓存（确保加载最新代码）
if exist "node_modules\.vite" (
    echo [信息] 正在清除 Vite 缓存...
    rmdir /s /q "node_modules\.vite"
    echo [信息] Vite 缓存已清除
)

REM 清除 Vite 配置缓存文件
if exist "vite.config.ts.timestamp-*.mjs" (
    echo [信息] 正在清除 Vite 配置缓存...
    del /q "vite.config.ts.timestamp-*.mjs"
    echo [信息] 配置缓存已清除
)

echo.

REM 检查是否已安装依赖
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

echo [信息] 正在启动开发服务器...
echo.
echo ========================================
echo    服务器启动后将自动打开浏览器
echo    访问地址: http://localhost:5173
echo    提示: 如未看到更新，请按 Ctrl+F5 强制刷新
echo ========================================
echo.

REM 启动 Vite 开发服务器并异步打开浏览器
start "" cmd /c "timeout /t 3 >nul && start http://localhost:5173"
call npm run dev

pause
