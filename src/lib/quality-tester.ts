// Quality Testing and Grading System
// Automated testing of different parameter combinations

import { resourceManager, GenerationSettings, QualityTestResult } from './resource-manager'
import { generateWithComfyUI, ComfyUIModel } from './comfyui-local'

export interface TestSession {
  id: string
  model: ComfyUIModel
  prompt: string
  startTime: Date
  results: QualityTestResult[]
  status: 'running' | 'completed' | 'failed'
}

export class QualityTester {
  private activeSessions: Map<string, TestSession> = new Map()
  
  // Start automated quality testing for a model
  async startQualityTest(
    model: ComfyUIModel,
    testPrompt: string = "cute cartoon character, game sprite, colorful"
  ): Promise<string> {
    const sessionId = `test_${Date.now()}_${model}`
    
    const session: TestSession = {
      id: sessionId,
      model,
      prompt: testPrompt,
      startTime: new Date(),
      results: [],
      status: 'running'
    }
    
    this.activeSessions.set(sessionId, session)
    
    // Run tests asynchronously
    this.runQualityTests(sessionId).catch(error => {
      console.error(`Quality test failed for ${model}:`, error)
      session.status = 'failed'
    })
    
    return sessionId
  }

  // Run the actual quality tests
  private async runQualityTests(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (!session) return
    
    const testConfigs = resourceManager.generateTestConfigurations(session.model)
    console.log(`🧪 Starting quality test for ${session.model} with ${testConfigs.length} configurations`)
    
    for (let i = 0; i < testConfigs.length; i++) {
      const config = testConfigs[i]
      console.log(`🔬 Testing config ${i + 1}/${testConfigs.length}: ${config.width}x${config.height}, ${config.steps} steps`)
      
      const startTime = Date.now()
      
      try {
        // Generate image with test configuration
        const result = await this.testConfiguration(session.model, session.prompt, config)
        
        const endTime = Date.now()
        const actualTime = (endTime - startTime) / 1000 // seconds
        
        const testResult: QualityTestResult = {
          settings: config,
          actualVRAM: this.estimateActualVRAM(config, result.success),
          actualTime,
          qualityScore: this.assessImageQuality(result),
          success: result.success,
          error: result.error
        }
        
        session.results.push(testResult)
        resourceManager.storeQualityResult(session.model, testResult)
        
        console.log(`✅ Test ${i + 1} completed: Quality ${testResult.qualityScore}/100, Time ${actualTime}s`)
        
        // Wait between tests to prevent overheating
        await new Promise(resolve => setTimeout(resolve, 5000))
        
      } catch (error) {
        console.error(`❌ Test ${i + 1} failed:`, error)
        
        const testResult: QualityTestResult = {
          settings: config,
          actualVRAM: 0,
          actualTime: 0,
          qualityScore: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
        
        session.results.push(testResult)
      }
    }
    
    session.status = 'completed'
    console.log(`🎯 Quality test completed for ${session.model}. Results: ${session.results.length} tests`)
    
    // Generate summary report
    this.generateTestReport(sessionId)
  }

  // Test a specific configuration
  private async testConfiguration(
    model: ComfyUIModel,
    prompt: string,
    config: GenerationSettings
  ): Promise<{ success: boolean; error?: string; imageSize?: number }> {
    try {
      const result = await generateWithComfyUI(prompt, model, {
        width: config.width,
        height: config.height,
        quality: this.getQualityFromSettings(config)
      })
      
      if (result.imageUrl.startsWith('data:image/svg+xml')) {
        // This is a fallback SVG, not a real generation
        return { success: false, error: 'ComfyUI not available' }
      }
      
      // Calculate image size from base64 data
      const base64Data = result.imageUrl.split(',')[1]
      const imageSize = base64Data ? Buffer.from(base64Data, 'base64').length : 0
      
      return { success: true, imageSize }
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Generation failed' 
      }
    }
  }

  // Estimate actual VRAM usage based on success/failure
  private estimateActualVRAM(config: GenerationSettings, success: boolean): number {
    if (!success) {
      // If failed, assume it exceeded VRAM limit
      return resourceManager.estimateVRAM(config.width, config.height, config.steps, 'sdxl-base') * 1.2
    }
    
    // If successful, use estimated VRAM
    return config.estimatedVRAM
  }

