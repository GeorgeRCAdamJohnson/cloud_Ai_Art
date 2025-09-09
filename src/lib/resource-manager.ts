// Resource Management System for ComfyUI
// Intelligent VRAM monitoring and parameter adjustment

export interface ResourceConfig {
  maxVRAM: number // Maximum VRAM in MB
  maxDuration: number // Maximum generation time in minutes
  safetyMargin: number // Safety margin percentage (0.1 = 10%)
}

export interface GenerationSettings {
  width: number
  height: number
  steps: number
  cfg: number
  sampler: string
  scheduler: string
  estimatedVRAM: number
  estimatedTime: number
  qualityScore: number
  consistentSeed?: boolean
}

export interface QualityTestResult {
  settings: GenerationSettings
  actualVRAM: number
  actualTime: number
  qualityScore: number
  success: boolean
  error?: string
}

// Default RTX 3050 6GB configuration
const DEFAULT_CONFIG: ResourceConfig = {
  maxVRAM: 5120, // 5GB safe limit
  maxDuration: 30, // 30 minutes max
  safetyMargin: 0.15 // 15% safety margin
}

export class ResourceManager {
  private config: ResourceConfig
  private qualityDatabase: Map<string, QualityTestResult[]> = new Map()
  
  constructor(config: ResourceConfig = DEFAULT_CONFIG) {
    this.config = config
  }

  // Calculate VRAM usage based on parameters
  estimateVRAM(width: number, height: number, steps: number, model: string): number {
    const pixelCount = width * height
    const baseVRAM = this.getModelBaseVRAM(model)
    
    // VRAM usage formula: base + (pixels * factor) + (steps * step_factor)
    const pixelFactor = pixelCount / (512 * 512) // Normalized to 512x512
    const stepFactor = steps / 20 // Normalized to 20 steps
    
    return Math.round(baseVRAM + (pixelFactor * 1500) + (stepFactor * 300))
  }

  // Get base VRAM usage for different models
  private getModelBaseVRAM(model: string): number {
    const modelVRAM = {
      'sdxl-base': 2800,
      'anime-sprite': 2600,
      'cartoon-3d': 2400,
      'sdxl-turbo': 2500
    }
    return modelVRAM[model as keyof typeof modelVRAM] || 2800
  }

  // Calculate optimal settings within resource constraints
  calculateOptimalSettings(
    targetWidth: number,
    targetHeight: number,
    quality: 'optimized' | 'high' | 'ultra',
    model: string
  ): GenerationSettings {
    const maxVRAM = this.config.maxVRAM * (1 - this.config.safetyMargin)
    
    // Start with target resolution and adjust down if needed
    let width = targetWidth
    let height = targetHeight
    let steps = this.getQualitySteps(quality)
    let cfg = this.getQualityCFG(quality)
    
    // Iteratively reduce parameters until within VRAM limit
    while (this.estimateVRAM(width, height, steps, model) > maxVRAM) {
      if (width > 512 || height > 512) {
        // Reduce resolution first
        width = Math.max(512, Math.floor(width * 0.9))
        height = Math.max(512, Math.floor(height * 0.9))
      } else if (steps > 8) {
        // Then reduce steps
        steps = Math.max(8, steps - 2)
      } else if (cfg > 4.0) {
        // Finally reduce CFG
        cfg = Math.max(4.0, cfg - 0.5)
      } else {
        break // Can't reduce further
      }
    }

    const estimatedVRAM = this.estimateVRAM(width, height, steps, model)
    const estimatedTime = this.estimateTime(width, height, steps, model)
    const qualityScore = this.calculateQualityScore(width, height, steps, cfg)

    return {
      width,
      height,
      steps,
      cfg,
      sampler: this.getOptimalSampler(quality),
      scheduler: 'karras',
      estimatedVRAM,
      estimatedTime,
      qualityScore
    }
  }

  private getQualitySteps(quality: 'optimized' | 'high' | 'ultra'): number {
    return { optimized: 15, high: 25, ultra: 40 }[quality]
  }

