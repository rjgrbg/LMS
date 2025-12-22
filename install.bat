@echo off
echo ========================================
echo SCOSCI1 LMS - Node.js Installation
echo ========================================
echo.

echo [1/3] Installing dependencies...
call npm install

echo.
echo [2/3] Creating required directories...
if not exist "uploads" mkdir uploads
if not exist "profile-pictures" mkdir profile-pictures

echo.
echo [3/3] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Configure .env file with your database credentials
echo 2. Import database: mysql -u root -p scosci1_lms ^< scosci1_lms.sql
echo 3. Start server: npm start
echo 4. Open browser: http://localhost:3000
echo.
echo Default admin login:
echo   Username: admin
echo   Password: admin123
echo ========================================
pause
