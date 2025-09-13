# Resource Management System

## Overview
Intelligent VRAM monitoring and parameter adjustment system for ComfyUI that keeps generation under 5GB VRAM for 30+ minutes while allowing user customization.

## Key Features

### 🧠 Intelligent Resource Management
- **Dynamic Parameter Adjustment**: Automatically adjusts resolution, steps, and CFG based on VRAM constraints
- **Safety Margins**: 15% safety buffer to prevent crashes
- **Real-time Monitoring**: Live VRAM usage estimation and quality scoring

### 🎯 Quality Testing & Optimization
- **Automated Testing**: Generate multiple configurations to find optimal settings
- **Quality Grading**: Score configurations based on output quality vs resource usage
- **Historical Data**: Learn from previous generations to improve future settings

### ⚙️ User Control
- **Advanced Settings Panel**: Full control over generation parameters
- **Resource Warnings**: Visual indicators when settings exceed safe limits
- **Preset Management**: Save and load optimal configurations

## Components

### ResourceManager (`src/lib/resource-manager.ts`)
```typescript
// Calculate optimal settings within constraints
const settings = resourceManager.calculateOptimalSettings(
  width, height, quality, model
)

// Check if settings are safe
const isSafe = resourceManager.isSettingsSafe(settings)

// Get resource summary
const summary = resourceManager.getResourceSummary(settings)
```

### QualityTester (`src/lib/quality-tester.ts`)
```typescript
// Run quick quality test
const results = await qualityTester.quickQualityTest('sdxl-base')

// Start full test session
const sessionId = await qualityTester.startQualityTest('sdxl-base')
```

### AdvancedSettings Component
- Custom parameter controls (width, height, steps, CFG, sampler)
- Real-time resource usage display
- Quality testing integration
- Safety warnings and recommendations

### ResourceMonitor Component
- Live VRAM usage visualization
- Estimated generation time
- Quality score tracking
- Status indicators

## API Endpoints

### Quality Testing API (`/api/quality-test`)
```bash
# Quick test
POST /api/quality-test
{
  "model": "sdxl-base",
  "testType": "quick"
}

# Full test session
POST /api/quality-test
{
  "model": "sdxl-base", 
  "testType": "full",
  "prompt": "test prompt"
}

# Check test status
GET /api/quality-test?sessionId=test_123
```

## Resource Constraints

### RTX 3050 6GB Optimization
- **Max VRAM**: 5120MB (5GB safe limit)
- **Max Duration**: 30 minutes
- **Safety Margin**: 15%

### Parameter Ranges
- **Resolution**: 512x512 to 1536x1536 (auto-adjusted)
- **Steps**: 8-50 (reduced for large images)
- **CFG Scale**: 1.0-15.0 (optimized per model)
- **Samplers**: Euler, DPM++ 2M, DPM++ 2M SDE

## Usage Examples

### Basic Resource-Managed Generation
```typescript
// Automatically calculates safe settings
const result = await generateWithComfyUI(
  "cute dragon character",
  "sdxl-base",
  { width: 1024, height: 1024, quality: "high" }
)
```

### Custom Settings with Safety Check
```typescript
const customSettings = {
  width: 1024,
  height: 1024, 
  steps: 30,
  cfg: 8.0,
  sampler: "dpmpp_2m"
}

// Check if safe before generation
if (resourceManager.isSettingsSafe(customSettings)) {
  const result = await generateWithComfyUI(
    prompt, model, { customSettings }
  )
}
```

### Quality Testing Workflow
```typescript
// Test different configurations
const sessionId = await qualityTester.startQualityTest("sdxl-base")

// Monitor progress
const session = qualityTester.getTestStatus(sessionId)

// Get best settings from historical data
const bestSettings = resourceManager.getBestSettings("sdxl-base", 80)
```

## Benefits

### For Users
- **No More Crashes**: Intelligent VRAM management prevents out-of-memory errors
- **Optimal Quality**: Automatic parameter tuning for best quality within constraints
- **Full Control**: Advanced settings for power users
- **Learning System**: Gets better over time through quality testing

### For Developers
- **Extensible**: Easy to add new models and constraints
- **Data-Driven**: Quality scoring and historical optimization
- **Modular**: Separate concerns (resource management, quality testing, UI)
- **API-First**: RESTful endpoints for testing and monitoring

## Configuration

### Environment Variables
```bash
# ComfyUI Server
COMFYUI_SERVER_URL=http://localhost
COMFYUI_PORT=8188
COMFYUI_TIMEOUT=1200000  # 20 minutes

# Resource Limits
MAX_VRAM_MB=5120         # 5GB
MAX_DURATION_MIN=30      # 30 minutes
SAFETY_MARGIN=0.15       # 15%
```

### Model-Specific Settings
Each model has optimized base settings:
- **SDXL Base**: 2800MB base VRAM, 45s base time
- **Anime Sprite**: 2600MB base VRAM, 35s base time  
- **3D Cartoon**: 2400MB base VRAM, 25s base time

## Future Enhancements

### Planned Features
- **GPU Temperature Monitoring**: Thermal throttling protection
- **Batch Generation**: Optimize multiple image generation
- **Cloud Resource Management**: Extend to cloud GPU instances
- **Model Performance Profiling**: Detailed model-specific optimization
- **User Preference Learning**: Personalized quality vs speed preferences

### Integration Opportunities
- **Workflow Automation**: Auto-generate test suites for new models
- **Performance Analytics**: Detailed generation metrics and trends
- **Resource Scheduling**: Queue management for long generations
- **Quality Metrics**: Advanced image quality assessment algorithms

## Troubleshooting

### Common Issues
1. **VRAM Overflow**: Reduce resolution or steps in Advanced Settings
2. **Slow Generation**: Use "Optimized" quality or smaller resolution
3. **Quality Too Low**: Increase steps/CFG within VRAM limits
4. **Test Failures**: Check ComfyUI server connection and model availability

### Debug Tools
- Resource Monitor: Real-time VRAM and time estimation
- Quality Tester: Automated parameter validation
- Console Logs: Detailed generation and resource information
- API Endpoints: Direct testing and monitoring capabilities