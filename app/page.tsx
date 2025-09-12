'use client'

import { useState } from 'react'
import SpriteGenerator from '@/components/SpriteGenerator'
import ServiceSelector from '@/components/ServiceSelector'
import SpriteGallery from '@/components/SpriteGallery'
import SavedImagesManager from '@/components/SavedImagesManager'
import ParentalControls from '@/components/ParentalControls'

export default function Home() {
  const [selectedService, setSelectedService] = useState<'aws' | 'azure' | 'google' | 'huggingface' | 'replicate' | 'pollinations' | 'segmind' | 'prodia' | 'comfyui-local'>('comfyui-local')
  const [generatedSprites, setGeneratedSprites] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate')
  const [isKidsMode, setIsKidsMode] = useState(true)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [defaultModel, setDefaultModel] = useState<string | null>(null)

  const handleSpriteGenerated = (sprite: any) => {
    setGeneratedSprites(prev => [...prev, sprite])
  }

  const handlePersonaChange = (persona: string | null, model?: string) => {
    setSelectedPersona(persona)
    setDefaultModel(model || null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Parental Controls */}
      <ParentalControls onModeChange={setIsKidsMode} />
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎨 Family Art Studio
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Create amazing characters and sprites together! 👨👩👧👦✨
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
              ✨ Create Art
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              🖼️ My Gallery
            </button>
          </div>
        </header>

        {/* Tab Content */}
        {activeTab === 'generate' ? (
          <>
            <ServiceSelector 
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              isKidsMode={isKidsMode}
              onPersonaChange={handlePersonaChange}
            />
            
            <div className="mt-8">
              <SpriteGenerator 
                selectedService={selectedService}
                onSpriteGenerated={handleSpriteGenerated}
                isKidsMode={isKidsMode}
                selectedPersona={selectedPersona}
                defaultModel={defaultModel}
              />
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