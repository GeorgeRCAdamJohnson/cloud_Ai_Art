#!/usr/bin/env node

/**
 * Cloud AI Art - Real Implementation Activator
 * 
 * This script helps you switch from mock implementations to real AI services.
 * 
 * Usage:
 *   node activate-real-ai.js aws
 *   node activate-real-ai.js azure  
 *   node activate-real-ai.js google
 *   node activate-real-ai.js all
 */

const fs = require('fs')
const path = require('path')

const services = {
  huggingface: {
    npm: 'none', // Uses built-in fetch
    source: './real-implementations/huggingface-real.ts',
    target: './src/lib/huggingface.ts',
    env: [
      'HUGGINGFACE_API_KEY=your_free_api_key_here'
    ]
  },
  replicate: {
    npm: 'none', // Uses built-in fetch
    source: './real-implementations/replicate-real.ts',
    target: './src/lib/replicate.ts',
    env: [
      'REPLICATE_API_TOKEN=your_free_api_token_here'
    ]
  },
  aws: {
    npm: '@aws-sdk/client-bedrock-runtime',
    source: './real-implementations/aws-bedrock-real.ts',
    target: './src/lib/aws-bedrock.ts',
    env: [
      'AWS_ACCESS_KEY_ID=your_aws_access_key_here',
      'AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here',
      'AWS_REGION=us-east-1'
    ]
  },
  azure: {
    npm: 'axios',
    source: './real-implementations/azure-ai-real.ts',
    target: './src/lib/azure-ai.ts',
    env: [
      'AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/',
      'AZURE_OPENAI_API_KEY=your_azure_openai_key_here',
      'AZURE_OPENAI_DEPLOYMENT_NAME=dall-e-3'
    ]
  },
  google: {
    npm: '@google-cloud/aiplatform',
    source: './real-implementations/google-ai-real.ts',
    target: './src/lib/google-ai.ts',
    env: [
      'GOOGLE_CLOUD_PROJECT_ID=your-google-project-id',
      'GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json',
      'GOOGLE_CLOUD_LOCATION=us-central1'
    ]
  }
}

function activateService(serviceName) {
  const service = services[serviceName]
  if (!service) {
    console.error(`❌ Unknown service: ${serviceName}`)
    console.log('Available services: aws, azure, google, all')
    return false
  }

  console.log(`🚀 Activating ${serviceName.toUpperCase()} AI service...`)

  // Check if source file exists
  if (!fs.existsSync(service.source)) {
    console.error(`❌ Source file not found: ${service.source}`)
    return false
  }

  try {
    // Copy real implementation
    const content = fs.readFileSync(service.source, 'utf8')
    fs.writeFileSync(service.target, content)
    console.log(`✅ Replaced ${service.target} with real implementation`)

    // Show npm install command
    if (service.npm !== 'none') {
      console.log(`📦 Run this to install dependencies:`)
      console.log(`   npm install ${service.npm}`)
    } else {
      console.log(`📦 No additional dependencies needed (uses built-in fetch)`)
    }

    // Show environment variables needed
    console.log(`🔑 Add these to your .env.local file:`)
    service.env.forEach(env => console.log(`   ${env}`))

    return true
  } catch (error) {
    console.error(`❌ Error activating ${serviceName}:`, error.message)
    return false
  }
}

function main() {
  const serviceName = process.argv[2]

  if (!serviceName) {
    console.log('🎨 Cloud AI Art - Real Implementation Activator')
    console.log('')
    console.log('🆓 FREE Options:')
    console.log('  node activate-real-ai.js huggingface  # FREE - 1000 images/month')
    console.log('  node activate-real-ai.js replicate    # FREE $5 credit monthly')
    console.log('')
    console.log('💰 Paid Options:')
    console.log('  node activate-real-ai.js aws          # $0.04 per image')
    console.log('  node activate-real-ai.js azure        # $0.04 per image') 
    console.log('  node activate-real-ai.js google       # $0.02-0.05 per image')
    console.log('')
    console.log('  node activate-real-ai.js all          # Activate all services')
    console.log('')
    console.log('💡 Start with Hugging Face - it\'s completely FREE!')
    return
  }

  if (serviceName === 'all') {
    console.log('🎨 Activating ALL AI services...')
    let success = true
    Object.keys(services).forEach(name => {
      if (!activateService(name)) {
        success = false
      }
      console.log('')
    })

    if (success) {
      console.log('🎉 All services activated successfully!')
      console.log('📦 Run: npm install @aws-sdk/client-bedrock-runtime axios @google-cloud/aiplatform')
    }
  } else {
    const success = activateService(serviceName)
    if (success) {
      console.log(`🎉 ${serviceName.toUpperCase()} service activated successfully!`)
      console.log('📖 Check SETUP_REAL_AI.md for detailed setup instructions')
    }
  }
}

main()