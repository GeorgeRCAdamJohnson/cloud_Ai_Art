'use client'

import { useState, useEffect } from 'react'
import { Wand2, Download, Loader2, AlertTriangle, Heart, ImageIcon, Sparkles, Settings } from 'lucide-react'
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
  selectedPersona?: string | null
  defaultModel?: string | null
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
    'sdxl-base': { name: 'SDXL Base', description: 'High quality, versatile (~30s)' },
    'photorealistic-ultra': { name: 'Photorealistic Ultra', description: 'Studio-quality, 4K-ready (~8-15min)' },
    'ui-asset-clean': { name: 'UI Asset Clean', description: 'Vector-style icons & interfaces (~2-4min)' },
    'cartoon-3d': { name: '3D Cartoon Safe', description: 'VRAM safe, 512x512, Pixar style (~6s)' },
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

export default function SpriteGenerator({ selectedService, onSpriteGenerated, isKidsMode, selectedPersona, defaultModel }: SpriteGeneratorProps) {
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
  const [denoisingStrength, setDenoisingStrength] = useState(0.3)

  // Smart defaults based on service selection and persona
  useEffect(() => {
    const availableModels = Object.keys(SERVICE_MODELS[selectedService] || {})
    if (availableModels.length > 0) {
      // Use persona-specific default model if available
      const modelToUse = defaultModel && availableModels.includes(defaultModel) 
        ? defaultModel 
        : selectedService === 'comfyui-local' && availableModels.includes('sdxl-base')
        ? 'sdxl-base'
        : availableModels[0]
      
      setSelectedModel(modelToUse)
      
      console.log('Model selection debug:', {
        selectedPersona,
        defaultModel,
        availableModels,
        modelToUse,
        selectedService
      })
      
      // Set persona-specific defaults
      if (selectedPersona === 'photographer' && modelToUse === 'photorealistic-ultra') {
        setComfyUISettings({
          width: 1536,
          height: 1536,
          quality: 'ultra',
          resolution: 'square-xl'
        })
      } else if (selectedPersona === 'designer' && modelToUse === 'ui-asset-clean') {
        setComfyUISettings({
          width: 512,
          height: 512,
          quality: 'high',
          resolution: 'square-small'
        })
      } else if (selectedService === 'comfyui-local') {
        setComfyUISettings({
          width: 768,
          height: 768,
          quality: 'high',
          resolution: 'square-medium'
        })
      } else {
        setComfyUISettings({
          width: 512,
          height: 512,
          quality: 'optimized',
          resolution: 'square-small'
        })
      }
    }
  }, [selectedService, selectedPersona, defaultModel])

  // Persona-specific quick prompts
  const getQuickPrompts = () => {
    if (isKidsMode) return FAMILY_PROMPTS
    
    // Check for persona-specific prompts
    if (selectedPersona === 'photographer' || selectedModel === 'photorealistic-ultra') {
      return [
        "professional portrait of a person with studio lighting, perfect anatomy",
        "high-end fashion model in elegant pose, correct proportions",
        "cinematic portrait with dramatic lighting, detailed face",
        "professional headshot with natural lighting, realistic skin",
        "artistic portrait with shallow depth of field, perfect anatomy",
        "studio fashion photography, professional model, correct proportions"
      ]
    }
    
    if (selectedPersona === 'designer' || selectedModel === 'ui-asset-clean') {
      return [
        "clean home icon for mobile app",
        "modern settings gear icon",
        "minimalist user profile icon",
        "professional download button",
        "clean search icon with magnifying glass",
        "modern notification bell icon"
      ]
    }
    
    const promptsByService = {
      'comfyui-local': [
        "pixel art warrior character",
        "detailed fantasy hero sprite",
        "high-quality robot character",
        "professional game character",
        "sci-fi soldier sprite",
        "medieval knight character"
      ],
      'pollinations': [
        "friendly animal teacher",
        "educational mascot character",
        "cartoon learning buddy",
        "classroom helper character",
        "story book character",
        "fun learning sprite"
      ],
      'huggingface': [
        "cute pet character",
        "simple cartoon animal",
        "friendly monster sprite",
        "colorful bird character",
        "happy sun character",
        "magical fairy sprite"
      ]
    }
    
    return promptsByService[selectedService] || [
      "cute cartoon character",
      "friendly animal sprite",
      "magical character",
      "brave hero character",
      "colorful creature",
      "fantasy character"
    ]
  }
  
  const spritePrompts = getQuickPrompts()

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

  const convertBlobToBase64 = async (blobUrl: string): Promise<string> => {
    const response = await fetch(blobUrl)
    const blob = await response.blob()
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    // Apply content filtering in kids mode (bypass for professional photographer)
    let finalPrompt = prompt
    if (isKidsMode && selectedPersona !== 'photographer') {
      const result = filterContent(prompt)
      if (!result.isAppropriate) {
        alert(`😊 Let's try different words! Instead of "${result.blockedWords.join(', ')}", try: ${result.suggestions.slice(0, 2).join(' or ')}`)
        return
      }
      finalPrompt = result.filteredText
    }

    setIsGenerating(true)
    try {
      const requestBody: any = {
        prompt: selectedService === 'comfyui-local' ? finalPrompt : 
          selectedPersona === 'photographer' ? finalPrompt : 
          finalPrompt + " 2D game sprite, pixel art style, transparent background, kids friendly",
        service: selectedService,
        model: selectedModel || Object.keys(SERVICE_MODELS[selectedService] || {})[0]
      }
      
      console.log('Frontend sending request:', {
        service: selectedService,
        model: requestBody.model,
        selectedModel,
        selectedPersona,
        prompt: finalPrompt
      })

      // Add ComfyUI-specific settings
      if (selectedService === 'comfyui-local') {
        requestBody.comfyUIOptions = {
          width: activeTab === 'refine' ? 1024 : comfyUISettings.width,
          height: activeTab === 'refine' ? 1024 : comfyUISettings.height,
          quality: comfyUISettings.quality,
          customSettings: Object.keys(customSettings).length > 0 ? customSettings : undefined
        }
        
        // Add img2img parameters if in refine mode and source image is provided
        if (activeTab === 'refine' && sourceImage) {
          try {
            // Convert blob URL to base64 data URL
            const base64Image = await convertBlobToBase64(sourceImage)
            requestBody.comfyUIOptions.sourceImageUrl = base64Image
            requestBody.comfyUIOptions.denoisingStrength = denoisingStrength
            
            // Conservative enhancement prompt to preserve character
            if (!requestBody.prompt.toLowerCase().includes('enhance')) {
              requestBody.prompt = `enhance details, improve quality, ${requestBody.prompt}, preserve original style and anatomy`
            }
          } catch (error) {
            console.error('Failed to convert image to base64:', error)
            setError('📷 Image upload issue! Try a smaller image or different format (JPG/PNG work best).')
            setIsGenerating(false)
            return
          }
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
        const friendlyError = data.error?.includes('timeout') ? 
          '😅 Taking longer than expected! Try a simpler prompt or different service.' :
          data.error?.includes('server') ?
          '😔 Server busy right now. Please try again in a moment!' :
          '🤔 Something went wrong. Try a different prompt like "cute cat character"'
        setError(friendlyError)
      }
    } catch (error) {
      console.error('Generation failed:', error)
      setError('😔 Oops! Something went wrong. Try a simpler prompt like "happy dog" or check your internet connection.')
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
        {isKidsMode ? '✨ Create Your Character' : 
         selectedPersona === 'photographer' ? '📸 Studio Photography Mode' :
         selectedPersona === 'designer' ? '🎨 UI/UX Design Mode' :
         selectedPersona === 'developer' ? '🎮 Game Development Mode' :
         selectedPersona === 'teacher' ? '👨🏫 Educational Content Mode' :
         'Generate Sprites'}
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
            {selectedPersona === 'photographer' ? 'Describe your photo concept:' :
             selectedPersona === 'designer' ? 'Describe your UI element:' :
             selectedPersona === 'developer' ? 'Describe your game sprite:' :
             selectedPersona === 'teacher' ? 'Describe your educational content:' :
             `Describe your ${isKidsMode ? 'character' : 'sprite'}:`}
            {isKidsMode && <span className="text-green-300 text-sm ml-2">🛡️ Family-safe mode</span>}
            {selectedPersona === 'photographer' && <span className="text-blue-300 text-sm ml-2">📸 Studio-quality mode</span>}
            {selectedPersona === 'designer' && <span className="text-purple-300 text-sm ml-2">🎨 UI/UX mode</span>}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder={
              isKidsMode ? "e.g., cute cartoon cat playing with a ball" :
              selectedPersona === 'photographer' ? "e.g., professional portrait with dramatic lighting" :
              selectedPersona === 'designer' ? "e.g., clean home icon for mobile app" :
              selectedPersona === 'developer' ? "e.g., pixel art warrior character" :
              selectedPersona === 'teacher' ? "e.g., friendly animal teacher character" :
              "e.g., cute cartoon cat character jumping"
            }
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

        {/* Persona-specific mode indicator */}
        {selectedPersona === 'photographer' && selectedModel === 'photorealistic-ultra' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📸</span>
              <h3 className="text-white font-semibold">Studio-Quality Photography Mode Active</h3>
            </div>
            <p className="text-blue-200 text-sm mb-2">
              Ultra-high resolution (1536x1536), photorealistic rendering, professional lighting and composition. Artistic freedom enabled.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs">1536x1536</span>
              <span className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs">Studio Lighting</span>
              <span className="px-2 py-1 bg-pink-500/30 text-pink-200 rounded-full text-xs">Artistic Freedom</span>
              <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded-full text-xs">Professional Quality</span>
            </div>
          </div>
        )}
        
        {selectedPersona === 'designer' && selectedModel === 'ui-asset-clean' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎨</span>
              <h3 className="text-white font-semibold">UI/UX Design Mode Active</h3>
            </div>
            <p className="text-purple-200 text-sm mb-2">
              Clean vector-style icons, perfect for interfaces, buttons, and UI elements.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-purple-500/30 text-purple-200 rounded-full text-xs">Vector Style</span>
              <span className="px-2 py-1 bg-pink-500/30 text-pink-200 rounded-full text-xs">Clean Design</span>
              <span className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs">UI Ready</span>
            </div>
          </div>
        )}

        {/* Progressive Disclosure - Advanced Settings */}
        {selectedService === 'comfyui-local' && (
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </button>
            
            {showAdvanced && (
              <div className="space-y-6">
                <ComfyUIModelSelector 
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  isVisible={true}
                />
                <ComfyUISettings
                  isVisible={true}
                  onSettingsChange={setComfyUISettings}
                />
                <AdvancedSettings
                  selectedModel={selectedModel as any}
                  onSettingsChange={setCustomSettings}
                />
              </div>
            )}
          </div>
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
            {isKidsMode ? '🎨 Fun ideas to try:' :
             selectedPersona === 'photographer' ? '📸 Studio photography ideas:' :
             selectedPersona === 'designer' ? '🎨 UI/UX design ideas:' :
             selectedPersona === 'developer' ? '🎮 Game sprite ideas:' :
             selectedPersona === 'teacher' ? '👨🏫 Educational content ideas:' :
             '✨ Quick ideas for you:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {spritePrompts.map((p) => (
              <button
                key={p}
                onClick={() => handlePromptChange(p)}
                className="p-3 text-sm bg-white/10 hover:bg-white/20 text-white/90 rounded-lg transition-colors text-left min-h-[44px] flex items-center"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating || (isKidsMode && filterResult && !filterResult.isAppropriate)}
          className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 min-h-[48px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {selectedService === 'comfyui-local' ? (
                selectedPersona === 'photographer' && comfyUISettings.quality === 'ultra' ? '📸 Creating 1536x1536 studio masterpiece... (8-12min)' :
                selectedPersona === 'designer' ? '🎨 Crafting UI element... (~2-4min)' :
                comfyUISettings.quality === 'ultra' ? '🎨 Creating masterpiece... (up to 20min)' :
                comfyUISettings.quality === 'high' ? '🎨 Crafting your sprite... (~2-5min)' :
                '⚡ Creating your sprite... (~30s)'
              ) : '🎨 Creating your art...'}
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              {isKidsMode ? '✨ Create My Character' :
               selectedPersona === 'photographer' ? '📸 Create Studio Photo' :
               selectedPersona === 'designer' ? '🎨 Generate UI Element' :
               selectedPersona === 'developer' ? '🎮 Create Game Sprite' :
               selectedPersona === 'teacher' ? '👨🏫 Create Educational Content' :
               selectedService === 'comfyui-local' ? '🚀 Generate Pro Sprite' :
               selectedService === 'pollinations' ? '⚡ Quick Generate' :
               '🌟 Generate Sprite'}
            </>
          )}
        </button>
        
        {isGenerating && selectedService === 'comfyui-local' && (
          <div className={`mt-3 p-3 rounded-lg border ${
            selectedPersona === 'photographer' ? 'bg-blue-500/10 border-blue-400/20' :
            selectedPersona === 'designer' ? 'bg-purple-500/10 border-purple-400/20' :
            'bg-purple-500/10 border-purple-400/20'
          }`}>
            <p className={`text-sm text-center ${
              selectedPersona === 'photographer' ? 'text-blue-200' :
              selectedPersona === 'designer' ? 'text-purple-200' :
              'text-purple-200'
            }`}>
              <strong>
                {selectedPersona === 'photographer' ? '📸 Studio Photography Mode!' :
                 selectedPersona === 'designer' ? '🎨 UI/UX Design Mode!' :
                 '🎨 ComfyUI RTX 3050 Optimized!'}
              </strong> 
              {selectedPersona === 'photographer' && comfyUISettings.quality === 'ultra' && ' 💎 Ultra Studio Quality - 1536x1536 professional photography (8-12min)!'}
              {selectedPersona === 'designer' && ' 🎨 Clean Vector Style - Perfect UI elements!'}
              {!selectedPersona && comfyUISettings.quality === 'ultra' && ' 💎 Ultra Quality - Maximum detail and perfection (8-12min)!'}
              {!selectedPersona && comfyUISettings.quality === 'high' && ' 🎨 High Quality - Excellent balance of speed and detail!'}
              {!selectedPersona && comfyUISettings.quality === 'optimized' && ' ⚡ Optimized Speed - Fast generation with good quality!'}
              <br />
              <span className={`text-sm ${
                selectedPersona === 'photographer' ? 'text-blue-300' :
                selectedPersona === 'designer' ? 'text-purple-300' :
                'text-purple-300'
              }`}>
                Resolution: {comfyUISettings.width}×{comfyUISettings.height} • Model: {
                  selectedModel === 'photorealistic-ultra' ? 'Photorealistic Ultra' :
                  selectedModel === 'ui-asset-clean' ? 'UI Asset Clean' :
                  'SDXL Base'
                }
              </span>
            </p>
          </div>
        )}

        {generatedImage && (
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">
              {selectedPersona === 'photographer' ? 'Studio Photography' :
               selectedPersona === 'designer' ? 'UI Element' :
               selectedPersona === 'developer' ? 'Game Sprite' :
               selectedPersona === 'teacher' ? 'Educational Content' :
               'Generated Sprite'}
            </h3>
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
      )}

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

            {/* Image Enhancement Settings */}
            {selectedService === 'comfyui-local' && (
              <div>
                <label className="block text-white/80 mb-2">Enhancement Quality:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['optimized', 'high', 'ultra'].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setComfyUISettings(prev => ({ ...prev, quality: quality as any }))}
                      className={`p-2 rounded-lg border transition-all text-sm ${
                        comfyUISettings.quality === quality
                          ? 'bg-white/20 border-white/50 text-white'
                          : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {quality === 'optimized' && '⚡ Fast'}
                      {quality === 'high' && '🎨 Balanced'}
                      {quality === 'ultra' && '💎 Maximum'}
                    </button>
                  ))}
                </div>
              </div>
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
  )
}