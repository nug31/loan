import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

// PostgreSQL connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:tAcyywGrcGlyNctqFVoACoyEMGMDgFjH@trolley.proxy.rlwy.net:25351/railway';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// User model
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

function isPasswordHashed(password) {
  return password && (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));
}

// Function to parse CSV data
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const users = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    if (values.length >= 3 && values[1] && values[2]) { // At least name and email
      const user = {};
      headers.forEach((header, index) => {
        user[header] = values[index] || '';
      });
      users.push(user);
    }
  }
  return users;
}

// Function to read users from file
async function readUsersFromFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const extension = path.extname(filePath).toLowerCase();
    
    let users = [];
    
    if (extension === '.json') {
      const data = JSON.parse(content);
      users = Array.isArray(data) ? data : (data.users || data.data || []);
    } else if (extension === '.csv') {
      users = parseCSV(content);
    } else {
      // Assume it's a text file with comma-separated values
      users = parseCSV(content);
    }
    
    console.log(`📄 Read ${users.length} users from ${filePath}`);
    return users;
    
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    return [];
  }
}

// Function to import all users
async function importAllUsers(filePath) {
  try {
    console.log('🚀 SmartLend All Users Import Tool');
    console.log('==================================');
    
    if (!filePath) {
      console.log('❌ Please provide a file path');
      console.log('\nUsage:');
      console.log('  node import-all-users.js /path/to/users.csv');
      console.log('  node import-all-users.js /path/to/users.json');
      return;
    }
    
    // Read users from file
    const usersData = await readUsersFromFile(filePath);
    
    if (usersData.length === 0) {
      console.log('❌ No valid users found in file');
      return;
    }
    
    console.log(`🔄 Starting import of ${usersData.length} users...`);
    
    // Connect to database
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Database connection established');
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Process each user
    for (const [index, userData] of usersData.entries()) {
      try {
        // Skip if no email
        if (!userData.email || !userData.name) {
          console.log(`⚠️  Skipping user ${index + 1}: Missing email or name`);
          errorCount++;
          continue;
        }
        
        console.log(`\n📋 Processing ${index + 1}/${usersData.length}: ${userData.name}`);
        
        // Check if user exists
        const existingUser = await User.findOne({
          where: { email: userData.email }
        });
        
        if (existingUser) {
          console.log(`⚠️  User already exists: ${userData.email}`);
          skippedCount++;
          continue;
        }
        
        // Handle password
        let hashedPassword;
        const password = userData.password || 'defaultPass123';
        
        if (isPasswordHashed(password)) {
          hashedPassword = password;
          console.log(`🔐 Using existing hash for: ${userData.email}`);
        } else {
          hashedPassword = await bcrypt.hash(password, 10);
          console.log(`🔐 Generated new hash for: ${userData.email}`);
        }
        
        // Determine role
        let userRole = 'user';
        if (userData.role === 'admin' ||
            userData.email.toLowerCase().includes('admin') || 
            userData.name.toLowerCase().includes('admin')) {
          userRole = 'admin';
        }
        
        // Create user
        const newUser = await User.create({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          department: userData.department || 'Imported',
          role: userRole,
          isActive: true,
          password: hashedPassword
        });
        
        console.log(`✅ User imported: ${newUser.name} (${newUser.email}) [${newUser.role}]`);
        importedCount++;
        
      } catch (userError) {
        console.error(`❌ Error importing user ${userData.email || 'unknown'}:`, userError.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${importedCount} users`);
    console.log(`⚠️  Skipped (already exists): ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📋 Total processed: ${usersData.length} users`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

// Function to create sample CSV file
function createSampleFiles() {
  console.log('📄 Creating sample files...');
  
  // Sample CSV content
  const csvContent = `id,name,email,password,phone,department,role
1,John Doe,john@example.com,$2b$10$hash1,+1234567890,IT,user
2,Jane Admin,admin@example.com,$2b$10$hash2,+0987654321,Admin,admin
3,Bob Smith,bob@example.com,plaintext123,,Engineering,user`;
  
  // Sample JSON content
  const jsonContent = `[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "$2b$10$hash1",
    "phone": "+1234567890",
    "department": "IT",
    "role": "user"
  },
  {
    "id": "2", 
    "name": "Jane Admin",
    "email": "admin@example.com",
    "password": "$2b$10$hash2",
    "phone": "+0987654321",
    "department": "Admin",
    "role": "admin"
  }
]`;
  
  fs.writeFileSync('sample-users.csv', csvContent);
  fs.writeFileSync('sample-users.json', jsonContent);
  
  console.log('✅ Created sample-users.csv and sample-users.json');
  console.log('\nInstructions:');
  console.log('1. Export your 113 users from MySQL in CSV or JSON format');
  console.log('2. Replace the sample files with your data');
  console.log('3. Run: node import-all-users.js sample-users.csv');
}

// Command line interface
const command = process.argv[2];

if (command === 'sample') {
  createSampleFiles();
} else if (command) {
  importAllUsers(command);
} else {
  console.log(`
🚀 SmartLend All Users Import Tool
==================================

Usage:
  node import-all-users.js <file-path>     # Import from file
  node import-all-users.js sample          # Create sample files

Examples:
  node import-all-users.js users.csv       # Import from CSV
  node import-all-users.js users.json      # Import from JSON
  node import-all-users.js sample          # Create sample files

File Formats:

CSV Format:
id,name,email,password,phone,department,role
1,John Doe,john@example.com,password123,+123456,IT,user

JSON Format:
[{"name":"John","email":"john@example.com","password":"pass123"}]

Instructions for 113 users:
1. Export your MySQL users table as CSV or JSON
2. Use this script to import all users at once
`);
}
