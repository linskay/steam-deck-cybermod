# CyberMod — Standalone Plugin Manager for Steam Deck

CyberMod — это мощное автономное приложение для Steam Deck, выполненное в эстетике Cyberpunk 2077. Оно позволяет управлять кастомными модификациями и оригинальными плагинами Decky Loader через единый футуристичный интерфейс.

## Основные возможности
- 🌌 **Cyberpunk UI**: Полностью кастомный интерфейс на React с использованием Tailwind и Framer Motion.
- 🎮 **Steam Deck Optimized**: Навигация адаптирована под геймпад (D-pad/стики) через Gamepad API.
- ⚡ **Java 21 Power**: Высокопроизводительный бэкенд на Java 21 с использованием Virtual Threads.
- 🛠 **Hybrid Catalog**: Поддержка собственных плагинов и интеграция с оригинальным каталогом Decky.
- 📦 **ZIP Installer**: Простая установка плагинов из локальных архивов.

## Структура проекта
- `/backend`: Логика на Java 21, API-сервер на Javalin.
- `/frontend`: Интерфейс на React + Vite + Tailwind.
- `/catalog`: Локальные манифесты и метаданные.

## Быстрый старт

### Требования
- JDK 21
- Node.js 18+

### Запуск в режиме разработки

1. **Запуск Backend**:
   ```bash
   cd backend
   mvn compile exec:java -Dexec.mainClass="com.cybermod.App"
   ```
   *Сервер будет доступен на порту 7070.*

2. **Запуск Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Интерфейс откроется в браузере (обычно порт 5173).*

### Сборка для Steam Deck
Для создания единого исполняемого пакета соберите фронтенд и упакуйте его в ресурсы бэкенда:
1. `cd frontend && npm run build`
2. `cp -r frontend/dist/* backend/src/main/resources/public/`
3. `cd backend && mvn package`

## Дизайн
Приложение использует цветовую палитру:
- **Neon Cyan**: `#00fbff` (основной)
- **Magenta**: `#ff003c` (акценты/ошибки)
- **Electric Yellow**: `#fcee0a` (важная инфо)
- **Cyber Black**: `#0d0d0d` (фон)

---
Разработано специально для использования в Game Mode на Steam Deck.
