# 🚀 AJIRI Backend API

Node.js backend API for the AJIRI Intelligent Document Processing System.

## 🎯 Features

- **🔐 JWT Authentication** - Secure user registration and login
- **📄 Multi-format Document Processing** - PDF, Word, Excel, PowerPoint, Images
- **🤖 AI-Powered Q&A** - Chat with documents using AWS Bedrock
- **🔍 Advanced OCR** - AWS Textract integration
- **📊 Analytics & History** - Track processing and chat history
- **🛡️ Security** - Rate limiting, input validation, CORS protection

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your AWS credentials and settings
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Production Start
```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Document Processing
- `POST /api/documents/process` - Process document
- `GET /api/documents/history` - Get processing history
- `GET /api/documents/stats` - Get processing statistics

### AI Chat
- `POST /api/chat/ask` - Ask question about document
- `POST /api/chat/quick-ask` - Quick predefined questions
- `GET /api/chat/history/:sessionId` - Get chat history
- `GET /api/chat/sessions` - Get all chat sessions
- `DELETE /api/chat/sessions/:sessionId` - Delete chat session

### Health Check
- `GET /api/health` - API health status

## 🔧 Configuration

### Environment Variables
```env
# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Database
DATABASE_PATH=./database/ajiri.db
```

## 📝 Usage Examples

### Register User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securepassword'
  })
});
```

### Process Document
```javascript
const formData = new FormData();
formData.append('document', file);

const response = await fetch('/api/documents/process', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
```

### Ask Question
```javascript
const response = await fetch('/api/chat/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    question: 'What is the total amount?',
    context: extractedText,
    documentName: 'invoice.pdf'
  })
});
```

## 🏗️ Architecture

```
ajiri-nodejs-backend/
├── config/
│   └── database.js          # Database configuration
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── documents.js        # Document processing routes
│   └── chat.js             # AI chat routes
├── database/               # SQLite database files
├── uploads/               # Temporary file uploads
├── server.js              # Main server file
├── package.json
└── .env                   # Environment configuration
```

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Protection** with configurable origins
- **Helmet.js** for security headers
- **Password Hashing** with bcrypt

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - User email
- `password_hash` - Hashed password
- `created_at` - Registration timestamp
- `last_login` - Last login timestamp

### User Sessions Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `document_name` - Processed document name
- `document_type` - MIME type
- `file_size` - File size in bytes
- `processed_at` - Processing timestamp
- `processing_time` - Time taken to process
- `status` - Processing status

### Chat History Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `session_id` - Chat session identifier
- `document_name` - Related document
- `question` - User question
- `answer` - AI response
- `created_at` - Timestamp

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name ajiri-backend
pm2 startup
pm2 save
```

## 🧪 Testing

```bash
npm test
```

## 📈 Monitoring

The API includes built-in logging and can be monitored using:
- Health check endpoint: `/api/health`
- Processing statistics: `/api/documents/stats`
- Database query logging

## 🤝 Integration

This backend is designed to work with any frontend framework. Example integrations:

- **React/Next.js** - Use fetch or axios
- **Vue.js** - Use axios or fetch
- **Angular** - Use HttpClient
- **Mobile Apps** - Standard HTTP requests

## 📄 License

MIT License - see LICENSE file for details.