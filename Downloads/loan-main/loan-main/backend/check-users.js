const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./loan_management.db');

console.log('🔍 Checking users in database...');

db.all('SELECT id, name, email, role, password, created_at FROM users LIMIT 10', (err, users) => {
  if (err) {
    console.error('❌ Database error:', err);
    db.close();
    return;
  }
  
  console.log('👥 Found users:');
  console.log('=====================================');
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.created_at}`);
    console.log('   Password hash: ' + (user.password ? user.password.substring(0, 30) + '...' : 'No password'));
    console.log('-------------------------------------');
  });
  
  // Test password verification with common passwords
  const testPasswords = ['password123', 'admin123', '123456', 'test123', 'password', 'admin'];
  
  if (users.length > 0) {
    console.log('\n🧪 Testing passwords for all users...');
    console.log('=====================================');
    
    users.forEach(user => {
      console.log(`\nTesting passwords for: ${user.email}`);
      let foundValid = false;
      
      testPasswords.forEach(testPass => {
        try {
          if (user.password) {
            const isValid = bcrypt.compareSync(testPass, user.password);
            if (isValid) {
              console.log(`✅ Password '${testPass}' works for ${user.email}`);
              foundValid = true;
            }
          }
        } catch (e) {
          // Silent catch for invalid hashes
        }
      });
      
      if (!foundValid) {
        console.log(`❌ None of the test passwords work for ${user.email}`);
      }
    });
    
    console.log('\n📋 SUMMARY:');
    console.log('=====================================');
    console.log(`Total users: ${users.length}`);
    console.log('Test these credentials in your app:');
    users.forEach(user => {
      console.log(`• Email: ${user.email} | Try password: password123`);
    });
  } else {
    console.log('❌ No users found in database');
  }
  
  db.close();
});
