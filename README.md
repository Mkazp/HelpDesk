# Реестр обращений граждан

Корпоративный starter на React + TypeScript + Vite для системы учёта граждан и обращений.

## Стек

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- TanStack Table
- Zustand
- React Hook Form
- Zod
- Recharts
- MSW
- CSS Modules

## Запуск

```bash
npm install
npm run dev
```

## Что входит

- Панель управления с KPI-карточками и графиками
- Реестр граждан с поиском, фильтрами, сортировкой и пагинацией
- Страница детальной карточки гражданина с вкладками и модальными окнами
- Мок API через MSW с данными в памяти
- Общий UI-kit и архитектура в стиле feature-sliced

## Архитектура

- Слой данных вынесен в `src/shared/api` и `src/mocks`
- UI работает только через типизированные HTTP-функции и React Query
- Переиспользуемые компоненты собраны в `shared/ui`
- Page/Widget/Feature/Entity-слои позволяют расширять проект без переписывания каркаса

Dev: Михаил Кацпшак
