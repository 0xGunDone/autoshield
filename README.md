# AutoShield69

Готовый production-ready сайт на Next.js + TypeScript для центра установки охранных систем и дооснащения авто (Тверь) с админкой `/admin`.

## Стек

- Next.js (App Router)
- TypeScript
- SQLite (встроенный `node:sqlite`, без нативной сборки)
- JWT (HTTP-only cookie)
- bcrypt
- TailwindCSS
- Nodemailer (SMTP Яндекс)
- Zod

Без ORM, без Docker.

Требование к Node.js: `>=22` (рекомендовано `24.x`).

## Что реализовано

- Публичные страницы: `/`, `/quiz`, `/services`, `/services/[slug]`, `/models`, `/models/[slug]`, `/cars`, `/cars/[brand]/[model]`, `/pricing`, `/contacts`
- Светлый glassmorphism-дизайн (светлый градиентный фон, полупрозрачные карточки, blur)
- Оптимизация изображений через `next/image` с форматами AVIF/WebP
- Админка `/admin`:
  - логин/пароль
  - разделы: настройки, контент главной, услуги, цены, отзывы, заявки
  - полный CRUD: услуги, цены, отзывы
  - CRM-режим для заявок: фильтрация по статусу/тегам, поиск, перевод в статусы `new / in_progress / closed`, экспорт CSV
  - теги заявок: гарантия, автозапуск, консультация, SLA>15 минут
  - быстрые действия по заявке: шаблон WhatsApp / Telegram / скрипт звонка (настраиваются в админке)
- Форма записи:
  - пошаговый опрос для подбора сигнализации
  - вопросы: марка/модель/год, запуск кнопка/ключ, гарантия, функции, демонтаж старой системы, выбран вариант или нужна консультация, контакты, желаемый слот связи
  - отдельная страница опроса `/quiz`
  - автосохранение ответов в `localStorage`
  - сохранение в SQLite
  - отправка HTML-письма через SMTP Яндекс
  - отправка уведомления в Telegram Bot API (если настроены `telegram_bot_token` и `telegram_chat_id`)
  - honeypot
  - rate limit
  - серверная валидация Zod
  - мобильный sticky-bar с 2 CTA: «Позвонить» и «Записаться»
  - CTA WhatsApp/Telegram рядом с формой (настраиваются в админке)
- Калькулятор стоимости на странице услуги (база + опции)
- SEO:
  - SSR
  - динамические meta title/description
  - canonical + hreflang (`ru-RU`)
  - OpenGraph
  - sitemap.xml
  - robots.txt
  - Schema.org (Organization + LocalBusiness + AutoRepair + Service)
  - FAQ блок + микроразметка FAQPage
  - отдельные SEO-страницы моделей (`/models/[slug]`) с микроразметкой Service
  - SEO-страницы по марке/модели авто (`/cars/[brand]/[model]`)
  - ЧПУ URL (slug)
- Аналитика:
  - подключение Yandex Metrika по ID из админки
  - цели по шагам опроса и по успешной/неуспешной отправке анкеты
  - цели по кликам на телефон и mobile sticky CTA
- Надёжность:
  - централизованное логирование ошибок API (`data/api-errors.log`)
  - внутренний SLA endpoint `/api/internal/sla` для Telegram-алертов по новым заявкам старше 15 минут
- Предзаполнение услуг и цен на основе `https://starline69.ru/` (с возможностью редактирования в админке)
  - контакты по умолчанию нейтральные (без копирования чужого адреса/телефона)
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
PORT=3000
INTERNAL_CRON_SECRET=long-random-cron-token
ERROR_LOG_PATH=./data/api-errors.log
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

Порт задается через `PORT` или флаг `-p`:

```bash
PORT=3011 npm run start
```

### SLA cron (опционально)

Пример вызова каждые 5 минут:

```bash
*/5 * * * * curl -fsS -X POST "https://your-domain/api/internal/sla?token=INTERNAL_CRON_SECRET" >/dev/null
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
- robots: закрыты `/admin`, `/api/admin`, `/api/internal`
- Zod-валидация API
- ограничение размера запроса
- rate limit (логин и форма заявки)
- honeypot в форме
