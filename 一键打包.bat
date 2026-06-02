@echo off
chcp 65001 >nul
title API余额管理工具 - 一键打包

echo.
echo ╔══════════════════════════════════════════╗
echo ║     API余额管理工具 - 一键打包脚本        ║
echo ║           版本: 2.0.0                     ║
echo ╚══════════════════════════════════════════╝
echo.

:: 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js！
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

:: 显示 Node.js 版本
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [信息] Node.js 版本: %NODE_VERSION%

:: 检查 npm 是否可用
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 npm！
    pause
    exit /b 1
)

:: 显示 npm 版本
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [信息] npm 版本: %NPM_VERSION%
echo.

:: 检查是否在项目根目录
if not exist "package.json" (
    echo [错误] 未找到 package.json，请在项目根目录运行此脚本！
    pause
    exit /b 1
)

:: 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [信息] 未检测到 node_modules，正在安装依赖...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败！
        pause
        exit /b 1
    )
    echo [完成] 依赖安装成功！
    echo.
) else (
    echo [信息] 依赖已存在，跳过安装。
    echo.
)

:: 清理旧的构建产物
if exist "dist\" (
    echo [清理] 正在清理旧的 dist 目录...
    rmdir /s /q "dist"
)

if exist "release\" (
    echo [清理] 正在清理旧的 release 目录...
    rmdir /s /q "release"
)
echo.

:: 开始打包
echo ══════════════════════════════════════════════
echo   正在打包，请耐心等待...
echo   首次打包需要下载 Electron 二进制文件
echo   可能需要几分钟时间
echo ══════════════════════════════════════════════
echo.

call npm run electron:build:win

if %errorlevel% equ 0 (
    echo.
    echo ╔══════════════════════════════════════════╗
    echo ║         打包成功！                        ║
    echo ╚══════════════════════════════════════════╝
    echo.
    echo 安装包位于: release\ 目录下
    echo.
    
    :: 自动打开 release 目录
    if exist "release\" (
        start "" "release"
    )
) else (
    echo.
    echo ╔══════════════════════════════════════════╗
    echo ║         打包失败！                        ║
    echo ╚══════════════════════════════════════════╝
    echo.
    echo 请检查上方错误信息。
    echo 常见问题:
    echo   1. 网络问题导致 Electron 二进制下载失败
    echo   2. 磁盘空间不足
    echo   3. VS2022 构建工具未正确配置
    echo.
)

echo.
echo 按任意键退出...
pause >nul
