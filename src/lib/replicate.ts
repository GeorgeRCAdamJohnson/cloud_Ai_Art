// Replicate SDXL - FREE $5 credit monthly  
// Get API token: replicate.com → Account → API tokens

import axios from 'axios'

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithReplicate(prompt: string): Promise<GenerationResult> {
  try {
    const apiToken = process.env.REPLICATE_API_TOKEN
    
    if (!apiToken) {
      // Return a helpful message about getting free Replicate credits
      console.log('No Replicate token - showing info message')
      return {
        imageUrl: createInfoCanvas(prompt),
        metadata: {
          service: 'replicate',
          model: 'Setup Required',
          prompt,
          cost: 'FREE $5 credit available',
          timestamp: new Date().toISOString(),
          setupInfo: 'Visit replicate.com to get $5 free credits'
        }
      }
    }

    // Use the stable-diffusion model on Replicate
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
        input: {
          prompt: `${prompt}, 2D game sprite, cartoon style, colorful, kids friendly`,
          width: 512,
          height: 512,
          num_inference_steps: 20,
          guidance_scale: 7.5
        }
      },
      {
        headers: {
          'Authorization': `Token ${apiToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const predictionId = response.data.id
    
    // Poll for completion (Replicate is async)
    let result = response.data
    let attempts = 0
    while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      const pollResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${apiToken}`
          }
        }
      )
      result = pollResponse.data
      attempts++
    }

    if (result.status === 'succeeded' && result.output && result.output[0]) {
      return {
        imageUrl: result.output[0],
        metadata: {
          service: 'replicate',
          model: 'stable-diffusion',
          prompt,
          cost: 'Paid from $5 free credit',
          timestamp: new Date().toISOString()
        }
      }
    }

    throw new Error(`Replicate generation failed: ${result.status}`)
  } catch (error) {
    console.error('Replicate generation error:', error)
    
    if (error.response?.status === 401) {
      throw new Error('Invalid Replicate API token')
    }
    
    throw new Error(`Replicate error: ${error.message}`)
  }
}

function createInfoCanvas(text: string): string {
  // Create a helpful info SVG
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#3B82F6"/>
      <text x="256" y="200" text-anchor="middle" dominant-baseline="middle" 
            fill="white" font-family="Arial" font-size="20" font-weight="bold">
        🎨 Replicate Available
      </text>
      <text x="256" y="240" text-anchor="middle" dominant-baseline="middle" 
            fill="white" font-family="Arial" font-size="16">
        Get $5 FREE Credits
      </text>
      <text x="256" y="280" text-anchor="middle" dominant-baseline="middle" 
            fill="white" font-family="Arial" font-size="14">
        Visit replicate.com
      </text>
      <text x="256" y="320" text-anchor="middle" dominant-baseline="middle" 
            fill="white" font-family="Arial" font-size="12">
        Prompt: ${text.substring(0, 25)}...
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}