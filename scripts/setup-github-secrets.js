#!/usr/bin/env node

/**
 * GitHub Secrets Setup Helper
 * Shows you exactly what secrets to add to GitHub
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 GitHub Secrets Setup Helper');
console.log('==============================\n');

// Read .env.local file to get current values
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envVars = {};

if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  content.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#') && line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  });
}

console.log('📋 Required GitHub Secrets');
console.log('==========================\n');

console.log('Go to: https://github.com/GeorgeRCAdamJohnson/cloud_Ai_Art/settings/secrets/actions\n');

const secrets = [
  {
    name: 'HUGGINGFACEALL',
    value: envVars.HUGGINGFACE_API_TOKEN ? '[Found in .env.local - copy this value]' : '[Not found - check .env.local]',
    description: 'Hugging Face API token for AI image generation'
  },
  {
    name: 'NEXTAUTH_SECRET', 
    value: 'cloud-ai-art-secret-2025-netlify-production',
    description: 'NextAuth secret for session security'
  },
  {
    name: 'NETLIFY_AUTH_TOKEN',
    value: '[Get from Netlify Dashboard]',
    description: 'Netlify personal access token for deployment'
  }
];

secrets.forEach((secret, index) => {
  console.log(`${index + 1}. Secret Name: ${secret.name}`);
  console.log(`   Description: ${secret.description}`);
  console.log(`   Value: ${secret.value}`);
  console.log('');
});

console.log('🚀 Steps:');
console.log('1. Click "New repository secret" for each secret above');
console.log('2. Copy the exact name and value');
console.log('3. For HUGGINGFACEALL: Use the value from your .env.local file');
console.log('4. For NETLIFY_AUTH_TOKEN: Get from https://app.netlify.com/user/applications#personal-access-tokens');
console.log('5. Push code to main branch to trigger deployment\n');

console.log('✅ After setup:');
console.log('- GitHub Actions will automatically deploy on push');
console.log('- Environment variables will be embedded in the build');
console.log('- No Netlify environment variables needed');
console.log('- Your API routes will work correctly\n');

if (envVars.HUGGINGFACE_API_TOKEN) {
  console.log('🎯 Your Hugging Face token is ready to use!');
} else {
  console.log('⚠️  No Hugging Face token found in .env.local');
}

console.log('\n📖 Full guide: ./GITHUB_SECRETS_SETUP.md');