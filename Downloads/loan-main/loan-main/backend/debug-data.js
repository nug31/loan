const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/loan_management', {
  dialect: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
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
    unique: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  }
});

// Item model
const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
});

// Loan model
const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'returned', 'overdue'),
    defaultValue: 'pending'
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

// Associations
User.hasMany(Loan, { foreignKey: 'userId' });
Loan.belongsTo(User, { foreignKey: 'userId' });
Item.hasMany(Loan, { foreignKey: 'itemId' });
Loan.belongsTo(Item, { foreignKey: 'itemId' });

async function debugData() {
  try {
    console.log('🔍 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('\n📊 DEBUGGING DASHBOARD DATA');
    console.log('=' .repeat(50));

    // Get all users
    const users = await User.findAll();
    console.log('\n👥 USERS:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Get all items
    const items = await Item.findAll();
    console.log('\n📦 ITEMS:');
    items.forEach(item => {
      console.log(`  - ${item.name} (${item.category}) - Qty: ${item.quantity}, Available: ${item.availableQuantity}`);
    });

    // Get all loans with details
    const loans = await Loan.findAll({
      include: [
        { model: User, attributes: ['name', 'email'] },
        { model: Item, attributes: ['name', 'category'] }
      ]
    });
    
    console.log('\n📋 LOANS:');
    loans.forEach(loan => {
      console.log(`  - ${loan.User.name} borrowed ${loan.Item.name}`);
      console.log(`    Status: ${loan.status}, Qty: ${loan.quantity}`);
      console.log(`    Start: ${loan.startDate}, End: ${loan.endDate}`);
      console.log(`    Purpose: ${loan.purpose || 'N/A'}`);
      console.log('');
    });

    // Calculate stats
    console.log('\n📊 DASHBOARD STATS CALCULATION:');
    console.log('-'.repeat(30));
    
    const totalItems = items.length;
    const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'approved').length;
    const pendingRequests = loans.filter(l => l.status === 'pending').length;
    const overdueItems = loans.filter(l => l.status === 'overdue').length;
    const returnedLoans = loans.filter(l => l.status === 'returned').length;

    console.log(`Total Items: ${totalItems}`);
    console.log(`Active Loans: ${activeLoans} (status: 'active' OR 'approved')`);
    console.log(`Pending Requests: ${pendingRequests} (status: 'pending')`);
    console.log(`Overdue Items: ${overdueItems} (status: 'overdue')`);
    console.log(`Returned Loans: ${returnedLoans} (status: 'returned')`);

    console.log('\n🔍 LOANS BY STATUS:');
    const statusCounts = {};
    loans.forEach(loan => {
      statusCounts[loan.status] = (statusCounts[loan.status] || 0) + 1;
    });
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    console.log('\n✅ Debug completed');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

debugData();
