#!/bin/bash

# AJIRI Cognito Setup Script
echo "🚀 Setting up Amazon Cognito for AJIRI..."

# Create User Pool
echo "Creating Cognito User Pool..."
USER_POOL_ID=$(aws cognito-idp create-user-pool \
  --pool-name "ajiri-user-pool" \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": false
    }
  }' \
  --auto-verified-attributes email \
  --username-attributes email \
  --verification-message-template '{
    "DefaultEmailOption": "CONFIRM_WITH_CODE",
    "EmailSubject": "AJIRI - Verify your email",
    "EmailMessage": "Welcome to AJIRI! Your verification code is {####}"
  }' \
  --region us-east-1 \
  --query 'UserPool.Id' \
  --output text)

echo "User Pool ID: $USER_POOL_ID"

if [ -z "$USER_POOL_ID" ]; then
  echo "❌ Failed to create User Pool"
  exit 1
fi

# Create User Pool Client
echo "Creating User Pool Client..."
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --user-pool-id "$USER_POOL_ID" \
  --client-name "ajiri-web-client" \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_SRP_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --supported-identity-providers COGNITO \
  --callback-urls "http://localhost:5173/dashboard" \
  --logout-urls "http://localhost:5173/" \
  --region us-east-1 \
  --query 'UserPoolClient.ClientId' \
  --output text)

echo "Client ID: $CLIENT_ID"

if [ -z "$CLIENT_ID" ]; then
  echo "❌ Failed to create User Pool Client"
  exit 1
fi

echo "✅ Cognito setup complete!"
echo ""
echo "📝 Update your .env files with these values:"
echo "VITE_COGNITO_USER_POOL_ID=$USER_POOL_ID"
echo "VITE_COGNITO_CLIENT_ID=$CLIENT_ID"
echo ""
echo "🔧 Backend .env should also include:"
echo "COGNITO_USER_POOL_ID=$USER_POOL_ID"
echo "COGNITO_CLIENT_ID=$CLIENT_ID"