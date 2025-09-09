'use client'

import { Zap, Sparkles, Gamepad2 } from 'lucide-react'

interface ComfyUIModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
  isVisible: boolean
}

export default function ComfyUIModelSelector({ selectedModel, onModelChange, isVisible }: ComfyUIModelSelectorProps) {
  if (!isVisible) return null

  const models = [
    {
      id: 'cartoon-3d',
      name: '3D Cartoon Safe',
      icon: Zap,
      description: 'DreamShaper XL - Pixar/Disney style, ultra-safe for RTX 3050 6GB',
      color: 'bg-gradient-to-r from-green-500 to-blue-500',
      features: ['VRAM Safe', '512x512', 'Pixar Style', '~6s'],
      badge: '⚡ SAFE',
      recommended: true
    },
    {
      id: 'sdxl-base',
      name: 'SDXL Safe',
      icon: Sparkles,
      description: 'SDXL realistic style, ultra-safe for RTX 3050 6GB',
      color: 'bg-gradient-to-r from-purple-500 to-pink-600',
      features: ['VRAM Safe', '512x512', 'Realistic', '~8s'],
      badge: '✅ SAFE',
      recommended: true
    },
    {
      id: 'anime-sprite',
      name: 'Anime Safe',
      icon: Gamepad2,
      description: 'Anime model, ultra-safe for RTX 3050 6GB',
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      features: ['VRAM Safe', '512x512', 'Anime Style', '~7s'],
      badge: '🎌 SAFE',
      recommended: true
    },

  ]

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-purple-400" />
        ComfyUI Model Selection
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => {
          const Icon = model.icon
          return (
            <button
              key={model.id}
              onClick={() => onModelChange(model.id)}
              className={`p-4 rounded-xl transition-all duration-200 text-left ${
                selectedModel === model.id
                  ? 'bg-white/20 ring-2 ring-white/50 shadow-lg transform scale-105'
                  : 'bg-white/5 hover:bg-white/10 hover:transform hover:scale-102'
              } ${model.recommended ? 'ring-1 ring-green-400/30' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${model.color} flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{model.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                      model.badge.includes('BEST') 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold'
                        : model.badge.includes('FAST')
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold'
                        : 'bg-white/20 text-white'
                    }`}>
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-2 line-clamp-2">{model.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  {model.recommended && (
                    <div className="mt-2">
                      <span className="text-xs text-yellow-300 font-medium">⭐ Recommended</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
        <p className="text-sm text-blue-200">
          <strong>💡 RTX 3050 Optimized:</strong> All models are tuned for your 6GB VRAM. Try <strong>3D Cartoon Turbo</strong> for fastest results!
        </p>
      </div>
    </div>
  )
}