@echo off
title SmartClinic ClinicOS - Start All
cd /d "%~dp0"
echo Starting SmartClinic services...
if exist backend\index.php (
  start "SmartClinic Backend API :8000" cmd /k "cd /d %~dp0backend && php -S 127.0.0.1:8000 index.php"
) else (
  echo Backend folder missing.
)
if exist ai_service\app.py (
  start "SmartClinic Python AI :5001" cmd /k "cd /d %~dp0ai_service && python app.py"
) else (
  echo AI folder missing.
)
if exist frontend\package.json (
  start "SmartClinic Frontend :5173" cmd /k "cd /d %~dp0frontend && if not exist node_modules call npm install && call npx vite --host 127.0.0.1 --port 5173"
) else (
  echo Frontend folder missing.
)
echo.
echo Open: http://127.0.0.1:5173
echo Login: admin@smartclinic.test / password
pause
