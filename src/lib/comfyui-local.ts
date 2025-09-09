// ComfyUI Local Integration - Self-hosted Stable Diffusion
// Connects to a local ComfyUI server for unlimited free generation

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

// ComfyUI workflow templates for different models
const COMFYUI_WORKFLOWS = {
  'sdxl': {
    name: 'SDXL Base',
    description: 'High quality, detailed images',
    workflow: {
      "3": {
        "inputs": {
          "seed": 0,
          "steps": 20,
          "cfg": 8.0,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1.0,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler",
        "_meta": {
          "title": "KSampler"
        }
      },
      "4": {
        "inputs": {
          "ckpt_name": "sd_xl_base_1.0.safetensors"
        },
        "class_type": "CheckpointLoaderSimple",
        "_meta": {
          "title": "Load Checkpoint"
        }
      },
      "5": {
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage",
        "_meta": {
          "title": "Empty Latent Image"
        }
      },
      "6": {
        "inputs": {
          "text": "",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Prompt)"
        }
      },
      "7": {
        "inputs": {
          "text": "blurry, low quality, distorted, ugly, inappropriate",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Prompt)"
        }
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode",
        "_meta": {
          "title": "VAE Decode"
        }
      },
      "9": {
        "inputs": {
          "filename_prefix": "ComfyUI",
          "images": ["8", 0]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save Image"
        }
      }
    }
  },
  'sd15': {
    name: 'Stable Diffusion 1.5',
    description: 'Classic, fast generation',
    workflow: {
      "3": {
        "inputs": {
          "seed": 0,
          "steps": 20,
          "cfg": 7.0,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 1.0,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler",
        "_meta": {
          "title": "KSampler"
        }
      },
      "4": {
        "inputs": {
          "ckpt_name": "v1-5-pruned-emaonly.ckpt"
        },
        "class_type": "CheckpointLoaderSimple",
        "_meta": {
          "title": "Load Checkpoint"
        }
      },
      "5": {
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage",
        "_meta": {
          "title": "Empty Latent Image"
        }
      },
      "6": {
        "inputs": {
          "text": "",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Prompt)"
        }
      },
      "7": {
        "inputs": {
          "text": "blurry, low quality, distorted, ugly, inappropriate",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Prompt)"
        }
      },
      "8": {
        "inputs": {
          "samples": ["3", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode",
        "_meta": {
          "title": "VAE Decode"
        }
      },
      "9": {
        "inputs": {
          "filename_prefix": "ComfyUI",
          "images": ["8", 0]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save Image"
        }
      }
    }
  }
} as const

export type ComfyUIModel = keyof typeof COMFYUI_WORKFLOWS

interface ComfyUIConfig {
  serverUrl: string
  port: number
  timeout: number
}

// Default configuration - can be overridden via environment variables
const DEFAULT_CONFIG: ComfyUIConfig = {
  serverUrl: process.env.COMFYUI_SERVER_URL || 'http://localhost',
  port: parseInt(process.env.COMFYUI_PORT || '8188'),
  timeout: parseInt(process.env.COMFYUI_TIMEOUT || '60000')
}