  private getQualityCFG(quality: 'optimized' | 'high' | 'ultra'): number {
    return { optimized: 6.5, high: 7.5, ultra: 8.5 }[quality]
  }

  private getOptimalSampler(quality: 'optimized' | 'high' | 'ultra'): string {
    return { optimized: 'euler', high: 'dpmpp_2m', ultra: 'dpmpp_2m_sde' }[quality]
  }

  // Estimate generation time
  private estimateTime(width: number, height: number, steps: number, model: string): number {
    const pixelCount = width * height
    const baseTime = this.getModelBaseTime(model)
    
    const pixelFactor = pixelCount / (512 * 512)
    const stepFactor = steps / 20
    
    return Math.round(baseTime * pixelFactor * stepFactor)
  }

  private getModelBaseTime(model: string): number {
    const modelTimes = {
      'sdxl-base': 45, // seconds for 512x512, 20 steps
      'anime-sprite': 35,
      'cartoon-3d': 25,
      'sdxl-turbo': 15
    }
    return modelTimes[model as keyof typeof modelTimes] || 45
  }

  // Calculate quality score (0-100)
  private calculateQualityScore(width: number, height: number, steps: number, cfg: number): number {
    const resolutionScore = Math.min(100, (width * height) / (1024 * 1024) * 100)
    const stepScore = Math.min(100, (steps / 50) * 100)
    const cfgScore = Math.min(100, (cfg / 10) * 100)
    
    return Math.round((resolutionScore * 0.4) + (stepScore * 0.4) + (cfgScore * 0.2))
  }

  // Generate test configurations for quality grading
  generateTestConfigurations(model: string): GenerationSettings[] {
    const testConfigs: GenerationSettings[] = []
    
    // Test different resolution/quality combinations
    const resolutions = [
      [512, 512], [768, 768], [1024, 1024]
    ]
    
    const qualities: Array<'optimized' | 'high' | 'ultra'> = ['optimized', 'high', 'ultra']
    
    for (const [width, height] of resolutions) {
      for (const quality of qualities) {
        const settings = this.calculateOptimalSettings(width, height, quality, model)
        if (settings.estimatedVRAM <= this.config.maxVRAM && 
            settings.estimatedTime <= this.config.maxDuration * 60) {
          testConfigs.push(settings)
        }
      }
    }
    
    return testConfigs
  }

  // Store quality test result
  storeQualityResult(model: string, result: QualityTestResult): void {
    if (!this.qualityDatabase.has(model)) {
      this.qualityDatabase.set(model, [])
    }
    
    const results = this.qualityDatabase.get(model)!
    results.push(result)
    
    // Keep only last 50 results per model
    if (results.length > 50) {
      results.splice(0, results.length - 50)
    }
  }

  // Get best settings based on historical data
  getBestSettings(model: string, targetQuality: number = 80): GenerationSettings | null {
    const results = this.qualityDatabase.get(model)
    if (!results || results.length === 0) return null
    
    // Find successful results that meet quality threshold
    const validResults = results.filter(r => 
      r.success && 
      r.qualityScore >= targetQuality &&
      r.actualVRAM <= this.config.maxVRAM &&
      r.actualTime <= this.config.maxDuration * 60
    )
    
    if (validResults.length === 0) return null
    
    // Sort by quality score and return best
    validResults.sort((a, b) => b.qualityScore - a.qualityScore)
    return validResults[0].settings
  }

  // Check if settings are safe
  isSettingsSafe(settings: GenerationSettings): boolean {
    return settings.estimatedVRAM <= this.config.maxVRAM &&
           settings.estimatedTime <= this.config.maxDuration * 60
  }

  // Get resource usage summary
  getResourceSummary(settings: GenerationSettings): string {
    const vramPercent = Math.round((settings.estimatedVRAM / this.config.maxVRAM) * 100)
    const timeMinutes = Math.round(settings.estimatedTime / 60 * 10) / 10
    
    return `VRAM: ${settings.estimatedVRAM}MB (${vramPercent}%), Time: ${timeMinutes}min, Quality: ${settings.qualityScore}/100`
  }
}

// Export singleton instance
export const resourceManager = new ResourceManager()