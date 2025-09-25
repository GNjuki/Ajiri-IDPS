const bcrypt = require('bcryptjs');
const { initDatabase, getDb } = require('../config/database');

async function createTestUser() {
  await initDatabase();
  const db = getDb();
  
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  db.run(
    'INSERT OR IGNORE INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    ['testuser', 'test@ajiri.com', hashedPassword],
    function(err) {
      if (err) {
        console.error('Error creating test user:', err);
      } else {
        console.log('✅ Test user created!');
        console.log('Username: testuser');
        console.log('Password: password123');
      }
      process.exit(0);
    }
  );
}

createTestUser();