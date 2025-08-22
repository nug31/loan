const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// PostgreSQL connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:tAcyywGrcGlyNctqFVoACoyEMGMDgFjH@trolley.proxy.rlwy.net:25351/railway';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to true for debugging
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Function to read users from CSV file
function readUsersFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const users = [];
    
    if (!fs.existsSync(filePath)) {
      reject(new Error(`File not found: ${filePath}`));
      return;
    }
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        // Expected CSV columns: id,name,email,password,phone,department,role
        if (row.name && row.email) {
          users.push({
            id: row.id || null,
            name: row.name.trim(),
            email: row.email.trim().toLowerCase(),
            password: row.password || 'defaultPassword123',
            phone: row.phone || null,
            department: row.department || 'Imported',
            role: row.role || 'user'
          });
        }
      })
      .on('end', () => {
        console.log(`📄 Read ${users.length} users from CSV file`);
        resolve(users);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Function to read users from JSON file
function readUsersFromJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Handle different JSON structures
    let users = [];
    if (Array.isArray(data)) {
      users = data;
    } else if (data.users && Array.isArray(data.users)) {
      users = data.users;
    } else if (data.data && Array.isArray(data.data)) {
      users = data.data;
    }
    
    console.log(`📄 Read ${users.length} users from JSON file`);
    return users;
  } catch (error) {
    throw new Error(`Error reading JSON file: ${error.message}`);
  }
}

// Function to determine if password is already hashed
function isPasswordHashed(password) {
  // Check if password starts with bcrypt hash patterns
  return password && (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));
}

// Function to import users from file
async function importUsersFromFile(filePath, fileType = 'auto') {
  try {
    console.log('🔄 Starting user import process...');
    console.log(`📁 File: ${filePath}`);
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync models
    await sequelize.sync();
    console.log('✅ Database models synced');
    
    // Determine file type
    if (fileType === 'auto') {
      fileType = path.extname(filePath).toLowerCase() === '.csv' ? 'csv' : 'json';
    }
    
    // Read users from file
    let users = [];
    if (fileType === 'csv') {
      users = await readUsersFromCSV(filePath);
    } else {
      users = readUsersFromJSON(filePath);
    }
    
    if (users.length === 0) {
      console.log('⚠️  No users found in file');
      return;
    }
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    console.log(`\n🔄 Processing ${users.length} users...`);
    
    for (const [index, user] of users.entries()) {
      try {
        if (!user.email || !user.name) {
          console.log(`⚠️  Skipping user ${index + 1}: Missing required fields (email or name)`);
          skippedCount++;
          continue;
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({
          where: {
            email: user.email
          }
        });
        
        if (existingUser) {
          console.log(`⚠️  User already exists: ${user.email}`);
          skippedCount++;
          continue;
        }
        
        // Prepare password
        let hashedPassword;
        if (isPasswordHashed(user.password)) {
          hashedPassword = user.password;
          console.log(`🔐 Using existing hash for: ${user.email}`);
        } else {
          hashedPassword = await bcrypt.hash(user.password, 10);
          console.log(`🔐 Generated new hash for: ${user.email}`);
        }
        
        // Prepare user data for insertion
        const userData = {
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          department: user.department || 'Imported',
          role: user.role === 'admin' ? 'admin' : 'user',
          isActive: user.isActive !== undefined ? user.isActive : true,
          password: hashedPassword
        };
        
        // Create new user
        const newUser = await User.create(userData);
        console.log(`✅ User imported: ${newUser.name} (${newUser.email}) [${newUser.role}]`);
        importedCount++;
        
      } catch (userError) {
        console.error(`❌ Error importing user ${user.email}:`, userError.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${importedCount} users`);
    console.log(`⚠️  Skipped (already exists): ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📋 Total processed: ${users.length} users`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

// Function to export current users to CSV (for backup)
async function exportUsersToCSV(outputPath) {
  try {
    console.log('🔄 Exporting users to CSV...');
    
    await sequelize.authenticate();
    await sequelize.sync();
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'department', 'role', 'isActive', 'createdAt'],
      order: [['name', 'ASC']]
    });
    
    const csvHeader = 'id,name,email,phone,department,role,isActive,createdAt\n';
    const csvRows = users.map(user => {
      return `"${user.id}","${user.name}","${user.email}","${user.phone || ''}","${user.department || ''}","${user.role}","${user.isActive}","${user.createdAt}"`;
    }).join('\n');
    
    fs.writeFileSync(outputPath, csvHeader + csvRows);
    console.log(`✅ Exported ${users.length} users to: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🚀 SmartLend User Import/Export Tool
===================================

Usage:
  Import from CSV:  node import-users-csv.js import users.csv
  Import from JSON: node import-users-csv.js import users.json
  Export to CSV:    node import-users-csv.js export users_backup.csv

CSV Format (with header):
id,name,email,password,phone,department,role
1,John Doe,john@example.com,password123,+1234567890,IT,user
2,Jane Admin,admin@example.com,$2b$10$...,+0987654321,Admin,admin

JSON Format:
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "department": "IT",
    "role": "user"
  }
]
`);
    process.exit(0);
  }
  
  const command = args[0];
  const filePath = args[1];
  
  if (!filePath) {
    console.error('❌ Please provide a file path');
    process.exit(1);
  }
  
  if (command === 'import') {
    console.log('🚀 Starting User Import');
    console.log('=====================');
    importUsersFromFile(filePath);
  } else if (command === 'export') {
    console.log('🚀 Starting User Export');
    console.log('=====================');
    exportUsersToCSV(filePath);
  } else {
    console.error('❌ Invalid command. Use "import" or "export"');
    process.exit(1);
  }
}

module.exports = {
  importUsersFromFile,
  exportUsersToCSV,
  readUsersFromCSV,
  readUsersFromJSON,
  User,
  sequelize
};
