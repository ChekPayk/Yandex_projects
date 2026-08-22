# SkillSwap

Платформа обмена навыками.

## Описание

Веб-приложение, где пользователи могут находить друг друга и обмениваться навыками: просматривать каталог, добавлять навыки в избранное, создавать собственные предложения и запросы, вести профиль.

## Стек

- React
- TypeScript
- Redux Toolkit
- React Router
- react-hook-form, yup
- Vite
- Storybook
- Vitest

## Архитектура

Проект построен по методологии Feature-Sliced Design:

- `app` — провайдеры, глобальные стили
- `pages` — страницы приложения
- `features` — фичи: авторизация, навыки, избранное, запросы
- `entities` — доменные модели: Skill, User, Request
- `widgets` — составные блоки интерфейса
- `shared` — переиспользуемые хуки, типы, UI-компоненты
- `store` — Redux store и типизированные хуки

## Запуск

```bash
npm install
npm run dev
```

## Скрипты

| Скрипт | Что делает |
|--------|------------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run lint` | Проверка ESLint + Stylelint |
| `npm run test` | Запуск тестов (Vitest) |
| `npm run storybook` | Запуск Storybook |
