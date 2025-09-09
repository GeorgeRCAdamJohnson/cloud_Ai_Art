'use client'

import { useState, useEffect } from 'react'
import { Wand2, Download, Loader2 } from 'lucide-react'
import ComfyUIModelSelector from './ComfyUIModelSelector'
import ComfyUISettings from './ComfyUISettings'
import AdvancedSettings from './AdvancedSettings'
import { GenerationSettings } from '../lib/resource-manager'

interface SpriteGeneratorProps {
  selectedService: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia' | 'comfyui-local'
  onSpriteGenerated: (sprite: any) => void
}

// Model options for each service
const SERVICE_MODELS = {
  pollinations: {
    'flux': { name: 'FLUX', description: 'High quality, balanced' },
    'flux-schnell': { name: 'FLUX Schnell', description: 'Fast generation' },
    'sd3.5': { name: 'SD 3.5', description: 'Latest Stable Diffusion' },
    'playground-v2.5': { name: 'Playground v2.5', description: 'Artistic style' },
    'sdxl': { name: 'SDXL', description: 'High resolution' },
    'anything-v5': { name: 'Anything v5', description: 'Anime/cartoon style' }
  },
  segmind: {
    'sdxl': { name: 'SDXL', description: 'High quality, detailed' },
    'sd1.5': { name: 'SD 1.5', description: 'Classic, reliable' },
    'kandinsky': { name: 'Kandinsky 2.2', description: 'Artistic, unique' },
    'deepfloyd': { name: 'DeepFloyd IF', description: 'Text-aware' }
  },
  prodia: {
    'dreamlike-anime': { name: 'Dreamlike Anime', description: 'Perfect for sprites' },
    'anything-v4': { name: 'Anything V4', description: 'Anime/cartoon style' },
    'deliberate': { name: 'Deliberate', description: 'High quality' },
    'v1-5-pruned-emaonly': { name: 'SD 1.5', description: 'Fast, reliable' },
    'openjourney': { name: 'OpenJourney', description: 'Artistic style' }
  },
  'comfyui-local': {
    'cartoon-3d': { name: '3D Cartoon Safe', description: 'VRAM safe, 512x512, Pixar style (~6s)' },
    'sdxl-base': { name: 'SDXL Safe', description: 'VRAM safe, 512x512, realistic (~8s)' },
    'anime-sprite': { name: 'Anime Safe', description: 'VRAM safe, 512x512, anime style (~7s)' }
  },
  huggingface: {
    'default': { name: 'FLUX.1-schnell', description: 'Fast generation' }
  },
  replicate: {
    'default': { name: 'SDXL', description: 'High quality' }
  },
  aws: {
    'default': { name: 'Stable Diffusion', description: 'Enterprise grade' }
  },
  azure: {
    'default': { name: 'DALL-E', description: 'Microsoft AI' }
  },
  google: {
    'default': { name: 'Imagen', description: 'Google AI' }
  }
} as const

