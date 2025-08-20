@echo off
echo Starting Loan Management Application...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server-pg.js"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3002
echo Frontend: http://localhost:3000
echo.
pause
