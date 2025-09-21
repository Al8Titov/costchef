#!/bin/bash

# Скрипт для деплоя приложения Recipe App

set -e

echo "🚀 Начинаем деплой Recipe App..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Пожалуйста, установите Docker."
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Пожалуйста, установите Docker Compose."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Удаляем старые образы (опционально)
echo "🧹 Очищаем старые образы..."
docker system prune -f

# Собираем новые образы
echo "🔨 Собираем новые образы..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запускаем приложение
echo "▶️ Запускаем приложение..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска сервисов
echo "⏳ Ждем запуска сервисов..."
sleep 30

# Проверяем статус сервисов
echo "📊 Проверяем статус сервисов..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем логи backend
echo "📝 Проверяем логи backend..."
docker-compose -f docker-compose.prod.yml logs backend --tail=20

echo "✅ Деплой завершен!"
echo "🌐 Приложение доступно по адресу: http://localhost"
echo "📊 API доступен по адресу: http://localhost:3001/api"
