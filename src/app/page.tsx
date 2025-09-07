'use client'

import { useState } from 'react'
import SpriteGenerator from '@/components/SpriteGenerator'
import CloudServiceSelector from '@/components/CloudServiceSelector'
import SpriteGallery from '@/components/SpriteGallery'

export default function Home() {
  const [selectedService, setSelectedService] = useState<'aws' | 'azure' | 'google' | 'huggingface' | 'replicate'>('huggingface')
  const [generatedSprites, setGeneratedSprites] = useState<any[]>([])

  const handleSpriteGenerated = (sprite: any) => {
    setGeneratedSprites(prev => [...prev, sprite])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Cloud AI Art Studio
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Generate amazing 2D game sprites for kids games using AI
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <CloudServiceSelector 
              selectedService={selectedService}
              onServiceChange={setSelectedService}
            />
          </div>
          
          <div className="lg:col-span-2">
            <SpriteGenerator 
              selectedService={selectedService}
              onSpriteGenerated={handleSpriteGenerated}
            />
          </div>
        </div>

        <div className="mt-12">
          <SpriteGallery sprites={generatedSprites} />
        </div>
      </div>
    </main>
  )
}