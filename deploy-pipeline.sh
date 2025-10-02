#!/bin/bash

# Deploy CI/CD Pipeline for AJIRI
echo "Deploying AJIRI CI/CD Pipeline..."

# Variables
STACK_NAME="ajiri-cicd-pipeline"
TEMPLATE_FILE="cicd-pipeline.yml"
GITHUB_REPO="GNjuki/Ajiri-IDPS"
GITHUB_BRANCH="main"

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file $TEMPLATE_FILE \
  --stack-name $STACK_NAME \
  --parameter-overrides \
    GitHubRepo=$GITHUB_REPO \
    GitHubBranch=$GITHUB_BRANCH \
  --capabilities CAPABILITY_IAM \
  --region eu-west-1

echo "Pipeline deployment complete!"
echo "Next steps:"
echo "1. Tag your EC2 instance with Name=ajiri-server"
echo "2. Install CodeDeploy agent on EC2 (run setup-ec2.sh)"
echo "3. Attach IAM role to EC2 for CodeDeploy"
echo "4. Pipeline will poll GitHub every few minutes for changes"