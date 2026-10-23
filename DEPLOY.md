# Vercel

Проект публикуется целиком: статический Vite frontend и три Node.js Functions в `api/`.

## Через GitHub

1. Загрузите содержимое папки `dashboard` в репозиторий, включая `api/`, `server/`, `mock/seed.json`, `package-lock.json` и `vercel.json`. Не загружайте node_modules, dist, .env, .vercel или mock/db.json.
2. В Vercel выберите Add New → Project → Import Git Repository.
3. Root Directory — папка с package.json и vercel.json. Если загрузили содержимое dashboard в корень репозитория, оставьте корень; если загрузили весь текущий workspace — выберите `outputs/dashboard`.
4. Framework — Vite, Build Command — `npm run build`, Output Directory — `dist`, Install Command — `npm ci`.
5. Добавьте серверную переменную `AUTH_SECRET` в Production и Preview: случайная строка не короче 32 символов. Генерация: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Не добавляйте префикс VITE_ и не коммитьте значение.
6. `VITE_AUTH_API` можно не задавать: по умолчанию используется `/api` на том же домене. Удалите старое значение с localhost, если оно было настроено.
7. Deploy. После изменения переменных выполните Redeploy.

## Проверка после публикации

- Открыть напрямую `/login`, `/rates`, `/cards`: страницы должны загружаться и после обновления.
- Без входа `/rates` и `/cards` перенаправляют на вход.
- Вход: `demo@example.com` / `demo123`; после обновления страницы сессия сохраняется.
- Logout возвращает на вход; повторный переход на защищённый маршрут требует авторизации.
- Выбор валюты загружает историю; создание карточки показывает alert с данными.

## Два режима mock API

`npm run dev`: локальный json-server и файловая база `mock/db.json`, как прежде.

Vercel: `api/login.js`, `api/me.js`, `api/logout.js` используют общий модуль `server/demo-auth.js` и тестового пользователя из seed. Записи на диск нет; сервер проверяет HMAC-подпись токена со сроком 1 час и совпадение с Secure HttpOnly SameSite-cookie. `AUTH_SECRET` должен быть одинаковым для всех Functions одного окружения.

Logout удаляет cookie в текущем браузере и токен из localStorage. Общего хранилища отозванных сессий нет: ранее скопированная пара token+cookie остаётся действительной до истечения часа. Это mock для тестового задания; для настоящих пользователей нужна полноценная авторизация с хранилищем сессий. После ротации AUTH_SECRET прежние подписи перестают проходить проверку.

Локальная статическая команда `npm run preview` не запускает Vercel Functions. Для полного локального режима используйте `npm run dev`. Открытый Frankfurter API вызывается браузером и не требует ключа.

## Опубликованная версия

Production: https://exchange-dashboard-react-ts.vercel.app

Проект Vercel: exchange-dashboard-react-ts. AUTH_SECRET настроен в Production и Preview. Публикация выполнена через CLI; GitHub-репозиторий пока не подключён. Для повторной публикации из этой папки: `npx vercel deploy --prod`.
