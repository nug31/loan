import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

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

// Function to parse various formats
function parseData(content, filename) {
  const extension = path.extname(filename).toLowerCase();
  let users = [];
  
  try {
    if (extension === '.json') {
      const data = JSON.parse(content);
      users = Array.isArray(data) ? data : (data.users || data.data || []);
    } else {
      // Parse as CSV/TSV/plain text
      const lines = content.trim().split('\n');
      let headers = [];
      
      // Detect separator
      let separator = ',';
      if (lines[0].includes('\t')) separator = '\t';
      else if (lines[0].includes(';')) separator = ';';
      else if (lines[0].includes('|')) separator = '|';
      
      // Parse headers (first line or detect from content)
      if (lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('email')) {
        headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, '').toLowerCase());
        lines.shift(); // Remove header line
      } else {
        // Auto-detect columns based on pattern
        headers = ['id', 'name', 'email', 'password', 'phone', 'department', 'role'];
      }
      
      console.log(`🔍 Detected separator: "${separator}"`);
      console.log(`📋 Headers: ${headers.join(', ')}`);
      
      // Parse data lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(separator).map(v => v.trim().replace(/^"|"$/g, ''));
        
        if (values.length >= 2 && values[0] && values[1]) {
          const user = {};
          
          // Map values to standard fields
          headers.forEach((header, index) => {
            if (values[index]) {
              if (header.includes('name') || header === 'name') user.name = values[index];
              else if (header.includes('email') || header === 'email') user.email = values[index];
              else if (header.includes('password') || header === 'password') user.password = values[index];
              else if (header.includes('phone') || header === 'phone') user.phone = values[index];
              else if (header.includes('department') || header === 'department') user.department = values[index];
              else if (header.includes('role') || header === 'role') user.role = values[index];
              else if (header.includes('id') || header === 'id') user.id = values[index];
            }
          });
          
          // Fallback: use position if headers not recognized
          if (!user.name && values[1]) user.name = values[1];
          if (!user.email && values[2]) user.email = values[2];
          if (!user.password && values[3]) user.password = values[3];
          
          if (user.name && user.email) {
            users.push(user);
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Parse error: ${error.message}`);
  }
  
  return users;
}

// Function to import from any format
async function importFromFile(filename) {
  try {
    console.log('🚀 SmartLend Flexible Import Tool');
    console.log('=================================');
    
    if (!filename || !fs.existsSync(filename)) {
      console.log(`❌ File not found: ${filename}`);
      return;
    }
    
    const content = fs.readFileSync(filename, 'utf-8');
    const users = parseData(content, filename);
    
    if (users.length === 0) {
      console.log('❌ No valid users found in file');
      console.log('Expected format: name, email, password (minimum)');
      return;
    }
    
    console.log(`📄 Found ${users.length} users in ${filename}`);
    console.log(`🔄 Starting import...`);
    
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Database connected');
    
    let imported = 0, skipped = 0, errors = 0;
    
    for (const [index, userData] of users.entries()) {
      try {
        if (!userData.email || !userData.name) {
          console.log(`⚠️  ${index + 1}: Missing name or email - skipping`);
          errors++;
          continue;
        }
        
        // Check if exists
        const existing = await User.findOne({ where: { email: userData.email } });
        if (existing) {
          console.log(`⚠️  ${index + 1}: ${userData.email} already exists - skipping`);
          skipped++;
          continue;
        }
        
        // Process password
        let hashedPassword;
        const password = userData.password || 'defaultPass123';
        
        if (isPasswordHashed(password)) {
          hashedPassword = password;
        } else {
          hashedPassword = await bcrypt.hash(password, 10);
        }
        
        // Determine role
        let role = 'user';
        if (userData.role === 'admin' || 
            userData.email.toLowerCase().includes('admin') || 
            userData.name.toLowerCase().includes('admin')) {
          role = 'admin';
        }
        
        // Create user
        await User.create({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          department: userData.department || 'Imported',
          role: role,
          isActive: true,
          password: hashedPassword
        });
        
        console.log(`✅ ${index + 1}: ${userData.name} (${userData.email}) [${role}]`);
        imported++;
        
      } catch (error) {
        console.error(`❌ ${index + 1}: Error - ${error.message}`);
        errors++;
      }
    }
    
    console.log('\n📊 Final Results:');
    console.log(`✅ Imported: ${imported} users`);
    console.log(`⚠️  Skipped: ${skipped} users`);
    console.log(`❌ Errors: ${errors} users`);
    console.log(`📋 Total: ${users.length} users processed`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Connection closed');
  }
}

// Create example files
function createExamples() {
  console.log('📄 Creating example files...');
  
  // CSV example
  const csvExample = `name,email,password,phone,department,role
Nida Aprilatul Hasanah,nida_aprilatul@smkind-mm2100.sch.id,$2b$10$hash1,,SMK Industri,user
Astri Afni Wulandari,astriafniwulandari@gmail.com,$2b$10$hash2,,SMK Industri,user
Admin User,admin@school.com,adminpass123,+628123456,Admin,admin`;
  
  // Tab-separated example
  const tsvExample = `name	email	password	phone	department
John Doe	john@example.com	pass123	+123456	IT
Jane Smith	jane@example.com	pass456	+789012	HR`;
  
  // Pipe-separated example
  const pipeExample = `name|email|password|phone|department
Bob Wilson|bob@example.com|bobpass|+111222|Engineering
Alice Brown|alice@example.com|alicepass|+333444|Marketing`;
  
  // JSON example
  const jsonExample = `[
  {
    "name": "Student 1",
    "email": "student1@school.com",
    "password": "$2b$10$hashedpassword1",
    "department": "Class A"
  },
  {
    "name": "Student 2", 
    "email": "student2@school.com",
    "password": "plainpassword",
    "department": "Class B"
  }
]`;
  
  fs.writeFileSync('example-csv.csv', csvExample);
  fs.writeFileSync('example-tsv.tsv', tsvExample);
  fs.writeFileSync('example-pipe.txt', pipeExample);
  fs.writeFileSync('example-json.json', jsonExample);
  
  console.log('✅ Created example files:');
  console.log('  - example-csv.csv (comma-separated)');
  console.log('  - example-tsv.tsv (tab-separated)');
  console.log('  - example-pipe.txt (pipe-separated)');
  console.log('  - example-json.json (JSON format)');
  console.log('\n🎯 Usage:');
  console.log('  node import-flexible.js your-data.csv');
  console.log('  node import-flexible.js your-data.txt');
  console.log('  node import-flexible.js your-data.json');
}

// Command line
const command = process.argv[2];

if (command === 'examples') {
  createExamples();
} else if (command) {
  importFromFile(command);
} else {
  console.log(`
🚀 SmartLend Flexible Import Tool
=================================

This tool can import users from various formats:
✅ CSV (comma-separated)
✅ TSV (tab-separated)  
✅ Pipe-separated (|)
✅ Semicolon-separated (;)
✅ JSON format
✅ Auto-detect separators
✅ Auto-detect columns

Usage:
  node import-flexible.js <filename>    # Import from file
  node import-flexible.js examples      # Create example files

Examples:
  node import-flexible.js users.csv     # Import CSV
  node import-flexible.js data.txt      # Import text file
  node import-flexible.js users.json    # Import JSON

Supported Formats:
- Any file with name, email, password columns
- Headers optional (auto-detected)
- Multiple separator types supported
- Preserves existing password hashes
- Auto-assigns admin role for admin emails

Just paste your 113 users data into any text file and run!
`);
}
