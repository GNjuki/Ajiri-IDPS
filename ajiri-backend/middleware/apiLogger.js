const { getDb } = require('../config/database');

const apiLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    const db = getDb();
    
    db.run(
      'INSERT INTO api_usage (user_id, endpoint, method, status_code, response_time) VALUES (?, ?, ?, ?, ?)',
      [req.user?.userId || null, req.path, req.method, res.statusCode, responseTime]
    );
  });
  
  next();
};

module.exports = apiLogger;