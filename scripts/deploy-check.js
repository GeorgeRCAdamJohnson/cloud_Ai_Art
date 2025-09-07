#!/usr/bin/env node

/**
 * Netlify Deployment Helper Script
 * This script helps configure environment variables for Netlify deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Cloud AI Art - Netlify Deployment Helper');
console.log('==========================================\n');

// Check if running in CI/CD environment
const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
const netlifyBuild = process.env.NETLIFY;

if (netlifyBuild) {
  console.log('✅ Running in Netlify build environment');
  
  // Set up environment variables for Netlify
  const hfToken = process.env.HUGGINGFACEALL || 
                  process.env.HUGGINGFACE_API_TOKEN || 
                  process.env.HUGGINGFACEWRITE;
                  
  if (hfToken) {
    console.log('✅ Hugging Face token found for deployment');
    process.env.HUGGINGFACE_API_TOKEN = hfToken;
  } else {
    console.warn('⚠️  No Hugging Face token found in environment variables');
    console.warn('   Please set HUGGINGFACE_API_TOKEN in Netlify dashboard');
  }
}

if (isCI && !netlifyBuild) {
  console.log('✅ Running in GitHub Actions environment');
  
  // GitHub Actions should have HUGGINGFACEALL secret
  if (process.env.HUGGINGFACEALL) {
    console.log('✅ GitHub Secret HUGGINGFACEALL found');
  } else {
    console.warn('⚠️  HUGGINGFACEALL secret not found in GitHub Actions');
  }
}

console.log('\n📋 Deployment Checklist:');
console.log('========================');

const checklist = [
  {
    name: 'GitHub Repository Connected',
    check: () => true, // Assumed if script is running
    status: true
  },
  {
    name: 'Netlify Configuration (netlify.toml)',
    check: () => fs.existsSync(path.join(__dirname, '..', 'netlify.toml')),
    status: null
  },
  {
    name: 'Next.js Configuration (next.config.js)',
    check: () => fs.existsSync(path.join(__dirname, '..', 'next.config.js')),
    status: null
  },
  {
    name: 'Environment Variables',
    check: () => !!(process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACEALL || process.env.HUGGINGFACEWRITE),
    status: null
  },
  {
    name: 'Dependencies (package.json)',
    check: () => fs.existsSync(path.join(__dirname, '..', 'package.json')),
    status: null
  }
];

checklist.forEach(item => {
  item.status = item.check();
  const icon = item.status ? '✅' : '❌';
  console.log(`${icon} ${item.name}`);
});

const allPassed = checklist.every(item => item.status);

if (allPassed) {
  console.log('\n🎉 All checks passed! Ready for deployment.');
  console.log('🌍 Your site will be available at: https://cloudaiart.netlify.app');
} else {
  console.log('\n⚠️  Some checks failed. Please review the deployment guide.');
  if (isCI || netlifyBuild) {
    console.log('ℹ️  Running in build environment - continuing with build...');
  } else {
    process.exit(1);
  }
}

console.log('\n📚 Resources:');
console.log('- Netlify Dashboard: https://app.netlify.com/projects/cloudaiart');
console.log('- GitHub Repository: https://github.com/GeorgeRCAdamJohnson/cloud_Ai_Art');
console.log('- Deployment Guide: ./DEPLOYMENT.md');