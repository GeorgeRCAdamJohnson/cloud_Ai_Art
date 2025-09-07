// FREE Replicate Implementation  
// $5 free credit monthly (about 100-500 images)
// Setup: Sign up at replicate.com for free credit

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithReplicate(prompt: string): Promise<GenerationResult> {
  try {
    const apiToken = process.env.REPLICATE_API_TOKEN

    if (!apiToken) {
      throw new Error('Replicate API token not configured. Get $5 free credit at replicate.com')
    }

    const enhancedPrompt = `${prompt}, 2D game sprite, pixel art style, cartoon, kids friendly, simple design, vibrant colors, game asset`

    console.log('🎨 Generating with Replicate (FREE $5 credit):', enhancedPrompt)

    // Using SDXL model for high quality
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b", // SDXL
        input: {
          prompt: enhancedPrompt,
          negative_prompt: "blurry, low quality, nsfw, inappropriate, dark, scary, text, watermark",
          width: 512,
          height: 512,
          num_inference_steps: 20,
          guidance_scale: 7.5,
          scheduler: "K_EULER",
          num_outputs: 1
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      
      if (response.status === 401) {
        throw new Error('Invalid Replicate API token. Check your credentials.')
      } else if (response.status === 402) {
        throw new Error('Replicate credit limit reached. Add payment method or wait for monthly reset.')
      }
      
      throw new Error(`Replicate API error: ${errorData.detail || response.statusText}`)
    }

    const prediction = await response.json()

    // Poll for completion
    let result = prediction
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Token ${apiToken}`,
        }
      })
      
      result = await pollResponse.json()
      
      if (result.status === 'failed') {
        throw new Error(`Replicate generation failed: ${result.error}`)
      }
    }

    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      return {
        imageUrl: result.output[0], // Replicate returns direct URLs
        metadata: {
          service: 'replicate',
          model: 'SDXL',
          prompt: enhancedPrompt,
          cost: '~$0.01 (from free credit)',
          timestamp: new Date().toISOString(),
          id: result.id
        }
      }
    }

    throw new Error('No image generated from Replicate')

  } catch (error) {
    console.error('Replicate generation error:', error)
    throw new Error(`Replicate generation failed: ${error.message}`)
  }
}