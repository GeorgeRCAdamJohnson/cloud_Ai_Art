'use client'

import { useState, useEffect } from 'react'
import { Wand2, Download, Loader2, AlertTriangle, Heart, ImageIcon, Sparkles } from 'lucide-react'
import ComfyUIModelSelector from './ComfyUIModelSelector'
import ComfyUISettings from './ComfyUISettings'
import AdvancedSettings from './AdvancedSettings'
import ImageUpload from './ImageUpload'
import DenoisingControl from './DenoisingControl'
import { GenerationSettings } from '../lib/resource-manager'
import { filterContent, FAMILY_PROMPTS, FilterResult } from '../lib/content-filter'

interface SpriteGeneratorProps {
  selectedService: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia' | 'comfyui-local'
  onSpriteGenerated: (sprite: any) => void
  isKidsMode: boolean
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

export default function SpriteGenerator({ selectedService, onSpriteGenerated, isKidsMode }: SpriteGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [comfyUISettings, setComfyUISettings] = useState({
    width: 768,
    height: 768,
    quality: 'optimized' as 'optimized' | 'high' | 'ultra',
    resolution: 'square-medium'
  })
  const [customSettings, setCustomSettings] = useState<Partial<GenerationSettings>>({})
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Tab system state
  const [activeTab, setActiveTab] = useState<'create' | 'refine'>('create')
  const [ageVerified, setAgeVerified] = useState(false)
  
  // Image-to-image state
  const [sourceImage, setSourceImage] = useState<string | null>(null)
  const [denoisingStrength, setDenoisingStrength] = useState(0.7)

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

  // Use family prompts when in kids mode
  const spritePrompts = isKidsMode ? FAMILY_PROMPTS : [
    "cute cartoon rabbit character for kids game",
    "friendly dragon character sprite",
    "magical fairy character with wings",
    "brave knight character in armor",
    "colorful butterfly character",
    "smiling sun character with face"
  ]

  // Handle prompt changes with filtering
  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt)
    if (isKidsMode && newPrompt.trim()) {
      const result = filterContent(newPrompt)
      setFilterResult(result)
    } else {
      setFilterResult(null)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Apply content filtering in kids mode
    let finalPrompt = prompt
    if (isKidsMode) {
      const result = filterContent(prompt)
      if (!result.isAppropriate) {
        alert(`❌ Please use family-friendly words! Blocked: ${result.blockedWords.join(', ')}`)
        return
      }
      finalPrompt = result.filteredText
    }

    setIsGenerating(true)
    try {
      const requestBody: any = {
        prompt: selectedService === 'comfyui-local' ? finalPrompt : finalPrompt + " 2D game sprite, pixel art style, transparent background, kids friendly",
        service: selectedService,
        model: selectedModel || Object.keys(SERVICE_MODELS[selectedService] || {})[0]
      }

      // Add ComfyUI-specific settings
      if (selectedService === 'comfyui-local') {
        requestBody.comfyUIOptions = {
          width: comfyUISettings.width,
          height: comfyUISettings.height,
          quality: comfyUISettings.quality,
          customSettings: Object.keys(customSettings).length > 0 ? customSettings : undefined,
          // Add img2img parameters if in refine mode and source image is provided
          ...(activeTab === 'refine' && sourceImage && {
            sourceImageUrl: sourceImage,
            denoisingStrength: denoisingStrength
          })
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
        setError(null)
        onSpriteGenerated({
          id: Date.now(),
          prompt: finalPrompt,
          imageUrl: data.imageUrl,
          service: selectedService,
          timestamp: new Date(),
          saved: data.saved // Include save info
        })
      } else {
        setError(data.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Generation failed:', error)
      setError('Failed to generate image. Please try again.')
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
      <h2 className="text-2xl font-bold text-white mb-6">
        {isKidsMode ? '✨ Create Your Character' : 'Generate Sprites'}
      </h2>
      
      {/* Tab Navigation - Only show if not in kids mode */}
      {!isKidsMode && (
        <div className="mb-6">
          <div className="flex space-x-2 bg-white/10 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Wand2 className="w-4 h-4 inline mr-2" />
              Create New Art
            </button>
            <button
              onClick={() => {
                if (!ageVerified) {
                  const confirmed = window.confirm(
                    'Age Verification Required\\n\\n' +
                    'The "Refine Art" feature allows uploading and modifying images. ' +
                    'This feature is intended for users 18+ only.\\n\\n' +
                    'By clicking OK, you confirm that you are 18 years or older.'
                  )
                  if (confirmed) {
                    setAgeVerified(true)
                    setActiveTab('refine')
                  }
                } else {
                  setActiveTab('refine')
                }
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                activeTab === 'refine'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Refine Art (18+)
            </button>
          </div>
        </div>
      )}
      
      {/* Create Tab Content */}
      {(isKidsMode || activeTab === 'create') && (
        <div className="space-y-6">
          <div>
          <label className="block text-white/80 mb-2">
            Describe your {isKidsMode ? 'character' : 'sprite'}:
            {isKidsMode && <span className="text-green-300 text-sm ml-2">🛡️ Family-safe mode</span>}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder={isKidsMode ? "e.g., cute cartoon cat playing with a ball" : "e.g., cute cartoon cat character jumping"}
            className={`w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border outline-none resize-none transition-colors ${
              filterResult && !filterResult.isAppropriate 
                ? 'border-red-400 focus:border-red-300 focus:ring-2 focus:ring-red-200' 
                : 'border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20'
            }`}
            rows={3}
          />
          
          {/* Content Filter Warning */}
          {filterResult && !filterResult.isAppropriate && (
            <div className="mt-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-300 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Please use family-friendly words!</span>
              </div>
              <p className="text-sm text-red-200 mb-2">
                Blocked words: {filterResult.blockedWords.join(', ')}
              </p>
              {filterResult.suggestions.length > 0 && (
                <div className="text-sm text-red-200">
                  <p className="font-medium mb-1">💡 Try these instead:</p>
                  <ul className="list-disc list-inside">
                    {filterResult.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Filtered Preview */}
          {filterResult && filterResult.isAppropriate && filterResult.filteredText !== prompt && (
            <div className="mt-2 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-300 mb-1">
                <Heart className="w-4 h-4" />
                <span className="font-medium">Enhanced for better results:</span>
              </div>
              <p className="text-sm text-green-200">"{filterResult.filteredText}"</p>
            </div>
          )}
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
          <p className="text-white/80 mb-3">
            {isKidsMode ? '🎨 Fun ideas to try:' : 'Quick prompts:'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {spritePrompts.map((p) => (
              <button
                key={p}
                onClick={() => handlePromptChange(p)}
                className="p-2 text-sm bg-white/10 hover:bg-white/20 text-white/90 rounded-lg transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating || (isKidsMode && filterResult && !filterResult.isAppropriate)}
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
              {isKidsMode ? '✨ Create My Character' : 'Generate Sprite'}
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
      }

      {/* Refine Tab Content - Adult Only */}
      {!isKidsMode && activeTab === 'refine' && ageVerified && (
          <div className="space-y-6">
            <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-orange-300 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Adult Content Warning</span>
              </div>
              <p className="text-orange-200 text-sm">
                This feature allows uploading and refining images. Please ensure all content follows community guidelines.
              </p>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-white/80 mb-2">
                Upload Reference Image:
              </label>
              <ImageUpload
                onImageSelect={(file) => {
                  if (file) {
                    const url = URL.createObjectURL(file)
                    setSourceImage(url)
                  } else {
                    setSourceImage(null)
                  }
                }}
                currentImage={sourceImage}
                onImageRemove={() => setSourceImage(null)}
              />
            </div>

            {/* Denoising Control */}
            {sourceImage && (
              <DenoisingControl
                value={denoisingStrength}
                onChange={setDenoisingStrength}
              />
            )}

            {/* Refinement Prompt */}
            <div>
              <label className="block text-white/80 mb-2">
                Describe how to refine the image:
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., make it more realistic, add better lighting, improve the facial features"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none resize-none"
                rows={3}
              />
            </div>

            {/* ComfyUI Settings for Refine Mode */}
            {selectedService === 'comfyui-local' && (
              <>
                <ComfyUISettings
                  isVisible={true}
                  onSettingsChange={setComfyUISettings}
                />
                <AdvancedSettings
                  selectedModel={selectedModel as any}
                  onSettingsChange={setCustomSettings}
                />
              </>
            )}

            {/* Generate Button for Refine Mode */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating || !sourceImage}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                !prompt.trim() || isGenerating || !sourceImage
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transform hover:scale-105 shadow-lg'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Refining Image...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Refine Image
                </div>
              )}
            </button>

            {/* Generated Image Display for Refine Mode */}
            {generatedImage && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={downloadSprite}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Refined Image
                  </button>
                </div>
                <img
                  src={generatedImage}
                  alt="Refined image"
                  className="w-full max-w-xs mx-auto rounded-lg bg-white/10 p-4"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}