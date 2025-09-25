const express = require('express');
const { authenticateToken } = require('./auth');
const { getDb } = require('../config/database');

const router = express.Router();

// Get user analytics dashboard
router.get('/dashboard', authenticateToken, (req, res) => {
  const db = getDb();
  
  db.all(`
    SELECT 
      COUNT(DISTINCT us.id) as totalDocuments,
      COUNT(DISTINCT DATE(us.processed_at)) as activeDays,
      AVG(us.processing_time) as avgProcessingTime,
      SUM(us.file_size) as totalDataProcessed,
      COUNT(DISTINCT ch.session_id) as chatSessions,
      COUNT(ch.id) as totalQuestions
    FROM user_sessions us
    LEFT JOIN chat_history ch ON us.user_id = ch.user_id
    WHERE us.user_id = ?
  `, [req.user.userId], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    db.all(`
      SELECT 
        document_type,
        COUNT(*) as count,
        AVG(processing_time) as avgTime
      FROM user_sessions 
      WHERE user_id = ? 
      GROUP BY document_type
      ORDER BY count DESC
    `, [req.user.userId], (err, typeStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        overview: stats[0],
        documentTypes: typeStats
      });
    });
  });
});

// Get processing trends
router.get('/trends', authenticateToken, (req, res) => {
  const db = getDb();
  const days = parseInt(req.query.days) || 30;
  
  db.all(`
    SELECT 
      DATE(processed_at) as date,
      COUNT(*) as documents,
      AVG(processing_time) as avgTime,
      SUM(file_size) as totalSize
    FROM user_sessions 
    WHERE user_id = ? 
    AND processed_at >= datetime('now', '-${days} days')
    GROUP BY DATE(processed_at)
    ORDER BY date DESC
  `, [req.user.userId], (err, trends) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ trends });
  });
});

module.exports = router;