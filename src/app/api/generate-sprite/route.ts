import { NextRequest, NextResponse } from 'next/server'
import { generateWithAWS } from '@/lib/aws-bedrock'
import { generateWithAzure } from '@/lib/azure-ai'
import { generateWithGoogle } from '@/lib/google-ai'
import { generateWithHuggingFace } from '@/lib/huggingface'
import { generateWithReplicate } from '@/lib/replicate'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, service } = body

    if (!prompt || !service) {
      return NextResponse.json(
        { success: false, error: 'Missing prompt or service' },
        { status: 400 }
      )
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

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      metadata: result.metadata
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Generation failed' },
      { status: 500 }
    )
  }
}