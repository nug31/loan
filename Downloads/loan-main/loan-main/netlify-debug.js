#!/usr/bin/env node

console.log('🔍 Netlify Build Debug Information:');
console.log('📦 Node Version:', process.version);
console.log('📦 NPM Version:', process.env.npm_version || 'Unknown');
console.log('🗂️ Current Directory:', process.cwd());

// Check if key files exist
const fs = require('fs');
const path = require('path');

const keyFiles = [
  'package.json',
  'index.html',
  'src/main.tsx',
  'vite.config.ts',
  'tailwind.config.js',
  '.nvmrc',
  'public/_redirects'
];

console.log('\n📂 File Check:');
keyFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json scripts
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
  console.log('\n📜 Available Scripts:');
  Object.keys(packageJson.scripts || {}).forEach(script => {
    console.log(`  • ${script}: ${packageJson.scripts[script]}`);
  });
  
  console.log('\n🔧 Engines:');
  if (packageJson.engines) {
    Object.keys(packageJson.engines).forEach(engine => {
      console.log(`  • ${engine}: ${packageJson.engines[engine]}`);
    });
  } else {
    console.log('  No engines specified');
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

console.log('\n🌍 Environment Variables:');
const envVars = ['NODE_ENV', 'VITE_API_URL', 'VITE_DEMO_MODE'];
envVars.forEach(envVar => {
  console.log(`  • ${envVar}: ${process.env[envVar] || 'Not set'}`);
});

console.log('\n✅ Debug information complete');