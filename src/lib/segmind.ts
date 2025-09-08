// Segmind - FREE AI Image Generation
// Multiple Stable Diffusion models available for free

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

// Available Segmind models (all FREE)
export const SEGMIND_MODELS = {
  'sd1.5': {
    name: 'Stable Diffusion 1.5',
    description: 'Classic, reliable model',
    endpoint: 'sd1.5-txt2img'
  },
  'sdxl': {
    name: 'SDXL',
    description: 'High quality, detailed images',
    endpoint: 'sdxl1.0-txt2img'
  },
  'kandinsky': {
    name: 'Kandinsky 2.2',
    description: 'Artistic, unique style',
    endpoint: 'kandinsky2.2-txt2img'
  },
  'deepfloyd': {
    name: 'DeepFloyd IF',
    description: 'Text-aware generation',
    endpoint: 'deepfloyd-if-txt2img'
  }
} as const

export type SegmindModel = keyof typeof SEGMIND_MODELS

export async function generateWithSegmind(prompt: string, model: SegmindModel = 'sdxl'): Promise<GenerationResult> {
  try {
    // Enhance prompt for 2D game sprites
    const enhancedPrompt = `${prompt}, 2D game sprite, pixel art style, transparent background, kids friendly, cartoon style, colorful, cute, friendly, simple background, kids game character`
    
    console.log(`Generating with Segmind ${SEGMIND_MODELS[model].name}:`, enhancedPrompt)

    // Segmind free API endpoint
    const apiUrl = `https://api.segmind.com/v1/${SEGMIND_MODELS[model].endpoint}`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        negative_prompt: 'blurry, low quality, distorted, ugly, inappropriate',
        samples: 1,
        width: 512,
        height: 512,
        num_inference_steps: 20,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000)
      })
    })

    if (!response.ok) {
      // Segmind might require API key for some models, fall back to simple generation
      console.log('Segmind API key required, using fallback method')
      return createSegmindFallback(prompt, model)
    }

    // Handle different response types
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      const result = await response.json()
      if (result.image) {
        // Base64 image in response
        const dataUrl = `data:image/png;base64,${result.image}`
        return {
          imageUrl: dataUrl,
          metadata: {
            service: 'segmind',
            model: SEGMIND_MODELS[model].name,
            modelKey: model,
            prompt: enhancedPrompt,
            timestamp: new Date().toISOString(),
            cost: 'FREE',
            description: SEGMIND_MODELS[model].description
          }
        }
      }
    } else {
      // Direct image response
      const imageBuffer = await response.arrayBuffer()
      const base64Data = Buffer.from(imageBuffer).toString('base64')
      const dataUrl = `data:image/png;base64,${base64Data}`

      console.log('✅ Successfully generated image with Segmind')
      console.log(`Image size: ${imageBuffer.byteLength} bytes`)

      return {
        imageUrl: dataUrl,
        metadata: {
          service: 'segmind',
          model: SEGMIND_MODELS[model].name,
          modelKey: model,
          prompt: enhancedPrompt,
          timestamp: new Date().toISOString(),
          cost: 'FREE',
          size: imageBuffer.byteLength,
          description: SEGMIND_MODELS[model].description
        }
      }
    }

    throw new Error('Unexpected response format from Segmind')

  } catch (error) {
    console.error('Segmind error:', error)
    // Return fallback instead of throwing
    return createSegmindFallback(prompt, model)
  }
}

// Fallback function when Segmind API isn't accessible
function createSegmindFallback(prompt: string, model: SegmindModel): GenerationResult {
  console.log('Using Segmind fallback generation')
  
  // Create a simple colored canvas as fallback
  const width = 512
  const height = 512
  
  // Different colors for different models
  const modelColors = {
    'sd1.5': '#FF6B6B',
    'sdxl': '#4ECDC4', 
    'kandinsky': '#45B7D1',
    'deepfloyd': '#96CEB4'
  }
  
  const color = modelColors[model]
  const modelName = SEGMIND_MODELS[model].name
  
  // Return a simple SVG as base64
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="35%" text-anchor="middle" fill="white" font-size="18" font-family="Arial, sans-serif">
        ${modelName}
      </text>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">
        Sprite: ${prompt.slice(0, 25)}...
      </text>
      <text x="50%" y="65%" text-anchor="middle" fill="white" font-size="12" font-family="Arial, sans-serif">
        (Service temporarily unavailable)
      </text>
    </svg>
  `
  
  const base64Svg = Buffer.from(svgContent).toString('base64')
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`
  
  return {
    imageUrl: dataUrl,
    metadata: {
      service: 'segmind',
      model: modelName,
      modelKey: model,
      prompt,
      timestamp: new Date().toISOString(),
      cost: 'FREE',
      note: 'Fallback placeholder - service temporarily unavailable',
      description: SEGMIND_MODELS[model].description
    }
  }
}