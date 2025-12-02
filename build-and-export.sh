#!/bin/bash

# Скрипт для сборки Docker образа и экспорта в tar файл
# Использование: ./build-and-export.sh [SITE_URL]

SITE_URL=${1:-"https://xn-----glcep7bbaf7au.xn--p1ai"}
IMAGE_NAME="gdz-frontend:latest"
OUTPUT_FILE="gdz-frontend.tar"

echo "🔨 Сборка Docker образа с URL: $SITE_URL"
docker build --build-arg NEXT_PUBLIC_SITE_URL="$SITE_URL" -t "$IMAGE_NAME" .

if [ $? -eq 0 ]; then
    echo "✅ Образ успешно собран"
    echo "💾 Сохранение образа в $OUTPUT_FILE..."
    docker save -o "$OUTPUT_FILE" "$IMAGE_NAME"
    
    if [ $? -eq 0 ]; then
        echo "✅ Образ сохранен в $OUTPUT_FILE"
        echo "📦 Сжатие архива..."
        gzip -f "$OUTPUT_FILE"
        echo "✅ Готово! Файл: ${OUTPUT_FILE}.gz"
        echo ""
        echo "Для переноса на VM выполните:"
        echo "  scp ${OUTPUT_FILE}.gz user@vm-ip:/opt/gdz-frontend/"
    else
        echo "❌ Ошибка при сохранении образа"
        exit 1
    fi
else
    echo "❌ Ошибка при сборке образа"
    exit 1
fi

