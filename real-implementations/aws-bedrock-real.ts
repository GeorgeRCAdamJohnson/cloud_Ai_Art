// REAL AWS Bedrock Implementation
// To use this file:
// 1. Run: npm install @aws-sdk/client-bedrock-runtime
// 2. Set up your AWS credentials in .env.local
// 3. Replace the content of src/lib/aws-bedrock.ts with this code

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithAWS(prompt: string): Promise<GenerationResult> {
  try {
    // Using Stable Diffusion XL on AWS Bedrock
    const modelId = 'stability.stable-diffusion-xl-v1'
    
    const body = {
      text_prompts: [
        {
          text: `${prompt}, 2D game sprite, pixel art style, transparent background, kids friendly, cartoon style, high quality`,
          weight: 1
        }
      ],
      cfg_scale: 7,
      steps: 30,
      seed: Math.floor(Math.random() * 4294967295),
      width: 512,
      height: 512,
      style_preset: "pixel-art"
    }

    const command = new InvokeModelCommand({
      modelId,
      body: JSON.stringify(body),
      contentType: 'application/json',
      accept: 'application/json'
    })

    const response = await client.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    
    if (responseBody.artifacts && responseBody.artifacts.length > 0) {
      const imageBase64 = responseBody.artifacts[0].base64
      const imageUrl = `data:image/png;base64,${imageBase64}`
      
      return {
        imageUrl,
        metadata: {
          service: 'aws',
          modelId,
          prompt,
          timestamp: new Date().toISOString(),
          cost: '$0.04' // Approximate cost per image
        }
      }
    }
    
    throw new Error('No image generated')
  } catch (error) {
    console.error('AWS Bedrock generation error:', error)
    
    // Check for specific error types
    if (error.name === 'ValidationException') {
      throw new Error('Invalid request parameters. Check your prompt and settings.')
    } else if (error.name === 'AccessDeniedException') {
      throw new Error('AWS credentials invalid or insufficient permissions for Bedrock.')
    } else if (error.name === 'ThrottlingException') {
      throw new Error('Too many requests. Please wait a moment and try again.')
    }
    
    throw new Error(`AWS Bedrock error: ${error.message}`)
  }
}