@echo off
echo ========================================
echo    AIƽ̨���������� - һ������
echo ========================================
echo.

REM ����Ƿ��Ѱ�װ Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [����] δ��⵽ Node.js�����Ȱ�װ Node.js
    pause
    exit /b 1
)

echo [��Ϣ] ��⵽ Node.js
node -v
echo.

REM ========================================
REM ȫ���������ģ��
REM ========================================
echo [��Ϣ] ��ʼȫ���������...

REM 1. ��� Vite ����Ԥ��������
if exist "node_modules\.vite" (
    echo [��Ϣ] ��� Vite ��������...
    rmdir /s /q "node_modules\.vite" 2>nul
    if exist "node_modules\.vite" (
        echo [����] Vite ��������������ܲ����������ļ���ռ�ã�
    ) else (
        echo [��Ϣ] Vite �������������
    )
)

REM 2. ��� Vite ���û����ļ���ʹ�ø��ɿ��� for ѭ����
echo [��Ϣ] ��� Vite ���û���...
for %%f in (vite.config.ts.timestamp-*.mjs) do (
    del /q "%%f" 2>nul
)

REM 3. ��� esbuild ���棨������ڣ�
if exist "node_modules\.cache" (
    echo [��Ϣ] ��� esbuild ����...
    rmdir /s /q "node_modules\.cache" 2>nul
)

REM 4. ��� TypeScript ���뻺��
if exist "node_modules\.tsbuildinfo" (
    echo [��Ϣ] ��� TypeScript ���뻺��...
    del /q "node_modules\.tsbuildinfo" 2>nul
)

REM 5. �����Ŀ��Ŀ¼�¿��ܴ��ڵ� .vite ����
if exist ".vite" (
    echo [��Ϣ] �����Ŀ��Ŀ¼ Vite ����...
    rmdir /s /q ".vite" 2>nul
)

echo [��Ϣ] ����������
echo.

REM ========================================
REM �������Ͱ�װ
REM ========================================
if not exist "node_modules" (
    echo [��Ϣ] ���ڰ�װ����...
    call npm install
    if %errorlevel% neq 0 (
        echo [����] ������װʧ��
        pause
        exit /b 1
    )
    echo.
)

REM ========================================
REM ��������������
REM ========================================
echo [��Ϣ] ������������������...
echo.
echo ========================================
echo    �������������Զ��������
echo    ���ʵ�ַ: http://localhost:5273
echo    ��ʾ: ����ģʽ�ѽ��� Service Worker ����
echo ========================================
echo.

REM ���� Vite �������������첽�������
start "" cmd /c "timeout /t 3 >nul && start http://localhost:5273"
call npm run dev

pause