export async function generateWithComfyUI(prompt: string, model: ComfyUIModel = 'sdxl'): Promise<GenerationResult> {
  try {
    const config = DEFAULT_CONFIG
    const baseUrl = `${config.serverUrl}:${config.port}`
    
    console.log(`🎨 Generating with ComfyUI ${COMFYUI_WORKFLOWS[model].name}:`, prompt)
    console.log(`🔗 ComfyUI Server: ${baseUrl}`)

    // Enhance prompt for 2D game sprites
    const enhancedPrompt = `${prompt}, 2D game sprite, pixel art style, cartoon style, colorful, cute character, kids friendly, simple background, clean art style, high quality`
    
    // Prepare workflow
    const workflow = JSON.parse(JSON.stringify(COMFYUI_WORKFLOWS[model].workflow))
    
    // Set the prompt in the workflow
    workflow["6"].inputs.text = enhancedPrompt
    
    // Set random seed
    workflow["3"].inputs.seed = Math.floor(Math.random() * 1000000)

    // Step 1: Check if ComfyUI server is running
    try {
      const healthResponse = await fetch(`${baseUrl}/system_stats`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout for health check
      })
      
      if (!healthResponse.ok) {
        console.log('❌ ComfyUI server not responding')
        return createComfyUIFallback(prompt, model, 'Server not responding')
      }
      
      console.log('✅ ComfyUI server is running')
    } catch (error) {
      console.log('❌ ComfyUI server not accessible:', error)
      return createComfyUIFallback(prompt, model, 'Server not accessible - make sure ComfyUI is running on http://localhost:8188')
    }

    // Step 2: Submit workflow to queue
    const queueResponse = await fetch(`${baseUrl}/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: workflow,
        client_id: Date.now().toString()
      }),
      signal: AbortSignal.timeout(config.timeout)
    })

    if (!queueResponse.ok) {
      console.log('❌ Failed to queue workflow:', queueResponse.status)
      return createComfyUIFallback(prompt, model, 'Failed to queue workflow')
    }

    const queueResult = await queueResponse.json()
    const promptId = queueResult.prompt_id

    if (!promptId) {
      console.log('❌ No prompt ID received')
      return createComfyUIFallback(prompt, model, 'No prompt ID received')
    }

    console.log(`🔄 Workflow queued with ID: ${promptId}`)

    // Step 3: Poll for completion
    let attempts = 0
    const maxAttempts = config.timeout / 2000 // Check every 2 seconds
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds
      
      try {
        // Check queue status
        const queueStatusResponse = await fetch(`${baseUrl}/queue`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        })
        
        if (queueStatusResponse.ok) {
          const queueStatus = await queueStatusResponse.json()
          
          // Check if our prompt is still in queue
          const isInQueue = queueStatus.queue_running.some((item: any) => item[1] === promptId) ||
                           queueStatus.queue_pending.some((item: any) => item[1] === promptId)
          
          if (!isInQueue) {
            // Prompt completed, get the result
            const historyResponse = await fetch(`${baseUrl}/history/${promptId}`, {
              method: 'GET',
              signal: AbortSignal.timeout(5000)
            })
            
            if (historyResponse.ok) {
              const history = await historyResponse.json()
              
              if (history[promptId] && history[promptId].outputs) {
                // Find the SaveImage node output
                const outputs = history[promptId].outputs
                const saveImageOutput = outputs["9"] // Node 9 is SaveImage in our workflow
                
                if (saveImageOutput && saveImageOutput.images && saveImageOutput.images.length > 0) {
                  const imageInfo = saveImageOutput.images[0]
                  const imageUrl = `${baseUrl}/view?filename=${imageInfo.filename}&subfolder=${imageInfo.subfolder || ''}&type=${imageInfo.type || 'output'}`
                  
                  // Fetch the actual image and convert to base64
                  const imageResponse = await fetch(imageUrl)
                  const imageBuffer = await imageResponse.arrayBuffer()
                  const base64Data = Buffer.from(imageBuffer).toString('base64')
                  const dataUrl = `data:image/png;base64,${base64Data}`

                  console.log('✅ Successfully generated image with ComfyUI')
                  console.log(`📁 Image size: ${imageBuffer.byteLength} bytes`)

                  return {
                    imageUrl: dataUrl,
                    metadata: {
                      service: 'comfyui-local',
                      model: COMFYUI_WORKFLOWS[model].name,
                      modelKey: model,
                      prompt: enhancedPrompt,
                      timestamp: new Date().toISOString(),
                      cost: 'FREE (Local)',
                      size: imageBuffer.byteLength,
                      promptId,
                      description: COMFYUI_WORKFLOWS[model].description,
                      serverUrl: baseUrl
                    }
                  }
                }
              }
            }
          }
        }
      } catch (pollError) {
        console.log('⚠️ Error polling ComfyUI:', pollError)
      }
      
      attempts++
      console.log(`🔄 Waiting for generation... (${attempts}/${maxAttempts})`)
    }

    // If we get here, it timed out
    console.log('⏰ ComfyUI generation timed out')
    return createComfyUIFallback(prompt, model, 'Generation timed out')

  } catch (error) {
    console.error('❌ ComfyUI error:', error)
    return createComfyUIFallback(prompt, model, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fallback function when ComfyUI isn't accessible
function createComfyUIFallback(prompt: string, model: ComfyUIModel, reason: string): GenerationResult {
  console.log('🔄 Using ComfyUI fallback generation')
  
  const width = 512
  const height = 512
  
  const modelInfo = COMFYUI_WORKFLOWS[model]
  
  // Create an informative SVG placeholder
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      <circle cx="256" cy="150" r="60" fill="white" opacity="0.2"/>
      <text x="50%" y="30%" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif" font-weight="bold">
        ComfyUI Local
      </text>
      <text x="50%" y="40%" text-anchor="middle" fill="white" font-size="16" font-family="Arial, sans-serif">
        ${modelInfo.name}
      </text>
      <text x="50%" y="55%" text-anchor="middle" fill="white" font-size="12" font-family="Arial, sans-serif">
        "${prompt.slice(0, 40)}${prompt.length > 40 ? '...' : ''}"
      </text>
      <text x="50%" y="70%" text-anchor="middle" fill="yellow" font-size="11" font-family="Arial, sans-serif">
        ${reason}
      </text>
      <text x="50%" y="80%" text-anchor="middle" fill="white" font-size="10" font-family="Arial, sans-serif" opacity="0.8">
        Install ComfyUI locally for unlimited free generation
      </text>
      <text x="50%" y="87%" text-anchor="middle" fill="white" font-size="9" font-family="Arial, sans-serif" opacity="0.7">
        Run: python main.py --listen --port 8188
      </text>
    </svg>
  `
  
  const base64Svg = Buffer.from(svgContent).toString('base64')
  const dataUrl = `data:image/svg+xml;base64,${base64Svg}`
  
  return {
    imageUrl: dataUrl,
    metadata: {
      service: 'comfyui-local',
      model: modelInfo.name,
      modelKey: model,
      prompt,
      timestamp: new Date().toISOString(),
      cost: 'FREE (Local)',
      status: 'fallback',
      reason,
      description: modelInfo.description,
      setupInstructions: 'Download ComfyUI and run: python main.py --listen --port 8188'
    }
  }
}