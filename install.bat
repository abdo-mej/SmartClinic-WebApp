@echo off
title SmartClinic ClinicOS - Install
cd /d "%~dp0"
echo ============================================
echo SmartClinic ClinicOS - Installation
echo ============================================
where node >nul 2>nul || (echo ERROR: Node.js is not installed. Install it from nodejs.org & pause & exit /b 1)
where npm >nul 2>nul || (echo ERROR: npm is not available. & pause & exit /b 1)
where php >nul 2>nul || (echo WARNING: PHP not found. Backend API will not start.)
where python >nul 2>nul || (echo WARNING: Python not found. AI service will not start.)
echo.
echo Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if not exist node_modules\react (
  echo ERROR: React was not installed. Check your internet connection then run install.bat again.
  pause
  exit /b 1
)
echo.
echo Installation finished successfully.
pause
