import { NextRequest, NextResponse } from 'next/server'
import { generateWithAWS } from '@/lib/aws-bedrock'
import { generateWithAzure } from '@/lib/azure-ai'
import { generateWithGoogle } from '@/lib/google-ai'
import { generateWithHuggingFace } from '@/lib/huggingface'
import { generateWithReplicate } from '@/lib/replicate'
import { ImageStorage } from '@/lib/imageStorage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, service } = body

    console.log(`API called with service: ${service}, prompt: ${prompt}`)

    if (!prompt || !service) {
      return NextResponse.json(
        { success: false, error: 'Missing prompt or service' },
        { status: 400 }
      )
    }

    // Debug environment variables
    if (service === 'huggingface') {
      const hasToken = !!process.env.HUGGINGFACE_API_TOKEN
      console.log(`Hugging Face token available: ${hasToken}`)
      if (hasToken) {
        console.log(`Token starts with: ${process.env.HUGGINGFACE_API_TOKEN?.substring(0, 10)}...`)
      }
    }

    let result

    switch (service) {
      case 'aws':
        result = await generateWithAWS(prompt)
        break
      case 'azure':
        result = await generateWithAzure(prompt)
        break
      case 'google':
        result = await generateWithGoogle(prompt)
        break
      case 'huggingface':
        result = await generateWithHuggingFace(prompt)
        break
      case 'replicate':
        result = await generateWithReplicate(prompt)
        break
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid service' },
          { status: 400 }
        )
    }

    // Try to automatically save the generated image
    let savedImage = null
    try {
      if (result.imageUrl && result.metadata) {
        savedImage = await ImageStorage.saveImage(
          result.imageUrl,
          prompt,
          service,
          result.metadata.model || 'unknown'
        )
        console.log(`Image saved: ${savedImage.filename}`)
      }
    } catch (saveError) {
      console.log('Note: Could not auto-save image:', saveError.message)
      // Continue anyway - saving is optional
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      metadata: result.metadata,
      saved: savedImage
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}