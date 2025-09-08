// Prodia - FREE AI Image Generation with multiple models
// Completely free, no API key required

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

// Available Prodia models (all FREE)
export const PRODIA_MODELS = {
  'v1-5-pruned-emaonly': {
    name: 'Stable Diffusion 1.5',
    description: 'Fast, reliable generation',
    id: 'v1-5-pruned-emaonly.safetensors [6ce0161689]'
  },
  'anything-v4': {
    name: 'Anything V4',
    description: 'Anime and cartoon style',
    id: 'anything-v4.5-pruned.ckpt [65745d25]'
  },
  'deliberate': {
    name: 'Deliberate',
    description: 'High quality, photorealistic',
    id: 'deliberate_v2.safetensors [10ec4b29]'
  },
  'dreamlike-anime': {
    name: 'Dreamlike Anime',
    description: 'Perfect for game sprites',
    id: 'dreamlike-anime-1.0.safetensors [4520e090]'
  },
  'openjourney': {
    name: 'OpenJourney',
    description: 'MidJourney style, artistic',
    id: 'openjourney_V4.ckpt [ca2f377f]'
  }
} as const

export type ProdiaModel = keyof typeof PRODIA_MODELS

export async function generateWithProdia(prompt: string, model: ProdiaModel = 'dreamlike-anime'): Promise<GenerationResult> {
  try {
    // Enhance prompt for 2D game sprites
    const enhancedPrompt = `${prompt}, 2D game sprite, cartoon style, colorful, cute character, kids friendly, simple background, clean art style`
    
    console.log(`Generating with Prodia ${PRODIA_MODELS[model].name}:`, enhancedPrompt)

    // Step 1: Create generation job
    const generateUrl = 'https://api.prodia.com/v1/sd/generate'
    const generateResponse = await fetch(generateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        model: PRODIA_MODELS[model].id,
        prompt: enhancedPrompt,
        negative_prompt: 'blurry, low quality, distorted, ugly, inappropriate, adult content',
        width: 512,
        height: 512,
        steps: 20,
        cfg_scale: 7,
        seed: Math.floor(Math.random() * 1000000),
        sampler: 'DPM++ 2M Karras'
      })
    })

    if (!generateResponse.ok) {
      console.log('Prodia generation failed, using fallback')
      return createProdiaFallback(prompt, model)
    }

    const generateResult = await generateResponse.json()
    const jobId = generateResult.job

    if (!jobId) {
      console.log('No job ID received from Prodia')
      return createProdiaFallback(prompt, model)
    }

    // Step 2: Poll for completion
    let attempts = 0
    const maxAttempts = 20
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
      
      const statusResponse = await fetch(`https://api.prodia.com/v1/job/${jobId}`)
      
      if (!statusResponse.ok) {
        break
      }

      const statusResult = await statusResponse.json()
      
      if (statusResult.status === 'succeeded' && statusResult.imageUrl) {
        console.log('✅ Successfully generated image with Prodia')
        
        // Fetch the actual image
        const imageResponse = await fetch(statusResult.imageUrl)
        const imageBuffer = await imageResponse.arrayBuffer()
        const base64Data = Buffer.from(imageBuffer).toString('base64')
        const dataUrl = `data:image/png;base64,${base64Data}`

        return {
          imageUrl: dataUrl,
          metadata: {
            service: 'prodia',
            model: PRODIA_MODELS[model].name,
            modelKey: model,
            prompt: enhancedPrompt,
            timestamp: new Date().toISOString(),
            cost: 'FREE',
            size: imageBuffer.byteLength,
            jobId,
            description: PRODIA_MODELS[model].description
          }
        }
      }
      
      if (statusResult.status === 'failed') {
        console.log('Prodia job failed')
        break
      }
      
      attempts++
    }

    // If we get here, it timed out or failed
    console.log('Prodia generation timed out or failed')
    return createProdiaFallback(prompt, model)

  } catch (error) {
    console.error('Prodia error:', error)
    return createProdiaFallback(prompt, model)
  }
}

// Fallback function when Prodia API isn't accessible
function createProdiaFallback(prompt: string, model: ProdiaModel): GenerationResult {
  console.log('Using Prodia fallback generation')
  
  // Create a simple colored canvas as fallback
  const width = 512
  const height = 512
  
  // Different colors for different models
  const modelColors = {
    'v1-5-pruned-emaonly': '#8E44AD',
    'anything-v4': '#E74C3C',
    'deliberate': '#3498DB',
    'dreamlike-anime': '#F39C12',
    'openjourney': '#27AE60'
  }
  
  const color = modelColors[model]
  const modelName = PRODIA_MODELS[model].name
  
  // Return a simple SVG as base64
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <circle cx="256" cy="200" r="80" fill="white" opacity="0.3"/>
      <text x="50%" y="35%" text-anchor="middle" fill="white" font-size="18" font-family="Arial, sans-serif" font-weight="bold">
        ${modelName}
      </text>
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="14" font-family="Arial, sans-serif">
        Sprite: ${prompt.slice(0, 30)}...
      </text>
      <text x="50%" y="65%" text-anchor="middle" fill="white" font-size="12" font-family="Arial, sans-serif">
        (Prodia service temporarily unavailable)
      </text>
      <text x="50%" y="75%" text-anchor="middle" fill="white" font-size="10" font-family="Arial, sans-serif" opacity="0.8">
        FREE Service - No API Key Required
      </text>
    </svg>
  `
  
  const base64Svg = Buffer.from(svgContent).toString('base64')
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`
  
  return {
    imageUrl: dataUrl,
    metadata: {
      service: 'prodia',
      model: modelName,
      modelKey: model,
      prompt,
      timestamp: new Date().toISOString(),
      cost: 'FREE',
      note: 'Fallback placeholder - service temporarily unavailable',
      description: PRODIA_MODELS[model].description
    }
  }
}