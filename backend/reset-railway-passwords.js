const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

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

// Railway users yang diimport dengan password sementara
const railwayUserEmails = [
  'fitriyani240909@gmail.com',
  'ekayuliana@smkind-mm2100.sch.id',
  'salsafatiaazharazhar@gmail.com',
  'yusupazizi039@gmail.com',
  'dikkysetia20@gmail.com',
  'viany_lingga_revi@smkind-mm2100.sch.id',
  'ressa.hadi@smkind-mm2100.sch.id',
  'ana@gudangmitra.com',
  'tidtayaputerilarasanty@smkind-mm2100.sch.id',
  'muhamad.yudi.dc@gmail.com',
  'esaapriyadi@gmail.com',
  'niadesnatahati@smkind-mm2100.sch.id',
  'alice.brown@example.com'
];

// Function to reset passwords for Railway users
async function resetRailwayPasswords() {
  try {
    console.log('🔄 Starting password reset for Railway users...');
    console.log('================================================');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync models
    await sequelize.sync();
    console.log('✅ Database models synced');
    
    let updatedCount = 0;
    let notFoundCount = 0;
    
    console.log(`\n🔄 Processing ${railwayUserEmails.length} users...`);
    
    for (const [index, email] of railwayUserEmails.entries()) {
      try {
        // Find user by email
        const user = await User.findOne({
          where: { email: email }
        });
        
        if (!user) {
          console.log(`⚠️  User not found: ${email}`);
          notFoundCount++;
          continue;
        }
        
        // Generate new password hash for "password123"
        const newPassword = 'password123';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update user password
        await user.update({ password: hashedPassword });
        
        console.log(`✅ Password reset for: ${user.name} (${email})`);
        console.log(`   Login with: ${email} / password123`);
        updatedCount++;
        
      } catch (userError) {
        console.error(`❌ Error updating user ${email}:`, userError.message);
      }
    }
    
    console.log('\n📊 Reset Summary:');
    console.log('==================');
    console.log(`✅ Successfully updated: ${updatedCount} users`);
    console.log(`❌ Not found: ${notFoundCount} users`);
    console.log(`📋 Total processed: ${railwayUserEmails.length} users`);
    
    if (updatedCount > 0) {
      console.log(`\n🔐 Login Instructions:`);
      console.log(`=====================`);
      console.log(`All Railway users can now login with:`);
      console.log(`Password: password123`);
      console.log(``);
      console.log(`Example logins:`);
      console.log(`- fitriyani240909@gmail.com / password123`);
      console.log(`- ekayuliana@smkind-mm2100.sch.id / password123`);
      console.log(`- ana@gudangmitra.com / password123`);
    }
    
  } catch (error) {
    console.error('❌ Password reset failed:', error.message);
    throw error;
  } finally {
    await sequelize.close();
    console.log('\n🔒 Database connection closed');
  }
}

// Function to test a specific user login
async function testUserLogin(email, password) {
  try {
    console.log(`🔍 Testing login for: ${email}`);
    
    await sequelize.authenticate();
    await sequelize.sync();
    
    const user = await User.findOne({
      where: { email: email }
    });
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return false;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (isValidPassword) {
      console.log(`✅ Login successful for: ${user.name} (${email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Department: ${user.department || 'N/A'}`);
      console.log(`   Active: ${user.isActive}`);
      return true;
    } else {
      console.log(`❌ Invalid password for: ${email}`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Login test failed:`, error.message);
    return false;
  } finally {
    await sequelize.close();
  }
}

// Function to show all Railway users
async function showRailwayUsers() {
  try {
    console.log('📋 Railway Users Status');
    console.log('======================');
    
    await sequelize.authenticate();
    await sequelize.sync();
    
    for (const email of railwayUserEmails) {
      const user = await User.findOne({
        where: { email: email },
        attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt']
      });
      
      if (user) {
        console.log(`✅ ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
        console.log('');
      } else {
        console.log(`❌ Not found: ${email}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔐 Railway Users Password Reset Tool
===================================

Usage:
  node reset-railway-passwords.js reset       # Reset all Railway users passwords to 'password123'
  node reset-railway-passwords.js show        # Show all Railway users status
  node reset-railway-passwords.js test <email> <password>  # Test login for specific user

Examples:
  node reset-railway-passwords.js reset
  node reset-railway-passwords.js test fitriyani240909@gmail.com password123
  node reset-railway-passwords.js show
`);
    process.exit(0);
  }
  
  const command = args[0];
  
  if (command === 'reset') {
    console.log('🚀 Starting Railway Users Password Reset');
    console.log('========================================');
    resetRailwayPasswords();
  } else if (command === 'test' && args[1] && args[2]) {
    const email = args[1];
    const password = args[2];
    console.log('🚀 Testing User Login');
    console.log('====================');
    testUserLogin(email, password);
  } else if (command === 'show') {
    console.log('🚀 Showing Railway Users');
    console.log('========================');
    showRailwayUsers();
  } else {
    console.error('❌ Invalid command or missing parameters');
    process.exit(1);
  }
}

module.exports = {
  resetRailwayPasswords,
  testUserLogin,
  showRailwayUsers
};
