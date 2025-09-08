'use client'

import { useState, useEffect } from 'react'
import { Wand2, Download, Loader2 } from 'lucide-react'

interface SpriteGeneratorProps {
  selectedService: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia'
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

  // Auto-select first model when service changes
  useEffect(() => {
    const availableModels = Object.keys(SERVICE_MODELS[selectedService] || {})
    if (availableModels.length > 0) {
      setSelectedModel(availableModels[0])
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
      const response = await fetch('/api/generate-sprite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt + " 2D game sprite, pixel art style, transparent background, kids friendly",
          service: selectedService,
          model: selectedModel || Object.keys(SERVICE_MODELS[selectedService] || {})[0]
        }),
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

        {/* Model Selection */}
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
          {!selectedModel && Object.keys(SERVICE_MODELS[selectedService] || {}).length > 0 && (
            <p className="text-sm text-yellow-300 mt-2">
              💡 Select a model above or we&apos;ll use the default one
            </p>
          )}
        </div>

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
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Sprite
            </>
          )}
        </button>

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