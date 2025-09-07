'use client'

import { useState } from 'react'
import { Wand2, Download, Loader2 } from 'lucide-react'

interface SpriteGeneratorProps {
  selectedService: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate'
  onSpriteGenerated: (sprite: any) => void
}

export default function SpriteGenerator({ selectedService, onSpriteGenerated }: SpriteGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const spritePrompts = [
    "cute cartoon rabbit character for kids game",
    "friendly dragon character sprite",
    "magical fairy character with wings",
    "brave knight character in armor",
    "colorful butterfly character",
    "smiling sun character with face"
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-sprite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt + " 2D game sprite, pixel art style, transparent background, kids friendly",
          service: selectedService
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedImage(data.imageUrl)
        onSpriteGenerated({
          id: Date.now(),
          prompt,
          imageUrl: data.imageUrl,
          service: selectedService,
          timestamp: new Date()
        })
      }
    } catch (error) {
      console.error('Generation failed:', error)
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
      <h2 className="text-2xl font-bold text-white mb-6">Generate Sprites</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white/80 mb-2">Describe your sprite:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., cute cartoon cat character jumping"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20 outline-none resize-none"
            rows={3}
          />
        </div>

        <div>
          <p className="text-white/80 mb-3">Quick prompts:</p>
          <div className="grid grid-cols-2 gap-2">
            {spritePrompts.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="p-2 text-sm bg-white/10 hover:bg-white/20 text-white/90 rounded-lg transition-colors text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate Sprite
            </>
          )}
        </button>

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
      </div>
    </div>
  )
}