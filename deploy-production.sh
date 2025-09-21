#!/bin/bash

# CostChef Production Deployment Script
# Сервер: 109.73.198.35

echo "🚀 Starting CostChef production deployment..."

# Настройки
SERVER_IP="109.73.198.35"
SERVER_USER="root"
APP_NAME="costchef"
DEPLOY_DIR="/opt/costchef"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Проверка подключения к серверу
log "Checking server connection..."
ssh -o ConnectTimeout=10 ${SERVER_USER}@${SERVER_IP} "echo 'Server connection successful'" || error "Cannot connect to server ${SERVER_IP}"

# Создание директории на сервере
log "Creating deployment directory..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${DEPLOY_DIR}"

# Копирование файлов на сервер
log "Copying files to server..."
scp -r . ${SERVER_USER}@${SERVER_IP}:${DEPLOY_DIR}/

# Установка Docker и Docker Compose на сервере
log "Installing Docker and Docker Compose..."
ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
    # Обновление системы
    apt update
    
    # Установка Docker
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        systemctl start docker
        systemctl enable docker
    fi
    
    # Установка Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi
    
    # Добавление пользователя в группу docker
    usermod -aG docker $USER
EOF

# Создание .env файла на сервере
log "Creating production environment file..."
ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
    cat > /opt/costchef/.env << 'ENV_EOF'
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://Buck:Trevogavjope@cluster0.ruk1ewc.mongodb.net/costchef?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=costchef_super_secret_jwt_key_2024_production
VITE_API_URL=http://109.73.198.35:3001/api
ENV_EOF
EOF

# Сборка и запуск контейнеров
log "Building and starting containers..."
ssh ${SERVER_USER}@${SERVER_IP} << EOF
    cd ${DEPLOY_DIR}
    
    # Остановка существующих контейнеров
    docker-compose -f docker-compose.prod.yml down || true
    
    # Сборка новых образов
    docker-compose -f docker-compose.prod.yml build --no-cache
    
    # Запуск контейнеров
    docker-compose -f docker-compose.prod.yml up -d
    
    # Проверка статуса
    docker-compose -f docker-compose.prod.yml ps
EOF

# Настройка firewall
log "Configuring firewall..."
ssh ${SERVER_USER}@${SERVER_IP} << 'EOF'
    # Разрешение портов
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 3001/tcp  # API
    ufw --force enable
EOF

# Проверка развертывания
log "Checking deployment..."
sleep 10

# Проверка API
if curl -f http://${SERVER_IP}:3001/api/health; then
    log "✅ API is running successfully"
else
    error "❌ API health check failed"
fi

# Проверка Frontend
if curl -f http://${SERVER_IP}/; then
    log "✅ Frontend is running successfully"
else
    error "❌ Frontend health check failed"
fi

log "🎉 Deployment completed successfully!"
log "🌐 Application URLs:"
log "   Frontend: http://${SERVER_IP}/"
log "   API: http://${SERVER_IP}:3001/api"
log "   Health Check: http://${SERVER_IP}:3001/api/health"

log "📋 Useful commands for server management:"
log "   View logs: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose -f docker-compose.prod.yml logs -f'"
log "   Restart: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose -f docker-compose.prod.yml restart'"
log "   Stop: ssh ${SERVER_USER}@${SERVER_IP} 'cd ${DEPLOY_DIR} && docker-compose -f docker-compose.prod.yml down'"
log "   Update: Run this script again"
