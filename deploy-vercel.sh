#!/bin/bash

# Vercel Deployment Script for Rox Nails
# This script helps deploy your application to Vercel

set -e

echo "🚀 Starting Vercel deployment for Rox Nails..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the rox-nails directory."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found. Creating from template..."
    if [ -f "production.env" ]; then
        cp production.env .env.local
        echo "📋 Created .env.local from production.env template."
        echo "⚠️  Please edit .env.local with your actual values before deploying."
        read -p "Press Enter to continue after editing .env.local..."
    else
        echo "❌ No environment template found. Please create .env.local manually."
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
pnpm run db:generate

# Build the application
echo "🔨 Building application..."
pnpm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "🎉 Deployment completed!"
echo "📊 Your application is now live on Vercel!"
echo "🔗 Check your Vercel dashboard for the deployment URL."
echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables in Vercel dashboard"
echo "2. Configure your database connection"
echo "3. Set up your custom domain (optional)"
echo "4. Test your application"
