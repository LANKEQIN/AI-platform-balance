# AI平台余额管理工具 - 一键启动脚本 (PowerShell版本)
# 编码: UTF-8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AI平台余额管理工具 - 一键启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否已安装 Node.js
try {
    $nodeVersion = node -v 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    Write-Host "[信息] 检测到 Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未检测到 Node.js，请先安装 Node.js" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""

# 检查是否已安装依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "[信息] 正在安装依赖..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
    Write-Host ""
}

Write-Host "[信息] 正在启动开发服务器..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   服务器启动后将自动打开浏览器" -ForegroundColor Cyan
Write-Host "   访问地址: http://localhost:5173" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 异步打开浏览器
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
} | Out-Null

# 启动开发服务器
npm run dev

Write-Host ""
Read-Host "按任意键退出"
