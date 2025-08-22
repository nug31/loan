const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

// Function to prompt for input
function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// Function to export MySQL users to CSV with manual credentials
async function exportMySQLUsersToCSV(credentials, outputPath = 'mysql_users_export.csv') {
  let connection = null;
  
  try {
    console.log('🔄 Connecting to MySQL database...');
    console.log(`📍 Host: ${credentials.host}:${credentials.port}`);
    console.log(`🗄️  Database: ${credentials.database}`);
    
    // Create MySQL connection
    connection = await mysql.createConnection({
      host: credentials.host,
      port: credentials.port,
      user: credentials.user,
      password: credentials.password,
      database: credentials.database,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 20000
    });
    
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
    rows.slice(0, 5).forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
    });
    
    if (rows.length > 5) {
      console.log(`... and ${rows.length - 5} more users`);
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
      } else if (line.trim()) {
        const truncated = line.length > 120 ? line.substring(0, 120) + '...' : line;
        console.log(`Row ${index}:`, truncated);
      }
    });
    
    return fullOutputPath;
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    console.error('Error code:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Tips:');
      console.error('   - Check if MySQL server is running');
      console.error('   - Verify host and port configuration');
      console.error('   - Check firewall settings');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('💡 Tips:');
      console.error('   - Check username and password');
      console.error('   - Railway credentials may have changed');
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

// Main interactive function
async function main() {
  console.log(`
🚀 MySQL User Export Tool (Manual Input)
========================================

Please provide your current Railway MySQL credentials.
You can find these in Railway Dashboard > MySQL Service > Connect tab
`);

  try {
    const host = await promptUser('MySQL Host (e.g., nozomi.proxy.rlwy.net): ');
    const port = await promptUser('MySQL Port (e.g., 21817): ');
    const user = await promptUser('MySQL User (usually "root"): ');
    const password = await promptUser('MySQL Password: ');
    const database = await promptUser('Database Name (usually "railway"): ');
    const outputFile = await promptUser('Output CSV filename (press Enter for auto): ');
    
    if (!host || !port || !user || !password || !database) {
      console.error('❌ All fields are required!');
      process.exit(1);
    }
    
    const credentials = {
      host: host.trim(),
      port: parseInt(port.trim()),
      user: user.trim(),
      password: password.trim(),
      database: database.trim()
    };
    
    const outputPath = outputFile.trim() || `mysql_users_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    console.log('\n🔄 Starting export with provided credentials...');
    console.log('===============================================');
    
    await exportMySQLUsersToCSV(credentials, outputPath);
    
    console.log(`\n🎉 Export completed successfully!`);
    console.log(`📁 File location: ${path.resolve(outputPath)}`);
    console.log(`\n📝 Next steps:`);
    console.log(`   1. Check the exported CSV file`);
    console.log(`   2. If it looks good, import to PostgreSQL:`);
    console.log(`      node import-users-csv.js import ${outputPath}`);
    
  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    main();
  } else if (args[0] === '--help' || args[0] === '-h') {
    console.log(`
🚀 MySQL User Export Tool (Manual Input)
========================================

This tool prompts you to enter MySQL credentials manually.
It's perfect for when Railway credentials change frequently.

Usage:
  node export-mysql-manual.js         # Interactive mode
  node export-mysql-manual.js --help  # Show this help

Steps:
1. Get fresh MySQL credentials from Railway Dashboard
2. Run this script and enter the credentials
3. Export will create a CSV file ready for import

Railway MySQL credentials location:
- Go to Railway Dashboard
- Open your MySQL service
- Click "Connect" tab
- Copy the connection details
`);
  } else {
    console.error('❌ Invalid arguments. Use --help for usage information.');
    process.exit(1);
  }
}

module.exports = {
  exportMySQLUsersToCSV
};
