const AWS = require('aws-sdk');
require('dotenv').config();

// Test AWS Configuration
async function testAWSServices() {
  console.log('🔍 Testing AWS Configuration...\n');

  // Configure AWS
  AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  // Test Textract
  console.log('📄 Testing AWS Textract...');
  const textract = new AWS.Textract();
  try {
    await textract.detectDocumentText({
      Document: {
        Bytes: Buffer.from('test')
      }
    }).promise();
    console.log('❌ Textract test failed (expected - need real document)');
  } catch (error) {
    if (error.code === 'InvalidParameterException') {
      console.log('✅ Textract credentials working (invalid document expected)');
    } else {
      console.log('❌ Textract error:', error.message);
    }
  }

  // Test Bedrock
  console.log('\n🤖 Testing AWS Bedrock...');
  const bedrock = new AWS.BedrockRuntime({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  try {
    const response = await bedrock.invokeModel({
      modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: 'Hello, this is a test. Respond with "AWS Bedrock is working!"'
        }]
      })
    }).promise();

    const result = JSON.parse(response.body.toString());
    console.log('✅ Bedrock working! Response:', result.content[0].text);
  } catch (error) {
    console.log('❌ Bedrock error:', error.message);
    if (error.code === 'AccessDeniedException') {
      console.log('💡 Enable Bedrock model access in AWS Console');
    }
  }

  console.log('\n🔧 Configuration Summary:');
  console.log('Region:', process.env.AWS_REGION);
  console.log('Access Key:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + '...');
  console.log('Secret Key:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Missing');
}

testAWSServices().catch(console.error);