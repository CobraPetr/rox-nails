#!/bin/bash

# Deployment script for Rox Nails application
# Run this script on your server to deploy the application

set -e

echo "🚀 Starting deployment of Rox Nails application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ssl
mkdir -p logs

# Check if SSL certificates exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/private.key" ]; then
    echo "⚠️  SSL certificates not found. Creating self-signed certificates for development..."
    echo "🔒 For production, replace these with real SSL certificates."
    
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/private.key \
        -out ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=mycustomserver.com"
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📋 Creating .env.local from production template..."
    cp production.env .env.local
    echo "⚠️  Please edit .env.local with your actual production values before starting the application."
fi

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose pull

# Build the application
echo "🔨 Building the application..."
docker-compose build --no-cache

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the application
echo "🚀 Starting the application..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose exec app npx prisma migrate deploy

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Test the application
echo "🧪 Testing application health..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: https://mycustomserver.com"
else
    echo "❌ Application health check failed. Check the logs:"
    docker-compose logs app
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "📊 View logs with: docker-compose logs -f"
echo "🛑 Stop application with: docker-compose down"
