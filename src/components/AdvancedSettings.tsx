'use client'

import { useState, useEffect } from 'react'
import { Settings, Zap, TestTube, BarChart3, AlertTriangle } from 'lucide-react'
import { resourceManager, GenerationSettings } from '../lib/resource-manager'
import { qualityTester, TestSession } from '../lib/quality-tester'
import { ComfyUIModel } from '../lib/comfyui-local'

interface AdvancedSettingsProps {
  selectedModel: ComfyUIModel
  onSettingsChange: (settings: Partial<GenerationSettings>) => void
}

export default function AdvancedSettings({ selectedModel, onSettingsChange }: AdvancedSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customSettings, setCustomSettings] = useState<Partial<GenerationSettings>>({})
  const [testSession, setTestSession] = useState<TestSession | null>(null)
  const [isTestRunning, setIsTestRunning] = useState(false)

  // Calculate optimal settings for current model
  const [optimalSettings, setOptimalSettings] = useState<GenerationSettings>(() =>
    resourceManager.calculateOptimalSettings(768, 768, 'high', selectedModel)
  )

  useEffect(() => {
    const newOptimal = resourceManager.calculateOptimalSettings(768, 768, 'high', selectedModel)
    setOptimalSettings(newOptimal)
    setCustomSettings({})
  }, [selectedModel])

  const handleSettingChange = (key: keyof GenerationSettings, value: any) => {
    const newSettings = { ...customSettings, [key]: value }
    setCustomSettings(newSettings)
    onSettingsChange(newSettings)
  }

  const resetToOptimal = () => {
    setCustomSettings({})
    onSettingsChange({})
  }

  const startQualityTest = async () => {
    setIsTestRunning(true)
    try {
      const sessionId = await qualityTester.startQualityTest(selectedModel)
      
      // Poll for test completion
      const pollInterval = setInterval(() => {
        const session = qualityTester.getTestStatus(sessionId)
        if (session) {
          setTestSession(session)
          if (session.status === 'completed' || session.status === 'failed') {
            clearInterval(pollInterval)
            setIsTestRunning(false)
          }
        }
      }, 2000)
    } catch (error) {
      console.error('Failed to start quality test:', error)
      setIsTestRunning(false)
    }
  }

  const runQuickTest = async () => {
    setIsTestRunning(true)
    try {
      const results = await qualityTester.quickQualityTest(selectedModel)
      console.log('Quick test results:', results)
      setIsTestRunning(false)
    } catch (error) {
      console.error('Quick test failed:', error)
      setIsTestRunning(false)
    }
  }

  const currentSettings = { ...optimalSettings, ...customSettings }
  const isSettingsSafe = resourceManager.isSettingsSafe(currentSettings)
  const resourceSummary = resourceManager.getResourceSummary(currentSettings)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>Advanced Settings</span>
      </button>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Advanced Settings - {selectedModel}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Resource Status */}
      <div className={`p-4 rounded-lg ${isSettingsSafe ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
        <div className="flex items-center gap-2 mb-2">
          {isSettingsSafe ? (
            <Zap className="w-4 h-4 text-green-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span className={`font-semibold ${isSettingsSafe ? 'text-green-300' : 'text-red-300'}`}>
            {isSettingsSafe ? 'Settings Safe' : 'Resource Limit Exceeded'}
          </span>
        </div>
        <p className="text-sm text-white/80">{resourceSummary}</p>
      </div>

      {/* Custom Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Width
          </label>
          <input
            type="number"
            min="512"
            max="1536"
            step="64"
            value={currentSettings.width}
            onChange={(e) => handleSettingChange('width', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Height
          </label>
          <input
            type="number"
            min="512"
            max="1536"
            step="64"
            value={currentSettings.height}
            onChange={(e) => handleSettingChange('height', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Steps ({currentSettings.steps})
          </label>
          <input
            type="range"
            min="8"
            max="50"
            value={currentSettings.steps}
            onChange={(e) => handleSettingChange('steps', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            CFG Scale ({currentSettings.cfg})
          </label>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={currentSettings.cfg}
            onChange={(e) => handleSettingChange('cfg', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Sampler
          </label>
          <select
            value={currentSettings.sampler}
            onChange={(e) => handleSettingChange('sampler', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="euler">Euler</option>
            <option value="dpmpp_2m">DPM++ 2M</option>
            <option value="dpmpp_2m_sde">DPM++ 2M SDE</option>
            <option value="ddim">DDIM</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Scheduler
          </label>
          <select
            value={currentSettings.scheduler}
            onChange={(e) => handleSettingChange('scheduler', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="karras">Karras</option>
            <option value="normal">Normal</option>
            <option value="exponential">Exponential</option>
          </select>
        </div>

        {/* Consistency Toggle */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
            <input
              type="checkbox"
              checked={currentSettings.consistentSeed || false}
              onChange={(e) => handleSettingChange('consistentSeed', e.target.checked)}
              className="w-4 h-4 bg-white/10 border border-white/20 rounded"
            />
            Consistent Results
          </label>
          <p className="text-xs text-white/60">
            Generate the same image every time with identical prompts
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={resetToOptimal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          <Zap className="w-4 h-4" />
          Reset to Optimal
        </button>

        <button
          onClick={runQuickTest}
          disabled={isTestRunning}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 rounded-lg transition-colors"
        >
          <TestTube className="w-4 h-4" />
          {isTestRunning ? 'Testing...' : 'Quick Test'}
        </button>

        <button
          onClick={startQualityTest}
          disabled={isTestRunning}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 rounded-lg transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          {isTestRunning ? 'Running...' : 'Full Quality Test'}
        </button>
      </div>

      {/* Test Results */}
      {testSession && (
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="font-semibold text-white mb-2">Test Results</h4>
          <div className="text-sm text-white/80 space-y-1">
            <p>Status: {testSession.status}</p>
            <p>Tests Completed: {testSession.results.length}</p>
            {testSession.results.length > 0 && (
              <>
                <p>Success Rate: {Math.round((testSession.results.filter(r => r.success).length / testSession.results.length) * 100)}%</p>
                <p>Average Quality: {Math.round(testSession.results.reduce((sum, r) => sum + r.qualityScore, 0) / testSession.results.length)}/100</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Optimal Settings Display */}
      <div className="bg-white/5 rounded-lg p-4">
        <h4 className="font-semibold text-white mb-2">Recommended Settings</h4>
        <div className="text-sm text-white/80 space-y-1">
          <p>Resolution: {optimalSettings.width}x{optimalSettings.height}</p>
          <p>Steps: {optimalSettings.steps}</p>
          <p>CFG: {optimalSettings.cfg}</p>
          <p>Sampler: {optimalSettings.sampler}</p>
          <p>Quality Score: {optimalSettings.qualityScore}/100</p>
        </div>
      </div>
    </div>
  )
}