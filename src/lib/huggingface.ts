// Hugging Face Inference Providers - COMPLETELY FREE
// Get API key: huggingface.co → Settings → Access Tokens → New Token

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithHuggingFace(prompt: string): Promise<GenerationResult> {
  try {
    const apiToken = process.env.HUGGINGFACE_API_TOKEN
    
    if (!apiToken) {
      throw new Error('Hugging Face API token not configured. Please set HUGGINGFACE_API_TOKEN in your .env.local file.')
    }

    // Using the new Hugging Face Inference Providers API
    // With a reliable text-to-image model
    const apiUrl = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell'
    
    const enhancedPrompt = `${prompt}, 2D game sprite, cartoon style, colorful, cute, friendly, simple background, kids game character`

    console.log('Generating with Hugging Face FLUX.1-schnell:', enhancedPrompt)

    // Use fetch instead of axios to avoid automatic headers
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: enhancedPrompt
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API Error Response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    if (response.ok && response.body) {
      // Convert the image data to base64
      const arrayBuffer = await response.arrayBuffer()
      const imageBase64 = Buffer.from(arrayBuffer).toString('base64')
      const imageUrl = `data:image/png;base64,${imageBase64}`

      return {
        imageUrl,
        metadata: {
          service: 'huggingface',
          model: 'FLUX.1-schnell (Fast & Free)',
          prompt: enhancedPrompt,
          timestamp: new Date().toISOString(),
          cost: 'FREE',
          provider: 'Hugging Face Inference API'
        }
      }
    }

    throw new Error('No valid response from Hugging Face')
  } catch (error) {
    console.error('Hugging Face generation error:', error)
    
    if (error.message?.includes('503')) {
      throw new Error('Hugging Face model is loading. Please wait 20-30 seconds and try again.')
    }
    
    if (error.message?.includes('429')) {
      throw new Error('Rate limit exceeded. You have used your free quota for today.')
    }
    
    if (error.message?.includes('401')) {
      throw new Error('Invalid Hugging Face API token. Please check your token.')
    }

    if (error.message?.includes('400')) {
      throw new Error(`Bad request from Hugging Face API: ${error.message}`)
    }

    throw new Error(`Hugging Face failed: ${error.message}`)
  }
}