# AJIRI Setup Guide - AWS Integration

## 🚀 Quick Setup Checklist

### 1. AWS Account Setup
- [ ] AWS Account with billing enabled
- [ ] IAM User with programmatic access
- [ ] Required AWS services enabled

### 2. AWS Permissions Required
Your IAM user needs these permissions:
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

### 3. Enable Bedrock Model Access
1. Go to AWS Console → Bedrock
2. Navigate to "Model access"
3. Enable: **Anthropic Claude 3.5 Sonnet**
4. Wait for approval (usually instant)

### 4. Configure Environment Variables
Update `ajiri-backend/.env`:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...your-key
AWS_SECRET_ACCESS_KEY=...your-secret
```

### 5. Test AWS Services
```bash
cd ajiri-backend
node scripts/testAWS.js
```

### 6. Start Services
```bash
# Backend
cd ajiri-backend
npm start

# Frontend  
cd ajiri-frontend
npm run dev
```

## 🔧 Troubleshooting

### Common Issues:

**❌ "AccessDeniedException" for Bedrock**
- Enable Claude 3.5 Sonnet in AWS Console → Bedrock → Model access

**❌ "InvalidSignatureException"**
- Check AWS credentials are correct
- Ensure no extra spaces in .env file

**❌ "Region not supported"**
- Use us-east-1 or us-west-2 for Bedrock
- Textract available in most regions

**❌ Documents not processing**
- Check file size < 50MB
- Ensure supported file types
- Check AWS credentials

## 📋 Supported File Types
- **Documents**: PDF, DOC, DOCX, TXT, CSV
- **Spreadsheets**: XLS, XLSX  
- **Presentations**: PPT, PPTX
- **Images**: PNG, JPG, JPEG, TIFF, BMP

## 🎯 Features Working After Setup
- ✅ Document upload with drag & drop
- ✅ AWS Textract OCR extraction
- ✅ Full text display with copy
- ✅ AI analysis with Bedrock Claude
- ✅ Natural language Q&A about documents
- ✅ Professional dashboard interface

## 💰 AWS Costs (Approximate)
- **Textract**: $1.50 per 1,000 pages
- **Bedrock Claude**: $3 per 1M input tokens
- **Typical usage**: $5-20/month for moderate use

## 🔐 Security Notes
- Never commit AWS credentials to git
- Use IAM roles in production
- Enable CloudTrail for audit logging
- Rotate access keys regularly