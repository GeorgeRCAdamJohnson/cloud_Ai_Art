'use client'

import { Download, Calendar, Heart, Share2 } from 'lucide-react'

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
  
  const shareSprite = async (sprite: Sprite) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my AI sprite!',
          text: `I created this with AI: "${sprite.prompt}"`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`Check out my AI sprite: "${sprite.prompt}" - Created with Cloud AI Art!`)
      alert('🎉 Copied to clipboard! Share with your friends!')
    }
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
        <p className="text-white/70">🎨 Your amazing creations will appear here!</p>
        <p className="text-white/50 text-sm mt-2">Start by describing what you want to create above ⬆️</p>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">🖼️ Your Creations ({sprites.length})</h2>
        {sprites.length > 0 && (
          <button
            onClick={() => sprites.forEach(downloadSprite)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm min-h-[44px]"
          >
            📦 Download All
          </button>
        )}
      </div>
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
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => shareSprite(sprite)}
                    className="p-2 hover:bg-white/20 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Share sprite"
                  >
                    <Share2 className="w-4 h-4 text-white/70" />
                  </button>
                  <button
                    onClick={() => downloadSprite(sprite)}
                    className="p-2 hover:bg-white/20 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Download sprite"
                  >
                    <Download className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}