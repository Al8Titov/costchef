# CostChef - Руководство по развертыванию

## Обзор

CostChef - это веб-приложение для управления стоимостью блюд и рецептов в ресторанном бизнесе. Приложение состоит из React frontend и Node.js backend с MongoDB базой данных.

## Архитектура

- **Frontend**: React 19 + Vite + Redux + Styled Components
- **Backend**: Node.js + Express + MongoDB + JWT
- **Database**: MongoDB Atlas
- **Deployment**: Docker + Docker Compose + Nginx

## Требования к серверу

- Ubuntu 20.04+ или аналогичная Linux система
- Минимум 2GB RAM
- 10GB свободного места на диске
- Docker и Docker Compose
- Открытые порты: 22 (SSH), 80 (HTTP), 3001 (API)

## Быстрое развертывание

### 1. Автоматическое развертывание

```bash
# Клонируйте репозиторий
git clone https://github.com/Al8Titov/costchef.git
cd costchef

# Запустите скрипт развертывания
./deploy-production.sh
```

### 2. Ручное развертывание

#### Подготовка сервера

```bash
# Подключитесь к серверу
ssh root@109.73.198.35

# Обновите систему
apt update && apt upgrade -y

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# Установите Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Настройте firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 3001/tcp
ufw --force enable
```

#### Развертывание приложения

```bash
# Создайте директорию
mkdir -p /opt/costchef
cd /opt/costchef

# Клонируйте репозиторий
git clone https://github.com/Al8Titov/costchef.git .

# Создайте .env файл
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://Buck:Trevogavjope@cluster0.ruk1ewc.mongodb.net/costchef?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=costchef_super_secret_jwt_key_2024_production
VITE_API_URL=http://109.73.198.35:3001/api
EOF

# Запустите приложение
docker-compose -f docker-compose.prod.yml up -d --build
```

## Управление приложением

### Просмотр логов

```bash
# Все сервисы
docker-compose -f docker-compose.prod.yml logs -f

# Только backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Только frontend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Перезапуск сервисов

```bash
# Перезапуск всех сервисов
docker-compose -f docker-compose.prod.yml restart

# Перезапуск только backend
docker-compose -f docker-compose.prod.yml restart backend

# Перезапуск только frontend
docker-compose -f docker-compose.prod.yml restart frontend
```

### Остановка приложения

```bash
# Остановка всех сервисов
docker-compose -f docker-compose.prod.yml down

# Остановка с удалением volumes
docker-compose -f docker-compose.prod.yml down -v
```

### Обновление приложения

```bash
# Получение последних изменений
git pull origin main

# Пересборка и перезапуск
docker-compose -f docker-compose.prod.yml up -d --build
```

## Мониторинг

### Проверка статуса

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Проверка здоровья API
curl http://109.73.198.35:3001/api/health
```

### Логи системы

```bash
# Логи Docker
journalctl -u docker.service

# Логи системы
tail -f /var/log/syslog
```

## Безопасность

### SSL сертификат (Let's Encrypt)

```bash
# Установите Certbot
apt install certbot python3-certbot-nginx -y

# Получите сертификат
certbot --nginx -d yourdomain.com

# Автоматическое обновление
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

### Резервное копирование

```bash
# Создайте скрипт резервного копирования
cat > /opt/backup-costchef.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"

mkdir -p $BACKUP_DIR

# Резервное копирование кода
tar -czf $BACKUP_DIR/costchef_code_$DATE.tar.gz /opt/costchef

# Очистка старых резервных копий (старше 30 дней)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
EOF

chmod +x /opt/backup-costchef.sh

# Добавьте в crontab (ежедневно в 2:00)
echo "0 2 * * * /opt/backup-costchef.sh" | crontab -
```

## Устранение неполадок

### Проблемы с подключением к базе данных

```bash
# Проверьте подключение к MongoDB Atlas
docker-compose -f docker-compose.prod.yml logs backend | grep -i mongo

# Проверьте переменные окружения
docker-compose -f docker-compose.prod.yml exec backend env | grep MONGO
```

### Проблемы с frontend

```bash
# Проверьте nginx конфигурацию
docker-compose -f docker-compose.prod.yml exec frontend nginx -t

# Проверьте доступность статических файлов
docker-compose -f docker-compose.prod.yml exec frontend ls -la /usr/share/nginx/html
```

### Проблемы с портами

```bash
# Проверьте открытые порты
netstat -tlnp | grep -E ':(80|3001)'

# Проверьте firewall
ufw status
```

## Контакты

- **GitHub**: https://github.com/Al8Titov/costchef
- **Автор**: CostChef Team
- **Лицензия**: MIT

## Поддержка

При возникновении проблем:

1. Проверьте логи приложения
2. Убедитесь, что все сервисы запущены
3. Проверьте подключение к базе данных
4. Создайте issue на GitHub с подробным описанием проблемы
