#!/bin/bash
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo
  echo "[!] Node.js не знайдено. Встановіть його з https://nodejs.org (LTS-версія),"
  echo "    потім запустіть цей файл ще раз."
  echo
  read -p "Натисніть Enter, щоб закрити..."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Встановлюю залежності (лише при першому запуску, потрібен інтернет)..."
  npm install || { echo "Помилка npm install."; read -p "Enter, щоб закрити..."; exit 1; }
fi

if [ ! -d out ]; then
  echo "Збираю проєкт (лише при першому запуску)..."
  npm run build || { echo "Помилка збірки."; read -p "Enter, щоб закрити..."; exit 1; }
fi

echo
echo "Запускаю сайт на http://localhost:3000 ..."
( sleep 2 && open http://localhost:3000 ) &
npm start
