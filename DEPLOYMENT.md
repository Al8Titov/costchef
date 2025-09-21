# Recipe App - Инструкции по деплою

## 🚀 Быстрый старт

### Предварительные требования

- Docker (версия 20.10+)
- Docker Compose (версия 2.0+)
- Git

### Установка и запуск

1. **Клонируйте репозиторий:**
```bash
git clone <repository-url>
cd recipe-app
```

2. **Настройте переменные окружения:**
```bash
cp env.example .env
# Отредактируйте .env файл под ваши нужды
```

3. **Запустите приложение:**
```bash
# Для разработки
docker-compose up -d

# Для production
./deploy.sh
```

## 📋 Структура проекта

```
recipe-app/
├── backend/                 # Backend API (Node.js + Express + MongoDB)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── server.js
│   ├── models/
│   ├── routes/
│   └── middleware/
├── frontend/               # Frontend (React + Vite)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── docker-compose.yml      # Development
├── docker-compose.prod.yml # Production
├── deploy.sh              # Скрипт деплоя
└── env.example            # Пример переменных окружения
```

## 🐳 Docker контейнеры

### Backend
- **Образ:** `recipe-app-backend`
- **Порт:** 3001
- **Технологии:** Node.js 18, Express.js, MongoDB
- **Health check:** `GET /api/health`

### Frontend
- **Образ:** `recipe-app-frontend`
- **Порт:** 80
- **Технологии:** React, Vite, Nginx
- **Статические файлы:** `/usr/share/nginx/html`

### MongoDB
- **Образ:** `mongo:7.0`
- **Порт:** 27017 (только в development)
- **База данных:** `recipe_app`
- **Пользователь:** `recipe_app_user`

## 🔧 Переменные окружения

### Backend
- `NODE_ENV` - Окружение (development/production)
- `PORT` - Порт сервера (по умолчанию: 3001)
- `MONGO_URI` - URI подключения к MongoDB
- `JWT_SECRET` - Секретный ключ для JWT токенов

### Frontend
- `REACT_APP_API_URL` - URL API backend

### MongoDB
- `MONGO_ROOT_USERNAME` - Имя root пользователя
- `MONGO_ROOT_PASSWORD` - Пароль root пользователя
- `MONGO_DATABASE` - Имя базы данных

## 🚀 Команды деплоя

### Development
```bash
# Запуск в режиме разработки
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### Production
```bash
# Автоматический деплой
./deploy.sh

# Ручной деплой
docker-compose -f docker-compose.prod.yml up -d

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Остановка
docker-compose -f docker-compose.prod.yml down
```

## 📊 Мониторинг

### Проверка статуса сервисов
```bash
docker-compose ps
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Health checks
```bash
# Backend API
curl http://localhost:3001/api/health

# Frontend
curl http://localhost
```

## 🔒 Безопасность

### Production настройки
1. **Измените JWT секрет:**
```bash
JWT_SECRET=your-very-secure-secret-key-here
```

2. **Настройте MongoDB пароли:**
```bash
MONGO_ROOT_PASSWORD=strong-password-here
```

3. **Настройте SSL (опционально):**
- Поместите SSL сертификаты в `nginx/ssl/`
- Обновите `nginx/nginx.conf`

### Рекомендации
- Используйте HTTPS в production
- Настройте firewall
- Регулярно обновляйте зависимости
- Мониторьте логи на предмет подозрительной активности

## 🐛 Troubleshooting

### Проблемы с MongoDB
```bash
# Проверка подключения
docker-compose exec mongodb mongosh --eval "db.adminCommand('ismaster')"

# Сброс данных (ОСТОРОЖНО!)
docker-compose down -v
docker volume rm recipe-app_mongodb_data
```

### Проблемы с Backend
```bash
# Проверка логов
docker-compose logs backend

# Перезапуск backend
docker-compose restart backend
```

### Проблемы с Frontend
```bash
# Проверка nginx конфигурации
docker-compose exec frontend nginx -t

# Перезапуск frontend
docker-compose restart frontend
```

## 📈 Масштабирование

### Горизонтальное масштабирование
```bash
# Увеличить количество backend инстансов
docker-compose up -d --scale backend=3
```

### Load Balancer
Для production рекомендуется использовать внешний load balancer (например, nginx, HAProxy).

## 🔄 Обновление

### Обновление кода
```bash
git pull origin main
./deploy.sh
```

### Обновление зависимостей
```bash
# Backend
docker-compose exec backend npm update

# Frontend
docker-compose exec frontend npm update
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs -f`
2. Проверьте статус сервисов: `docker-compose ps`
3. Проверьте переменные окружения
4. Убедитесь, что порты не заняты другими приложениями

---

**Приложение готово к деплою! 🎉**
