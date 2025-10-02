#!/bin/bash
set -e

echo "Installing dependencies..."

# Navigate to application directory
cd /home/ubuntu/ajiri

# Install backend dependencies
echo "Installing backend dependencies..."
cd ajiri-backend
npm install --production

# Install frontend dependencies and build
echo "Installing frontend dependencies..."
cd ../ajiri-frontend
npm install
npm run build

# Copy built frontend to nginx directory
echo "Copying frontend build to nginx..."
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

echo "Dependencies installed successfully"