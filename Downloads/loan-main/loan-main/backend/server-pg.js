const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://localhost:5179',
  'https://loan-management-nug.netlify.app',
  'https://main--loan-management-nug.netlify.app',
  /\.netlify\.app$/,
  /\.railway\.app$/,
  /\.up\.railway\.app$/
];

// Log CORS for debugging
console.log('🔒 CORS allowed origins:', allowedOrigins);

// Temporary: Allow all origins for debugging
app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

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

// Simple Item model for testing
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
    defaultValue: 'good'
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
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  maintenanceSchedule: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Category model
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  requestDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  actualReturnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'returned', 'overdue'),
    defaultValue: 'pending'
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Define associations after all models are defined
User.hasMany(Loan, { foreignKey: 'userId', as: 'loans' });
Loan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Item.hasMany(Loan, { foreignKey: 'itemId', as: 'loans' });
Loan.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

User.hasMany(Loan, { foreignKey: 'approvedBy', as: 'approvedLoans' });
Loan.belongsTo(User, { foreignKey: 'approvedBy', as: 'approver' });



// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'PostgreSQL' });
});

// Dashboard Stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    console.log('📊 Getting dashboard stats...');

    // Get total items count
    const totalItems = await Item.count();

    // Get active loans count (only 'active' status, not 'approved')
    const activeLoans = await Loan.count({
      where: { status: 'active' }
    });

    // Get pending requests count
    const pendingRequests = await Loan.count({
      where: { status: 'pending' }
    });

    // Get overdue items count
    const overdueItems = await Loan.count({
      where: { status: 'overdue' }
    });

    // Get total users count
    const totalUsers = await User.count();

    // Get category breakdown using raw SQL
    const categoryBreakdownResult = await sequelize.query(`
      SELECT c.name as category, COUNT(i.id) as count
      FROM "Categories" c
      LEFT JOIN "Items" i ON c.name = i.category
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `, { type: sequelize.QueryTypes.SELECT });

    const categoryBreakdown = categoryBreakdownResult.map(row => ({
      category: row.category,
      count: parseInt(row.count) || 0
    }));

    // Get loan trends for the past 7 days using raw SQL
    const loanTrendsResult = await sequelize.query(`
      SELECT
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Loans"
      WHERE "createdAt" >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `, { type: sequelize.QueryTypes.SELECT });

    const loanTrends = loanTrendsResult.map(row => ({
      date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
      count: parseInt(row.count)
    }));

    const dashboardStats = {
      totalItems,
      activeLoans,
      pendingRequests,
      overdueItems,
      totalUsers,
      categoryBreakdown,
      loanTrends
    };

    console.log('✅ Dashboard stats retrieved:', dashboardStats);
    res.json(dashboardStats);

  } catch (error) {
    console.error('❌ Error getting dashboard stats:', error);
    res.status(500).json({
      error: 'Failed to get dashboard stats',
      details: error.message
    });
  }
});

// Recent Activity endpoint
app.get('/api/dashboard/recent-activity', async (req, res) => {
  try {
    console.log('📊 Getting recent activity...');

    const recentActivityResult = await sequelize.query(`
      SELECT
        l.id,
        l.status,
        l."createdAt",
        l."updatedAt",
        u.name as user_name,
        i.name as item_name
      FROM "Loans" l
      JOIN "Users" u ON l."userId" = u.id
      JOIN "Items" i ON l."itemId" = i.id
      ORDER BY l."updatedAt" DESC
      LIMIT 10
    `, { type: sequelize.QueryTypes.SELECT });

    const recentActivity = recentActivityResult.map(row => ({
      id: row.id,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      userName: row.user_name,
      itemName: row.item_name
    }));

    console.log('✅ Recent activity retrieved:', recentActivity.length, 'activities');
    res.json(recentActivity);

  } catch (error) {
    console.error('❌ Error getting recent activity:', error);
    res.status(500).json({
      error: 'Failed to get recent activity',
      details: error.message
    });
  }
});


