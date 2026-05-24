@echo off
setlocal

REM ========================================
REM Initialize Midwest Shipment Database
REM ========================================

pushd "%~dp0"

echo.
echo Initializing MySQL Database for Midwest Shipment...
echo.
echo This script will:
echo   1. Create the midwest_shipment database
echo   2. Create all necessary tables
echo   3. Insert default admin user
echo.
echo Prerequisites:
echo   - MySQL Server must be running
echo   - MySQL root user should have no password (or update the script)
echo.

node -e "const { initializeDatabase, testConnection } = require('./backend/config/database'); (async () => { await initializeDatabase(); await testConnection(); process.exit(0); })().catch(err => { console.error(err); process.exit(1); });"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Database initialized successfully!
    echo.
    echo Default Admin Credentials:
    echo   Email:    admin@midwestshipment.com
    echo   Password: Admin@123456
    echo.
) else (
    echo.
    echo ❌ Database initialization failed!
    echo   Make sure MySQL is running and accessible.
    echo   Check the Node error output above for details.
    echo.
)

popd
if /i "%~1"=="--pause" pause
endlocal
