'use client'

import { useState } from 'react'

interface SpriteGeneratorProps {
  selectedService: string
  onSpriteGenerated: (sprite: any) => void
  isKidsMode: boolean
}

export default function SpriteGenerator({ selectedService, onSpriteGenerated, isKidsMode }: SpriteGeneratorProps) {
  const [prompt, setPrompt] = useState('')

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        {isKidsMode ? '✨ Create Your Character' : 'Generate Sprites'}
      </h2>
      <div>Test content</div>
    </div>
  )
}