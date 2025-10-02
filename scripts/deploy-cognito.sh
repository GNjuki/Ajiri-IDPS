#!/bin/bash

# AJIRI Cognito Deployment Script
echo "🚀 Deploying AJIRI with Cognito integration..."

# Update backend dependencies
echo "📦 Installing backend dependencies..."
cd /home/ubuntu/ajiri/ajiri-backend
npm install

# Update frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd /home/ubuntu/ajiri/ajiri-frontend
npm install

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Copy frontend build to nginx
echo "📋 Copying frontend to nginx..."
sudo cp -r dist/* /var/www/html/

# Restart backend
echo "🔄 Restarting backend..."
pm2 restart ajiri-backend

# Restart nginx
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx

echo "✅ Deployment complete!"
echo "🌐 Application available at: http://54.195.237.204"