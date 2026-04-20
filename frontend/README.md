# CyberMod — Theme System Guide

CyberMod поддерживает 5 игровых вселенных.  
Переключение в **Настройки → Оболочка интерфейса**.

## Архитектура тем

| Слой | Что меняет | Где |
|---|---|---|
| **A — Semantic Core** | Метки навигации, кнопки, заголовки | Всегда фиксированы в компонентах |
| **B — Theme Tokens** | Цвета, шрифт, анимация | `themes/<name>/style.css` |
| **C — Flavor Pack** | Хинты меню, телеметрия header | `themes/themeConfig.ts` |

## Как добавить тему

1. Создать `src/themes/MyTheme/style.css` — все правила под `.theme-mytheme`
2. Добавить запись в `src/themes/themeConfig.ts` (тип `ThemeConfig`)
3. Добавить импорт в `index.css`
4. Добавить `id` в тип `ThemeId`

## Правила именования

- CSS класс темы: `.theme-{id}` (нижний регистр, без спецсимволов)
- Все CSS-правила темы **только** под `.theme-{id} .selector`
- Никаких глобальных overrides, `!important`, `* { ... }`
- Motion только через `--motion-speed` и `--motion-ease` из токенов

## Motion профили

| Тема | Speed | Ease |
|---|---|---|
| Cyberpunk | 180ms | cubic-bezier sharp |
| Stalker | 140ms | steps(2) |
| DOOM | 80ms | steps(1) |
| Portal | 280ms | smooth ease |
| Dead Space | 340ms | holographic float |

## Разработка

```bash
cd frontend
npm install
npm run dev
```