// Items endpoints
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.findAll({ where: { isActive: true } });
    console.log(`✅ GET /api/items - returning ${items.length} items`);
    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching items:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('❌ Error fetching item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const item = await Item.create(req.body);
    console.log(`✅ POST /api/items - created item: ${item.name}`);
    res.status(201).json(item);
  } catch (error) {
    console.error('❌ Error creating item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.update(req.body);
    console.log(`✅ PUT /api/items/${req.params.id} - updated item: ${item.name}`);
    res.json(item);
  } catch (error) {
    console.error('❌ Error updating item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    await item.update({ isActive: false });
    console.log(`✅ DELETE /api/items/${req.params.id} - deactivated item: ${item.name}`);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting item:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true } });
    console.log(`✅ GET /api/categories - returning ${categories.length} categories`);
    res.json(categories);
  } catch (error) {
    console.error('❌ Error fetching categories:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    console.log(`✅ POST /api/categories - created category: ${category.name}`);
    res.status(201).json(category);
  } catch (error) {
    console.error('❌ Error creating category:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update(req.body);
    console.log(`✅ PUT /api/categories/${req.params.id} - updated category: ${category.name}`);
    res.json(category);
  } catch (error) {
    console.error('❌ Error updating category:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update({ isActive: false });
    console.log(`✅ DELETE /api/categories/${req.params.id} - deactivated category: ${category.name}`);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting category:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    console.log(`✅ Login successful for user: ${user.name} (${user.email})`);


    // Return user data (without password)
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.name.split(' ')[0] || user.name,
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      role: user.role,
      department: user.department,
      phoneNumber: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.json(userResponse);
  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('🔐 Registration request received:', { email: req.body.email, hasPassword: !!req.body.password });
    const { name, email, password, department, phone, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      department,
      phone,
      role,
      isActive: true
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    console.log(`✅ User registered: ${user.email}`);
    res.status(201).json({
      user: userWithoutPassword,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('❌ Error during registration:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Don't return passwords
      order: [['createdAt', 'ASC']]
    });
    console.log(`✅ GET /api/users - returning ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    // Remove password from response
    const { password, ...userWithoutPassword } = user.toJSON();
    console.log(`✅ POST /api/users - created user: ${user.name}`);
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update(req.body);
    // Remove password from response
    const { password, ...userWithoutPassword } = user.toJSON();
    console.log(`✅ PUT /api/users/${req.params.id} - updated user: ${user.name}`);
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ isActive: false });
    console.log(`✅ DELETE /api/users/${req.params.id} - deactivated user: ${user.name}`);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Loans endpoints
app.get('/api/loans', async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'department']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'category', 'location', 'images']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log(`✅ GET /api/loans - returning ${loans.length} loans`);
    res.json(loans);
  } catch (error) {
    console.error('❌ Error fetching loans:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/loans', async (req, res) => {
  try {
    console.log('🔄 Creating loan with data:', JSON.stringify(req.body, null, 2));
    console.log('🔄 Request headers:', req.headers);

    // Validate required fields
    const { userId, itemId, startDate, endDate } = req.body;
    if (!userId || !itemId || !startDate || !endDate) {
      console.error('❌ Missing required fields:', { userId, itemId, startDate, endDate });
      return res.status(400).json({
        error: 'Missing required fields: userId, itemId, startDate, endDate'
      });
    }

    // Check if user exists
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      console.error('❌ User not found:', userId);
      return res.status(400).json({
        error: 'User not found. Please login again.'
      });
    }

    // Check if item exists
    const itemExists = await Item.findByPk(itemId);
    if (!itemExists) {
      console.error('❌ Item not found:', itemId);
      return res.status(400).json({
        error: 'Item not found.'
      });
    }

    const loan = await Loan.create(req.body);

    // Fetch the created loan with associations
    const loanWithAssociations = await Loan.findByPk(loan.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'department']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'category', 'location', 'images']
        }
      ]
    });

    console.log(`✅ POST /api/loans - created loan for ${loanWithAssociations.user.name} requesting ${loanWithAssociations.item.name}`);


    res.status(201).json(loanWithAssociations);
  } catch (error) {
    console.error('❌ Error creating loan:', error.message);
    console.error('❌ Error details:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/loans/:id/approve', async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Get the item to update available quantity
    const item = await Item.findByPk(loan.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log(`🔄 Before approve: ${item.name} - Available: ${item.availableQuantity}, Requested: ${loan.quantity}`);

    // Check if there's enough available quantity
    if (item.availableQuantity < loan.quantity) {
      return res.status(400).json({
        error: `Not enough available quantity. Available: ${item.availableQuantity}, Requested: ${loan.quantity}`
      });
    }

    // Update item available quantity
    const newAvailableQuantity = item.availableQuantity - loan.quantity;
    await item.update({
      availableQuantity: newAvailableQuantity
    });

    console.log(`✅ After approve: ${item.name} - Available: ${newAvailableQuantity} (reduced by ${loan.quantity})`);

    // Verify the update
    const updatedItem = await Item.findByPk(loan.itemId);
    console.log(`🔍 Verification: ${updatedItem.name} - Available: ${updatedItem.availableQuantity}`);

    await loan.update({
      status: 'active', // Langsung masuk ke pinjaman aktif
      approvedBy: req.body.approvedBy,
      approvedAt: new Date()
    });

    const updatedLoan = await Loan.findByPk(loan.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'department']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'name', 'category', 'location', 'images']
        },
        {
          model: User,
          as: 'approver',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    console.log(`✅ PUT /api/loans/${req.params.id}/approve - approved loan for ${updatedLoan.user.name} (${updatedLoan.user.email}) - ${updatedLoan.item.name}`);


    res.json(updatedLoan);
  } catch (error) {
    console.error('❌ Error approving loan:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/loans/:id/reject', async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    await loan.update({
      status: 'rejected',
      approvedBy: req.body.approvedBy,
      approvedAt: new Date(),
      notes: req.body.notes || loan.notes
    });

    const updatedLoan = await Loan.findByPk(loan.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Item, as: 'item', attributes: ['id', 'name', 'category'] },
        { model: User, as: 'approver', attributes: ['id', 'name', 'email'] }
      ]
    });

    console.log(`✅ PUT /api/loans/${req.params.id}/reject - rejected loan`);


    res.json(updatedLoan);
  } catch (error) {
    console.error('❌ Error rejecting loan:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/loans/:id/return', async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check if loan is already returned
    if (loan.status === 'returned') {
      return res.status(400).json({ error: 'Loan has already been returned' });
    }

    // Only allow returning approved or active loans
    if (loan.status !== 'approved' && loan.status !== 'active') {
      return res.status(400).json({ error: 'Only approved or active loans can be returned' });
    }

    // Get the item to update available quantity
    const item = await Item.findByPk(loan.itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log(`🔄 Before return: ${item.name} - Available: ${item.availableQuantity}, Returning: ${loan.quantity}`);

    // Return the quantity back to available stock
    await item.update({
      availableQuantity: item.availableQuantity + loan.quantity
    });

    console.log(`✅ After return: ${item.name} - Available: ${item.availableQuantity + loan.quantity} (increased by ${loan.quantity})`);

    await loan.update({
      status: 'returned',
      actualReturnDate: new Date(),
      notes: req.body.notes || loan.notes
    });

    const updatedLoan = await Loan.findByPk(loan.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: Item, as: 'item', attributes: ['id', 'name', 'category'] },
        { model: User, as: 'approver', attributes: ['id', 'name', 'email'] }
      ]
    });

    console.log(`✅ PUT /api/loans/${req.params.id}/return - returned loan`);


    res.json(updatedLoan);
  } catch (error) {
    console.error('❌ Error returning loan:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Fix data endpoint - reset ROG Gaming Laptop quantity
app.post('/api/admin/fix-rog-quantity', async (req, res) => {
  try {
    const rogLaptop = await Item.findOne({
      where: { name: 'ROG Gaming Laptop' }
    });

    if (!rogLaptop) {
      return res.status(404).json({ error: 'ROG Gaming Laptop not found' });
    }

    // Count active loans for this item
    const activeLoans = await Loan.count({
      where: {
        itemId: rogLaptop.id,
        status: 'approved'
      }
    });

    const correctAvailableQuantity = rogLaptop.quantity - activeLoans;

    console.log(`🔧 Fixing ROG Gaming Laptop quantity:`);
    console.log(`   Total quantity: ${rogLaptop.quantity}`);
    console.log(`   Active loans: ${activeLoans}`);
    console.log(`   Current available: ${rogLaptop.availableQuantity}`);
    console.log(`   Correct available: ${correctAvailableQuantity}`);

    await rogLaptop.update({
      availableQuantity: correctAvailableQuantity
    });

    console.log(`✅ Fixed ROG Gaming Laptop quantity to ${correctAvailableQuantity}`);
    res.json({
      message: 'ROG Gaming Laptop quantity fixed',
      totalQuantity: rogLaptop.quantity,
      activeLoans,
      correctedAvailableQuantity: correctAvailableQuantity
    });
  } catch (error) {
    console.error('❌ Error fixing ROG quantity:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Upload endpoint (basic - accepts base64 images)
app.post('/api/upload', async (req, res) => {
  try {
    const { file, filename } = req.body;

    if (!file || !filename) {
      return res.status(400).json({ error: 'File and filename are required' });
    }

    // For now, just return a mock URL
    // In production, you would save the file and return the actual URL
    const mockUrl = `/images/${filename}`;

    console.log(`✅ File uploaded: ${filename}`);
    res.json({ url: mockUrl });
  } catch (error) {
    console.error('❌ Error uploading file:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Notification endpoints
app.get('/api/notifications', async (req, res) => {
  try {
    console.log('📡 Getting notifications...');
    
    // Get user role from query params or headers
    const userRole = req.query.role || req.headers['x-user-role'] || 'user';
    const userId = req.query.userId || req.headers['x-user-id'];
    
    console.log('👤 Fetching notifications for role:', userRole, 'userId:', userId);
    
    const notifications = [];
    
    // ADMIN NOTIFICATIONS - System-wide view
    if (userRole === 'admin') {
      // Get overdue loans (Darurat) - Admin sees all overdue
      const overdueLoans = await Loan.findAll({
        where: {
          status: 'active',
          endDate: {
            [Op.lt]: new Date()
          }
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'category']
          }
        ]
      });

      overdueLoans.forEach(loan => {
        const daysOverdue = Math.ceil(
          (new Date().getTime() - new Date(loan.endDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        notifications.push({
          id: `overdue-${loan.id}`,
          title: `${loan.item.name} Terlambat Dikembalikan`,
          message: `${loan.user.name} terlambat mengembalikan ${loan.item.name} selama ${daysOverdue} hari`,
          type: 'darurat',
          priority: 'high',
          timestamp: loan.endDate,
          user: loan.user.name,
          relatedId: loan.id,
          isRead: false
        });
      });
    } else {
      // USER NOTIFICATIONS - Only their own overdue loans
      if (userId) {
        const userOverdueLoans = await Loan.findAll({
          where: {
            userId: userId,
            status: 'active',
            endDate: {
              [Op.lt]: new Date()
            }
          },
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'category']
            }
          ]
        });

        userOverdueLoans.forEach(loan => {
          const daysOverdue = Math.ceil(
            (new Date().getTime() - new Date(loan.endDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          notifications.push({
            id: `overdue-${loan.id}`,
            title: `${loan.item.name} Terlambat Dikembalikan`,
            message: `Anda terlambat mengembalikan ${loan.item.name} selama ${daysOverdue} hari`,
            type: 'darurat',
            priority: 'high',
            timestamp: loan.endDate,
            relatedId: loan.id,
            isRead: false
          });
        });
      }
    }

    // Get items due soon (Tinggi)
    if (userRole === 'admin') {
      // Admin sees all due soon items
      const dueSoonLoans = await Loan.findAll({
        where: {
          status: 'active',
          endDate: {
            [Op.between]: [new Date(), new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)] // Next 2 days
          }
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'category']
          }
        ]
      });

      dueSoonLoans.forEach(loan => {
        const daysUntilDue = Math.ceil(
          (new Date(loan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        
        notifications.push({
          id: `due-soon-${loan.id}`,
          title: `${loan.item.name} Akan Jatuh Tempo`,
          message: `${loan.user.name} harus mengembalikan ${loan.item.name} dalam ${daysUntilDue} hari`,
          type: 'tinggi',
          priority: 'high',
          timestamp: new Date(),
          user: loan.user.name,
          relatedId: loan.id,
          isRead: false
        });
      });
    } else {
      // User sees only their own due soon items
      if (userId) {
        const userDueSoonLoans = await Loan.findAll({
          where: {
            userId: userId,
            status: 'active',
            endDate: {
              [Op.between]: [new Date(), new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)]
            }
          },
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'category']
            }
          ]
        });

        userDueSoonLoans.forEach(loan => {
          const daysUntilDue = Math.ceil(
            (new Date(loan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          
          notifications.push({
            id: `due-soon-${loan.id}`,
            title: `${loan.item.name} Akan Jatuh Tempo`,
            message: `Anda harus mengembalikan ${loan.item.name} dalam ${daysUntilDue} hari`,
            type: 'tinggi',
            priority: 'high',
            timestamp: new Date(),
            relatedId: loan.id,
            isRead: false
          });
        });
      }
    }

    // Get pending loans (Menunggu)
    if (userRole === 'admin') {
      // Admin sees all pending loan requests
      const pendingLoans = await Loan.findAll({
        where: { status: 'pending' },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'name', 'category']
          }
        ]
      });

      pendingLoans.forEach(loan => {
        notifications.push({
          id: `pending-${loan.id}`,
          title: `Permintaan Peminjaman Baru`,
          message: `${loan.user.name} mengajukan peminjaman ${loan.item.name}`,
          type: 'menunggu',
          priority: 'medium',
          timestamp: loan.requestDate,
          user: loan.user.name,
          relatedId: loan.id,
          isRead: false
        });
      });
    } else {
      // User sees only their own pending loans
      if (userId) {
        const userPendingLoans = await Loan.findAll({
          where: { 
            status: 'pending',
            userId: userId 
          },
          include: [
            {
              model: Item,
              as: 'item',
              attributes: ['id', 'name', 'category']
            }
          ]
        });

        userPendingLoans.forEach(loan => {
          notifications.push({
            id: `pending-${loan.id}`,
            title: `Permintaan Peminjaman Diproses`,
            message: `Permintaan Anda untuk meminjam ${loan.item.name} sedang diproses`,
            type: 'menunggu',
            priority: 'medium',
            timestamp: loan.requestDate,
            relatedId: loan.id,
            isRead: false
          });
        });
      }
    }

    // Note: Stock notifications removed as per request
    // Only loan/request-related notifications will be shown

    // Sort notifications by priority and timestamp
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    notifications.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    console.log(`✅ GET /api/notifications - returning ${notifications.length} notifications`);
    res.json(notifications);
    
  } catch (error) {
    console.error('❌ Error fetching notifications:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get notifications count by type
app.get('/api/notifications/count', async (req, res) => {
  try {
    const counts = {
      darurat: 0,
      tinggi: 0,
      menunggu: 0,
      proses: 0,
      sedang: 0
    };

    // Count overdue loans (Darurat)
    counts.darurat = await Loan.count({
      where: {
        status: 'active',
        endDate: {
          [Op.lt]: new Date()
        }
      }
    });

    // Count items due soon (Tinggi) - removed stock counts
    counts.tinggi = await Loan.count({
      where: {
        status: 'active',
        endDate: {
          [Op.between]: [new Date(), new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)]
        }
      }
    });

    // Count pending loans (Menunggu)
    counts.menunggu = await Loan.count({
      where: { status: 'pending' }
    });

    // Count return requests (Proses) - if you have this field
    // counts.proses = await Loan.count({
    //   where: { returnRequested: true }
    // });

    // Sedang notifications removed as per request (no stock-related notifications)
    counts.sedang = 0;

    console.log(`✅ GET /api/notifications/count - returning counts:`, counts);
    res.json(counts);
    
  } catch (error) {
    console.error('❌ Error fetching notification counts:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  try {
    console.log('🔄 Starting PostgreSQL server...');
    console.log('🔄 DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    await sequelize.sync(); // Sync database without dropping existing tables
    console.log('✅ Database synchronized');
    
    // Add sample categories if they don't exist
    const existingCategories = await Category.count();
    if (existingCategories === 0) {
      await Category.bulkCreate([
        {
          name: 'Electronics',
          description: 'Electronic devices and gadgets',
          icon: 'Laptop',
          color: '#3B82F6'
        },
        {
          name: 'Photography',
          description: 'Camera and photography equipment',
          icon: 'Camera',
          color: '#8B5CF6'
        },
        {
          name: 'Audio',
          description: 'Audio equipment and accessories',
          icon: 'Headphones',
          color: '#10B981'
        },
        {
          name: 'Office',
          description: 'Office supplies and equipment',
          icon: 'FileText',
          color: '#F59E0B'
        },
        {
          name: 'Sports',
          description: 'Sports and fitness equipment',
          icon: 'Activity',
          color: '#EF4444'
        }
      ]);
      console.log('✅ Sample categories created');
    } else {
      console.log('✅ Categories already exist, skipping creation');
    }

    // Add sample users with hashed passwords if they don't exist
    const existingUsers = await User.count();
    if (existingUsers === 0) {
      const hashedAdminPassword = await bcrypt.hash('admin123', 10);
      const hashedUserPassword = await bcrypt.hash('user123', 10);
      
      await User.bulkCreate([
        {
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '+1234567890',
          department: 'IT',
          role: 'admin',
          password: hashedAdminPassword,
          isActive: true
        },
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567891',
          department: 'Engineering',
          role: 'user',
          password: hashedUserPassword,
          isActive: true
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1234567892',
          department: 'Marketing',
          role: 'user',
          password: hashedUserPassword,
          isActive: false // This matches the "Inactive" status in frontend
        }
      ]);
      console.log('✅ Sample users created');
    } else {
      console.log('✅ Users already exist, skipping creation');
    }

    // Add sample data if they don't exist
    const existingItems = await Item.count();
    if (existingItems === 0) {
      await Item.bulkCreate([
        {
          name: 'ROG Gaming Laptop',
          description: 'High-performance gaming laptop untuk gaming dan development',
          category: 'Electronics',
          condition: 'excellent',
          quantity: 2,
          availableQuantity: 2,
          images: ['/images/rog-laptop.jpg'],
          tags: ['gaming', 'laptop', 'high-performance'],
          location: 'Gudang'
        },
        {
          name: 'Laptop Dell XPS 13',
          description: 'Laptop untuk keperluan kerja dan presentasi',
          category: 'Electronics',
          condition: 'excellent',
          quantity: 4,
          availableQuantity: 4,
          images: ['/images/dell-xps.jpg'],
          tags: ['laptop', 'business', 'portable'],
          location: 'Gudang'
        },
        {
          name: 'Proyektor Epson',
          description: 'Proyektor untuk presentasi dan meeting',
          category: 'Electronics',
          condition: 'good',
          quantity: 3,
          availableQuantity: 3,
          images: ['/images/projector-epson.jpg'],
          tags: ['projector', 'presentation', 'meeting'],
          location: 'Gudang'
        },
        {
          name: 'Kamera Canon DSLR',
          description: 'Kamera untuk dokumentasi event dan kegiatan',
          category: 'Photography',
          condition: 'excellent',
          quantity: 2,
          availableQuantity: 2,
          images: ['/images/canon-dslr.jpg'],
          tags: ['camera', 'photography', 'documentation'],
          location: 'Gudang'
        },
        {
          name: 'Microphone Wireless',
          description: 'Microphone untuk acara dan presentasi',
          category: 'Audio',
          condition: 'good',
          quantity: 4,
          availableQuantity: 4,
          images: ['/images/microphone.jpg'],
          tags: ['microphone', 'audio', 'wireless'],
          location: 'Gudang'
        }
      ]);
      console.log('✅ Sample items created');
    } else {
      console.log('✅ Items already exist, skipping creation');
    }

    // Get users and items for loan references
    const users = await User.findAll();
    const items = await Item.findAll();

    // Add sample loans if they don't exist and we have users and items
    const existingLoans = await Loan.count();
    if (existingLoans === 0 && users.length > 0 && items.length > 0) {
      await Loan.bulkCreate([
        {
          userId: users[1]?.id, // John Doe
          itemId: items[0]?.id, // ROG Gaming Laptop
          quantity: 1,
          startDate: new Date('2025-07-15'),
          endDate: new Date('2025-07-22'),
          status: 'pending',
          purpose: 'Development project for mobile app'
        },
        {
          userId: users[1]?.id, // John Doe
          itemId: items[1]?.id, // Laptop Dell XPS 13
          quantity: 1,
          startDate: new Date('2025-07-10'),
          endDate: new Date('2025-07-17'),
          status: 'approved',
          purpose: 'Client presentation',
          approvedBy: users[0]?.id, // Admin User
          approvedAt: new Date('2025-07-10T10:00:00Z')
        },
        {
          userId: users[2]?.id, // Jane Smith
          itemId: items[2]?.id, // Proyektor Epson
          quantity: 1,
          startDate: new Date('2025-07-05'),
          endDate: new Date('2025-07-12'),
          status: 'returned',
          purpose: 'Marketing presentation',
          approvedBy: users[0]?.id, // Admin User
          approvedAt: new Date('2025-07-05T09:00:00Z'),
          actualReturnDate: new Date('2025-07-12T16:00:00Z')
        }
      ].filter(loan => loan.userId && loan.itemId)); // Filter out loans with null IDs
      console.log('✅ Sample loans created');
    } else {
      console.log('✅ Loans already exist or missing users/items, skipping creation');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 PostgreSQL server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Railway URL: https://loan-production-a1a2.up.railway.app`);
      console.log(`🔒 CORS: Allowing all origins for debugging`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

startServer();
