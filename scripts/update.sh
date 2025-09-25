#!/bin/bash

# AJIRI Update Script - Pull latest changes from GitHub
set -e

echo "🔄 Updating AJIRI from GitHub..."

# Navigate to project directory
cd /home/ubuntu/ajiri

# Pull latest changes
git pull origin main

# Update backend
echo "📦 Updating backend..."
cd ajiri-backend
npm install --production

# Restart backend service
pm2 restart ajiri-backend

# Update frontend
echo "🎨 Updating frontend..."
cd ../ajiri-frontend
npm install
npm run build

# Update nginx files
sudo cp -r dist/* /var/www/html/

# Reload nginx
sudo systemctl reload nginx

echo "✅ Update complete!"
echo "🌐 Changes are now live"