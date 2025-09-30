const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Railway MySQL Connection URL from screenshot
// mysql://root:pv0CQbz1DAobtcdozDMvcdIDDEmenwkO@nozomi.proxy.rlwy.net:21817/railway

const MYSQL_URL = 'mysql://root:pv0CQbz1DAobtcdozDMvcdIDDEmenwkO@nozomi.proxy.rlwy.net:21817/railway';

// Function to escape CSV field
function escapeCSVField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, newline, or double quote, wrap in quotes and escape inner quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r') || stringField.includes('"')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

// Function to export MySQL users to CSV using connection URL
async function exportMySQLUsersToCSV(outputPath = 'mysql_users_export.csv') {
  let connection = null;
  
  try {
    console.log('🔄 Connecting to Railway MySQL database...');
    console.log('📍 Using Railway connection URL');
    
    // Create MySQL connection using URL
    connection = await mysql.createConnection(MYSQL_URL);
    console.log('✅ MySQL connection established');
    
    // Test connection with a simple query first
    console.log('🔍 Testing connection...');
    const [testResult] = await connection.execute('SELECT 1 as test');
    console.log('✅ Connection test passed');
    
    // Check if users table exists
    console.log('🔍 Checking for users table...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('❌ Users table not found in database');
      console.log('📋 Available tables:');
      const [allTables] = await connection.execute('SHOW TABLES');
      allTables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
      return;
    }
    
    console.log('✅ Users table found');
    
    // Get table structure first
    console.log('🔍 Checking table structure...');
    const [columns] = await connection.execute('DESCRIBE users');
    console.log('📋 Table columns:');
    columns.forEach(col => {
      console.log(`   - ${col.Field} (${col.Type})`);
    });
    
    // Query to get all users
    console.log('📊 Fetching users data...');
    const [rows] = await connection.execute(`
      SELECT 
        id,
        name,
        email,
        password
      FROM users 
      ORDER BY name ASC
    `);
    
    console.log(`📊 Found ${rows.length} users in database`);
    
    if (rows.length === 0) {
      console.log('⚠️  No users found in database');
      return;
    }
    
    // Show sample data
    console.log('\n📋 Sample data from database:');
    console.log('===============================');
    rows.slice(0, 3).forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Password hash: ${user.password ? user.password.substring(0, 20) + '...' : 'null'}`);
    });
    
    if (rows.length > 3) {
      console.log(`... and ${rows.length - 3} more users`);
    }
    
    // Prepare CSV content
    const csvHeader = 'id,name,email,password,phone,department,role,isActive,createdAt\n';
    
    const csvRows = rows.map(user => {
      return [
        escapeCSVField(user.id),
        escapeCSVField(user.name),
        escapeCSVField(user.email),
        escapeCSVField(user.password), // Keep the hashed password
        escapeCSVField(''), // phone - empty for now
        escapeCSVField('Migrated'), // department
        escapeCSVField('user'), // role - default to user
        escapeCSVField(true), // isActive
        escapeCSVField(new Date().toISOString()) // createdAt - current time as placeholder
      ].join(',');
    }).join('\n');
    
    // Write to CSV file
    const csvContent = csvHeader + csvRows;
    const fullOutputPath = path.resolve(outputPath);
    
    fs.writeFileSync(fullOutputPath, csvContent, 'utf8');
    
    console.log(`\n✅ Successfully exported ${rows.length} users to: ${fullOutputPath}`);
    console.log(`📄 File size: ${(csvContent.length / 1024).toFixed(2)} KB`);
    
    // Show CSV preview
    console.log('\n📄 CSV Preview (first 3 lines):');
    console.log('=================================');
    const lines = csvContent.split('\n');
    lines.slice(0, 4).forEach((line, index) => {
      if (index === 0) {
        console.log('Header:', line);
      } else {
        console.log(`Row ${index}:`, line.substring(0, 100) + (line.length > 100 ? '...' : ''));
      }
    });
    
    return fullOutputPath;
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Tips:');
      console.error('   - Check if Railway MySQL service is running');
      console.error('   - Verify Railway connection URL');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Tips:');
      console.error('   - Railway credentials may have expired');
      console.error('   - Check Railway dashboard for new credentials');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Tips:');
      console.error('   - Database name may be incorrect');
      console.error('   - Check Railway database configuration');
    }
    
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 MySQL connection closed');
    }
  }
}

// Function to test connection
async function testConnection() {
  let connection = null;
  
  try {
    console.log('🔄 Testing Railway MySQL connection...');
    connection = await mysql.createConnection(MYSQL_URL);
    
    const [rows] = await connection.execute('SELECT COUNT(*) as user_count FROM users');
    console.log(`✅ Connection successful! Found ${rows[0].user_count} users in database`);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Railway credentials may have changed. Please:');
      console.log('   1. Go to Railway dashboard');
      console.log('   2. Open MySQL service');
      console.log('   3. Go to Connect tab');
      console.log('   4. Copy new connection string');
      console.log('   5. Update this script with new credentials');
    }
    
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🚀 Railway MySQL User Export Tool
=================================

Usage:
  Test connection:  node export-mysql-railway.js test
  Export to CSV:    node export-mysql-railway.js export [filename.csv]

This script uses the Railway MySQL connection URL directly from your screenshot:
mysql://root:pv0CQbz1DAobtcdozDMvcdIDDEmenwkO@nozomi.proxy.rlwy.net:21817/railway

Example:
  node export-mysql-railway.js export users_from_railway.csv
`);
    process.exit(0);
  }
  
  const command = args[0];
  
  if (command === 'test') {
    console.log('🚀 Testing Railway MySQL Connection');
    console.log('===================================');
    testConnection();
  } else if (command === 'export') {
    const outputFile = args[1] || `railway_users_export_${new Date().toISOString().split('T')[0]}.csv`;
    console.log('🚀 Starting Railway MySQL User Export');
    console.log('=====================================');
    exportMySQLUsersToCSV(outputFile);
  } else {
    console.error('❌ Invalid command. Use "test" or "export"');
    process.exit(1);
  }
}

module.exports = {
  exportMySQLUsersToCSV,
  testConnection
};