export default function SpriteGenerator({ selectedService, onSpriteGenerated }: SpriteGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [comfyUISettings, setComfyUISettings] = useState({
    width: 768,
    height: 768,
    quality: 'optimized' as 'optimized' | 'high' | 'ultra',
    resolution: 'square-medium'
  })
  const [customSettings, setCustomSettings] = useState<Partial<GenerationSettings>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Auto-select first model when service changes
  useEffect(() => {
    const availableModels = Object.keys(SERVICE_MODELS[selectedService] || {})
    if (availableModels.length > 0) {
      // For ComfyUI Local, prefer sdxl-base as it's the only working model
      if (selectedService === 'comfyui-local' && availableModels.includes('sdxl-base')) {
        setSelectedModel('sdxl-base')
      } else {
        setSelectedModel(availableModels[0])
      }
    }
  }, [selectedService])

  const spritePrompts = [
    "cute cartoon rabbit character for kids game",
    "friendly dragon character sprite",
    "magical fairy character with wings",
    "brave knight character in armor",
    "colorful butterfly character",
    "smiling sun character with face"
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const requestBody: any = {
        prompt: selectedService === 'comfyui-local' ? prompt : prompt + " 2D game sprite, pixel art style, transparent background, kids friendly",
        service: selectedService,
        model: selectedModel || Object.keys(SERVICE_MODELS[selectedService] || {})[0]
      }

      // Add ComfyUI-specific settings
      if (selectedService === 'comfyui-local') {
        requestBody.comfyUIOptions = {
          width: comfyUISettings.width,
          height: comfyUISettings.height,
          quality: comfyUISettings.quality,
          customSettings: Object.keys(customSettings).length > 0 ? customSettings : undefined
        }
      }

      const response = await fetch('/api/generate-sprite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedImage(data.imageUrl)
        onSpriteGenerated({
          id: Date.now(),
          prompt,
          imageUrl: data.imageUrl,
          service: selectedService,
          timestamp: new Date(),
          saved: data.saved // Include save info
        })
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadSprite = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `sprite-${Date.now()}.png`
      link.click()
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Generate Sprites</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white/80 mb-2">Describe your sprite:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., cute cartoon cat character jumping"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none resize-none"
            rows={3}
          />
        </div>

        {/* ComfyUI Model Selection */}
        <ComfyUIModelSelector 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isVisible={selectedService === 'comfyui-local'}
        />

        {/* ComfyUI Quality & Resolution Settings */}
        <ComfyUISettings
          isVisible={selectedService === 'comfyui-local'}
          onSettingsChange={setComfyUISettings}
        />

        {/* Advanced Settings for ComfyUI */}
        {selectedService === 'comfyui-local' && (
          <AdvancedSettings
            selectedModel={selectedModel as any}
            onSettingsChange={setCustomSettings}
          />
        )}

        {/* Other Services Model Selection */}
        {selectedService !== 'comfyui-local' && Object.keys(SERVICE_MODELS[selectedService] || {}).length > 1 && (
          <div>
            <label className="block text-white/80 mb-2">Choose AI Model:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(SERVICE_MODELS[selectedService] || {}).map(([modelKey, modelInfo]) => (
                <button
                  key={modelKey}
                  onClick={() => setSelectedModel(modelKey)}
                  className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                    selectedModel === modelKey
                      ? 'bg-white/20 border-white/50 ring-2 ring-white/30'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="font-medium text-white">{modelInfo.name}</div>
                  <div className="text-sm text-white/70">{modelInfo.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-white/80 mb-3">Quick prompts:</p>
          <div className="grid grid-cols-2 gap-2">
            {spritePrompts.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="p-2 text-sm bg-white/10 hover:bg-white/20 text-white/90 rounded-lg transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {selectedService === 'comfyui-local' ? (
                comfyUISettings.quality === 'ultra' ? 'Generating... (up to 20min)' :
                comfyUISettings.quality === 'high' ? 'Generating... (~2-5min)' :
                'Generating... (~30s)'
              ) : 'Generating...'}
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Sprite
            </>
          )}
        </button>
        
        {isGenerating && selectedService === 'comfyui-local' && (
          <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
            <p className="text-sm text-purple-200 text-center">
              <strong>🎨 ComfyUI RTX 3050 Optimized!</strong> 
              {comfyUISettings.quality === 'ultra' && ' 💎 Ultra Quality - Maximum detail and perfection (up to 20min)!'}
              {comfyUISettings.quality === 'high' && ' 🎨 High Quality - Excellent balance of speed and detail!'}
              {comfyUISettings.quality === 'optimized' && ' ⚡ Optimized Speed - Fast generation with good quality!'}
              <br />
              <span className="text-sm text-purple-300">
                Resolution: {comfyUISettings.width}×{comfyUISettings.height} • Model: SDXL Base
              </span>
            </p>
          </div>
        )}

        {generatedImage && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Generated Sprite</h3>
              <button
                onClick={downloadSprite}
                className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <img
              src={generatedImage}
              alt="Generated sprite"
              className="w-full max-w-xs mx-auto rounded-lg bg-white/10 p-4"
            />
          </div>
        )}
      </div>
    </div>
  )
}