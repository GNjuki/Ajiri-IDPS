const AWS = require('aws-sdk');
require('dotenv').config();

async function testBedrock() {
  console.log('🤖 Testing AWS Bedrock Configuration...\n');

  // Configure AWS
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const bedrock = new AWS.BedrockRuntime({
    region: process.env.AWS_REGION
  });

  try {
    console.log('Region:', process.env.AWS_REGION);
    console.log('Model ID:', process.env.BEDROCK_MODEL_ID);
    console.log('Sending test request...\n');

    const response = await bedrock.invokeModel({
      modelId: process.env.BEDROCK_MODEL_ID,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Hello! Please respond with "Bedrock is working correctly!"'
        }]
      })
    }).promise();

    const result = JSON.parse(response.body.toString());
    console.log('✅ Bedrock Success!');
    console.log('Response:', result.content[0].text);

  } catch (error) {
    console.log('❌ Bedrock Error:', error.message);
    console.log('Error Code:', error.code);
    
    if (error.code === 'AccessDeniedException') {
      console.log('\n💡 Solution: Enable Claude 3.5 Sonnet model access in AWS Bedrock console');
      console.log('   1. Go to AWS Console → Bedrock → Model access');
      console.log('   2. Request access to Anthropic Claude 3.5 Sonnet');
      console.log('   3. Wait for approval (usually instant)');
    } else if (error.code === 'ValidationException') {
      console.log('\n💡 Solution: Check model ID and region');
      console.log('   - Ensure region supports Bedrock (us-east-1, us-west-2)');
      console.log('   - Verify model ID is correct');
    }
  }
}

testBedrock();