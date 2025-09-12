'use client'

import { useState } from 'react'
import { Sparkles, Zap, Shield, Settings } from 'lucide-react'

interface ServiceSelectorProps {
  selectedService: string
  onServiceChange: (service: string) => void
  isKidsMode: boolean
  onPersonaChange?: (persona: UserPersona | null, defaultModel?: string) => void
}

type UserPersona = 'beginner' | 'developer' | 'designer' | 'photographer' | 'teacher' | 'advanced'

const PERSONA_RECOMMENDATIONS = {
  beginner: {
    service: 'huggingface',
    title: '🌟 Perfect for First-Time Users',
    description: 'Simple, safe, and no setup required - just start creating!',
    defaultModel: 'default'
  },
  developer: {
    service: 'comfyui-local',
    title: '🚀 Best for Game Development',
    description: 'Unlimited, high-quality, professional sprites for your games',
    defaultModel: 'sdxl-base'
  },
  designer: {
    service: 'comfyui-local',
    title: '🎨 Perfect for UI/UX Design',
    description: 'Clean vector-style icons, buttons, and interface elements',
    defaultModel: 'ui-asset-clean'
  },
  photographer: {
    service: 'comfyui-local',
    title: '📸 Studio-Quality Photography',
    description: 'Ultra-high resolution, photorealistic, professional results',
    defaultModel: 'photorealistic-ultra'
  },
  teacher: {
    service: 'pollinations',
    title: '👨🏫 Great for Education',
    description: 'Family-safe, super fast, perfect for classroom use',
    defaultModel: 'flux'
  },
  advanced: {
    service: 'comfyui-local',
    title: '🔧 Full Control & Power',
    description: 'All features, maximum quality, complete customization',
    defaultModel: 'sdxl-base'
  }
}

const SIMPLE_SERVICES = [
  {
    id: 'huggingface',
    name: 'Easy Mode',
    icon: '🌟',
    description: 'Perfect for beginners',
    features: ['No signup needed', 'Family-safe', 'Fast results (15s)'],
    badge: 'Beginner Friendly'
  },
  {
    id: 'comfyui-local',
    name: 'Pro Mode',
    icon: '🚀',
    description: 'Best quality & unlimited',
    features: ['Unlimited free', 'Highest quality', 'Fast & High Quality (30s)'],
    badge: 'Most Popular'
  },
  {
    id: 'pollinations',
    name: 'Quick Mode',
    icon: '⚡',
    description: 'Super fast generation',
    features: ['Lightning fast (10s)', 'No limits', 'Good quality'],
    badge: 'Fastest'
  }
]

export default function ServiceSelector({ selectedService, onServiceChange, isKidsMode, onPersonaChange }: ServiceSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(null)

  const handlePersonaSelect = (persona: UserPersona) => {
    setSelectedPersona(persona)
    const recommendation = PERSONA_RECOMMENDATIONS[persona]
    onServiceChange(recommendation.service)
    onPersonaChange?.(persona, recommendation.defaultModel)
  }

  if (!selectedPersona) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          👋 Welcome! What describes you best?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => handlePersonaSelect('beginner')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🌟</span>
              <h3 className="text-white font-semibold">First Time User</h3>
            </div>
            <p className="text-white/70 text-sm">I'm new to AI art and want something simple</p>
          </button>

          <button
            onClick={() => handlePersonaSelect('developer')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎮</span>
              <h3 className="text-white font-semibold">Game Developer</h3>
            </div>
            <p className="text-white/70 text-sm">I need high-quality sprites for my games</p>
          </button>

          <button
            onClick={() => handlePersonaSelect('teacher')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <h3 className="text-white font-semibold">Teacher/Parent</h3>
            </div>
            <p className="text-white/70 text-sm">I want safe, educational content for kids</p>
          </button>

          <button
            onClick={() => handlePersonaSelect('designer')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🎨</span>
              <h3 className="text-white font-semibold">UI/UX Designer</h3>
            </div>
            <p className="text-white/70 text-sm">I create icons, buttons, and interface mockups</p>
          </button>

          <button
            onClick={() => handlePersonaSelect('photographer')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📸</span>
              <h3 className="text-white font-semibold">Photographer/Artist</h3>
            </div>
            <p className="text-white/70 text-sm">I want ultra-high quality photorealistic images</p>
          </button>

          <button
            onClick={() => handlePersonaSelect('advanced')}
            className="p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🔧</span>
              <h3 className="text-white font-semibold">Advanced User</h3>
            </div>
            <p className="text-white/70 text-sm">I want full control over all settings</p>
          </button>
        </div>
      </div>
    )
  }

  const recommendation = PERSONA_RECOMMENDATIONS[selectedPersona]

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Choose Your AI Engine</h2>
        <button
          onClick={() => setSelectedPersona(null)}
          className="text-white/60 hover:text-white text-sm"
        >
          Change Profile
        </button>
      </div>

      {/* Recommended Service */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-medium text-sm">RECOMMENDED FOR YOU</span>
        </div>
        
        <div className={`p-4 rounded-xl border-2 transition-all ${
          selectedService === recommendation.service
            ? 'bg-white/20 border-white/50'
            : 'bg-white/10 border-white/20 hover:border-white/40'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-white font-semibold text-lg">{recommendation.title}</h3>
              <p className="text-white/70 text-sm">{recommendation.description}</p>
            </div>
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-medium">
              Recommended
            </span>
          </div>
          
          <button
            onClick={() => onServiceChange(recommendation.service)}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
              selectedService === recommendation.service
                ? 'bg-green-500 text-white'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            {selectedService === recommendation.service ? '✓ Selected' : 'Select This'}
          </button>
        </div>
      </div>

      {/* Simple Service Options */}
      {!showAdvanced && (
        <div>
          <h3 className="text-white/80 font-medium mb-3">Other Quick Options</h3>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {SIMPLE_SERVICES.filter(s => s.id !== recommendation.service).map((service) => (
              <button
                key={service.id}
                onClick={() => onServiceChange(service.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  selectedService === service.id
                    ? 'bg-white/20 border-white/50'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{service.icon}</span>
                    <div>
                      <div className="text-white font-medium">{service.name}</div>
                      <div className="text-white/60 text-sm">{service.description}</div>
                    </div>
                  </div>
                  {service.badge && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      {service.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
      >
        <Settings className="w-4 h-4" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </button>

      {/* Advanced Service Grid */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h3 className="text-white/80 font-medium mb-3">All AI Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {['aws', 'azure', 'google', 'replicate', 'segmind', 'prodia'].map((service) => (
              <button
                key={service}
                onClick={() => onServiceChange(service)}
                className={`p-2 rounded border text-left ${
                  selectedService === service
                    ? 'bg-white/20 border-white/50 text-white'
                    : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                }`}
              >
                {service.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}