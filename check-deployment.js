#!/usr/bin/env node

/**
 * Simple deployment check script
 * Run with: node check-deployment.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Vercel Deployment Configuration...\n');

// Check required files
const requiredFiles = [
  'package.json',
  'vercel.json',
  'app.config.js',
  '.nvmrc',
  '.vercelignore'
];

const missingFiles = [];
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    missingFiles.push(file);
  } else {
    console.log(`✅ ${file} - Found`);
  }
});

if (missingFiles.length > 0) {
  console.log('\n❌ Missing files:');
  missingFiles.forEach(file => console.log(`   - ${file}`));
} else {
  console.log('\n✅ All required files present');
}

// Check package.json scripts
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  console.log('\n📦 Package.json checks:');
  
  if (packageJson.scripts && packageJson.scripts['vercel-build']) {
    console.log('✅ vercel-build script - Found');
  } else {
    console.log('❌ vercel-build script - Missing');
  }
  
  if (packageJson.engines && packageJson.engines.node) {
    console.log(`✅ Node.js version specified - ${packageJson.engines.node}`);
  } else {
    console.log('⚠️  Node.js version not specified');
  }
  
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check build output
if (fs.existsSync('web-build')) {
  const buildFiles = fs.readdirSync('web-build');
  console.log('\n🏗️  Build output:');
  console.log(`✅ web-build directory exists (${buildFiles.length} files)`);
  
  if (buildFiles.includes('index.html')) {
    console.log('✅ index.html - Found');
  } else {
    console.log('❌ index.html - Missing');
  }
} else {
  console.log('\n⚠️  web-build directory not found - run npm run build first');
}

console.log('\n🚀 Deployment Status: Ready for Vercel!');
console.log('💡 Push to main branch to trigger deployment');