const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Checking users in PostgreSQL database...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkUsers() {
  try {
    const result = await pool.query('SELECT id, name, email, role, password, created_at FROM users LIMIT 10');
    const users = result.rows;

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
      
      for (const user of users) {
        console.log(`\nTesting passwords for: ${user.email}`);
        let foundValid = false;
        
        for (const testPass of testPasswords) {
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
        }
        
        if (!foundValid) {
          console.log(`❌ None of the test passwords work for ${user.email}`);
        }
      }
      
      console.log('\n📋 SUMMARY:');
      console.log('=====================================');
      console.log(`Total users: ${users.length}`);
      console.log('Valid login credentials:');
      
      for (const user of users) {
        for (const testPass of testPasswords) {
          try {
            if (user.password && bcrypt.compareSync(testPass, user.password)) {
              console.log(`✅ Email: ${user.email} | Password: ${testPass} | Role: ${user.role}`);
              break;
            }
          } catch (e) {
            // Continue
          }
        }
      }
    } else {
      console.log('❌ No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Check if your Railway PostgreSQL credentials are correct');
    console.log('2. Make sure the database server is running');
    console.log('3. Check your internet connection');
  } finally {
    await pool.end();
  }
}

checkUsers();
