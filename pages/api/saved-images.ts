import { NextApiRequest, NextApiResponse } from 'next'
import { ImageStorage } from '../../src/lib/imageStorage'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      // Get all saved images
      const images = ImageStorage.listSavedImages()
      return res.status(200).json({
        success: true,
        images,
        count: images.length
      })
    }

    if (req.method === 'DELETE') {
      const { filename } = req.body
      if (!filename) {
        return res.status(400).json({
          success: false,
          error: 'Filename is required'
        })
      }

      const success = ImageStorage.deleteSavedImage(filename)
      if (success) {
        return res.status(200).json({
          success: true,
          message: 'Image deleted successfully'
        })
      } else {
        return res.status(404).json({
          success: false,
          error: 'Image not found'
        })
      }
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })

  } catch (error) {
    console.error('Saved images API error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    return res.status(500).json({
      success: false,
      error: errorMessage
    })
  }
}