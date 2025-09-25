const express = require('express');
const AWS = require('aws-sdk');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('./auth');
const { getDb } = require('../config/database');

const router = express.Router();

// Configure AWS Bedrock
const bedrock = new AWS.BedrockRuntime({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Ask question about document
router.post('/ask', authenticateToken, [
  body('question').isLength({ min: 1 }).trim(),
  body('context').isLength({ min: 1 }),
  body('documentName').optional().trim(),
  body('sessionId').optional().trim()
], async (req, res) => {
  try {
    console.log('Chat request received:', {
      userId: req.user.userId,
      question: req.body.question?.substring(0, 50) + '...',
      contextLength: req.body.context?.length
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { question, context, documentName, sessionId } = req.body;
    const startTime = Date.now();

    // Call AWS Bedrock
    console.log('Calling Bedrock...');
    const answer = await askBedrock(context, question);
    const responseTime = Date.now() - startTime;
    console.log('Bedrock response received in', responseTime, 'ms');

    if (!answer) {
      console.log('No answer received from Bedrock');
      return res.status(500).json({ error: 'Failed to generate answer' });
    }

    // Save to chat history
    const db = getDb();
    const sessionIdToUse = sessionId || generateSessionId();
    
    db.run(
      'INSERT INTO chat_history (user_id, session_id, document_name, question, answer) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, sessionIdToUse, documentName || 'unknown', question, answer],
      function(err) {
        if (err) {
          console.error('Failed to save chat history:', err);
        } else {
          console.log('Chat history saved with ID:', this.lastID);
        }
      }
    );

    res.json({
      success: true,
      question,
      answer,
      responseTime,
      sessionId: sessionIdToUse
    });

  } catch (error) {
    console.error('Chat error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to process question',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get chat history for a session
router.get('/history/:sessionId', authenticateToken, (req, res) => {
  const { sessionId } = req.params;
  const db = getDb();

  db.all(
    'SELECT * FROM chat_history WHERE user_id = ? AND session_id = ? ORDER BY created_at ASC',
    [req.user.userId, sessionId],
    (err, history) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ history });
    }
  );
});

// Get all chat sessions for user
router.get('/sessions', authenticateToken, (req, res) => {
  const db = getDb();

  db.all(`
    SELECT 
      session_id,
      document_name,
      COUNT(*) as message_count,
      MIN(created_at) as first_message,
      MAX(created_at) as last_message
    FROM chat_history 
    WHERE user_id = ? 
    GROUP BY session_id, document_name 
    ORDER BY last_message DESC
  `, [req.user.userId], (err, sessions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ sessions });
  });
});

// Delete chat session
router.delete('/sessions/:sessionId', authenticateToken, (req, res) => {
  const { sessionId } = req.params;
  const db = getDb();

  db.run(
    'DELETE FROM chat_history WHERE user_id = ? AND session_id = ?',
    [req.user.userId, sessionId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ 
        success: true, 
        message: 'Chat session deleted',
        deletedCount: this.changes 
      });
    }
  );
});

// Quick questions endpoint
router.post('/quick-ask', authenticateToken, [
  body('type').isIn(['amount', 'date', 'company', 'summary']),
  body('context').isLength({ min: 1 }),
  body('documentName').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, context, documentName } = req.body;
    
    const quickQuestions = {
      amount: 'What is the total amount?',
      date: 'What is the date on this document?',
      company: 'What company is this from?',
      summary: 'Provide a brief summary of this document.'
    };

    const question = quickQuestions[type];
    const answer = await askBedrock(context, question);

    if (!answer) {
      return res.status(500).json({ error: 'Failed to generate answer' });
    }

    // Save to chat history
    const db = getDb();
    const sessionId = generateSessionId();
    db.run(
      'INSERT INTO chat_history (user_id, session_id, document_name, question, answer) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, sessionId, documentName || 'unknown', question, answer]
    );

    res.json({
      success: true,
      type,
      question,
      answer,
      sessionId
    });

  } catch (error) {
    console.error('Quick ask error:', error);
    res.status(500).json({ 
      error: 'Failed to process quick question',
      message: error.message 
    });
  }
});

// Helper function to call AWS Bedrock
async function askBedrock(context, question) {
  try {
    // Check if Bedrock is enabled
    if (!process.env.BEDROCK_ENABLED || process.env.BEDROCK_ENABLED !== 'true') {
      return 'AI analysis is currently disabled. Please enable Bedrock in your configuration.';
    }

    const prompt = `You are a helpful assistant that answers questions based on the provided document context.

Document Context:
${context}

Question: ${question}

Please provide a clear, concise answer based only on the information in the document.`;

    const params = {
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.3,
        top_p: 0.9
      })
    };

    const response = await bedrock.invokeModel(params).promise();
    const responseBody = JSON.parse(response.body.toString());
    
    return responseBody.content[0].text.trim();

  } catch (error) {
    console.error('Bedrock API error:', error);
    
    // Provide helpful error messages
    if (error.code === 'AccessDeniedException') {
      return 'AI service access denied. Please enable Claude 3.5 Sonnet model access in AWS Bedrock console.';
    } else if (error.code === 'ValidationException') {
      return 'Invalid request to AI service. Please check your AWS Bedrock configuration.';
    } else if (error.code === 'ThrottlingException') {
      return 'AI service is currently busy. Please try again in a moment.';
    } else {
      return `AI analysis temporarily unavailable: ${error.message}`;
    }
  }
}

// Helper function to generate session ID
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = router;