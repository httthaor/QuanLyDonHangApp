@echo off
title Mini App Launcher
echo ======================================================
echo       DANG KHOI DONG HE THONG BAN HANG...
echo ======================================================

:: 1. Chạy Backend (Cửa sổ thu nhỏ)
echo [1/3] Dang bat Backend (Port 8080)...
start "Backend Server" /min cmd /k "cd Backend && npm run dev"

:: 2. Chạy Frontend (Cửa sổ thu nhỏ)
echo [2/3] Dang bat Frontend (Port 5173)...
start "Frontend App" /min cmd /k "cd frontend && npm run dev"

:: 3. Đợi 5 giây cho server lên sóng rồi mở Web
echo [3/3] Mo trinh duyet...
timeout /t 5 >nul
start http://localhost:5173

echo.
echo ======================================================
echo    THANH CONG!
echo ======================================================
pause