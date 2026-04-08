@echo off
echo Installing the necessary components to run the tests
echo.

echo 1. Checking availability Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js not found. Please install Node.js с https://nodejs.org/
    pause
    exit /b 1
) else (
    echo Node.js Install
    node --version
)

echo.
echo 2. Installing project dependencies
npm install
if %errorlevel% neq 0 (
    echo Ошибка при установке зависимостей
    pause
    exit /b 1
)

echo.
echo 3. Installing the Playwright browser drivers
npx playwright install
if %errorlevel% neq 0 (
    echo Ошибка при установке браузерных драйверов
    pause
    exit /b 1
)

echo.
echo УThe installation has been completed successfully!
echo Для запуска тестов используйте команду: npx playwright test
pause