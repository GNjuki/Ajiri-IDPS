const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('./auth');
const { getDb } = require('../config/database');

const router = express.Router();

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const textract = new AWS.Textract();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      'text/plain',
      'text/csv',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/tiff'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Process document endpoint
router.post('/process', authenticateToken, upload.single('document'), async (req, res) => {
  const startTime = Date.now();
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, buffer, size } = req.file;
    const db = getDb();

    let extractedText = '';
    let textractResponse = null;
    let processingMethod = '';

    // Process based on file type
    switch (mimetype) {
      case 'application/pdf':
        try {
          // Try direct PDF text extraction first
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;
          processingMethod = 'Direct PDF extraction';
          
          // If no text found, use Textract
          if (!extractedText.trim()) {
            textractResponse = await processWithTextract(buffer);
            extractedText = extractTextFromTextractResponse(textractResponse);
            processingMethod = 'AWS Textract OCR';
          }
        } catch (error) {
          // Fallback to Textract
          textractResponse = await processWithTextract(buffer);
          extractedText = extractTextFromTextractResponse(textractResponse);
          processingMethod = 'AWS Textract OCR';
        }
        break;

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        const wordResult = await mammoth.extractRawText({ buffer });
        extractedText = wordResult.value;
        processingMethod = 'Direct Word extraction';
        break;

      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        let excelText = '';
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          excelText += `--- Sheet: ${sheetName} ---\n`;
          excelText += XLSX.utils.sheet_to_txt(sheet) + '\n';
        });
        extractedText = excelText;
        processingMethod = 'Direct Excel extraction';
        break;

      case 'text/plain':
      case 'text/csv':
        extractedText = buffer.toString('utf-8');
        processingMethod = 'Direct text extraction';
        break;

      case 'image/png':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/tiff':
        textractResponse = await processWithTextract(buffer);
        extractedText = extractTextFromTextractResponse(textractResponse);
        processingMethod = 'AWS Textract OCR';
        break;

      default:
        return res.status(400).json({ error: 'Unsupported file type' });
    }

    const processingTime = Date.now() - startTime;

    // Log session to database
    db.run(
      'INSERT INTO user_sessions (user_id, document_name, document_type, file_size, processing_time, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userId, originalname, mimetype, size, processingTime, 'completed']
    );

    // Prepare response
    const response = {
      success: true,
      document: {
        name: originalname,
        type: mimetype,
        size: size,
        processingMethod: processingMethod,
        processingTime: processingTime
      },
      extractedText: extractedText,
      textractResponse: textractResponse,
      stats: {
        wordCount: extractedText.split(/\s+/).length,
        characterCount: extractedText.length
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Document processing error:', error);
    
    // Log failed session
    const db = getDb();
    db.run(
      'INSERT INTO user_sessions (user_id, document_name, document_type, file_size, processing_time, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userId, req.file?.originalname || 'unknown', req.file?.mimetype || 'unknown', req.file?.size || 0, Date.now() - startTime, 'failed']
    );

    res.status(500).json({ 
      error: 'Document processing failed',
      message: error.message 
    });
  }
});

// Get user's document processing history
router.get('/history', authenticateToken, (req, res) => {
  const db = getDb();
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  db.all(
    'SELECT * FROM user_sessions WHERE user_id = ? ORDER BY processed_at DESC LIMIT ? OFFSET ?',
    [req.user.userId, limit, offset],
    (err, sessions) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        sessions,
        pagination: {
          limit,
          offset,
          hasMore: sessions.length === limit
        }
      });
    }
  );
});

// Get processing statistics
router.get('/stats', authenticateToken, (req, res) => {
  const db = getDb();

  db.all(`
    SELECT 
      COUNT(*) as totalDocuments,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) as successfulProcessing,
      COUNT(CASE WHEN status = 'failed' THEN 1 END) as failedProcessing,
      AVG(processing_time) as avgProcessingTime,
      SUM(file_size) as totalDataProcessed,
      COUNT(DISTINCT DATE(processed_at)) as activeDays
    FROM user_sessions 
    WHERE user_id = ?
  `, [req.user.userId], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ stats: stats[0] });
  });
});

// Helper function to process with AWS Textract
async function processWithTextract(buffer) {
  const params = {
    Document: {
      Bytes: buffer
    }
  };

  try {
    const result = await textract.detectDocumentText(params).promise();
    return result;
  } catch (error) {
    throw new Error(`Textract processing failed: ${error.message}`);
  }
}

// Helper function to extract text from Textract response
function extractTextFromTextractResponse(response) {
  if (!response || !response.Blocks) {
    return '';
  }

  const lines = response.Blocks
    .filter(block => block.BlockType === 'LINE')
    .map(block => block.Text);

  return lines.join('\n');
}

module.exports = router;