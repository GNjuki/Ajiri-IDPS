#!/bin/bash

# Setup EC2 instance for CodeDeploy
echo "Setting up EC2 for CodeDeploy..."

# Update system
sudo yum update -y

# Install CodeDeploy agent
sudo yum install -y ruby wget
cd /home/ec2-user
wget https://aws-codedeploy-eu-west-1.s3.eu-west-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

# Start CodeDeploy agent
sudo service codedeploy-agent start
sudo chkconfig codedeploy-agent on

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install nginx
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Create application directory
sudo mkdir -p /home/ubuntu/ajiri
sudo chown ec2-user:ec2-user /home/ubuntu/ajiri

echo "EC2 setup complete!"
echo "CodeDeploy agent status:"
sudo service codedeploy-agent status