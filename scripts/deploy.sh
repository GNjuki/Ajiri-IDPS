#!/bin/bash

# AJIRI EC2 Deployment Script
set -e

echo "🚀 Starting AJIRI deployment on EC2..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install global packages
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Clone repository to /home/ubuntu/
cd /home/ubuntu
if [ -d "ajiri" ]; then
    cd ajiri
    git pull origin main
else
    git clone https://github.com/yourusername/ajiri.git
    cd ajiri
fi

# Make update script executable
chmod +x scripts/update.sh

# Backend setup
echo "📦 Setting up backend..."
cd ajiri-backend
npm install --production

# Create production .env (user needs to edit)
if [ ! -f .env ]; then
    cat > .env << 'EOF'
# EDIT THESE VALUES FOR PRODUCTION
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
JWT_SECRET=CHANGE-THIS-TO-SECURE-RANDOM-STRING
JWT_EXPIRES_IN=7d

# AWS Configuration - ADD YOUR CREDENTIALS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# AWS Service Configuration
TEXTRACT_ENABLED=true
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
BEDROCK_ENABLED=true

# Database
DATABASE_PATH=./database/ajiri.db

# File Upload
MAX_FILE_SIZE=50MB
UPLOAD_PATH=./uploads
EOF
    echo "⚠️  IMPORTANT: Edit ajiri-backend/.env with your AWS credentials!"
fi

# Create directories
mkdir -p database uploads

# Stop existing PM2 process if running
pm2 delete ajiri-backend 2>/dev/null || true

# Start backend
pm2 start server.js --name ajiri-backend
pm2 save
pm2 startup

# Frontend setup
echo "🎨 Setting up frontend..."
cd ../ajiri-frontend

# Create production .env
cat > .env << 'EOF'
VITE_API_URL=https://your-domain.com/api
EOF

npm install
npm run build

# Copy to nginx
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/

# Create Nginx config
sudo tee /etc/nginx/sites-available/ajiri << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # File uploads
    client_max_body_size 50M;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/ajiri /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit ajiri-backend/.env with your AWS credentials"
echo "2. Update domain name in nginx config: sudo nano /etc/nginx/sites-available/ajiri"
echo "3. Update frontend API URL: nano ajiri-frontend/.env"
echo "4. Restart services: pm2 restart ajiri-backend && sudo systemctl reload nginx"
echo "5. Setup SSL with Let's Encrypt: sudo apt install certbot python3-certbot-nginx"
echo "6. Get SSL cert: sudo certbot --nginx -d your-domain.com"
echo ""
echo "🔄 To update from GitHub later:"
echo "   cd /home/ubuntu/ajiri && ./scripts/update.sh"
echo ""
echo "🌐 Your app will be available at: http://your-ec2-ip"