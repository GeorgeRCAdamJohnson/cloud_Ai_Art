'use client'

import { useState } from 'react'
import { Cloud, Zap, Shield, Menu, X } from 'lucide-react'

interface CloudServiceSelectorProps {
  selectedService: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia' | 'comfyui-local'
  onServiceChange: (service: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia' | 'comfyui-local') => void
}

export default function CloudServiceSelector({ selectedService, onServiceChange }: CloudServiceSelectorProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false)

  // Main family-friendly options
  const mainServices = [
    {
      id: 'comfyui-local' as const,
      name: 'ComfyUI Local',
      icon: Zap,
      description: '🏠 Generate art on your computer - Unlimited & Free!',
      color: 'bg-gradient-to-r from-purple-600 to-blue-600',
      features: ['Unlimited generation', 'Best quality', 'Works offline'],
      badge: '🌟 RECOMMENDED'
    },
    {
      id: 'pollinations' as const,
      name: 'Pollinations',
      icon: Zap,
      description: '☁️ Online AI - No signup needed, completely free!',
      color: 'bg-green-500',
      features: ['No signup needed', 'Fast generation', 'Good quality'],
      badge: '✅ EASY'
    },
    {
      id: 'huggingface' as const,
      name: 'Hugging Face',
      icon: Shield,
      description: '🤗 Friendly AI - Free with simple signup',
      color: 'bg-yellow-500',
      features: ['Family-friendly', 'Safe content', 'Free account'],
      badge: '👨👩👧👦 SAFE'
    }
  ]

  // Hidden advanced options
  const advancedServices = [
    {
      id: 'replicate' as const,
      name: 'Replicate',
      icon: Shield,
      description: 'FREE $5 credit monthly',
      color: 'bg-purple-500',
      features: ['$5 free credit', 'SDXL model'],
      badge: '$5 FREE'
    },
    {
      id: 'segmind' as const,
      name: 'Segmind',
      icon: Zap,
      description: 'Experimental service',
      color: 'bg-gray-500',
      features: ['Experimental'],
      badge: '⚠️ EXPERIMENTAL'
    },
    {
      id: 'prodia' as const,
      name: 'Prodia',
      icon: Shield,
      description: 'Experimental service',
      color: 'bg-gray-500',
      features: ['Experimental'],
      badge: '⚠️ EXPERIMENTAL'
    },
    {
      id: 'aws' as const,
      name: 'AWS Bedrock',
      icon: Cloud,
      description: 'Professional service ($0.04 per image)',
      color: 'bg-orange-500',
      features: ['Professional quality'],
      badge: '💳 PAID'
    },
    {
      id: 'azure' as const,
      name: 'Azure AI',
      icon: Shield,
      description: 'Microsoft service ($0.04 per image)',
      color: 'bg-blue-500',
      features: ['Enterprise grade'],
      badge: '💳 PAID'
    },
    {
      id: 'google' as const,
      name: 'Google Cloud AI',
      icon: Zap,
      description: 'Google service ($0.02 per image)',
      color: 'bg-green-500',
      features: ['Advanced AI'],
      badge: '💳 PAID'
    }
  ]

  const renderServiceButton = (service: any) => {
    const Icon = service.icon
    return (
      <button
        key={service.id}
        onClick={() => onServiceChange(service.id)}
        className={`w-full p-4 rounded-xl transition-all duration-200 ${
          selectedService === service.id
            ? 'bg-white/20 ring-2 ring-white/50 shadow-lg'
            : 'bg-white/5 hover:bg-white/10'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${service.color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">{service.name}</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                {service.badge}
              </span>
            </div>
            <p className="text-sm text-white/70 mb-2">{service.description}</p>
            <div className="flex flex-wrap gap-1">
              {service.features.map((feature: string) => (
                <span
                  key={feature}
                  className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">🎨 Choose AI Service</h2>
        <button
          onClick={() => setShowMoreOptions(!showMoreOptions)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          title="More options"
        >
          {showMoreOptions ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>
      </div>
      
      {/* Main Family-Friendly Options */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-green-300 mb-3">👨👩👧👦 Perfect for Families</h3>
        {mainServices.map(renderServiceButton)}
      </div>

      {/* Advanced Options (Hidden by default) */}
      {showMoreOptions && (
        <div className="space-y-6 border-t border-white/20 pt-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">⚙️ Advanced Options</h3>
          <div className="space-y-3">
            {advancedServices.map(renderServiceButton)}
          </div>
          <p className="text-xs text-white/60 text-center">
            💡 The family options above are recommended for most users
          </p>
        </div>
      )}
    </div>
  )
}