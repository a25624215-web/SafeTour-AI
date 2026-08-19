@echo off
title SafeTour AI - Startup
color 0A

echo.
echo  ============================================
echo    SAFETOUR AI - Starting All Services...
echo  ============================================
echo.

:: Add Node.js to PATH if not already there
SET PATH=%PATH%;C:\Program Files\nodejs

:: Set PowerShell execution policy fix
powershell -Command "Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force" >nul 2>&1

:: Check Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found! Please install Python from https://python.org
    pause
    exit /b
)

:: Check Node
node --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found! Please install from https://nodejs.org
    pause
    exit /b
)

echo [1/4] Installing Python packages...
pip install fastapi uvicorn sqlalchemy passlib bcrypt requests python-multipart -q

echo [2/4] Installing Frontend packages...
cd frontend
call npm install --silent
cd ..

echo [3/4] Starting Backend Server (port 8000)...
start "SafeTour-AI Backend" cmd /k "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

:: Wait for backend to start
timeout /t 4 /nobreak >nul

echo [4/4] Starting Frontend Server (port 5173)...
start "SafeTour-AI Frontend" cmd /k "cd frontend && npm run dev"

:: Wait for frontend to start
timeout /t 4 /nobreak >nul

echo.
echo  ============================================
echo   ALL SERVICES RUNNING!
echo  --------------------------------------------
echo   Frontend : http://localhost:5173/SafeTour-AI/
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo  ============================================
echo.

:: Open browser automatically
start "" "http://localhost:5173/SafeTour-AI/"

echo  Press any key to EXIT all services...
pause >nul

:: Kill all servers when user presses key
taskkill /FI "WINDOWTITLE eq SafeTour-AI Backend*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SafeTour-AI Frontend*" /F >nul 2>&1
echo  Servers stopped. Goodbye!
