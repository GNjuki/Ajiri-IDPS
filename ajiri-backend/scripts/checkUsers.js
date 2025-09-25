const { initDatabase, getDb } = require('../config/database');

async function checkUsers() {
  await initDatabase();
  const db = getDb();
  
  console.log('📋 Checking users in database...\n');
  
  db.all('SELECT id, username, email, first_name, last_name FROM users', (err, users) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('💡 You need to register first!');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach(user => {
        console.log(`- ID: ${user.id}`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  First Name: ${user.first_name || 'NULL'}`);
        console.log(`  Last Name: ${user.last_name || 'NULL'}`);
        console.log('');
      });
    }
    
    process.exit(0);
  });
}

checkUsers();