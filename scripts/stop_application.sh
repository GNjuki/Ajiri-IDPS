#!/bin/bash

echo "Stopping application..."

# Stop PM2 processes
pm2 delete ajiri-backend || true

echo "Application stopped"