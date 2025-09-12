import { NextApiRequest, NextApiResponse } from 'next'
import { generateWithComfyUI } from '../../src/lib/comfyui-local'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Testing ComfyUI generation...')
    
    const result = await generateWithComfyUI('test prompt', 'sdxl', {
      width: 512,
      height: 512,
      quality: 'optimized'
    })
    
    console.log('Generation successful!')
    
    return res.status(200).json({
      success: true,
      hasImage: !!result.imageUrl,
      imageLength: result.imageUrl?.length || 0,
      metadata: result.metadata
    })
    
  } catch (error) {
    console.error('Test failed:', error)
    
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
  }
}