#!/bin/bash
set -e

echo "Starting application..."

# Navigate to backend directory
cd /home/ubuntu/ajiri/ajiri-backend

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please update .env file with production values"
fi

# Start backend with PM2
echo "Starting backend with PM2..."
pm2 delete ajiri-backend || true
pm2 start server.js --name ajiri-backend

# Restart nginx
echo "Restarting nginx..."
sudo systemctl restart nginx

# Save PM2 configuration
pm2 save
pm2 startup

echo "Application started successfully"