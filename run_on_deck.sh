#!/bin/bash

# Переходим в директорию скрипта
cd "$(dirname "$0")"

echo "========================================"
echo "    CYBERMOD - STEAM DECK LOADER        "
echo "========================================"

# Проверка наличия Java
if ! command -v java &> /dev/null
then
    echo "Ошибка: Java не найдена. Пожалуйста, установите JRE 21."
    echo "Подсказка: Вы можете использовать 'flatpak install flathub org.freedesktop.Sdk.Extension.openjdk21'"
    exit 1
fi

# Запуск бэкенда
echo "// ИНИЦИАЛИЗАЦИЯ ЯДРА..."
cd backend
mvn compile exec:java -Dexec.mainClass="com.cybermod.App"
