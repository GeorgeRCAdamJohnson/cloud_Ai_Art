// Hugging Face Inference Providers - COMPLETELY FREE
// Get API key: huggingface.co → Settings → Access Tokens → New Token

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithHuggingFace(prompt: string): Promise<GenerationResult> {
  try {
    // Try different token types - HUGGINGFACEALL has the most permissions
    const apiToken = process.env.HUGGINGFACE_API_TOKEN || 
                     process.env.HUGGINGFACEALL || 
                     process.env.HUGGINGFACEWRITE
    
    if (!apiToken) {
      throw new Error('Hugging Face API token not configured. Please set HUGGINGFACE_API_TOKEN, HUGGINGFACEALL, or HUGGINGFACEWRITE in your environment variables.')
    }

    // Using the new Hugging Face Inference Providers API
    // With a reliable text-to-image model
    const apiUrl = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell'
    
    const enhancedPrompt = `${prompt}, 2D game sprite, cartoon style, colorful, cute, friendly, simple background, kids game character`

    console.log('Generating with Hugging Face FLUX.1-schnell:', enhancedPrompt)
    console.log('Using token type:', apiToken.substring(0, 10) + '...')

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
      
      // Try to parse error details
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(`HTTP ${response.status}: ${errorJson.error || errorText}`)
      } catch {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    }

    if (response.ok && response.body) {
      // Convert the image data to base64
      const arrayBuffer = await response.arrayBuffer()
      const imageBase64 = Buffer.from(arrayBuffer).toString('base64')
      const imageUrl = `data:image/png;base64,${imageBase64}`

      console.log('✅ Successfully generated image, size:', arrayBuffer.byteLength, 'bytes')

      return {
        imageUrl,
        metadata: {
          service: 'huggingface',
          model: 'FLUX.1-schnell (Fast & Free)',
          prompt: enhancedPrompt,
          timestamp: new Date().toISOString(),
          cost: 'FREE',
          provider: 'Hugging Face Inference API',
          imageSize: arrayBuffer.byteLength
        }
      }
    }

    throw new Error('No valid response from Hugging Face')
  } catch (error) {
    console.error('Hugging Face generation error:', error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    if (errorMessage.includes('503')) {
      throw new Error('Hugging Face model is loading. Please wait 20-30 seconds and try again.')
    }
    
    if (errorMessage.includes('429')) {
      throw new Error('Rate limit exceeded. You have used your free quota for today. Try again later.')
    }
    
    if (errorMessage.includes('401')) {
      throw new Error('Invalid Hugging Face API token. Please check your token has the correct permissions.')
    }

    if (errorMessage.includes('400')) {
      throw new Error(`Bad request from Hugging Face API: ${errorMessage}`)
    }

    throw new Error(`Hugging Face failed: ${errorMessage}`)
  }
}