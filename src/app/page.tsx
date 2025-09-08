'use client'

import { useState } from 'react'
import SpriteGenerator from '@/components/SpriteGenerator'
import CloudServiceSelector from '@/components/CloudServiceSelector'
import SpriteGallery from '@/components/SpriteGallery'
import SavedImagesManager from '@/components/SavedImagesManager'

export default function Home() {
  const [selectedService, setSelectedService] = useState<'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations'>('pollinations')
  const [generatedSprites, setGeneratedSprites] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate')

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
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'generate'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🎨 Generate Sprites
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              💾 Saved Images
            </button>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'generate' ? (
          <>
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
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-2xl">
            <SavedImagesManager />
          </div>
        )}
      </div>
    </main>
  )
}