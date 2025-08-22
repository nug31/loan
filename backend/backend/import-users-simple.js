const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// PostgreSQL connection (destination database - SmartLend)
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

// Define PostgreSQL User model (destination)
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

// Sample data based on your screenshot - you can update this array with more users
const sampleUserData = [
  {
    id: '00b2accd-538e-4cf-9105-e7a2882abaff',
    name: 'Nida Aprilatul Hasanah',
    email: 'nida_aprilatul@smkind-mm2100.sch.id',
    password: '$2b$10$zoxtk43r'
  },
  {
    id: '027bc792-5e11-4047-a85e-9944b9395330',
    name: 'Astri Afni Wulandari',
    email: 'astriafniwulandari@gmail.com',
    password: '$2b$10$LbnMGOO'
  },
  {
    id: '10',
    name: 'Intan Chaya',
    email: 'intanchaya21@gmail.com',
    password: '$2a$10$QnDajj4OZ'
  },
  {
    id: '11',
    name: 'Ridwan',
    email: 'ridwanfarid213@gmail.com',
    password: 'Ridwanganteng123'
  },
  {
    id: '166628bd-03c4-4b17-b37b-583bc734e25',
    name: 'Okxy Ixganda',
    email: 'okxy.ixganda@smkind-mm2100.sch.id',
    password: '$2b$10$t7QY7JlF'
  },
  {
    id: '18',
    name: 'Reza Maulana',
    email: 'mreza3074@gmail.com',
    password: '$2a$10$D5n5rjQu'
  },
  {
    id: '19e051b2-8ef4-4905-87df-c121c72b24c6',
    name: 'Admin Test',
    email: 'admin.test@example.com',
    password: '$2a$10$HR0vBijB'
  },
  {
    id: '1a6e97af-8968-4277-aeec-f89aba7910eb',
    name: 'Kiki',
    email: 'kikiwidhiaswara@smkind-mm2100.sch.id',
    password: '$2b$10$g8wm86S'
  },
  {
    id: '1c419f39e-3b92-419e-9af7-83dc6395e9ff',
    name: 'Dwi N',
    email: 'dwinugraha@smkind-mm2100.sch.id',
    password: '$2b$10$ThBQYq1'
  },
  {
    id: '22b33c4a-1714-44df-8e85-7ee110e88001',
    name: 'Dafiq',
    email: 'dafiq_najiyullah@smkind-mm2100.sch.id',
    password: '$2b$10$/sYfCqT$'
  }
];

// Function to determine if password is already hashed
function isPasswordHashed(password) {
  return password && (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));
}

// Function to import users (from sample data or custom array)
async function importUsers(userData = sampleUserData) {
  try {
    console.log('🔄 Starting user import to SmartLend database...');
    
    // Connect to PostgreSQL
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ PostgreSQL connection established');
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    console.log(`\n🔄 Processing ${userData.length} users...`);
    
    for (const [index, user] of userData.entries()) {
      try {
        console.log(`\n📋 Processing user ${index + 1}/${userData.length}: ${user.name}`);
        
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
        
        // Determine role
        let userRole = 'user';
        if (user.email.toLowerCase().includes('admin') || 
            user.name.toLowerCase().includes('admin')) {
          userRole = 'admin';
        }
        
        // Prepare user data
        const newUserData = {
          name: user.name,
          email: user.email,
          phone: user.phone || null,
          department: user.department || 'SMK Industri',
          role: userRole,
          isActive: true,
          password: hashedPassword
        };
        
        // Create user
        const newUser = await User.create(newUserData);
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
    console.log(`📋 Total processed: ${userData.length} users`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

// Interactive function to add more users
async function addMoreUsers() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };
  
  const newUsers = [];
  
  console.log('\n🆕 Add More Users');
  console.log('================');
  console.log('Enter user details (press Enter with empty name to finish):\n');
  
  while (true) {
    const name = await askQuestion('Name: ');
    if (!name.trim()) break;
    
    const email = await askQuestion('Email: ');
    const password = await askQuestion('Password (or leave empty for default): ') || 'defaultPass123';
    const department = await askQuestion('Department (optional): ') || 'SMK Industri';
    const role = await askQuestion('Role (admin/user, default=user): ') || 'user';
    
    newUsers.push({
      name: name.trim(),
      email: email.trim(),
      password,
      department,
      role: role === 'admin' ? 'admin' : 'user'
    });
    
    console.log(`✅ Added: ${name} (${email})\n`);
  }
  
  rl.close();
  
  if (newUsers.length > 0) {
    console.log(`\n🔄 Importing ${newUsers.length} new users...`);
    await importUsers(newUsers);
  } else {
    console.log('\n⚠️  No new users to import');
  }
}

// Function to check current users in SmartLend
async function checkCurrentUsers() {
  try {
    console.log('🔍 Checking current users in SmartLend database...');
    
    await sequelize.authenticate();
    await sequelize.sync();
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'department', 'createdAt'],
      order: [['name', 'ASC']]
    });
    
    console.log(`\n📊 Found ${users.length} users in SmartLend database:`);
    console.log('================================================');
    
    if (users.length > 0) {
      console.table(users.map(user => ({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        created: user.createdAt?.toISOString().split('T')[0]
      })));
    } else {
      console.log('🔍 No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🚀 SmartLend User Import Tool (Simple Version)');
  console.log('==============================================');
  
  switch (command) {
    case 'import':
      console.log('📥 Importing sample users...');
      importUsers();
      break;
    case 'add':
      addMoreUsers();
      break;
    case 'check':
      checkCurrentUsers();
      break;
    default:
      console.log(`
Available Commands:
==================

📥 Import sample users:    node import-users-simple.js import
👥 Add more users:         node import-users-simple.js add  
🔍 Check current users:    node import-users-simple.js check

Instructions:
=============

1. To import the sample users from your MySQL data:
   node import-users-simple.js import

2. To add more users interactively:
   node import-users-simple.js add

3. To check what users are already in SmartLend:
   node import-users-simple.js check

Note: You can edit the sampleUserData array in this file to add more users
      from your MySQL database screenshot.
`);
      break;
  }
}

module.exports = {
  importUsers,
  addMoreUsers,
  checkCurrentUsers,
  User,
  sequelize
};