  // Assess image quality based on generation result
  private assessImageQuality(result: { success: boolean; imageSize?: number }): number {
    if (!result.success) return 0
    
    // Basic quality assessment based on file size and success
    const baseScore = 60 // Base score for successful generation
    const sizeBonus = result.imageSize ? Math.min(30, (result.imageSize / 100000) * 20) : 0
    
    return Math.round(baseScore + sizeBonus)
  }

  // Convert settings back to quality level
  private getQualityFromSettings(config: GenerationSettings): 'optimized' | 'high' | 'ultra' {
    if (config.steps <= 15) return 'optimized'
    if (config.steps <= 30) return 'high'
    return 'ultra'
  }

  // Generate test report
  private generateTestReport(sessionId: string): void {
    const session = this.activeSessions.get(sessionId)
    if (!session) return
    
    const successfulTests = session.results.filter(r => r.success)
    const failedTests = session.results.filter(r => !r.success)
    
    console.log(`\n📊 QUALITY TEST REPORT - ${session.model}`)
    console.log(`===========================================`)
    console.log(`Total Tests: ${session.results.length}`)
    console.log(`Successful: ${successfulTests.length}`)
    console.log(`Failed: ${failedTests.length}`)
    
    if (successfulTests.length > 0) {
      const avgQuality = successfulTests.reduce((sum, r) => sum + r.qualityScore, 0) / successfulTests.length
      const avgTime = successfulTests.reduce((sum, r) => sum + r.actualTime, 0) / successfulTests.length
      const maxVRAM = Math.max(...successfulTests.map(r => r.actualVRAM))
      
      console.log(`Average Quality: ${Math.round(avgQuality)}/100`)
      console.log(`Average Time: ${Math.round(avgTime)}s`)
      console.log(`Max VRAM Used: ${maxVRAM}MB`)
      
      // Find best configuration
      const bestConfig = successfulTests.reduce((best, current) => 
        current.qualityScore > best.qualityScore ? current : best
      )
      
      console.log(`\n🏆 BEST CONFIGURATION:`)
      console.log(`Resolution: ${bestConfig.settings.width}x${bestConfig.settings.height}`)
      console.log(`Steps: ${bestConfig.settings.steps}`)
      console.log(`CFG: ${bestConfig.settings.cfg}`)
      console.log(`Quality Score: ${bestConfig.qualityScore}/100`)
      console.log(`Time: ${Math.round(bestConfig.actualTime)}s`)
      console.log(`VRAM: ${bestConfig.actualVRAM}MB`)
    }
    
    if (failedTests.length > 0) {
      console.log(`\n❌ FAILED CONFIGURATIONS:`)
      failedTests.forEach((test, i) => {
        console.log(`${i + 1}. ${test.settings.width}x${test.settings.height}, ${test.settings.steps} steps - ${test.error}`)
      })
    }
    
    console.log(`===========================================\n`)
  }

  // Get test session status
  getTestStatus(sessionId: string): TestSession | null {
    return this.activeSessions.get(sessionId) || null
  }

  // Get all test sessions
  getAllSessions(): TestSession[] {
    return Array.from(this.activeSessions.values())
  }

  // Quick quality test with predefined settings
  async quickQualityTest(model: ComfyUIModel): Promise<QualityTestResult[]> {
    const testPrompt = "cute dragon character, game sprite, colorful, high quality"
    
    // Test 3 key configurations
    const quickConfigs = [
      resourceManager.calculateOptimalSettings(512, 512, 'optimized', model),
      resourceManager.calculateOptimalSettings(768, 768, 'high', model),
      resourceManager.calculateOptimalSettings(1024, 1024, 'ultra', model)
    ].filter(config => resourceManager.isSettingsSafe(config))
    
    const results: QualityTestResult[] = []
    
    for (const config of quickConfigs) {
      console.log(`🚀 Quick test: ${config.width}x${config.height}, ${config.steps} steps`)
      
      const startTime = Date.now()
      const testResult = await this.testConfiguration(model, testPrompt, config)
      const endTime = Date.now()
      
      const result: QualityTestResult = {
        settings: config,
        actualVRAM: this.estimateActualVRAM(config, testResult.success),
        actualTime: (endTime - startTime) / 1000,
        qualityScore: this.assessImageQuality(testResult),
        success: testResult.success,
        error: testResult.error
      }
      
      results.push(result)
      resourceManager.storeQualityResult(model, result)
    }
    
    return results
  }
}

// Export singleton instance
export const qualityTester = new QualityTester()