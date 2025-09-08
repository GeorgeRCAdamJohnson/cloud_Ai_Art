import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Check environment variables
    const envCheck = {
      hasHuggingFaceToken: !!process.env.HUGGINGFACE_API_TOKEN,
      hasHuggingFaceAll: !!process.env.HUGGINGFACEALL,
      tokenPrefix: process.env.HUGGINGFACE_API_TOKEN?.substring(0, 10) || 
                   process.env.HUGGINGFACEALL?.substring(0, 10) || 'none',
      nodeEnv: process.env.NODE_ENV,
      isNetlify: !!process.env.NETLIFY,
      timestamp: new Date().toISOString()
    }

    console.log('Environment check:', envCheck)

    // Test Hugging Face API connection
    if (req.method === 'POST') {
      const apiToken = process.env.HUGGINGFACE_API_TOKEN || process.env.HUGGINGFACEALL
      if (!apiToken) {
        return res.status(500).json({ success: false, error: 'No API token available' })
      }

      try {
        console.log('Testing Hugging Face API connection...')
        const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inputs: 'test image generation'
          })
        })

        console.log('HF API Response status:', response.status)
        const responseHeaders = Object.fromEntries(response.headers.entries())
        console.log('HF API Response headers:', responseHeaders)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('HF API Error:', errorText)
          return res.status(200).json({
            success: false,
            environment: envCheck,
            hfTest: {
              status: response.status,
              error: errorText,
              headers: responseHeaders
            }
          })
        }

        const contentType = response.headers.get('content-type')
        console.log('HF API Content-Type:', contentType)

        return res.status(200).json({
          success: true,
          environment: envCheck,
          hfTest: {
            status: response.status,
            contentType: contentType,
            headers: responseHeaders,
            message: 'API connection successful'
          }
        })
      } catch (fetchError) {
        console.error('Fetch error:', fetchError)
        return res.status(200).json({
          success: false,
          environment: envCheck,
          hfTest: {
            error: fetchError instanceof Error ? fetchError.message : String(fetchError)
          }
        })
      }
    }

    return res.status(200).json({
      success: true,
      environment: envCheck
    })
  } catch (error) {
    console.error('Test env error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }
}