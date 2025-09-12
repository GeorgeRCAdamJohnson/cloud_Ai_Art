'use client'

import { Sliders } from 'lucide-react'

interface DenoisingControlProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export default function DenoisingControl({ value, onChange, disabled = false }: DenoisingControlProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sliders className="w-4 h-4 text-gray-600" />
        <label className="text-sm font-medium text-gray-700">
          Denoising Strength: {value.toFixed(1)}
        </label>
      </div>
      
      <div className="px-1">
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1 (Subtle)</span>
          <span>0.5 (Balanced)</span>
          <span>1.0 (Complete)</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>For Quality Enhancement:</strong></p>
        <p>• 0.2-0.4: Sharpen & enhance details (recommended)</p>
        <p>• 0.5-0.7: Moderate changes & improvements</p>
        <p>• 0.8+: Major style changes</p>
      </div>
    </div>
  )
}