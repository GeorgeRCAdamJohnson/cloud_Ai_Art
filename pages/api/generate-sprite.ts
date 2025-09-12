import { NextApiRequest, NextApiResponse } from 'next'
import { generateWithAWS } from '../../src/lib/aws-bedrock'
import { generateWithAzure } from '../../src/lib/azure-ai'
import { generateWithGoogle } from '../../src/lib/google-ai'
import { generateWithHuggingFace } from '../../src/lib/huggingface'
import { generateWithReplicate } from '../../src/lib/replicate'
import { generateWithPollinations } from '../../src/lib/pollinations'
import { generateWithSegmind } from '../../src/lib/segmind'
import { generateWithProdia } from '../../src/lib/prodia'
import { generateWithComfyUI } from '../../src/lib/comfyui-local'
import { ImageStorage } from '../../src/lib/imageStorage'

// Configure API route to handle larger requests (for base64 images)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'GET') {
    // Return available services for testing
    return res.status(200).json({
      success: true,
      message: 'AI Sprite Generation API',
      services: ['aws', 'azure', 'google', 'huggingface', 'replicate', 'pollinations', 'segmind', 'prodia', 'comfyui-local'],
      freeServices: ['huggingface', 'replicate', 'pollinations', 'segmind', 'prodia', 'comfyui-local'],
      localServices: ['comfyui-local'],
      version: '1.0.0',
      timestamp: new Date().toISOString()
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { prompt, service = 'comfyui-local', model, comfyUIOptions } = req.body

    console.log(`Generating sprite with ${service}:`, prompt, 'Model:', model)
    
    if (comfyUIOptions) {
      console.log('ComfyUI Options:', comfyUIOptions)
    }

    if (!prompt || !service) {
      return res.status(400).json({
        success: false,
        error: 'Missing prompt or service'
      })
    }

    // Debug: Check environment variables
    const hasToken = !!process.env.HUGGINGFACE_API_TOKEN
    console.log('Environment check:', { hasToken })
    if (process.env.HUGGINGFACE_API_TOKEN) {
      console.log(`Token starts with: ${process.env.HUGGINGFACE_API_TOKEN?.substring(0, 10)}...`)
    }

    let result
    
    switch (service.toLowerCase()) {
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
      case 'pollinations':
        result = await generateWithPollinations(prompt, model || 'flux')
        break
      case 'segmind':
        result = await generateWithSegmind(prompt, model || 'sdxl')
        break
      case 'prodia':
        result = await generateWithProdia(prompt, model || 'dreamlike-anime')
        break
      case 'comfyui-local':
        console.log('Starting ComfyUI generation...')
        const options = comfyUIOptions || {}
        // Pass custom settings and consistency option if provided
        if (options.customSettings) {
          options.customSettings = options.customSettings
          // Extract consistency setting if present
          if (options.customSettings.consistentSeed !== undefined) {
            options.consistentSeed = options.customSettings.consistentSeed
          }
        }
        console.log('Calling generateWithComfyUI with:', { prompt, model: model || 'sdxl', options })
        result = await generateWithComfyUI(
          prompt, 
          model || 'sdxl',
          options
        )
        console.log('ComfyUI generation completed, result:', !!result?.imageUrl)
        break
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown service: ${service}. Available services: aws, azure, google, huggingface, replicate, pollinations, segmind, prodia, comfyui-local`
        })
    }

    if (result?.imageUrl) {
      // Check if we're in a serverless environment (Netlify)
      const isServerless = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME
      
      if (isServerless) {
        // Skip saving in serverless environment
        console.log('Serverless environment detected, skipping file system save')
        return res.status(200).json({
          success: true,
          imageUrl: result.imageUrl,
          metadata: result.metadata,
          info: 'Generated successfully (serverless mode - no file saving)'
        })
      } else {
        // Save the generated image (local development)
        try {
          console.log('Attempting to save image...', {
            hasImageUrl: !!result.imageUrl,
            imageUrlLength: result.imageUrl?.length,
            prompt,
            service
          })
          const savedImage = await ImageStorage.saveImage(
            result.imageUrl, 
            prompt, 
            service, 
            result.metadata?.model || 'unknown'
          )
          
          console.log('Image saved successfully:', savedImage.filename)
          
          return res.status(200).json({
            success: true,
            imageUrl: result.imageUrl,
            savedImage: savedImage,
            metadata: result.metadata
          })
        } catch (saveError) {
          console.error('Failed to save image:', saveError)
          // Still return the generated image even if saving fails
          return res.status(200).json({
            success: true,
            imageUrl: result.imageUrl,
            metadata: result.metadata,
            warning: 'Generated successfully but failed to save to gallery'
          })
        }
      }
    } else {
      throw new Error('No image generated')
    }

  } catch (error) {
    console.error('Generation error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return res.status(500).json({
      success: false,
      error: errorMessage,
      service: req.body?.service || 'unknown'
    })
  }
}