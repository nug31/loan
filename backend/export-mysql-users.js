const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Debug: Log loaded environment variables
console.log('🔧 Debug - Environment Variables:');
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_PORT:', process.env.MYSQL_PORT);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD ? '*'.repeat(process.env.MYSQL_PASSWORD.length) : 'undefined');
console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
console.log('');

// MySQL connection configuration
// Sesuaikan dengan credentials MySQL Anda dari screenshot
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'railway',
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 20000
};

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

// Function to export MySQL users to CSV
async function exportMySQLUsersToCSV(outputPath = 'mysql_users_export.csv') {
  let connection = null;
  
  try {
    console.log('🔄 Connecting to MySQL database...');
    console.log(`📍 Host: ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}`);
    console.log(`🗄️  Database: ${MYSQL_CONFIG.database}`);
    
    // Create MySQL connection
    connection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ MySQL connection established');
    
    // Query to get all users
    const [rows] = await connection.execute(`
      SELECT 
        id,
        name,
        email,
        password,
        created_at,
        updated_at
      FROM users 
      ORDER BY name ASC
    `);
    
    console.log(`📊 Found ${rows.length} users in database`);
    
    if (rows.length === 0) {
      console.log('⚠️  No users found in database');
      return;
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
        escapeCSVField(user.created_at || new Date().toISOString())
      ].join(',');
    }).join('\n');
    
    // Write to CSV file
    const csvContent = csvHeader + csvRows;
    const fullOutputPath = path.resolve(outputPath);
    
    fs.writeFileSync(fullOutputPath, csvContent, 'utf8');
    
    console.log(`✅ Successfully exported ${rows.length} users to: ${fullOutputPath}`);
    console.log(`📄 File size: ${(csvContent.length / 1024).toFixed(2)} KB`);
    
    // Display sample data
    console.log('\n📋 Sample exported data:');
    console.log('========================');
    rows.slice(0, 3).forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });
    
    if (rows.length > 3) {
      console.log(`... and ${rows.length - 3} more users`);
    }
    
    return fullOutputPath;
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Tips:');
      console.error('   - Check if MySQL server is running');
      console.error('   - Verify host and port configuration');
      console.error('   - Check firewall settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Tips:');
      console.error('   - Check username and password');
      console.error('   - Verify user permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('💡 Tips:');
      console.error('   - Check database name');
      console.error('   - Verify database exists');
    }
    
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔒 MySQL connection closed');
    }
  }
}

// Function to show connection test
async function testConnection() {
  let connection = null;
  
  try {
    console.log('🔄 Testing MySQL connection...');
    connection = await mysql.createConnection(MYSQL_CONFIG);
    
    const [rows] = await connection.execute('SELECT COUNT(*) as user_count FROM users');
    console.log(`✅ Connection successful! Found ${rows[0].user_count} users in database`);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
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
🚀 MySQL User Export Tool
========================

Usage:
  Test connection:  node export-mysql-users.js test
  Export to CSV:    node export-mysql-users.js export [filename.csv]

Environment Variables (.env file):
  MYSQL_HOST=your_mysql_host
  MYSQL_PORT=3306
  MYSQL_USER=your_username  
  MYSQL_PASSWORD=your_password
  MYSQL_DATABASE=your_database_name

Example:
  node export-mysql-users.js export users_from_mysql.csv
`);
    process.exit(0);
  }
  
  const command = args[0];
  
  if (command === 'test') {
    console.log('🚀 Testing MySQL Connection');
    console.log('==========================');
    testConnection();
  } else if (command === 'export') {
    const outputFile = args[1] || `mysql_users_export_${new Date().toISOString().split('T')[0]}.csv`;
    console.log('🚀 Starting MySQL User Export');
    console.log('=============================');
    exportMySQLUsersToCSV(outputFile);
  } else {
    console.error('❌ Invalid command. Use "test" or "export"');
    process.exit(1);
  }
}

module.exports = {
  exportMySQLUsersToCSV,
  testConnection,
  MYSQL_CONFIG
};
