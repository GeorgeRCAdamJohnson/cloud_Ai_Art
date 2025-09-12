// ComfyUI Local Integration - Self-hosted Stable Diffusion
// Connects to a local ComfyUI server for unlimited free generation

export interface GenerationResult {
  imageUrl: string
  metadata?: any
}

export interface ImageToImageOptions {
  sourceImageUrl?: string
  denoisingStrength?: number
  width?: number
  height?: number
  quality?: 'optimized' | 'high' | 'ultra'
  steps?: number
  cfg?: number
  customSettings?: any
  consistentSeed?: boolean
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
  'sdxl-base': {
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
  'cartoon-3d': {
    name: '3D Cartoon Safe',
    description: 'VRAM safe, 512x512, Pixar style',
    workflow: {
      "3": {
        "inputs": {
          "seed": 0,
          "steps": 15,
          "cfg": 6.0,
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
  'anime-sprite': {
    name: 'Anime Safe',
    description: 'VRAM safe, 512x512, anime style',
    workflow: {
      "3": {
        "inputs": {
          "seed": 0,
          "steps": 18,
          "cfg": 7.5,
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

  // Photorealistic Ultra Quality Workflow
  'photorealistic-ultra': {
    name: 'Photorealistic Ultra',
    description: 'Studio-quality photorealistic generation with upscaling',
    workflow: {
      "3": {
        "inputs": {
          "seed": 0,
          "steps": 120,
          "cfg": 9.5,
          "sampler_name": "dpmpp_2m",
          "scheduler": "karras",
          "denoise": 1.0,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["5", 0]
        },
        "class_type": "KSampler",
        "_meta": {
          "title": "KSampler Ultra"
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
          "width": 1536,
          "height": 1536,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage",
        "_meta": {
          "title": "Empty Latent Image"
        }
      },
      "6": {
        "inputs": {
          "text": "masterpiece, best quality, ultra high resolution, 8k, photorealistic, professional photography, studio lighting, sharp focus, detailed textures, cinematic quality, perfect anatomy, correct proportions, detailed face, realistic skin texture, natural pose, professional model, high-end fashion photography",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Photorealistic)"
        }
      },
      "7": {
        "inputs": {
          "text": "blurry, low quality, distorted, low resolution, pixelated, compressed, artifacts, noise, jpeg artifacts, watermark, signature, text, logo, worst quality, normal quality, lowres, bad anatomy, bad hands, bad fingers, extra fingers, missing fingers, deformed hands, mutated hands, extra limbs, missing limbs, deformed limbs, extra arms, extra legs, bad proportions, malformed limbs, disfigured, ugly face, asymmetric face, long neck, duplicate, morbid, mutilated, out of frame, body out of frame, cartoon, anime, illustration, painting, drawing, art, sketch",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Professional)"
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
          "filename_prefix": "PhotoRealistic_Ultra",
          "images": ["8", 0]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save Photorealistic Image"
        }
      }
    }
  },

  // UI/UX Asset Generation Workflow
  'ui-asset-clean': {
    name: 'UI Asset Clean',
    description: 'Clean, scalable UI elements and interface components',
    workflow: {
      "3": {
        "inputs": {
          "seed": 0,
          "steps": 40,
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
          "title": "KSampler UI"
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
          "width": 1024,
          "height": 1024,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage",
        "_meta": {
          "title": "Empty Latent Image"
        }
      },
      "6": {
        "inputs": {
          "text": "clean vector icon, minimalist design, solid colors, sharp edges, professional UI design, flat design style, scalable graphics, modern interface element",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (UI Clean)"
        }
      },
      "7": {
        "inputs": {
          "text": "blurry, low quality, distorted, ugly, inappropriate, realistic, photorealistic, 3d, shadows, gradients, complex textures, noise, artifacts, sketchy, hand-drawn, messy, cluttered",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Anti-Complex)"
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
          "filename_prefix": "UI_Asset_Clean",
          "images": ["8", 0]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save UI Asset"
        }
      }
    }
  },

  // Enhanced Image-to-Image workflows with upscaling
  'sdxl-img2img': {
    name: 'SDXL Image Enhancement',
    description: 'High-quality image refinement and upscaling',
    workflow: {
      "3": {
        "inputs": {
          "seed": 0,
          "steps": 35,
          "cfg": 7.5,
          "sampler_name": "dpmpp_2m",
          "scheduler": "karras",
          "denoise": 0.4,
          "model": ["4", 0],
          "positive": ["6", 0],
          "negative": ["7", 0],
          "latent_image": ["10", 0]
        },
        "class_type": "KSampler",
        "_meta": {
          "title": "KSampler Enhancement"
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
      "6": {
        "inputs": {
          "text": "masterpiece, best quality, highly detailed, sharp focus, professional, 8k, ultra high resolution",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Enhancement)"
        }
      },
      "7": {
        "inputs": {
          "text": "blurry, low quality, distorted, ugly, inappropriate, low resolution, pixelated, compressed, artifacts, noise, jpeg artifacts, watermark, signature, text, logo, worst quality, normal quality, lowres, bad anatomy, bad hands, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Negative)"
        }
      },
      "8": {
        "inputs": {
          "samples": ["12", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEDecode",
        "_meta": {
          "title": "VAE Decode"
        }
      },
      "9": {
        "inputs": {
          "filename_prefix": "ComfyUI_Enhanced",
          "images": ["8", 0]
        },
        "class_type": "SaveImage",
        "_meta": {
          "title": "Save Enhanced Image"
        }
      },
      "10": {
        "inputs": {
          "pixels": ["11", 0],
          "vae": ["4", 2]
        },
        "class_type": "VAEEncode",
        "_meta": {
          "title": "VAE Encode"
        }
      },
      "11": {
        "inputs": {
          "image": "input_image_placeholder"
        },
        "class_type": "LoadImage",
        "_meta": {
          "title": "Load Source Image"
        }
      },
      "12": {
        "inputs": {
          "seed": 0,
          "steps": 20,
          "cfg": 8.0,
          "sampler_name": "euler",
          "scheduler": "normal",
          "denoise": 0.25,
          "model": ["4", 0],
          "positive": ["13", 0],
          "negative": ["14", 0],
          "latent_image": ["3", 0]
        },
        "class_type": "KSampler",
        "_meta": {
          "title": "KSampler Refinement"
        }
      },
      "13": {
        "inputs": {
          "text": "ultra sharp, crystal clear, perfect details, photorealistic, studio lighting, professional photography",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Refinement)"
        }
      },
      "14": {
        "inputs": {
          "text": "blurry, soft, out of focus, low quality, pixelated, compressed",
          "clip": ["4", 1]
        },
        "class_type": "CLIPTextEncode",
        "_meta": {
          "title": "CLIP Text Encode (Refinement Negative)"
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
  timeout: parseInt(process.env.COMFYUI_TIMEOUT || '1200000') // 20 minutes for ultra quality
}

// ComfyUI API functions
async function queuePrompt(workflow: any, serverUrl: string): Promise<string> {
  const response = await fetch(`${serverUrl}/prompt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000'
    },
    body: JSON.stringify({ prompt: workflow })
  })
  
  if (!response.ok) {
    throw new Error(`Failed to queue prompt: ${response.statusText}`)
  }
  
  const result = await response.json()
  return result.prompt_id
}

async function getHistory(promptId: string, serverUrl: string): Promise<any> {
  const response = await fetch(`${serverUrl}/history/${promptId}`, {
    headers: {
      'Origin': 'http://localhost:3000'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get history: ${response.statusText}`)
  }
  
  return response.json()
}

async function getImage(filename: string, subfolder: string, type: string, serverUrl: string): Promise<ArrayBuffer> {
  const params = new URLSearchParams({
    filename,
    subfolder,
    type
  })
  
  const response = await fetch(`${serverUrl}/view?${params}`, {
    headers: {
      'Origin': 'http://localhost:3000'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Failed to get image: ${response.statusText}`)
  }
  
  return response.arrayBuffer()
}

// Upload image to ComfyUI for img2img
async function uploadImage(imageFile: File | Blob, serverUrl: string): Promise<string> {
  const formData = new FormData()
  formData.append('image', imageFile)
  
  const response = await fetch(`${serverUrl}/upload/image`, {
    method: 'POST',
    headers: {
      'Origin': 'http://localhost:3000'
    },
    body: formData
  })
  
  if (!response.ok) {
    throw new Error(`Failed to upload image: ${response.statusText}`)
  }
  
  const result = await response.json()
  return result.name // ComfyUI returns the uploaded filename
}

// Convert image URL/base64 to blob for upload
async function imageUrlToBlob(imageUrl: string): Promise<Blob> {
  console.log('imageUrlToBlob called with:', {
    isDataUrl: imageUrl.startsWith('data:'),
    urlLength: imageUrl.length,
    urlPrefix: imageUrl.substring(0, 50) + '...'
  })
  
  if (imageUrl.startsWith('data:')) {
    // Handle base64 data URLs
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to create blob from data URL: ${response.statusText}`)
      }
      const blob = await response.blob()
      console.log('Successfully created blob from data URL:', {
        size: blob.size,
        type: blob.type
      })
      return blob
    } catch (error) {
      console.error('Error processing data URL:', error)
      throw new Error(`Failed to process data URL: ${error instanceof Error ? error.message : String(error)}`)
    }
  } else {
    // Handle regular URLs
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`)
      }
      const blob = await response.blob()
      console.log('Successfully fetched image from URL:', {
        size: blob.size,
        type: blob.type
      })
      return blob
    } catch (error) {
      console.error('Error fetching image from URL:', error)
      throw new Error(`Failed to fetch image: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

// Main generation function
export async function generateWithComfyUI(
  prompt: string,
  model: ComfyUIModel = 'sdxl',
  options: ImageToImageOptions = {}
): Promise<GenerationResult> {
  const config = DEFAULT_CONFIG
  const serverUrl = `${config.serverUrl}:${config.port}`
  
  // Map model names for backward compatibility and check for img2img
  const modelMap: { [key: string]: string } = {
    'sdxl-base': 'sdxl-base',
    'sdxl': 'sdxl-base',
    'cartoon-3d': 'cartoon-3d',
    'anime-sprite': 'anime-sprite',
    'photorealistic-ultra': 'photorealistic-ultra',
    'ui-asset-clean': 'ui-asset-clean'
  }
  
  let mappedModel = modelMap[model] || model
  
  // If source image is provided, use img2img workflow
  if (options.sourceImageUrl) {
    mappedModel = mappedModel + '-img2img'
    // Create img2img workflow if it doesn't exist
    if (!COMFYUI_WORKFLOWS[mappedModel as keyof typeof COMFYUI_WORKFLOWS]) {
      mappedModel = 'sdxl-img2img' // fallback to sdxl img2img
    }
    console.log('Using img2img workflow:', mappedModel)
  } else {
    console.log('Using txt2img workflow:', mappedModel)
  }
  
  // Get workflow template
  const workflowTemplate = COMFYUI_WORKFLOWS[mappedModel as keyof typeof COMFYUI_WORKFLOWS]
  if (!workflowTemplate) {
    throw new Error(`Unknown model: ${mappedModel} (from ${model}). Available models: ${Object.keys(COMFYUI_WORKFLOWS).join(', ')}`)
  }
  
  console.log('Selected workflow template:', workflowTemplate.name)
  console.log('Original model:', model, '-> Mapped model:', mappedModel)
  
  // Clone and customize workflow
  const workflow = JSON.parse(JSON.stringify(workflowTemplate.workflow))
  
  // Handle image upload for img2img
  let uploadedImageName = null
  if (options.sourceImageUrl) {
    try {
      console.log('Starting img2img process with source image...')
      const imageBlob = await imageUrlToBlob(options.sourceImageUrl)
      console.log('Successfully converted to blob, uploading to ComfyUI...')
      uploadedImageName = await uploadImage(imageBlob, serverUrl)
      console.log('Successfully uploaded image to ComfyUI:', uploadedImageName)
      
      // Set the uploaded image in the workflow
      if (workflow['11']) {
        workflow['11'].inputs.image = uploadedImageName
        console.log('Set image in workflow node 11')
      }
      
      // Conservative denoising to preserve character
      if (workflow['3']) {
        const enhancementStrength = Math.min(options.denoisingStrength || 0.3, 0.4)
        workflow['3'].inputs.denoise = enhancementStrength
        console.log('Set conservative denoising strength:', enhancementStrength)
      }
      
      // Light refinement to avoid artifacts
      if (workflow['12']) {
        workflow['12'].inputs.denoise = Math.min(options.denoisingStrength * 0.5, 0.2)
        console.log('Set light refinement denoising:', workflow['12'].inputs.denoise)
      }
    } catch (uploadError) {
      console.error('Image upload error details:', uploadError)
      throw new Error(`Failed to upload source image: ${uploadError}`)
    }
  }
  
  // Enhanced prompt engineering based on model type
  const enhancePromptForModel = (basePrompt: string, model: string, hasSourceImage: boolean) => {
    if (model.includes('photorealistic')) {
      const photoPrompt = hasSourceImage 
        ? `${basePrompt}, improve quality, enhance details, photorealistic, professional photography, studio lighting, sharp focus, detailed textures, perfect anatomy, correct proportions`
        : `${basePrompt}, masterpiece, best quality, ultra high resolution, 8k, photorealistic, professional photography, studio lighting, sharp focus, detailed textures, cinematic quality, perfect anatomy, correct proportions, detailed face, realistic skin texture, natural pose, professional model`
      console.log('Enhanced photorealistic prompt:', photoPrompt)
      return photoPrompt
    }
    
    if (model.includes('ui-asset')) {
      const uiPrompt = hasSourceImage
        ? `${basePrompt}, improve clarity, clean design, sharp edges, professional UI element`
        : `${basePrompt}, clean vector icon, minimalist design, solid colors, sharp edges, professional UI design, flat design style, scalable graphics`
      return uiPrompt
    }
    
    // Default enhancement
    return hasSourceImage 
      ? `${basePrompt}, improve quality, enhance details, preserve original style`
      : basePrompt
  }
  
  const enhancedPrompt = enhancePromptForModel(prompt, mappedModel, !!options.sourceImageUrl)
  workflow['6'].inputs.text = enhancedPrompt
  
  // Set refinement prompt if node exists
  if (workflow['13']) {
    if (mappedModel.includes('photorealistic')) {
      workflow['13'].inputs.text = `ultra sharp, crystal clear, perfect details, photorealistic, studio lighting, professional photography, ${prompt}`
    } else {
      workflow['13'].inputs.text = `sharpen details, improve clarity, ${prompt}, maintain character anatomy`
    }
  }
  
  // Model-specific negative prompts
  const getNegativePrompt = (model: string) => {
    if (model.includes('photorealistic')) {
      return "blurry, low quality, distorted, low resolution, pixelated, compressed, artifacts, noise, jpeg artifacts, watermark, signature, text, logo, worst quality, normal quality, lowres, bad anatomy, bad hands, bad fingers, extra fingers, missing fingers, deformed hands, mutated hands, extra limbs, missing limbs, deformed limbs, extra arms, extra legs, bad proportions, malformed limbs, disfigured, ugly face, asymmetric face, long neck, duplicate, morbid, mutilated, out of frame, body out of frame, cartoon, anime, illustration, painting, drawing, art, sketch"
    }
    
    if (model.includes('ui-asset')) {
      return "blurry, low quality, distorted, ugly, inappropriate, realistic, photorealistic, 3d, shadows, gradients, complex textures, noise, artifacts, sketchy, hand-drawn, messy, cluttered"
    }
    
    // Default negative prompt
    return "blurry, low quality, distorted, inappropriate, artifacts, noise, bad anatomy, bad hands, deformed, extra limbs, anime style, cartoon nipples, oversexualized"
  }
  
  workflow['7'].inputs.text = getNegativePrompt(mappedModel)
  
  if (workflow['14']) {
    if (mappedModel.includes('photorealistic')) {
      workflow['14'].inputs.text = "blurry, soft, out of focus, low quality, pixelated, compressed, artistic, cartoon, anime"
    } else {
      workflow['14'].inputs.text = "blurry, artifacts, deformed anatomy, extra limbs, anime features"
    }
  }
  
  // Set dimensions based on workflow type and custom settings
  if (workflow['5']) {
    if (options.sourceImageUrl) {
      // For img2img enhancement, use higher resolution for better quality
      const targetWidth = options.customSettings?.width || options.width || 1536
      const targetHeight = options.customSettings?.height || options.height || 1536
      workflow['5'].inputs.width = Math.min(targetWidth, 1792) // Increased cap for better quality
      workflow['5'].inputs.height = Math.min(targetHeight, 1792)
      console.log('Set enhanced dimensions for img2img:', workflow['5'].inputs.width, 'x', workflow['5'].inputs.height)
    } else {
      // For txt2img, use enhanced dimensions for photorealistic
      const defaultWidth = mappedModel.includes('photorealistic') ? 1536 : 768
      const defaultHeight = mappedModel.includes('photorealistic') ? 1536 : 768
      workflow['5'].inputs.width = options.customSettings?.width || options.width || defaultWidth
      workflow['5'].inputs.height = options.customSettings?.height || options.height || defaultHeight
      console.log('Set dimensions for txt2img:', workflow['5'].inputs.width, 'x', workflow['5'].inputs.height)
    }
  }
  
  // Enhanced quality parameters with persona-specific settings
  const getQualitySettings = (model: string, hasSourceImage: boolean) => {
    // Photorealistic models need higher quality settings
    if (model.includes('photorealistic')) {
      return hasSourceImage ? {
        optimized: { steps: 50, cfg: 8.5 },
        high: { steps: 80, cfg: 9.0 },
        ultra: { steps: 120, cfg: 9.5 }
      } : {
        optimized: { steps: 45, cfg: 8.0 },
        high: { steps: 80, cfg: 9.0 },
        ultra: { steps: 120, cfg: 9.5 }
      }
    }
    
    // UI assets need clean, consistent settings
    if (model.includes('ui-asset')) {
      return hasSourceImage ? {
        optimized: { steps: 25, cfg: 6.5 },
        high: { steps: 40, cfg: 7.0 },
        ultra: { steps: 60, cfg: 7.5 }
      } : {
        optimized: { steps: 20, cfg: 6.0 },
        high: { steps: 40, cfg: 7.0 },
        ultra: { steps: 60, cfg: 7.5 }
      }
    }
    
    // Default settings for other models
    return hasSourceImage ? {
      optimized: { steps: 25, cfg: 7.5 },
      high: { steps: 35, cfg: 8.0 },
      ultra: { steps: 50, cfg: 8.5 }
    } : {
      optimized: { steps: 20, cfg: 7.0 },
      high: { steps: 30, cfg: 8.0 },
      ultra: { steps: 50, cfg: 9.0 }
    }
  }
  
  const qualitySettings = getQualitySettings(mappedModel, !!options.sourceImageUrl)
  
  const settings = qualitySettings[options.quality || 'optimized']
  
  // Apply custom settings first, then fallback to quality presets
  let finalSteps = settings.steps
  let finalCfg = settings.cfg
  let finalSampler = "euler"
  let finalScheduler = "normal"
  
  // Enhanced sampler settings based on model type and quality
  const getSamplerSettings = (model: string, quality: string, hasSourceImage: boolean) => {
    // Photorealistic models benefit from advanced samplers
    if (model.includes('photorealistic')) {
      if (quality === 'ultra') {
        return { sampler: "dpmpp_2m", scheduler: "karras" }
      } else if (quality === 'high') {
        return { sampler: "dpmpp_2m", scheduler: "normal" }
      } else {
        return { sampler: "euler_ancestral", scheduler: "normal" }
      }
    }
    
    // UI assets need consistent, clean sampling
    if (model.includes('ui-asset')) {
      if (quality === 'ultra') {
        return { sampler: "euler", scheduler: "normal" }
      } else {
        return { sampler: "euler", scheduler: "normal" }
      }
    }
    
    // Default sampler logic
    if (hasSourceImage) {
      if (quality === 'ultra') {
        return { sampler: "dpmpp_2m", scheduler: "karras" }
      } else if (quality === 'high') {
        return { sampler: "dpmpp_2m", scheduler: "normal" }
      } else {
        return { sampler: "euler_ancestral", scheduler: "normal" }
      }
    } else {
      if (quality === 'ultra') {
        return { sampler: "dpmpp_2m", scheduler: "karras" }
      } else if (quality === 'high') {
        return { sampler: "euler_ancestral", scheduler: "normal" }
      } else {
        return { sampler: "euler", scheduler: "normal" }
      }
    }
  }
  
  const samplerSettings = getSamplerSettings(mappedModel, options.quality || 'optimized', !!options.sourceImageUrl)
  finalSampler = samplerSettings.sampler
  finalScheduler = samplerSettings.scheduler
  
  // Check for custom settings in options
  if (options.customSettings) {
    finalSteps = options.customSettings.steps || finalSteps
    finalCfg = options.customSettings.cfg || finalCfg
  }
  
  // Direct overrides take highest priority
  finalSteps = options.steps || finalSteps
  finalCfg = options.cfg || finalCfg
  
  workflow['3'].inputs.steps = finalSteps
  workflow['3'].inputs.cfg = finalCfg
  workflow['3'].inputs.sampler_name = finalSampler
  workflow['3'].inputs.scheduler = finalScheduler
  
  // Set refinement pass parameters for img2img
  if (workflow['12'] && options.sourceImageUrl) {
    workflow['12'].inputs.steps = Math.floor(finalSteps * 0.6) // 60% of main steps
    workflow['12'].inputs.cfg = finalCfg
    workflow['12'].inputs.sampler_name = "euler"
    workflow['12'].inputs.scheduler = "normal"
    console.log('Set refinement pass parameters:', {
      steps: workflow['12'].inputs.steps,
      cfg: workflow['12'].inputs.cfg
    })
  }
  
  console.log('Applied generation settings:', {
    quality: options.quality,
    steps: finalSteps,
    cfg: finalCfg,
    sampler: finalSampler,
    scheduler: finalScheduler,
    customSettings: options.customSettings
  })
  
  // Generate seed (consistent if requested)
  if (options.consistentSeed) {
    workflow['3'].inputs.seed = 12345 // Fixed seed for consistency
  } else {
    workflow['3'].inputs.seed = Math.floor(Math.random() * 1000000)
  }
  
  try {
    // Test connection first
    try {
      const testResponse = await fetch(`${serverUrl}/system_stats`, {
        headers: { 'Origin': 'http://localhost:3000' }
      })
      if (!testResponse.ok) {
        throw new Error(`ComfyUI server not accessible: ${testResponse.status}`)
      }
    } catch (connError) {
      throw new Error(`Cannot connect to ComfyUI server at ${serverUrl}. Make sure ComfyUI is running with: python main.py --listen --port 8188 --enable-cors-header "*"`)
    }
    
    // Queue the prompt
    const promptId = await queuePrompt(workflow, serverUrl)
    
    // Wait for completion
    let history
    let attempts = 0
    const maxAttempts = Math.floor(config.timeout / 5000) // Check every 5 seconds for longer generations
    
    console.log(`Waiting for ComfyUI generation to complete (prompt ID: ${promptId})...`)
    
    do {
      await new Promise(resolve => setTimeout(resolve, 5000))
      history = await getHistory(promptId, serverUrl)
      attempts++
      console.log(`Attempt ${attempts}/${maxAttempts}: Checking generation status...`)
      
      if (attempts > maxAttempts) {
        throw new Error('Generation timeout')
      }
    } while (!history[promptId])
    
    console.log('Generation completed! Processing results...')
    
    // Extract image info
    const outputs = history[promptId].outputs
    console.log('Available output nodes:', Object.keys(outputs))
    
    const imageNode = outputs['9'] // SaveImage node
    
    if (!imageNode) {
      console.error('No SaveImage node (9) found in outputs:', outputs)
      throw new Error('No SaveImage node found in generation outputs')
    }
    
    if (!imageNode.images || imageNode.images.length === 0) {
      console.error('SaveImage node found but no images generated:', imageNode)
      throw new Error('No images generated')
    }
    
    const imageInfo = imageNode.images[0]
    console.log('Image info retrieved:', imageInfo)
    
    // Get the image data
    console.log('Retrieving image data from ComfyUI...')
    const imageBuffer = await getImage(
      imageInfo.filename,
      imageInfo.subfolder,
      imageInfo.type,
      serverUrl
    )
    
    console.log('Image retrieved successfully, size:', imageBuffer.byteLength, 'bytes')
    
    console.log('Image retrieved successfully, size:', imageBuffer.byteLength, 'bytes')
    
    // Convert to base64 (Node.js environment)
    const base64 = Buffer.from(imageBuffer).toString('base64')
    const imageUrl = `data:image/png;base64,${base64}`
    
    console.log('Image converted to base64, data URL length:', imageUrl.length)
    
    const result = {
      imageUrl,
      metadata: {
        service: 'comfyui-local',
        model,
        prompt,
        resolution: `${workflow['5']?.inputs?.width || 'auto'}x${workflow['5']?.inputs?.height || 'auto'}`,
        quality: options.quality || 'optimized',
        steps: finalSteps,
        cfg: finalCfg,
        seed: workflow['3'].inputs.seed,
        timestamp: new Date().toISOString(),
        ...(uploadedImageName && { sourceImage: uploadedImageName }),
        ...(options.denoisingStrength && { denoisingStrength: options.denoisingStrength })
      }
    }
    
    console.log('ComfyUI generation completed successfully:', {
      hasImageUrl: !!result.imageUrl,
      imageUrlLength: result.imageUrl.length,
      metadata: result.metadata
    })
    
    return result
  } catch (error) {
    console.error('ComfyUI generation error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      serverUrl,
      prompt,
      model,
      options
    })
    throw error // Re-throw the original error with full details
  }
}