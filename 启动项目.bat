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
echo ========================================
echo.

REM 启动 Vite 开发服务器并异步打开浏览器
start "" cmd /c "timeout /t 3 >nul && start http://localhost:5173"
call npm run dev

pause
