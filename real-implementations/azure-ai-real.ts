// REAL Azure OpenAI Implementation
// To use this file:
// 1. Run: npm install axios
// 2. Set up your Azure OpenAI credentials in .env.local
// 3. Replace the content of src/lib/azure-ai.ts with this code

import axios from 'axios'

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithAzure(prompt: string): Promise<GenerationResult> {
  try {
    // Azure OpenAI DALL-E 3 configuration
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiKey = process.env.AZURE_OPENAI_API_KEY
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'dall-e-3'

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI credentials not configured. Please set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in your .env.local file.')
    }

    const enhancedPrompt = `${prompt}, 2D game sprite, pixel art style, transparent background, kids friendly, cartoon style, vibrant colors, simple design, game asset`

    const response = await axios.post(
      `${endpoint}/openai/deployments/${deploymentName}/images/generations?api-version=2024-02-01`,
      {
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        timeout: 60000 // 60 second timeout
      }
    )

    if (response.data.data && response.data.data.length > 0) {
      const imageUrl = response.data.data[0].url
      const revisedPrompt = response.data.data[0].revised_prompt
      
      return {
        imageUrl,
        metadata: {
          service: 'azure',
          deployment: deploymentName,
          originalPrompt: prompt,
          enhancedPrompt,
          revisedPrompt,
          timestamp: new Date().toISOString(),
          cost: '$0.04' // Approximate cost per image
        }
      }
    }
    
    throw new Error('No image generated from Azure OpenAI')
  } catch (error) {
    console.error('Azure AI generation error:', error)
    
    // Handle specific Azure OpenAI errors
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      
      if (status === 401) {
        throw new Error('Azure OpenAI authentication failed. Check your API key.')
      } else if (status === 403) {
        throw new Error('Azure OpenAI access forbidden. Check your permissions.')
      } else if (status === 404) {
        throw new Error('Azure OpenAI endpoint or deployment not found.')
      } else if (status === 429) {
        throw new Error('Azure OpenAI rate limit exceeded. Please wait and try again.')
      } else if (status === 400) {
        throw new Error(`Azure OpenAI request error: ${data.error?.message || 'Invalid request'}`)
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Azure OpenAI request timed out. The service may be busy.')
    }
    
    throw new Error(`Azure OpenAI error: ${error.message}`)
  }
}