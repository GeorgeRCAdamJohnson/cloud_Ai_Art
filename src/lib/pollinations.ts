// Pollinations.ai - COMPLETELY FREE (No signup required)
// Simple URL-based image generation API

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

// Available Pollinations.ai models
export const POLLINATIONS_MODELS = {
  'flux': {
    name: 'FLUX',
    description: 'High-quality, fast generation',
    recommended: true
  },
  'flux-schnell': {
    name: 'FLUX Schnell',
    description: 'Ultra-fast generation',
    speed: 'fastest'
  },
  'sd3.5': {
    name: 'Stable Diffusion 3.5',
    description: 'Latest SD model, excellent quality',
    quality: 'highest'
  },
  'playground-v2.5': {
    name: 'Playground v2.5',
    description: 'Great for artistic styles',
    style: 'artistic'
  },
  'sdxl': {
    name: 'SDXL',
    description: 'High resolution generation',
    resolution: 'high'
  },
  'anything-v5': {
    name: 'Anything v5',
    description: 'Perfect for anime/cartoon sprites',
    style: 'cartoon'
  }
} as const

export type PollinationsModel = keyof typeof POLLINATIONS_MODELS

export async function generateWithPollinations(prompt: string, model: PollinationsModel = 'flux'): Promise<GenerationResult> {
  try {
    // Enhance prompt for 2D game sprites
    const enhancedPrompt = `${prompt}, 2D game sprite, pixel art style, transparent background, kids friendly, cartoon style, colorful, cute, friendly, simple background, kids game character`
    
    console.log('Generating with Pollinations.ai:', enhancedPrompt)

    // Pollinations.ai uses a simple URL-based API
    const apiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`
    
    // Add parameters for better sprite generation
    const params = new URLSearchParams({
      'width': '512',
      'height': '512',
      'seed': Math.floor(Math.random() * 1000000).toString(),
      'model': model,
      'enhance': 'true'
    })
    
    const fullUrl = `${apiUrl}?${params.toString()}`
    
    console.log(`Generating with Pollinations.ai ${POLLINATIONS_MODELS[model].name}:`, enhancedPrompt)
    console.log('Pollinations API URL:', fullUrl)

    // Test if the image is accessible
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Convert to base64 for consistent handling
    const imageBuffer = await response.arrayBuffer()
    const base64Data = Buffer.from(imageBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64Data}`

    console.log('✅ Successfully generated image with Pollinations.ai')
    console.log(`Image size: ${imageBuffer.byteLength} bytes`)

    return {
      imageUrl: dataUrl,
      metadata: {
        service: 'pollinations',
        model: POLLINATIONS_MODELS[model].name,
        modelKey: model,
        prompt: enhancedPrompt,
        timestamp: new Date().toISOString(),
        cost: 'FREE',
        size: imageBuffer.byteLength,
        description: POLLINATIONS_MODELS[model].description
      }
    }

  } catch (error) {
    console.error('Pollinations.ai error:', error)
    throw new Error(`Pollinations generation failed: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Fallback function for when other services fail
export async function createFallbackSprite(prompt: string): Promise<GenerationResult> {
  // Create a simple colored canvas as fallback
  const canvas = createInfoCanvas(prompt, 'Pollinations.ai Service')
  return {
    imageUrl: canvas,
    metadata: {
      service: 'pollinations',
      model: 'fallback',
      prompt,
      timestamp: new Date().toISOString(),
      cost: 'FREE',
      note: 'Fallback image generated'
    }
  }
}

function createInfoCanvas(prompt: string, service: string): string {
  // Create a simple colored rectangle as a placeholder
  const width = 512
  const height = 512
  
  // Simple base64 encoded 1x1 pixel image
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  const colorIndex = prompt.length % colors.length
  
  // Return a simple data URL (this is a fallback)
  return `data:image/svg+xml;base64,${Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${colors[colorIndex]}"/>
      <text x="50%" y="40%" text-anchor="middle" fill="white" font-size="20" font-family="Arial">
        ${service}
      </text>
      <text x="50%" y="60%" text-anchor="middle" fill="white" font-size="14" font-family="Arial">
        Sprite: ${prompt.slice(0, 30)}...
      </text>
    </svg>
  `).toString('base64')}`
}