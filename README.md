# Snow Service Management System

Система управления заявками по уборке и вывозу снега.

## Структура проекта

```
snow-service/
├── backend/          # Backend на Node.js + Express
├── frontend/         # Frontend на React
├── database/         # SQL скрипты для БД
└── docker-compose.yml
```

## Технологии

### Backend
- Node.js + Express
- PostgreSQL
- JWT для аутентификации
- bcrypt для хэширования паролей

### Frontend
- React
- React Router для навигации
- Axios для HTTP запросов

### База данных
- PostgreSQL 15
- 3 таблицы: users, organizations, requests

## Быстрый старт

### Требования
- Node.js 16+
- npm или yarn
- Docker и Docker Compose (для БД)

### 1. Запуск базы данных

```bash
# Запустить PostgreSQL в Docker
docker-compose up -d

# Проверить, что БД запустилась
docker-compose ps
```

База данных автоматически инициализируется с тестовыми данными из `database/init.sql`.

### 2. Настройка Backend

```bash
cd backend

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env

# Запустить сервер (порт 5000)
npm start

# Или в режиме разработки с автоперезагрузкой
npm run dev
```

Backend будет доступен на `http://localhost:5000`

### 3. Настройка Frontend

```bash
cd frontend

# Установить зависимости
npm install

# Создать .env файл (опционально)
cp .env.example .env

# Запустить приложение (порт 3000)
npm start
```

Frontend будет доступен на `http://localhost:3000`

## Демо учетные записи

После инициализации БД доступны следующие учетные записи:

| Email | Пароль | Роль |
|-------|--------|------|
| admin@example.com | password123 | admin |
| operator@example.com | password123 | operator |
| manager@example.com | password123 | manager |

## Структура базы данных

### Таблица users
- `id` - первичный ключ
- `email` - email пользователя (уникальный)
- `password_hash` - хэш пароля
- `role` - роль (operator, manager, admin)
- `name` - имя пользователя
- `created_at` - дата создания

### Таблица organizations
- `id` - первичный ключ
- `name` - название организации
- `city` - город
- `created_at` - дата создания

### Таблица requests
- `id` - первичный ключ
- `organization_id` - ID организации (FK)
- `city` - город
- `address` - адрес выполнения работ
- `work_type` - тип работ
- `volume` - объем работ (м³)
- `status` - статус (new, in_progress, completed, cancelled)
- `created_at` - дата создания
- `operator_id` - ID оператора (FK)

## API Endpoints

### Аутентификация
- `POST /api/auth/login` - вход в систему
- `GET /api/auth/me` - получить текущего пользователя

### Заявки
- `GET /api/requests` - получить список заявок (с фильтром ?city=)
- `GET /api/requests/cities` - получить список городов
- `POST /api/requests` - создать новую заявку
- `PUT /api/requests/:id` - обновить заявку

## Функциональность

### Страница авторизации
- Вход по email и паролю
- Автоматическое сохранение токена
- Перенаправление на страницу заявок после входа

### Страница заявок
- Просмотр всех заявок
- Фильтрация по городу
- Отображение информации:
  - Номер заявки
  - Статус (new, in_progress, completed, cancelled)
  - Организация
  - Адрес
  - Тип работ
  - Объем
  - Оператор (если назначен)
  - Дата создания

### Роли пользователей
- **operator** - может просматривать и создавать заявки
- **manager** - может просматривать, создавать и обновлять заявки
- **admin** - полный доступ ко всем функциям

## Остановка проекта

```bash
# Остановить frontend и backend
# Нажать Ctrl+C в терминалах

# Остановить базу данных
docker-compose down

# Удалить данные БД (опционально)
docker-compose down -v
```

## Разработка

### Backend
Сервер автоматически перезапускается при изменении файлов (если используется `npm run dev`).

### Frontend
React приложение автоматически перезагружается при изменении файлов.

### База данных
Для повторной инициализации БД:
```bash
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Порт 5432 уже занят
Если PostgreSQL уже установлен локально, измените порт в `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"
```
И обновите `DB_PORT` в `backend/.env`.

### Ошибка подключения к БД
Убедитесь, что PostgreSQL запущен:
```bash
docker-compose ps
```

### Frontend не может подключиться к Backend
Проверьте, что backend запущен на порту 5000 и доступен по адресу `http://localhost:5000/api/health`.