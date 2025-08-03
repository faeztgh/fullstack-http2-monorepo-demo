@echo off
echo 🚀 Setting up HTTP/2 Demo Project with pnpm...

REM Install all dependencies
echo 📦 Installing all dependencies...
call pnpm install

REM Build server
echo 🔨 Building server...
call pnpm build:server

echo ✅ Setup complete!
echo.
echo To start both applications:
echo pnpm dev
echo.
echo Or start individually:
echo 1. Server: pnpm dev:server
echo 2. Frontend: pnpm dev:front
echo.
echo Access the application:
echo - Frontend: http://localhost:3000
echo - API Server: https://localhost:3001
pause 