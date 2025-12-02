#!/bin/bash

# Скрипт для загрузки Docker образа и запуска контейнера на VM
# Использование: ./load-and-run.sh [TAR_FILE]

TAR_FILE=${1:-"gdz-frontend.tar"}
IMAGE_NAME="gdz-frontend:latest"
CONTAINER_NAME="gdz-frontend"
SITE_URL="https://xn-----glcep7bbaf7au.xn--p1ai"
PORT="3002"

# Распаковка если сжат
if [ -f "${TAR_FILE}.gz" ]; then
    echo "📦 Распаковка ${TAR_FILE}.gz..."
    gunzip -f "${TAR_FILE}.gz"
fi

if [ ! -f "$TAR_FILE" ]; then
    echo "❌ Файл $TAR_FILE не найден"
    exit 1
fi

echo "📥 Загрузка образа из $TAR_FILE..."
sudo docker load -i "$TAR_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Образ успешно загружен"
    
    # Остановка и удаление старого контейнера
    echo "🛑 Остановка старого контейнера..."
    sudo docker stop "$CONTAINER_NAME" 2>/dev/null
    sudo docker rm "$CONTAINER_NAME" 2>/dev/null
    
    # Запуск нового контейнера
    echo "🚀 Запуск нового контейнера..."
    sudo docker run -d \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        -p "127.0.0.1:${PORT}:${PORT}" \
        -e "NEXT_PUBLIC_SITE_URL=$SITE_URL" \
        "$IMAGE_NAME"
    
    if [ $? -eq 0 ]; then
        echo "✅ Контейнер успешно запущен"
        echo ""
        echo "Проверка статуса:"
        sudo docker ps | grep "$CONTAINER_NAME"
        echo ""
        echo "Просмотр логов:"
        echo "  sudo docker logs $CONTAINER_NAME"
    else
        echo "❌ Ошибка при запуске контейнера"
        exit 1
    fi
else
    echo "❌ Ошибка при загрузке образа"
    exit 1
fi

