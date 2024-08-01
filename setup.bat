@echo off
echo Setting up Prediction Market Aggregator...

REM Navigate to project root
cd /d "%~dp0"

REM Check for Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js v20.13.1 or later and run this script again.
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

REM Install global dependencies
echo Installing global dependencies...
call npm install -g react-native-cli@2.0.1 ts-node@10.9.2 typescript@5.5.4 yarn@1.22.22

REM Install backend dependencies
echo Setting up backend...
cd backend
call npm install
if not exist .env (
    copy .env.example .env
    echo Please update backend\.env with your configuration.
) else (
    echo Backend .env file already exists. Please ensure it's configured correctly.
)

REM Install frontend dependencies
echo Setting up frontend...
cd ..\frontend
call npm install
if not exist .env (
    copy .env.example .env
    echo Please update frontend\.env with your configuration.
) else (
    echo Frontend .env file already exists. Please ensure it's configured correctly.
)

REM Reminder about MongoDB
echo.
echo IMPORTANT: Ensure MongoDB is installed and running.
echo The database should be named "prediction_market_aggregator"
echo Refer to ENVIRONMENT_SETUP.md for detailed MongoDB setup instructions.

echo.
echo Setup complete! Please review and update the .env files in both frontend and backend directories if needed.
echo.
echo To start the servers:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: cd frontend ^&^& npm start

pause