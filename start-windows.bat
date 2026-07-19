@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo [!] Node.js не знайдено. Спочатку встановіть його з https://nodejs.org (LTS-версія),
  echo     потім запустіть цей файл ще раз.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Встановлюю залежності ^(лише при першому запуску, потрібен інтернет^)...
  call npm install
  if errorlevel 1 (
    echo Помилка npm install. Перевірте інтернет-з'єднання.
    pause
    exit /b 1
  )
)

if not exist out (
  echo Збираю проєкт ^(лише при першому запуску^)...
  call npm run build
  if errorlevel 1 (
    echo Помилка збірки.
    pause
    exit /b 1
  )
)

echo.
echo Запускаю сайт на http://localhost:3000 ...
start "" http://localhost:3000
call npm start

pause
