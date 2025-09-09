'use client'

import { useState, useEffect } from 'react'
import { Activity, Zap, Clock, BarChart3 } from 'lucide-react'
import { resourceManager } from '../lib/resource-manager'

interface ResourceMonitorProps {
  currentSettings?: any
  isGenerating?: boolean
}

export default function ResourceMonitor({ currentSettings, isGenerating }: ResourceMonitorProps) {
  const [vramUsage, setVramUsage] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [qualityScore, setQualityScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (currentSettings) {
      const settings = resourceManager.calculateOptimalSettings(
        currentSettings.width || 768,
        currentSettings.height || 768,
        currentSettings.quality || 'optimized',
        'sdxl-base'
      )
      
      setVramUsage(settings.estimatedVRAM)
      setEstimatedTime(settings.estimatedTime)
      setQualityScore(settings.qualityScore)
    }
  }, [currentSettings])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
      >
        <Activity className="w-4 h-4 text-blue-400" />
        <span className="text-blue-300 text-sm">Resource Monitor</span>
      </button>
    )
  }

  const vramPercent = Math.round((vramUsage / 5120) * 100) // 5GB limit
  const timeMinutes = Math.round(estimatedTime / 60 * 10) / 10

  return (
    <div className="bg-blue-500/10 backdrop-blur-md rounded-lg p-4 border border-blue-400/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-blue-300 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Resource Monitor
        </h4>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-400/60 hover:text-blue-400"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* VRAM Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-blue-200 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              VRAM Usage
            </span>
            <span className="text-sm font-mono text-blue-100">
              {vramUsage}MB ({vramPercent}%)
            </span>
          </div>
          <div className="w-full bg-blue-900/30 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                vramPercent > 90 ? 'bg-red-500' :
                vramPercent > 75 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(vramPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Estimated Time */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-blue-200 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Est. Time
            </span>
            <span className="text-sm font-mono text-blue-100">
              {timeMinutes < 1 ? `${estimatedTime}s` : `${timeMinutes}min`}
            </span>
          </div>
          <div className="w-full bg-blue-900/30 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                timeMinutes > 10 ? 'bg-red-500' :
                timeMinutes > 3 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min((timeMinutes / 15) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Quality Score */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-blue-200 flex items-center gap-1">
              <BarChart3 className="w-3 h-3" />
              Quality Score
            </span>
            <span className="text-sm font-mono text-blue-100">
              {qualityScore}/100
            </span>
          </div>
          <div className="w-full bg-blue-900/30 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                qualityScore > 80 ? 'bg-green-500' :
                qualityScore > 60 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-2 border-t border-blue-400/20">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isGenerating ? 'bg-yellow-500 animate-pulse' :
              vramPercent > 90 ? 'bg-red-500' :
              'bg-green-500'
            }`} />
            <span className="text-xs text-blue-200">
              {isGenerating ? 'Generating...' :
               vramPercent > 90 ? 'High VRAM Usage' :
               'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}