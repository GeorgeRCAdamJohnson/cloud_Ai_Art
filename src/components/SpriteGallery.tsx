'use client'

import { Download, Calendar } from 'lucide-react'

interface Sprite {
  id: number
  prompt: string
  imageUrl: string
  service: 'aws' | 'azure' | 'google' | 'huggingface' | 'replicate'
  timestamp: Date
}

interface SpriteGalleryProps {
  sprites: Sprite[]
}

export default function SpriteGallery({ sprites }: SpriteGalleryProps) {
  const downloadSprite = (sprite: Sprite) => {
    const link = document.createElement('a')
    link.href = sprite.imageUrl
    link.download = `sprite-${sprite.id}.png`
    link.click()
  }

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'aws': return 'bg-orange-500'
      case 'azure': return 'bg-blue-500'
      case 'google': return 'bg-green-500'
      case 'huggingface': return 'bg-yellow-500'
      case 'replicate': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  if (sprites.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Sprite Gallery</h2>
        <p className="text-white/70">Your generated sprites will appear here</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Sprite Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sprites.map((sprite) => (
          <div key={sprite.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
            <div className="aspect-square bg-white/10 rounded-lg mb-3 overflow-hidden">
              <img
                src={sprite.imageUrl}
                alt={sprite.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-white/90 text-sm line-clamp-2">{sprite.prompt}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs text-white rounded-full ${getServiceColor(sprite.service)}`}>
                    {sprite.service.toUpperCase()}
                  </span>
                  <span className="text-white/50 text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {sprite.timestamp.toLocaleDateString()}
                  </span>
                </div>
                
                <button
                  onClick={() => downloadSprite(sprite)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Download sprite"
                >
                  <Download className="w-4 h-4 text-white/70" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}