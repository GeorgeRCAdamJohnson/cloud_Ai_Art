// FREE Hugging Face Implementation
// Completely free with 1000 requests/month
// Setup: Get free API key from huggingface.co

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export async function generateWithHuggingFace(prompt: string): Promise<GenerationResult> {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY

    if (!apiKey) {
      throw new Error('Hugging Face API key not configured. Get one free at huggingface.co')
    }

    const enhancedPrompt = `${prompt}, 2D game sprite, pixel art style, cartoon, kids friendly, simple design, vibrant colors, high quality`

    console.log('🎨 Generating with Hugging Face (FREE):', enhancedPrompt)

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: 512,
            height: 512,
            negative_prompt: "blurry, low quality, nsfw, inappropriate, dark, scary"
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      
      if (response.status === 429) {
        throw new Error('Hugging Face rate limit reached. Try again in a few minutes.')
      } else if (response.status === 401) {
        throw new Error('Invalid Hugging Face API key. Check your credentials.')
      } else if (response.status === 503) {
        throw new Error('Hugging Face model is loading. Please wait 20 seconds and try again.')
      }
      
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`)
    }

    // Check if response is JSON (error) or binary (image)
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json()
      if (errorData.error) {
        throw new Error(`Hugging Face error: ${errorData.error}`)
      }
    }

    // Convert image blob to base64
    const imageBlob = await response.blob()
    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const imageUrl = `data:image/jpeg;base64,${base64}`

    return {
      imageUrl,
      metadata: {
        service: 'huggingface',
        model: 'stable-diffusion-2-1',
        prompt: enhancedPrompt,
        cost: 'FREE (1000/month)',
        timestamp: new Date().toISOString()
      }
    }

  } catch (error) {
    console.error('Hugging Face generation error:', error)
    throw new Error(`Hugging Face generation failed: ${error.message}`)
  }
}