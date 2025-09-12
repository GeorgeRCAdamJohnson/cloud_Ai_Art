'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Unlock, Settings } from 'lucide-react'

interface ParentalControlsProps {
  onModeChange: (isKidsMode: boolean) => void
}

export default function ParentalControls({ onModeChange }: ParentalControlsProps) {
  const [isKidsMode, setIsKidsMode] = useState(true) // Default to kids mode
  const [showSettings, setShowSettings] = useState(false)
  const [parentPassword, setParentPassword] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Simple password (you can change this)
  const PARENT_PASSWORD = 'parent123'

  useEffect(() => {
    // Load saved mode from localStorage
    const savedMode = localStorage.getItem('familyArtMode')
    if (savedMode) {
      const mode = savedMode === 'kids'
      setIsKidsMode(mode)
      onModeChange(mode)
    }
  }, [onModeChange])

  const toggleMode = () => {
    if (isKidsMode) {
      // Switching to adult mode requires password
      setShowSettings(true)
    } else {
      // Switching back to kids mode is always allowed
      setIsKidsMode(true)
      setIsUnlocked(false)
      onModeChange(true)
      localStorage.setItem('familyArtMode', 'kids')
    }
  }

  const handlePasswordSubmit = () => {
    if (parentPassword === PARENT_PASSWORD) {
      setIsKidsMode(false)
      setIsUnlocked(true)
      setShowSettings(false)
      setParentPassword('')
      onModeChange(false)
      localStorage.setItem('familyArtMode', 'adult')
    } else {
      alert('❌ Incorrect password! Ask a parent for help.')
      setParentPassword('')
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-3">
        <div className="flex items-center gap-3">
          {/* Mode Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            isKidsMode 
              ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
              : 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
          }`}>
            <Shield className="w-4 h-4" />
            {isKidsMode ? '👶 Kids Mode' : '👨‍👩‍👧‍👦 Parent Mode'}
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleMode}
            className={`p-2 rounded-lg transition-colors ${
              isKidsMode 
                ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300' 
                : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
            }`}
            title={isKidsMode ? 'Switch to Parent Mode' : 'Switch to Kids Mode'}
          >
            {isKidsMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div className="text-center mb-4">
                <Shield className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-gray-800">Parent Access Required</h3>
                <p className="text-sm text-gray-600">Enter parent password to disable content filtering</p>
              </div>

              <input
                type="password"
                value={parentPassword}
                onChange={(e) => setParentPassword(e.target.value)}
                placeholder="Parent password"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-800"
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowSettings(false)
                    setParentPassword('')
                  }}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Unlock
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3 text-center">
                💡 Default password: parent123<br/>
                (Change this in the code for security)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mode Description */}
      <div className="mt-2 text-xs text-white/70 text-right max-w-48">
        {isKidsMode ? (
          <p>🛡️ Content filtering active. Only family-friendly prompts allowed.</p>
        ) : (
          <p>⚠️ Content filtering disabled. Adult supervision recommended.</p>
        )}
      </div>
    </div>
  )
}