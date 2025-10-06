#!/bin/bash

# Quick start script for Rox Nails application
# Use this script to start the application after initial deployment

set -e

echo "🚀 Starting Rox Nails application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please run ./deploy.sh first or create .env.local manually."
    exit 1
fi

# Start the application
echo "🔄 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 5

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

# Test application health
echo "🧪 Testing application health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: https://mycustomserver.com"
    echo "📊 View logs with: docker-compose logs -f"
else
    echo "⚠️  Application may still be starting. Check logs with: docker-compose logs -f"
fi

echo "🎉 Application started!"
