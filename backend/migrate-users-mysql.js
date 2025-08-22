const mysql = require('mysql2/promise');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// MySQL connection (source database)
const MYSQL_CONFIG = {
  host: 'nozomi.proxy.rlwy.net',
  user: 'root',
  password: 'pv0cQbzIDAbbtcdozpbMvCdIDDEmenwKO',
  database: 'railway',
  port: 21817,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  ssl: {
    rejectUnauthorized: false
  }
};

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

// Function to determine if password is already hashed
function isPasswordHashed(password) {
  return password && (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));
}

// Function to migrate users from MySQL to PostgreSQL
async function migrateUsers() {
  let mysqlConnection = null;
  
  try {
    console.log('🔄 Starting user migration from MySQL to PostgreSQL...');
    
    // Connect to MySQL (source)
    console.log('🔗 Connecting to MySQL database...');
    mysqlConnection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ MySQL connection established');
    
    // Connect to PostgreSQL (destination)
    console.log('🔗 Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('✅ PostgreSQL connection established');
    
    // Query all users from MySQL
    console.log('📊 Fetching users from MySQL...');
    const [mysqlUsers] = await mysqlConnection.execute('SELECT * FROM users ORDER BY name');
    console.log(`📄 Found ${mysqlUsers.length} users in MySQL database`);
    
    if (mysqlUsers.length === 0) {
      console.log('⚠️  No users found in MySQL database');
      return;
    }
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Process each user
    for (const [index, mysqlUser] of mysqlUsers.entries()) {
      try {
        console.log(`\n🔄 Processing user ${index + 1}/${mysqlUsers.length}: ${mysqlUser.name}`);
        
        // Check if user already exists in PostgreSQL
        const existingUser = await User.findOne({
          where: {
            email: mysqlUser.email
          }
        });
        
        if (existingUser) {
          console.log(`⚠️  User already exists in PostgreSQL: ${mysqlUser.email}`);
          skippedCount++;
          continue;
        }
        
        // Prepare password
        let hashedPassword;
        if (isPasswordHashed(mysqlUser.password)) {
          hashedPassword = mysqlUser.password;
          console.log(`🔐 Using existing hash for: ${mysqlUser.email}`);
        } else {
          hashedPassword = await bcrypt.hash(mysqlUser.password, 10);
          console.log(`🔐 Generated new hash for: ${mysqlUser.email}`);
        }
        
        // Determine role based on email or name
        let userRole = 'user';
        if (mysqlUser.email.toLowerCase().includes('admin') || 
            mysqlUser.name.toLowerCase().includes('admin')) {
          userRole = 'admin';
        }
        
        // Prepare user data for PostgreSQL
        const userData = {
          name: mysqlUser.name,
          email: mysqlUser.email,
          phone: mysqlUser.phone || null,
          department: mysqlUser.department || 'Migrated from MySQL',
          role: userRole,
          isActive: true,
          password: hashedPassword
        };
        
        // Create user in PostgreSQL
        const newUser = await User.create(userData);
        console.log(`✅ User migrated: ${newUser.name} (${newUser.email}) [${newUser.role}]`);
        importedCount++;
        
      } catch (userError) {
        console.error(`❌ Error migrating user ${mysqlUser.email}:`, userError.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${importedCount} users`);
    console.log(`⚠️  Skipped (already exists): ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log(`📋 Total processed: ${mysqlUsers.length} users`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close connections
    if (mysqlConnection) {
      await mysqlConnection.end();
      console.log('🔒 MySQL connection closed');
    }
    
    await sequelize.close();
    console.log('🔒 PostgreSQL connection closed');
  }
}

// Function to preview users from MySQL without migrating
async function previewMySQLUsers() {
  let mysqlConnection = null;
  
  try {
    console.log('🔍 Previewing users in MySQL database...');
    
    // Connect to MySQL
    mysqlConnection = await mysql.createConnection(MYSQL_CONFIG);
    console.log('✅ MySQL connection established');
    
    // Query users
    const [users] = await mysqlConnection.execute(`
      SELECT id, name, email, 
             CASE 
               WHEN password LIKE '$2%' THEN 'HASHED' 
               ELSE 'PLAIN' 
             END as password_type,
             created_at
      FROM users 
      ORDER BY name 
      LIMIT 20
    `);
    
    console.log(`\n📊 Found ${users.length} users (showing first 20):`);
    console.log('=====================================');
    console.table(users);
    
    // Get total count
    const [countResult] = await mysqlConnection.execute('SELECT COUNT(*) as total FROM users');
    console.log(`\n📈 Total users in MySQL: ${countResult[0].total}`);
    
  } catch (error) {
    console.error('❌ Preview failed:', error);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}

// Function to check table structure
async function checkMySQLTableStructure() {
  let mysqlConnection = null;
  
  try {
    console.log('🔍 Checking MySQL table structure...');
    
    mysqlConnection = await mysql.createConnection(MYSQL_CONFIG);
    
    // Get table structure
    const [columns] = await mysqlConnection.execute('DESCRIBE users');
    
    console.log('\n📋 MySQL users table structure:');
    console.log('================================');
    console.table(columns);
    
    // Get sample data
    const [sample] = await mysqlConnection.execute('SELECT * FROM users LIMIT 3');
    console.log('\n📄 Sample data:');
    console.log('===============');
    console.table(sample);
    
  } catch (error) {
    console.error('❌ Structure check failed:', error);
  } finally {
    if (mysqlConnection) {
      await mysqlConnection.end();
    }
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🚀 SmartLend MySQL to PostgreSQL Migration Tool');
  console.log('===============================================');
  
  switch (command) {
    case 'preview':
      previewMySQLUsers();
      break;
    case 'structure':
      checkMySQLTableStructure();
      break;
    case 'migrate':
      migrateUsers();
      break;
    default:
      console.log(`
Usage:
  Preview users:     node migrate-users-mysql.js preview
  Check structure:   node migrate-users-mysql.js structure  
  Migrate users:     node migrate-users-mysql.js migrate

Examples:
  node migrate-users-mysql.js preview    # See users in MySQL
  node migrate-users-mysql.js migrate    # Migrate all users
`);
      break;
  }
}

module.exports = {
  migrateUsers,
  previewMySQLUsers,
  checkMySQLTableStructure,
  User,
  sequelize
};
