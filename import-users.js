import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend folder
dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

// PostgreSQL connection (SmartLend database)
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

// Define User model (same as in server-pg.js)
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

// User data from your MySQL database (from screenshot)
const usersToImport = [
  {
    name: 'Nida Aprilatul Hasanah',
    email: 'nida_aprilatul@smkind-mm2100.sch.id',
    password: '$2b$10$zoxtk43r',
    department: 'SMK Industri'
  },
  {
    name: 'Astri Afni Wulandari', 
    email: 'astriafniwulandari@gmail.com',
    password: '$2b$10$LbnMGOO',
    department: 'SMK Industri'
  },
  {
    name: 'Intan Chaya',
    email: 'intanchaya21@gmail.com', 
    password: '$2a$10$QnDajj4OZ',
    department: 'SMK Industri'
  },
  {
    name: 'Ridwan',
    email: 'ridwanfarid213@gmail.com',
    password: 'Ridwanganteng123',
    department: 'SMK Industri'
  },
  {
    name: 'Okxy Ixganda',
    email: 'okxy.ixganda@smkind-mm2100.sch.id',
    password: '$2b$10$t7QY7JlF',
    department: 'SMK Industri'  
  },
  {
    name: 'Reza Maulana',
    email: 'mreza3074@gmail.com',
    password: '$2a$10$D5n5rjQu',
    department: 'SMK Industri'
  },
  {
    name: 'Admin Test',
    email: 'admin.test@example.com',
    password: '$2a$10$HR0vBijB',
    department: 'Admin'
  },
  {
    name: 'Kiki',
    email: 'kikiwidhiaswara@smkind-mm2100.sch.id',
    password: '$2b$10$g8wm86S',
    department: 'SMK Industri'
  },
  {
    name: 'Dwi N',
    email: 'dwinugraha@smkind-mm2100.sch.id',
    password: '$2b$10$ThBQYq1',
    department: 'SMK Industri'
  },
  {
    name: 'Dafiq',
    email: 'dafiq_najiyullah@smkind-mm2100.sch.id',
    password: '$2b$10$/sYfCqT$',
    department: 'SMK Industri'
  }
];

function isPasswordHashed(password) {
  return password && (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));
}

async function importUsers() {
  try {
    console.log('🚀 SmartLend User Import Tool');
    console.log('=============================');
    console.log('🔄 Starting user import process...');
    
    // Connect to database
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ Database connection established');
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const [index, user] of usersToImport.entries()) {
      try {
        console.log(`\n📋 Processing ${index + 1}/${usersToImport.length}: ${user.name}`);
        
        // Check if user exists
        const existingUser = await User.findOne({
          where: { email: user.email }
        });
        
        if (existingUser) {
          console.log(`⚠️  User already exists: ${user.email}`);
          skippedCount++;
          continue;
        }
        
        // Handle password
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
        
        // Create user
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          phone: null,
          department: user.department,
          role: userRole,
          isActive: true,
          password: hashedPassword
        });
        
        console.log(`✅ User imported: ${newUser.name} (${newUser.email}) [${newUser.role}]`);
        importedCount++;
        
      } catch (userError) {
        console.error(`❌ Error importing ${user.email}:`, userError.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${importedCount} users`);
    console.log(`⚠️  Skipped (already exists): ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📋 Total processed: ${usersToImport.length} users`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

async function checkUsers() {
  try {
    console.log('🔍 Checking users in SmartLend database...');
    
    await sequelize.authenticate();
    await sequelize.sync();
    
    const users = await User.findAll({
      attributes: ['name', 'email', 'role', 'department', 'createdAt'],
      order: [['name', 'ASC']]
    });
    
    console.log(`\n📊 Found ${users.length} users:`);
    console.log('========================');
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 ${user.email}`);  
        console.log(`   👤 ${user.role}`);
        console.log(`   🏢 ${user.department}`);
        console.log(`   📅 ${user.createdAt?.toISOString().split('T')[0]}`);
        console.log('');
      });
    } else {
      console.log('🔍 No users found');
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Command line interface
const command = process.argv[2];

if (command === 'import') {
  importUsers();
} else if (command === 'check') {
  checkUsers();
} else {
  console.log(`
🚀 SmartLend User Import Tool
=============================

Usage:
  node import-users.js import    # Import users from MySQL data
  node import-users.js check     # Check existing users

The script will import ${usersToImport.length} users from your MySQL database
into the SmartLend PostgreSQL database.
`);
}
