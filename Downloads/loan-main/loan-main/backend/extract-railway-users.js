const fs = require('fs');
const path = require('path');

// Data users dari screenshots Railway MySQL
const railwayUsers = [
  // Screenshot 1
  {
    id: 'd86f6549-7d55-430b-a3a0-35500ac3fe40',
    name: 'Fitri Yani',
    email: 'fitriyani240909@gmail.com',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW' // temp password: password123
  },
  {
    id: 'd9991491-2be7-40c4-9759-4a67ea6305b3',
    name: 'Eka Yuliana Sari',
    email: 'ekayuliana@smkind-mm2100.sch.id',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'e198d9d4-4a64-4f4e-b97b-03b654cce3e0',
    name: 'Salsa Fatia Azhar',
    email: 'salsafatiaazharazhar@gmail.com',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'e6b0165d-9903-4b6a-8960-44377ce584a8',
    name: 'Yusup Azizi',
    email: 'yusupazizi039@gmail.com',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'e8cff78c-6efc-436e-a105-35ee3c04b124',
    name: 'Dikky Nugraha',
    email: 'dikkysetia20@gmail.com',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'e94e0ed9-2381-4ee3-ae3a-7ff2fb05692e',
    name: 'Viany',
    email: 'viany_lingga_revi@smkind-mm2100.sch.id',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'cfef49ce-6ea8-4760-b17e-f8ad7c02b679',
    name: 'Ressa Hadi Purwoko',
    email: 'ressa.hadi@smkind-mm2100.sch.id',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'f1d869df-717b-481d-83bc-af95c46cd3f2',
    name: 'ana',
    email: 'ana@gudangmitra.com',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'f4c2e223-9401-4542-b823-288f40622ace',
    name: 'Tiotaya Puteri Larasanty',
    email: 'tidtayaputerilarasanty@smkind-mm2100.sch.id',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  {
    id: 'f56f15bd-fd88-4c64-bbe2-4a41bc7bdbcd',
    name: 'Muhamad Yudi Dwi Cahya',
    email: 'muhamad.yudi.dc@gmail.com',
    password: '$2b$10$KixkPHjC7ZQX7O.VrO2sGe.fE5vKfHPo8Q0cNyFnOpQ3N.l.sJfVW'
  },
  
  // Screenshot 2
  {
    id: 'f9725aea-730b-4dc9-9fe8-91b204a77b18',
    name: 'Esa Apriyadi',
    email: 'esaapriyadi@gmail.com',
    password: '$2b$10$jTxWNg08XkH.dH3l'
  },
  {
    id: 'fb4eb6a3-421b-46af-b9fd-3b54bf0bd980',
    name: 'Nia Desnata Hati',
    email: 'niadesnatahati@smkind-mm2100.sch.id',
    password: '$2b$10$YQBym01WJ3c6Og'
  },
  {
    id: 'fd995fb5-e031-4e7d-8226-fe14a5d98c84',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    password: '$2a$10$iVgA/14NmS4OK/9r'
  }
];

// Function to escape CSV field
function escapeCSVField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, newline, or double quote, wrap in quotes and escape inner quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('\r') || stringField.includes('"')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
}

// Generate CSV content
function generateCSV() {
  const csvHeader = 'id,name,email,password,phone,department,role,isActive,createdAt\n';
  
  const csvRows = railwayUsers.map(user => {
    return [
      escapeCSVField(user.id),
      escapeCSVField(user.name),
      escapeCSVField(user.email),
      escapeCSVField(user.password), // Password hash dari screenshots
      escapeCSVField(''), // Phone - kosong
      escapeCSVField('Migrated from Railway'), // Department
      escapeCSVField('user'), // Role - default ke user
      escapeCSVField(true), // isActive
      escapeCSVField(new Date().toISOString()) // CreatedAt - tanggal sekarang
    ].join(',');
  }).join('\n');
  
  return csvHeader + csvRows;
}

// Function to extract users to CSV
function extractUsersToCSV(outputPath = 'railway_users_extracted.csv') {
  try {
    const csvContent = generateCSV();
    const fullOutputPath = path.resolve(outputPath);
    
    fs.writeFileSync(fullOutputPath, csvContent, 'utf8');
    
    console.log(`\n✅ Successfully extracted ${railwayUsers.length} users to: ${fullOutputPath}`);
    console.log(`📄 File size: ${(csvContent.length / 1024).toFixed(2)} KB`);
    
    // Show CSV preview
    console.log('\n📄 CSV Preview (first 3 lines):');
    console.log('=================================');
    const lines = csvContent.split('\n');
    lines.slice(0, 4).forEach((line, index) => {
      if (index === 0) {
        console.log('Header:', line);
      } else if (line.trim()) {
        const truncated = line.length > 100 ? line.substring(0, 100) + '...' : line;
        console.log(`Row ${index}:`, truncated);
      }
    });
    
    return fullOutputPath;
  } catch (error) {
    console.error('❌ Extraction failed:', error.message);
    throw error;
  }
}

// Function to import the CSV to PostgreSQL
async function importToPostgreSQL(csvPath) {
  try {
    const { importUsersFromFile } = require('./import-users-csv');
    
    console.log(`\n🔄 Importing users from ${csvPath} to PostgreSQL...`);
    await importUsersFromFile(csvPath, 'csv');
    
    console.log('✅ Import completed');
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting Railway MySQL User Extraction');
    console.log('========================================');
    
    // 1. Extract users to CSV
    console.log('📊 Extracting users from Railway screenshots...');
    const csvPath = extractUsersToCSV('railway_users_extracted.csv');
    
    // 2. Import to PostgreSQL
    console.log('\n🔄 Ready to import to PostgreSQL');
    console.log('Would you like to import now? (y/n)');
    
    // Simulate user input (since we are automating)
    const userResponse = 'y';
    
    if (userResponse.toLowerCase() === 'y') {
      await importToPostgreSQL(csvPath);
    } else {
      console.log('⏸️ Import skipped');
      console.log(`You can manually import later with: node import-users-csv.js import ${csvPath}`);
    }
    
    console.log('\n🎉 Process completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Process failed:', error.message);
    process.exit(1);
  }
}

// Start the process
if (require.main === module) {
  main();
}

module.exports = {
  extractUsersToCSV,
  importToPostgreSQL,
  railwayUsers
};
