'use client'

import { useState } from 'react'
import { Settings, Zap, Clock, Image } from 'lucide-react'

interface ComfyUISettingsProps {
  isVisible: boolean
  onSettingsChange: (settings: {
    width: number
    height: number
    quality: 'optimized' | 'high' | 'ultra'
    resolution: string
  }) => void
}

const RESOLUTION_PRESETS = {
  'square-small': { width: 512, height: 512, name: 'Square Small (512×512)', icon: '📱' },
  'square-medium': { width: 768, height: 768, name: 'Square Medium (768×768)', icon: '🖥️' },
  'square-large': { width: 1024, height: 1024, name: 'Square Large (1024×1024)', icon: '🖼️' },
  'portrait': { width: 768, height: 1024, name: 'Portrait (768×1024)', icon: '📄' },
  'landscape': { width: 1024, height: 768, name: 'Landscape (1024×768)', icon: '🌄' },
  'sprite': { width: 512, height: 640, name: 'Game Sprite (512×640)', icon: '🎮' },
  'banner': { width: 1280, height: 720, name: 'Banner (1280×720)', icon: '🏷️' },
  'custom': { width: 768, height: 768, name: 'Custom Size', icon: '⚙️' }
} as const

const QUALITY_PRESETS = {
  optimized: {
    name: 'Optimized ⚡',
    description: 'Fast generation (~30s)',
    time: '~30s',
    icon: Zap,
    color: 'from-green-500 to-emerald-600'
  },
  high: {
    name: 'High Quality 🎨',
    description: 'Better quality (~2-5min)',
    time: '~2-5min', 
    icon: Image,
    color: 'from-blue-500 to-purple-600'
  },
  ultra: {
    name: 'Ultra Quality 💎',
    description: 'Maximum quality (up to 20min)',
    time: 'up to 20min',
    icon: Clock,
    color: 'from-purple-500 to-pink-600'
  }
} as const

export default function ComfyUISettings({ isVisible, onSettingsChange }: ComfyUISettingsProps) {
  const [selectedResolution, setSelectedResolution] = useState<keyof typeof RESOLUTION_PRESETS>('square-medium')
  const [selectedQuality, setSelectedQuality] = useState<keyof typeof QUALITY_PRESETS>('optimized')
  const [customWidth, setCustomWidth] = useState(768)
  const [customHeight, setCustomHeight] = useState(768)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleResolutionChange = (resolution: keyof typeof RESOLUTION_PRESETS) => {
    setSelectedResolution(resolution)
    const preset = RESOLUTION_PRESETS[resolution]
    
    onSettingsChange({
      width: preset.width,
      height: preset.height,
      quality: selectedQuality,
      resolution
    })
  }

  const handleQualityChange = (quality: keyof typeof QUALITY_PRESETS) => {
    setSelectedQuality(quality)
    const currentResolution = RESOLUTION_PRESETS[selectedResolution]
    
    onSettingsChange({
      width: selectedResolution === 'custom' ? customWidth : currentResolution.width,
      height: selectedResolution === 'custom' ? customHeight : currentResolution.height,
      quality,
      resolution: selectedResolution
    })
  }

  const handleCustomSizeChange = (width: number, height: number) => {
    setCustomWidth(width)
    setCustomHeight(height)
    
    if (selectedResolution === 'custom') {
      onSettingsChange({
        width,
        height,
        quality: selectedQuality,
        resolution: selectedResolution
      })
    }
  }

  if (!isVisible) return null

  return (
    <div className="space-y-6">
      {/* Quality Settings */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-5 h-5 text-white/80" />
          <label className="block text-white/80 font-medium">Generation Quality</label>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(QUALITY_PRESETS).map(([qualityKey, quality]) => {
            const Icon = quality.icon
            return (
              <button
                key={qualityKey}
                onClick={() => handleQualityChange(qualityKey as keyof typeof QUALITY_PRESETS)}
                className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedQuality === qualityKey
                    ? 'bg-white/20 border-white/50 ring-2 ring-white/30'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${quality.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{quality.name}</div>
                    <div className="text-sm text-white/70">{quality.description}</div>
                  </div>
                  <div className="text-sm font-mono text-white/60">{quality.time}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Resolution Settings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-white/80" />
            <label className="block text-white/80 font-medium">Image Resolution</label>
          </div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Advanced'}
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(RESOLUTION_PRESETS).map(([resKey, resolution]) => (
            <button
              key={resKey}
              onClick={() => handleResolutionChange(resKey as keyof typeof RESOLUTION_PRESETS)}
              className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                selectedResolution === resKey
                  ? 'bg-white/20 border-white/50 ring-2 ring-white/30'
                  : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
              }`}
            >
              <div className="text-lg mb-1">{resolution.icon}</div>
              <div className="text-sm font-medium text-white">{resolution.name.split(' (')[0]}</div>
              <div className="text-xs text-white/60">{resolution.width}×{resolution.height}</div>
            </button>
          ))}
        </div>

        {/* Custom Size Controls */}
        {selectedResolution === 'custom' && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Width</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => handleCustomSizeChange(parseInt(e.target.value) || 768, customHeight)}
                  min="256"
                  max="2048"
                  step="64"
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-1">Height</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => handleCustomSizeChange(customWidth, parseInt(e.target.value) || 768)}
                  min="256"
                  max="2048"
                  step="64"
                  className="w-full p-2 rounded bg-white/10 text-white border border-white/20 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none"
                />
              </div>
            </div>
            <div className="mt-2 text-xs text-white/60">
              Tip: Keep dimensions divisible by 64 for best results
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/20">
            <h4 className="text-sm font-medium text-white mb-3">Advanced Settings</h4>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Current Model:</span>
                <span className="text-white">SDXL Base 1.0</span>
              </div>
              <div className="flex justify-between">
                <span>GPU Memory:</span>
                <span className="text-green-400">RTX 3050 (6GB)</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated VRAM:</span>
                <span className="text-yellow-400">
                  {selectedResolution === 'square-large' || selectedResolution === 'banner' ? '5-6GB' : '3-4GB'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quality Warning */}
      {selectedQuality === 'ultra' && (
        <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-400/20">
          <div className="flex items-center gap-2 text-orange-300">
            <Clock className="w-5 h-5" />
            <div className="text-sm">
              <strong>Ultra Quality Notice:</strong> This setting uses maximum quality parameters and can take up to 10 minutes to generate. 
              Perfect for final artwork but consider "High Quality" for faster iterations.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}