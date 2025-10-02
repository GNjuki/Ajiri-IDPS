# AJIRI CI/CD Setup Guide

## 🚀 Complete CI/CD Pipeline Implementation

This setup creates an automated deployment pipeline that triggers on every GitHub commit.

## 📋 Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **GitHub repository** with your AJIRI code
3. **EC2 instance** running Amazon Linux 2
4. **Domain/subdomain** pointing to your EC2 (optional)

## 🛠️ Setup Steps

### Step 1: Prepare EC2 Instance

1. **Tag your EC2 instance:**
   ```bash
   # In AWS Console, add tag:
   Key: Name
   Value: ajiri-server
   ```

2. **Run setup script on EC2:**
   ```bash
   # SSH into your EC2 instance
   ssh -i your-key.pem ec2-user@your-ec2-ip
   
   # Run the setup script
   curl -o setup-ec2.sh https://raw.githubusercontent.com/GNjuki/Ajiri-IDPS/main/setup-ec2.sh
   chmod +x setup-ec2.sh
   ./setup-ec2.sh
   ```

### Step 2: Update Configuration

1. **Repository is already configured:**
   ```bash
   GITHUB_REPO="GNjuki/Ajiri-IDPS"
   ```

2. **Update cicd-pipeline.yml** (if needed):
   - Change default GitHub repo parameter
   - Adjust region if not using eu-west-1

### Step 3: Deploy the Pipeline

```bash
# Make script executable
chmod +x deploy-pipeline.sh

# Deploy the pipeline
./deploy-pipeline.sh
```

### Step 4: Create IAM Role for EC2

1. **Create role for EC2 CodeDeploy access:**
   ```bash
   aws iam create-role \
     --role-name EC2CodeDeployRole \
     --assume-role-policy-document '{
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Principal": {
             "Service": "ec2.amazonaws.com"
           },
           "Action": "sts:AssumeRole"
         }
       ]
     }'
   
   # Attach policy
   aws iam attach-role-policy \
     --role-name EC2CodeDeployRole \
     --policy-arn arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforAWSCodeDeploy
   
   # Create instance profile
   aws iam create-instance-profile --instance-profile-name EC2CodeDeployInstanceProfile
   aws iam add-role-to-instance-profile \
     --instance-profile-name EC2CodeDeployInstanceProfile \
     --role-name EC2CodeDeployRole
   ```

2. **Attach instance profile to EC2:**
   ```bash
   aws ec2 associate-iam-instance-profile \
     --instance-id i-your-instance-id \
     --iam-instance-profile Name=EC2CodeDeployInstanceProfile
   ```

## 🔄 How It Works

1. **Commit to GitHub** → Pipeline polls and triggers automatically
2. **Source Stage** → Downloads code from GitHub
3. **Build Stage** → Runs `npm install` and `npm run build`
4. **Deploy Stage** → Deploys to EC2 using CodeDeploy

## 📁 File Structure

```
AJIRI/
├── buildspec.yml          # CodeBuild instructions
├── appspec.yml           # CodeDeploy instructions
├── cicd-pipeline.yml     # CloudFormation template
├── deploy-pipeline.sh    # Pipeline deployment script
├── setup-ec2.sh         # EC2 setup script
└── scripts/
    ├── install_dependencies.sh
    ├── start_application.sh
    └── stop_application.sh
```

## 🎯 Pipeline Stages

### Build Stage (buildspec.yml)
- Installs Node.js dependencies
- Builds frontend application
- Prepares artifacts for deployment

### Deploy Stage (appspec.yml)
- Stops running application
- Installs new dependencies
- Copies built frontend to nginx
- Starts backend with PM2
- Restarts nginx

## 🔧 Customization

### Environment Variables
Update `ajiri-backend/.env` on EC2 with production values:
```bash
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
# ... other production settings
```

### Nginx Configuration
The pipeline copies frontend build to `/var/www/html/`. Ensure nginx is configured to serve from this directory.

## 🚨 Troubleshooting

### Pipeline Fails
1. Check CloudWatch logs for CodeBuild
2. Verify GitHub repository is public and accessible
3. Ensure EC2 has proper tags and CodeDeploy agent

### Deployment Fails
1. Check CodeDeploy logs on EC2: `/var/log/aws/codedeploy-agent/`
2. Verify script permissions: `chmod +x scripts/*.sh`
3. Check EC2 IAM role permissions

### Application Not Starting
1. SSH to EC2 and check PM2: `pm2 status`
2. Check application logs: `pm2 logs ajiri-backend`
3. Verify environment variables in `.env`

## 📊 Monitoring

- **Pipeline Status**: AWS CodePipeline console
- **Build Logs**: AWS CodeBuild console
- **Deployment Logs**: AWS CodeDeploy console
- **Application Logs**: `pm2 logs` on EC2

## 🔄 Manual Deployment

If needed, you can trigger manual deployment:
```bash
# Trigger pipeline manually
aws codepipeline start-pipeline-execution \
  --name ajiri-pipeline \
  --region eu-west-1
```

## 🎉 Success!

Once setup is complete:
- Every commit to `main` branch triggers automatic deployment
- Build and deployment status visible in AWS console
- Application automatically restarts with new code
- Zero-downtime deployments with proper health checks