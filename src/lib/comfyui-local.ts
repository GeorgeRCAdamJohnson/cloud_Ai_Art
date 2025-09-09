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

// Advanced Prompt Engineering System
const PROMPT_TEMPLATES = {
  character: {
    base: 'detailed character design, full body character, game character sheet',
    styles: {
      cartoon: 'cartoon style, cel shading, clean lines, bright colors, stylized proportions',
      anime: 'anime art style, manga illustration, detailed anime character, vibrant anime colors',
      fantasy: 'fantasy character design, magical elements, epic fantasy art style',
      cute: 'kawaii style, adorable character, cute proportions, charming design',
      heroic: 'heroic character design, dynamic pose, epic character art, legendary hero'
    }
  },
  sprite: {
    base: '2D game sprite, pixel-perfect design, game asset, clean sprite art',
    styles: {
      retro: 'retro game sprite, 16-bit style, classic video game art',
      modern: 'modern game sprite, high-resolution sprite, contemporary game art',
      mobile: 'mobile game character, casual game art, friendly design, polished sprite'
    }
  }
}

const QUALITY_ENHANCERS = {
  optimized: {
    positive: 'good quality, clean art, well-designed',
    technical: '(clean lines:1.1), (bright colors:1.0)'
  },
  high: {
    positive: 'high quality, masterpiece, professional art, detailed design, excellent composition',
    technical: '(masterpiece:1.2), (best quality:1.3), (ultra-detailed:1.1), (sharp focus:1.1)'
  },
  ultra: {
    positive: 'masterpiece, best quality, ultra-detailed, professional artwork, studio quality, award-winning design, perfect composition, exceptional detail',
    technical: '(masterpiece:1.4), (best quality:1.4), (ultra-detailed:1.3), (perfect composition:1.2), (studio lighting:1.1), (sharp focus:1.2), (professional artwork:1.3)'
  }
}

const NEGATIVE_PROMPTS = {
  general: 'lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry',
  character: 'deformed, ugly, mutilated, disfigured, bad proportions, malformed limbs, extra limbs, cloned face, missing arms, missing legs, fused fingers, too many fingers',
  sprite: 'pixelated, aliasing, compression artifacts, muddy colors, unclear edges, low resolution, distorted proportions',
  kids_safe: 'nsfw, nude, inappropriate, scary, violent, dark themes, horror, blood, weapons'
}

function buildAdvancedPrompt(
  userPrompt: string, 
  model: ComfyUIModel, 
  quality: 'optimized' | 'high' | 'ultra' = 'optimized'
): { positive: string; negative: string } {
  
  // Analyze user prompt for content type and style hints
  const isCharacter = /character|person|hero|knight|dragon|fairy|princess|warrior|mage|wizard|robot|creature/i.test(userPrompt)
  const isSprite = /sprite|game|pixel|2d|asset/i.test(userPrompt)
  const isCute = /cute|adorable|kawaii|friendly|sweet|charming/i.test(userPrompt)
  const isFantasy = /magic|fantasy|wizard|dragon|fairy|mythical|enchanted/i.test(userPrompt)
  const isHeroic = /hero|knight|warrior|brave|epic|legendary|champion/i.test(userPrompt)
  
  // Build positive prompt components
  const components = []
  
  // Quality enhancers first
  const qualityEnhancer = QUALITY_ENHANCERS[quality]
  components.push(qualityEnhancer.technical)
  
  // Core user prompt (cleaned and enhanced) - EMPHASIZED for consistency
  const cleanPrompt = userPrompt.replace(/[,\s]+$/, '') // Remove trailing commas/spaces
  components.push(`"${cleanPrompt}"`) // Quote the main subject for emphasis
  components.push(`main subject: ${cleanPrompt}`) // Reinforce the subject
  
  // Add base template
  if (isCharacter) {
    components.push(PROMPT_TEMPLATES.character.base)
    
    // Add style-specific enhancements
    if (isCute) components.push(PROMPT_TEMPLATES.character.styles.cute)
    else if (isFantasy) components.push(PROMPT_TEMPLATES.character.styles.fantasy)
    else if (isHeroic) components.push(PROMPT_TEMPLATES.character.styles.heroic)
    else components.push(PROMPT_TEMPLATES.character.styles.cartoon)
  }
  
  if (isSprite) {
    components.push(PROMPT_TEMPLATES.sprite.base)
    components.push(PROMPT_TEMPLATES.sprite.styles.modern)
  }
  
  // Model-specific enhancements (reduced to prevent subject drift)
  switch (model) {
    case 'sdxl':
      components.push('detailed illustration, clean digital art')
      break
    case 'sd15':
      components.push('2D game art, cartoon style')
      break
  }
  
  // Essential specifications only
  components.push('white background, clean composition')
  components.push('game asset, high quality')
  components.push(qualityEnhancer.positive)
  
  // Kids-friendly elements (always include)
  components.push('colorful, bright lighting, cheerful, family-friendly, appropriate for children')
  
  // Build negative prompt with stronger subject preservation
  const negativeComponents = [
    NEGATIVE_PROMPTS.general,
    NEGATIVE_PROMPTS.kids_safe,
    'cars, vehicles, automobiles, trucks, motorcycles, trains, planes, ships, boats', // Prevent common drift subjects
    'buildings, architecture, landscapes, scenery, city, urban, roads, streets', // Prevent environment drift
    'multiple subjects, crowd, group, many characters' // Keep focus on single subject
  ]
  
  if (isCharacter) {
    negativeComponents.push(NEGATIVE_PROMPTS.character)
  }
  
  if (isSprite) {
    negativeComponents.push(NEGATIVE_PROMPTS.sprite)
  }
  
  // Add model-specific negative prompts
  switch (model) {
    case 'sdxl':
      negativeComponents.push('anime, manga style, low quality render, pixelated')
      break
    case 'sd15':
      negativeComponents.push('photographic, realistic photo, 3d render')
      break
  }
  
  return {
    positive: components.join(', '),
    negative: negativeComponents.join(', ')
  }
}

