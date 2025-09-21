# CostChef - Food Cost Management Application

Приложение для управления стоимостью блюд и рецептов в ресторанном бизнесе.

## Описание

CostChef - это веб-приложение, которое помогает рестораторам и поварам:
- Управлять ингредиентами и их стоимостью
- Создавать рецепты с точным расчетом себестоимости
- Отслеживать изменения цен на продукты
- Анализировать рентабельность блюд

## Технологии

### Frontend
- React 19
- Redux Toolkit
- React Router
- Styled Components
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs

### DevOps
- Docker & Docker Compose
- MongoDB Atlas
- Nginx

## Структура проекта

```
costchef/
├── frontend/          # React приложение
├── backend/           # Node.js API
├── docker-compose.yml # Docker конфигурация
├── package.json       # Корневые скрипты
└── README.md
```

## Быстрый старт

### Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/Al8Titov/costchef.git
cd costchef
```

2. Установите зависимости:
```bash
npm run install:all
```

3. Запустите в режиме разработки:
```bash
npm run dev
```

Приложение будет доступно по адресам:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Docker

1. Соберите и запустите контейнеры:
```bash
npm run docker:build
npm run docker:up
```

2. Приложение будет доступно по адресу: http://localhost

## API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получение информации о текущем пользователе

### Продукты
- `GET /api/products` - Получение списка продуктов
- `POST /api/products` - Создание нового продукта
- `PUT /api/products/:id` - Обновление продукта
- `DELETE /api/products/:id` - Удаление продукта

### Блюда
- `GET /api/dishes` - Получение списка блюд
- `POST /api/dishes` - Создание нового блюда
- `PUT /api/dishes/:id` - Обновление блюда
- `DELETE /api/dishes/:id` - Удаление блюда

## Переменные окружения

Создайте файл `.env` в папке `backend/`:

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb+srv://Buck:<password>@cluster0.ruk1ewc.mongodb.net/costchef
JWT_SECRET=your_jwt_secret_key_here
```

## Развертывание

### Production с Docker

1. Настройте переменные окружения в `docker-compose.prod.yml`
2. Запустите:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Ручное развертывание

1. Соберите frontend:
```bash
npm run build:frontend
```

2. Запустите backend:
```bash
npm run start:backend
```

## Авторы

- CostChef Team

## Лицензия

MIT License