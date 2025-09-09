'use client'

import { Cloud, Zap, Shield } from 'lucide-react'

interface CloudServiceSelectorProps {
  selectedService: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia' | 'comfyui-local'
  onServiceChange: (service: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia' | 'comfyui-local') => void
}

export default function CloudServiceSelector({ selectedService, onServiceChange }: CloudServiceSelectorProps) {
  const services = [
    {
      id: 'comfyui-local' as const,
      name: 'ComfyUI Local',
      icon: Zap,
      description: 'ULTIMATE FREE - Self-hosted unlimited generation',
      color: 'bg-gradient-to-r from-purple-600 to-blue-600',
      features: ['Unlimited generation', 'Any SD model', 'Complete control', 'Offline capable'],
      badge: '🚀 UNLIMITED',
      status: 'ultimate'
    },
    {
      id: 'pollinations' as const,
      name: 'Pollinations.ai',
      icon: Zap,
      description: 'COMPLETELY FREE - No signup required',
      color: 'bg-green-500',
      features: ['No signup needed', 'Unlimited use', 'FLUX model'],
      badge: '✅ WORKING',
      status: 'working'
    },
    {
      id: 'replicate' as const,
      name: 'Replicate',
      icon: Shield,
      description: 'FREE $5 credit monthly',
      color: 'bg-purple-500',
      features: ['$5 free credit', 'SDXL model', 'Excellent quality'],
      badge: '$5 FREE',
      status: 'working'
    },
    {
      id: 'huggingface' as const,
      name: 'Hugging Face',
      icon: Zap,
      description: 'FREE AI with Stable Diffusion (quota limited)',
      color: 'bg-yellow-500',
      features: ['Completely FREE', '1000/month', 'Good quality'],
      badge: 'QUOTA',
      status: 'limited'
    },
    {
      id: 'segmind' as const,
      name: 'Segmind',
      icon: Zap,
      description: 'Experimental - API access may be limited',
      color: 'bg-gray-500',
      features: ['Experimental', 'SDXL model', 'May not work'],
      badge: '⚠️ EXPERIMENTAL',
      status: 'experimental'
    },
    {
      id: 'prodia' as const,
      name: 'Prodia',
      icon: Shield,
      description: 'Experimental - API access may be limited',
      color: 'bg-gray-500',
      features: ['Experimental', 'Anime models', 'May not work'],
      badge: '⚠️ EXPERIMENTAL',
      status: 'experimental'
    },
    {
      id: 'aws' as const,
      name: 'AWS Bedrock',
      icon: Cloud,
      description: 'Amazon Bedrock with Stable Diffusion',
      color: 'bg-orange-500',
      features: ['High quality', 'Fast generation', 'Reliable'],
      badge: '$0.04',
      status: 'paid'
    },
    {
      id: 'azure' as const,
      name: 'Azure AI',
      icon: Shield,
      description: 'Azure Computer Vision + OpenAI',
      color: 'bg-blue-500',
      features: ['Enterprise grade', 'Secure', 'Scalable'],
      badge: '$0.04',
      status: 'paid'
    },
    {
      id: 'google' as const,
      name: 'Google Cloud AI',
      icon: Zap,
      description: 'Vertex AI with Imagen',
      color: 'bg-green-500',
      features: ['Advanced AI', 'Multi-modal', 'Innovative'],
      badge: '$0.02',
      status: 'paid'
    }
  ]

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Choose AI Service</h2>
      
      {/* Working Services Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-green-300 mb-3">✅ Recommended (Working)</h3>
        <div className="space-y-4">
          {services.filter(service => service.status === 'working' || service.status === 'limited').map((service) => {
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
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.badge === 'FREE' || service.badge === '$5 FREE' || service.badge === '✅ WORKING'
                          ? 'bg-green-500 text-white' 
                          : service.badge === 'QUOTA'
                          ? 'bg-yellow-500 text-white'
                          : service.badge?.includes('EXPERIMENTAL')
                          ? 'bg-gray-500 text-white'
                          : 'bg-white/20 text-white/80'
                      }`}>
                        {service.badge}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{service.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature) => (
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
          })}
        </div>
      </div>

      {/* Experimental Services Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-yellow-300 mb-3">⚠️ Experimental (May Not Work)</h3>
        <div className="space-y-4">
          {services.filter(service => service.status === 'experimental').map((service) => {
            const Icon = service.icon
            return (
              <button
                key={service.id}
                onClick={() => onServiceChange(service.id)}
                className={`w-full p-4 rounded-xl transition-all duration-200 opacity-60 ${
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
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.badge === 'FREE' || service.badge === '$5 FREE' || service.badge === '✅ WORKING'
                          ? 'bg-green-500 text-white' 
                          : service.badge === 'QUOTA'
                          ? 'bg-yellow-500 text-white'
                          : service.badge?.includes('EXPERIMENTAL')
                          ? 'bg-gray-500 text-white'
                          : 'bg-white/20 text-white/80'
                      }`}>
                        {service.badge}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{service.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature) => (
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
          })}
        </div>
      </div>

      {/* Paid Services Section */}
      <div>
        <h3 className="text-lg font-semibold text-blue-300 mb-3">💳 Paid Services</h3>
        <div className="space-y-4">
          {services.filter(service => service.status === 'paid').map((service) => {
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
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.badge === 'FREE' || service.badge === '$5 FREE' || service.badge === '✅ WORKING'
                          ? 'bg-green-500 text-white' 
                          : service.badge === 'QUOTA'
                          ? 'bg-yellow-500 text-white'
                          : service.badge?.includes('EXPERIMENTAL')
                          ? 'bg-gray-500 text-white'
                          : 'bg-white/20 text-white/80'
                      }`}>
                        {service.badge}
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{service.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {service.features.map((feature) => (
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
          })}
        </div>
      </div>
    </div>
  )
}