interface ComfyUIGenerationOptions {
  width?: number
  height?: number
  quality?: 'optimized' | 'high' | 'ultra'
  customSettings?: any
  consistentSeed?: boolean // New option for consistent results
}

export async function generateWithComfyUI(
  prompt: string, 
  model: ComfyUIModel = 'sdxl',
  options: ComfyUIGenerationOptions = {}
): Promise<GenerationResult> {
  // Handle model name mapping for backward compatibility
  const normalizedModel: ComfyUIModel = (model === 'sdxl-base' as any) ? 'sdxl' : model
  
  try {
    const config = DEFAULT_CONFIG
    const baseUrl = `${config.serverUrl}:${config.port}`
    
    const quality = options.quality || 'optimized'
    console.log(`🎨 Generating with ComfyUI ${COMFYUI_WORKFLOWS[normalizedModel].name} (${quality}):`, prompt)
    console.log(`🔗 ComfyUI Server: ${baseUrl}`)
    console.log(`📐 Resolution: ${options.width || 768}x${options.height || 768}`)

    // Generate advanced prompts using the new system
    const promptData = buildAdvancedPrompt(prompt, normalizedModel, quality)
    
    console.log(`🎯 Enhanced Prompt: ${promptData.positive.substring(0, 100)}...`)
    console.log(`🚫 Negative Prompt: ${promptData.negative.substring(0, 80)}...`)

    // Enhance prompt for 2D game sprites (legacy fallback)
    const enhancedPrompt = promptData.positive
    
    // Prepare workflow
    if (!COMFYUI_WORKFLOWS[normalizedModel]) {
      throw new Error(`Unsupported model: ${model}. Available models: ${Object.keys(COMFYUI_WORKFLOWS).join(', ')}`)
    }
    const workflow = JSON.parse(JSON.stringify(COMFYUI_WORKFLOWS[normalizedModel].workflow))
    
    // Set the positive and negative prompts in the workflow
    workflow["6"].inputs.text = promptData.positive
    workflow["7"].inputs.text = promptData.negative
    
    // Set seed (consistent or random)
    if (options.consistentSeed) {
      // Use a hash of the prompt for consistent results
      const promptHash = prompt.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      workflow["3"].inputs.seed = Math.abs(promptHash) % 1000000
    } else {
      workflow["3"].inputs.seed = Math.floor(Math.random() * 1000000)
    }

    // Apply custom settings from options
    if (options.width && workflow["5"]?.inputs) {
      workflow["5"].inputs.width = options.width
    }
    if (options.height && workflow["5"]?.inputs) {
      workflow["5"].inputs.height = options.height
    }

    // Apply advanced custom settings if provided
    if (options.customSettings) {
      const { width, height, steps, cfg, sampler, scheduler } = options.customSettings
      console.log(`🔧 Applying advanced settings:`, {
        width, height, steps, cfg, sampler, scheduler
      })
      
      // Apply custom dimensions
      if (width && workflow["5"]?.inputs) {
        workflow["5"].inputs.width = width
      }
      if (height && workflow["5"]?.inputs) {
        workflow["5"].inputs.height = height
      }
      
      // Apply KSampler settings (node 3 for most workflows)
      if (workflow["3"]?.inputs) {
        if (steps) workflow["3"].inputs.steps = steps
        if (cfg) workflow["3"].inputs.cfg = cfg
        if (sampler) workflow["3"].inputs.sampler_name = sampler
        if (scheduler) workflow["3"].inputs.scheduler = scheduler
      }
    }

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
              
              if (history[promptId]?.outputs) {
                // Find the SaveImage node output
                const outputs = history[promptId].outputs
                const saveImageOutput = outputs["9"] // Node 9 is SaveImage in our workflow
                
                if (saveImageOutput?.images?.length > 0) {
                  const imageInfo = saveImageOutput.images[0]
                  const imageUrl = `${baseUrl}/view?filename=${imageInfo.filename}&subfolder=${imageInfo.subfolder || ''}&type=${imageInfo.type || 'output'}`
                  
                  // Fetch the actual image and convert to base64 with better error handling
                  try {
                    const imageResponse = await fetch(imageUrl, {
                      signal: AbortSignal.timeout(10000) // 10 second timeout for image fetch
                    })
                    
                    if (!imageResponse.ok) {
                      throw new Error(`Failed to fetch image: ${imageResponse.status}`)
                    }
                    
                    const imageBuffer = await imageResponse.arrayBuffer()
                    const base64Data = Buffer.from(imageBuffer).toString('base64')
                    const dataUrl = `data:image/png;base64,${base64Data}`

                    console.log('✅ Successfully generated image with ComfyUI')
                    console.log(`📁 Image size: ${imageBuffer.byteLength} bytes`)

                    return {
                      imageUrl: dataUrl,
                      metadata: {
                        service: 'comfyui-local',
                        model: COMFYUI_WORKFLOWS[normalizedModel]?.name || normalizedModel,
                        modelKey: normalizedModel,
                        prompt: enhancedPrompt,
                        timestamp: new Date().toISOString(),
                        cost: 'FREE (Local)',
                        size: imageBuffer.byteLength,
                        promptId,
                        description: COMFYUI_WORKFLOWS[normalizedModel]?.description || 'AI-generated image',
                        serverUrl: baseUrl
                      }
                    }
                  } catch (imageError) {
                    console.log('⚠️ Error fetching generated image:', imageError)
                    return createComfyUIFallback(prompt, model, 'Generated but failed to fetch image')
                  }
                }
              }
            }
          }
        }
      } catch (pollError) {
        const errorMessage = pollError instanceof Error ? pollError.message : String(pollError)
        console.log(`⚠️ Error polling ComfyUI (attempt ${attempts + 1}):`, errorMessage)
        
        // Don't immediately fail on connection errors, keep trying
        if (pollError instanceof Error) {
          if (pollError.name === 'AbortError' || errorMessage.includes('timeout')) {
            console.log('🔄 Continuing polling despite timeout...')
          } else if (errorMessage.includes('connection') || errorMessage.includes('network')) {
            console.log('🔄 Network issue, continuing polling...')
          }
        }
        // Continue polling for other errors too - ComfyUI might still be working
      }
      
      attempts++
      console.log(`🔄 Waiting for generation... (${attempts}/${maxAttempts})`)
    }

    // If we get here, it timed out
    console.log('⏰ ComfyUI generation timed out')
    return createComfyUIFallback(prompt, normalizedModel, 'Generation timed out')

  } catch (error) {
    console.error('❌ ComfyUI error:', error)
    return createComfyUIFallback(prompt, normalizedModel, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Fallback function when ComfyUI isn't accessible
function createComfyUIFallback(prompt: string, model: ComfyUIModel, reason: string): GenerationResult {
  console.log('🔄 Using ComfyUI fallback generation')
  
  const width = 512
  const height = 512
  
  // Handle model name mapping for fallback
  const normalizedModel: ComfyUIModel = (model === 'sdxl-base' as any) ? 'sdxl' : model
  const modelInfo = COMFYUI_WORKFLOWS[normalizedModel] || { name: `Unknown Model (${model})` }
  
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