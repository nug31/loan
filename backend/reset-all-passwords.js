const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

console.log('🔐 Resetting passwords for all users...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function resetAllPasswords() {
  const client = await pool.connect();
  
  try {
    // Get all users
    const result = await client.query('SELECT id, name, email, role FROM users');
    const users = result.rows;

    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`👥 Found ${users.length} users:`);
    console.log('=====================================');
    
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    for (const user of users) {
      try {
        await client.query(
          'UPDATE users SET password = $1 WHERE id = $2',
          [hashedPassword, user.id]
        );
        
        console.log(`✅ Password reset for: ${user.name} (${user.email})`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Login: ${user.email} / password123`);
        console.log('-------------------------------------');
      } catch (error) {
        console.error(`❌ Failed to update ${user.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 Password Reset Complete!');
    console.log('============================');
    console.log('All users can now login with password: password123');
    console.log('');
    console.log('Available login credentials:');
    
    for (const user of users) {
      console.log(`• ${user.email} / password123 (${user.role})`);
    }
    
    console.log('');
    console.log('💡 Admin account:');
    const admin = users.find(u => u.role === 'admin');
    if (admin) {
      console.log(`🔑 ${admin.email} / password123`);
    }
    
  } catch (error) {
    console.error('❌ Error resetting passwords:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

resetAllPasswords();
