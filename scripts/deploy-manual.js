#!/usr/bin/env node

/**
 * Manual Netlify Deployment Script
 * This script builds and deploys directly to Netlify without CI/CD
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Manual Netlify Deployment');
console.log('============================\n');

// Check if Netlify CLI is installed
try {
  execSync('netlify --version', { stdio: 'ignore' });
  console.log('✅ Netlify CLI is installed');
} catch (error) {
  console.error('❌ Netlify CLI not found. Installing...');
  execSync('npm install -g netlify-cli', { stdio: 'inherit' });
}

// Set environment variables for build
process.env.HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN || 
                                   process.env.HUGGINGFACEALL || 
                                   'demo_token';

console.log('\n📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('\n🌐 Deploying to Netlify...');
try {
  // Deploy to existing site
  const siteId = '22fe0741-d224-44ea-bed3-88a0be2ddaca';
  
  console.log(`Deploying to site: ${siteId}`);
  execSync(`netlify deploy --prod --dir=.next --site=${siteId}`, { stdio: 'inherit' });
  
  console.log('\n🎉 Deployment successful!');
  console.log('🌍 Your site is live at: https://cloudaiart.netlify.app');
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  console.log('\n💡 Try running: netlify login');
  console.log('   Then run this script again');
  process.exit(1);
}

console.log('\n📋 Post-deployment checklist:');
console.log('- Set HUGGINGFACE_API_TOKEN in Netlify dashboard');
console.log('- Test API endpoints at https://cloudaiart.netlify.app/api/generate-sprite');
console.log('- Verify image generation functionality');