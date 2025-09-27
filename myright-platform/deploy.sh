#!/bin/bash

# MyRight Platform Deployment Script
# Professional deployment automation for Vercel

echo "🚀 Starting MyRight Platform Deployment..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci

echo "🧪 Running tests..."
npm test tests/contract/

if [ $? -ne 0 ]; then
    echo "❌ Tests failed. Deployment aborted."
    exit 1
fi

echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Deployment aborted."
    exit 1
fi

echo "🌐 Deploying to Vercel..."
npx vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your MyRight platform is live!"
else
    echo "❌ Deployment failed. Check the logs above."
    exit 1
fi