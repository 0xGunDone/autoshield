# AutoShield69

Готовый production-ready сайт на Next.js + TypeScript для центра установки охранных систем и дооснащения авто (Тверь) с админкой `/admin`.

## Стек

- Next.js (App Router)
- TypeScript
- SQLite + better-sqlite3
- JWT (HTTP-only cookie)
- bcrypt
- TailwindCSS
- Nodemailer (SMTP Яндекс)
- Zod

Без ORM, без Docker.

## Что реализовано

- Публичные страницы: `/`, `/services`, `/services/[slug]`, `/models`, `/models/[slug]`, `/pricing`, `/contacts`
- Светлый glassmorphism-дизайн (светлый градиентный фон, полупрозрачные карточки, blur)
- Админка `/admin`:
  - логин/пароль
  - разделы: настройки, контент главной, услуги, цены, отзывы, заявки
  - полный CRUD: услуги, цены, отзывы
  - CRM-режим для заявок: фильтрация по статусу, поиск, перевод в статусы `new / in_progress / closed`, экспорт CSV
- Форма записи:
  - пошаговый опрос для подбора сигнализации
  - вопросы: марка/модель/год, запуск кнопка/ключ, гарантия, функции, демонтаж старой системы, выбран вариант или нужна консультация, контакты, желаемый слот связи
  - сохранение в SQLite
  - отправка HTML-письма через SMTP Яндекс
  - отправка уведомления в Telegram Bot API (если настроены `telegram_bot_token` и `telegram_chat_id`)
  - honeypot
  - rate limit
  - серверная валидация Zod
  - sticky-кнопка «Записаться» на мобильных
  - CTA WhatsApp/Telegram рядом с формой (настраиваются в админке)
- Калькулятор стоимости на странице услуги (база + опции)
- SEO:
  - SSR
  - динамические meta title/description
  - OpenGraph
  - sitemap.xml
  - robots.txt
  - Schema.org (Organization + Service)
  - FAQ блок + микроразметка FAQPage
  - отдельные SEO-страницы моделей (`/models/[slug]`) с микроразметкой Service
  - ЧПУ URL (slug)
- Аналитика:
  - подключение Yandex Metrika по ID из админки
  - цели по шагам опроса и по успешной/неуспешной отправке анкеты
- Предзаполнение услуг/цен/контактов данными на основе `https://starline69.ru/` (с возможностью редактирования в админке)
  - WhatsApp/Telegram CTA настраиваются в `/admin/settings`
  - FAQ настраивается в `/admin/content` (JSON-массив `{question, answer}`)

## Быстрый старт

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` из примера:

```bash
cp .env.example .env
```

3. Заполнить переменные в `.env`:

```env
DATABASE_PATH=./data/site.db
JWT_SECRET=long-random-secret
ADMIN_LOGIN=admin
ADMIN_PASSWORD=admin12345
SITE_URL=http://localhost:3000
```

### Генерация JWT_SECRET

Сгенерировать криптостойкий секрет:

```bash
npm run jwt:secret
```

Вставьте полученную строку в `.env` в `JWT_SECRET`.

4. Запустить dev:

```bash
npm run dev
```

Сайт: `http://localhost:3000`  
Админка: `http://localhost:3000/admin/login`

После первого запуска добавьте услуги/цены/отзывы в админке, чтобы заполнить витрину.

## Production

```bash
npm run build
npm run start
```

## Seed admin

При первом запуске автоматически создается администратор из переменных:

- `ADMIN_LOGIN`
- `ADMIN_PASSWORD`

Если таблица `admin` уже не пуста, повторный seed не выполняется.

## SMTP Яндекс

SMTP настраивается в админке (`/admin/settings`):

- `smtp.yandex.ru`
- порт `465`
- `smtp_secure=1`
- логин/пароль ящика
- `request_email` — адрес, куда приходят заявки

## SQL инициализация

Схема находится в `data/init.sql`.  
Фактическая автоинициализация и сиды выполняются в `lib/db.ts` при первом запуске.

## Безопасность

- `bcrypt` для паролей
- JWT в `httpOnly` cookie
- middleware защита `/admin` и `/api/admin`
- Zod-валидация API
- ограничение размера запроса
- rate limit (логин и форма заявки)
- honeypot в форме
