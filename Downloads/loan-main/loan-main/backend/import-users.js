const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// PostgreSQL connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:tAcyywGrcGlyNctqFVoACoyEMGMDgFjH@trolley.proxy.rlwy.net:25351/railway';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: console.log,
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

// Sample user data based on your screenshot
// You can replace this with your actual data
const userData = [
  {
    id: '00b2accd-538e-4cf-9105-e7a2882abaff',
    name: 'Nida Aprilatul Hasanah',
    email: 'nida_aprilatul@smkind-mm2100.sch.id',
    password: '$2b$10$...zoxtk43r' // This is already hashed
  },
  {
    id: '027bc792-5e11-4047-a85e-9944b9395330',
    name: 'Astri Afni Wulandari',
    email: 'astriafniwulandari@gmail.com',
    password: '$2b$10$LbnMGOO' // This is already hashed
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

// Function to import users
async function importUsers() {
  try {
    console.log('🔄 Starting user import process...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync();
    console.log('✅ Database models synced');
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const user of userData) {
      try {
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
        
        // Prepare user data for insertion
        const userData_new = {
          name: user.name,
          email: user.email,
          phone: null, // Set default values
          department: 'Imported', // Mark as imported
          role: user.email.includes('admin') ? 'admin' : 'user', // Determine role based on email
          isActive: true,
          password: user.password.startsWith('$2') ? user.password : await bcrypt.hash(user.password, 10)
        };
        
        // Create new user
        const newUser = await User.create(userData_new);
        console.log(`✅ User imported: ${newUser.name} (${newUser.email})`);
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
    // Close database connection
    await sequelize.close();
    console.log('🔒 Database connection closed');
  }
}

// Function to validate and format user data from external source
function validateAndFormatUserData(externalUsers) {
  return externalUsers.map(user => ({
    id: user.id,
    name: user.name || 'Unknown User',
    email: user.email,
    password: user.password,
    phone: user.phone || null,
    department: user.department || 'Imported',
    role: user.role || (user.email && user.email.includes('admin') ? 'admin' : 'user')
  })).filter(user => user.email && user.name && user.password);
}

// Export function for use in other scripts
module.exports = {
  importUsers,
  validateAndFormatUserData,
  User,
  sequelize
};

// Run import if this file is executed directly
if (require.main === module) {
  console.log('🚀 Starting SmartLend User Import Tool');
  console.log('=====================================');
  importUsers().catch(console.error);
}
