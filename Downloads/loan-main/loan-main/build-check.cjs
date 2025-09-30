#!/usr/bin/env node
console.log('=== Build Environment Check ===');
console.log('Node:', process.version);
console.log('Platform:', process.platform);
console.log('Arch:', process.arch);
console.log('CWD:', process.cwd());
console.log('ENV VITE_API_URL:', process.env.VITE_API_URL);
console.log('ENV VITE_DEMO_MODE:', process.env.VITE_DEMO_MODE);
console.log('ENV NODE_ENV:', process.env.NODE_ENV);

const fs = require('fs');
const path = require('path');

// Check critical files
const files = ['package.json', 'index.html', 'vite.config.ts'];
files.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`File ${file}:`, exists ? 'EXISTS' : 'MISSING');
});

console.log('=== Check Complete ===');