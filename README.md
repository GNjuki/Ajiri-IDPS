# AJIRI - AI Document Intelligence Platform

🚀 **Enterprise-grade document processing with AWS AI services**

## Features
- 📄 **Document OCR** - AWS Textract integration
- 🤖 **AI Analysis** - Bedrock Claude 3.5 Sonnet
- 💬 **Conversation History** - Full chat tracking
- 📱 **Responsive Design** - Modern dashboard UI
- 🔐 **Secure Authentication** - JWT-based auth

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + SQLite
- **AI Services**: AWS Textract + Bedrock
- **Deployment**: EC2 + Nginx + PM2

## Quick Start

### Prerequisites
- Node.js 18+
- AWS Account with Textract/Bedrock access
- AWS credentials configured

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/ajiri.git
cd ajiri

# Backend setup
cd ajiri-backend
npm install
cp .env.example .env
# Configure your AWS credentials in .env
npm start

# Frontend setup (new terminal)
cd ../ajiri-frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env):**
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-jwt-secret
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
TEXTRACT_ENABLED=true
BEDROCK_ENABLED=true
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

## Deployment

### EC2 Deployment
1. Launch Ubuntu 22.04 EC2 instance (t3.medium+)
2. Configure security groups (80, 443, 22, 3001)
3. Run deployment script:

```bash
# On EC2 instance
curl -o- https://raw.githubusercontent.com/yourusername/ajiri/main/scripts/deploy.sh | bash
```

### Update from GitHub
After making changes to your code:

```bash
# Push changes to GitHub
git add .
git commit -m "Your changes"
git push origin main

# Update on EC2
ssh -i your-key.pem ubuntu@your-ec2-ip
cd /home/ubuntu/ajiri
./scripts/update.sh
```

### Manual Deployment
```bash
# Install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/yourusername/ajiri.git
cd ajiri

# Backend
cd ajiri-backend
npm install --production
# Configure .env with production values
pm2 start server.js --name ajiri-backend

# Frontend
cd ../ajiri-frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/

# Configure Nginx (see nginx.conf)
sudo systemctl restart nginx
```

## AWS Setup Required
1. **Enable Bedrock Model Access**:
   - AWS Console → Bedrock → Model access
   - Enable "Anthropic Claude 3.5 Sonnet"

2. **IAM Permissions**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "textract:DetectDocumentText",
           "textract:AnalyzeDocument",
           "bedrock:InvokeModel"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

## Supported File Types
- **Documents**: PDF, DOC, DOCX, TXT, CSV
- **Images**: PNG, JPG, JPEG, TIFF, BMP
- **Presentations**: PPT, PPTX
- **Spreadsheets**: XLS, XLSX

## License
MIT License - see LICENSE file for details