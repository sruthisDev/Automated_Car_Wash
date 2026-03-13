@echo off
title LuxeWash Dev Launcher
echo.
echo  =========================================
echo   LuxeWash - Starting Development Servers
echo  =========================================
echo.

set ROOT=C:\Masters\repo\Automated_Car_Wash

echo [1/2] Starting Backend (FastAPI)...
start "LuxeWash Backend" cmd /k "cd /d %ROOT%\backend && venv\Scripts\activate && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (Vite)...
start "LuxeWash Frontend" cmd /k "cd /d %ROOT%\frontend && npm run dev"

echo.
echo  Both servers are starting in separate windows.
echo  Backend  -> http://localhost:8000
echo  Frontend -> http://localhost:5173
echo  API Docs -> http://localhost:8000/docs
echo.
timeout /t 5 /nobreak >nul
start http://localhost:5173
