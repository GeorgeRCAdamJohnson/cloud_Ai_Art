# ComfyUI Local Setup Guide - RTX 3050 Optimized

This guide provides detailed instructions for setting up ComfyUI Local integration with RTX 3050 6GB optimization for unlimited free AI art generation.

## 🎯 Overview

ComfyUI Local integration provides:
- **FREE Unlimited Generation**: No API costs or usage limits
- **RTX 3050 Optimization**: Hardware-aware memory management
- **Professional Quality**: SDXL Base 1.0 model (6.9GB)
- **Extended Timeout**: Up to 20 minutes for ultra-quality generation
- **Smart Settings**: Automatic parameter adjustment for your GPU

## 📋 Prerequisites

### Hardware Requirements
- **GPU**: RTX 3050 6GB (minimum) or better
- **RAM**: 16GB system RAM recommended
- **Storage**: 15GB free space (10GB for ComfyUI + 5GB for models)
- **OS**: Windows 10/11, Linux, or macOS

### Software Requirements
- **Python**: 3.8 or higher
- **Git**: For cloning repositories
- **Node.js**: 18+ (for the main application)
- **CUDA**: 11.8 or compatible with your RTX 3050

## 🛠️ Step-by-Step Setup

### 1. Install ComfyUI

```bash
# Clone ComfyUI repository
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI

# Install PyTorch with CUDA support (RTX 3050 compatible)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install ComfyUI dependencies
pip install -r requirements.txt
```

### 2. Download SDXL Model

The SDXL Base 1.0 model is the primary working model for RTX 3050 optimization:

```bash
# Navigate to checkpoints directory
cd models/checkpoints

# Download SDXL Base 1.0 (6.9GB)
# Option 1: Direct download (if you have wget)
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors

# Option 2: Manual download
# Visit: https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/tree/main
# Download: sd_xl_base_1.0.safetensors (6.94 GB)
# Place in: ComfyUI/models/checkpoints/
```

### 3. Verify Model Installation

```bash
# Check if model exists
ls -la models/checkpoints/sd_xl_base_1.0.safetensors

# Verify model integrity (optional)
python -c "
import safetensors.torch as st
try:
    with st.safe_open('models/checkpoints/sd_xl_base_1.0.safetensors', framework='pt') as f:
        print('✅ SDXL model is valid and ready')
except Exception as e:
    print(f'❌ Model error: {e}')
"
```

### 4. Start ComfyUI Server

```bash
# Start ComfyUI with network access
python main.py --listen --port 8188

# Expected output:
# Starting server
# To see the GUI go to: http://127.0.0.1:8188
```

### 5. Configure Cloud AI Art Application

In your Cloud AI Art project directory:

```bash
# Install dependencies
npm install

# Create environment file (if not exists)
cp .env.example .env.local

# Add ComfyUI configuration to .env.local
echo "COMFYUI_SERVER_URL=http://localhost" >> .env.local
echo "COMFYUI_PORT=8188" >> .env.local
echo "COMFYUI_TIMEOUT=1200000" >> .env.local

# Start the application
npm run dev
```

## ⚙️ RTX 3050 Optimization Features

### Automatic Memory Management

The system automatically manages VRAM usage:

```typescript
// RTX 3050 Configuration
const RTX_3050_CONFIG = {
  maxVRAM: 6144,    // 6GB total
  safeVRAM: 5120,   // 5GB safe limit
  maxBatchSize: 1,  // Single image generation
  
  // Automatic VRAM estimation
  getVRAMUsage: (width, height, steps) => {
    // Calculates expected memory usage
    // Prevents out-of-memory errors
  }
}
```

### Quality Presets

Three optimized quality levels:

| Quality | Time | VRAM Usage | Steps | Description |
|---------|------|------------|-------|-------------|
| **Optimized** | 25-45s | ~3.5GB | 20 | Fast, good quality |
| **High** | 2-5min | ~4.8GB | 28 | Balanced quality/speed |
| **Ultra** | 8-20min | ~5.8GB | 35 | Maximum quality |

### Resolution Support

8 preset resolutions optimized for RTX 3050:

- **512×512** (~2.8GB VRAM) - Ultra fast
- **640×640** (~3.2GB VRAM) - Game sprites
- **768×768** (~3.5GB VRAM) - Balanced
- **1024×768** (~4.2GB VRAM) - Landscape
- **768×1024** (~4.2GB VRAM) - Portrait
- **1024×1024** (~4.8GB VRAM) - High detail
- **1280×720** (~5.2GB VRAM) - Widescreen
- **Custom sizes** - With memory warnings

## 🔧 Advanced Configuration

### Environment Variables

Add to `.env.local` for custom configuration:

```bash
# ComfyUI Server Configuration
COMFYUI_SERVER_URL=http://localhost
COMFYUI_PORT=8188
COMFYUI_TIMEOUT=1200000          # 20 minutes

# RTX 3050 Optimization
COMFYUI_MAX_VRAM=6144           # 6GB limit
COMFYUI_SAFE_VRAM=5120          # Safe threshold
COMFYUI_MAX_BATCH_SIZE=1        # Single generation

# Performance Tuning
COMFYUI_HEALTH_CHECK_INTERVAL=5000  # 5 seconds
COMFYUI_PROGRESS_UPDATE_INTERVAL=3000  # 3 seconds
```

### Custom Workflows

The system supports custom ComfyUI workflows. Create in `src/lib/comfyui-workflows/`:

```typescript
// custom-workflow.ts
export const customWorkflow = {
  name: 'Custom Style',
  description: 'Your custom workflow',
  createWorkflow: (options: ComfyUIGenerationOptions) => {
    // Return ComfyUI JSON workflow
    // System will automatically apply RTX 3050 optimizations
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**1. "ComfyUI server not running"**
```bash
# Check if ComfyUI is running
curl http://localhost:8188/system_stats

# If not running, start ComfyUI:
cd ComfyUI
python main.py --listen --port 8188
```

**2. "CUDA out of memory" errors**
```bash
# Solutions:
# - Use "Optimized" quality instead of "Ultra"
# - Reduce resolution (try 768×768 instead of 1024×1024)
# - Close other GPU-intensive applications
# - Restart ComfyUI server to clear VRAM
```

**3. "Model not found" errors**
```bash
# Verify SDXL model exists:
ls ComfyUI/models/checkpoints/sd_xl_base_1.0.safetensors

# If missing, re-download:
cd ComfyUI/models/checkpoints
wget https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors
```

**4. Slow generation times**
```bash
# Optimization tips:
# - Use "Optimized" quality for 25-45s generation
# - Ensure RTX 3050 drivers are updated
# - Check GPU utilization in Task Manager
# - Close unnecessary background applications
```

**5. Timeout errors on long generations**
```bash
# For ultra quality (up to 20min):
# - Ensure stable power supply
# - Check ComfyUI server logs for progress
# - Monitor GPU temperature (<85°C)
# - Use smaller resolutions for faster results
```

### Performance Monitoring

Monitor your RTX 3050 performance:

```bash
# Check GPU usage (Windows)
nvidia-smi

# Monitor VRAM usage in real-time
nvidia-smi -l 1

# Check ComfyUI server logs
tail -f ComfyUI/comfyui.log
```

### Hardware Monitoring

Keep your RTX 3050 healthy:

- **Temperature**: Keep under 85°C
- **VRAM Usage**: Monitor in the web interface
- **Power**: Ensure adequate PSU (550W+ recommended)
- **Cooling**: Verify GPU fans are working

## 🎨 Usage Tips

### Optimal Settings for RTX 3050

**For Speed (25-45s)**:
- Quality: Optimized
- Resolution: 768×768 or smaller
- Expected VRAM: ~3.5GB

**For Quality (2-5min)**:
- Quality: High
- Resolution: 1024×768 or 768×1024
- Expected VRAM: ~4.2GB

**For Maximum Detail (8-20min)**:
- Quality: Ultra
- Resolution: 1024×1024 (max safe)
- Expected VRAM: ~5.8GB

### Prompt Optimization

Effective prompts for SDXL:
```
Good: "cute cartoon dragon character, 2D game sprite, colorful, kids friendly"
Better: "cute cartoon dragon character, 2D game sprite, colorful, kids friendly, simple design, clean background"
Best: "cute cartoon dragon character for kids game, 2D sprite art, bright colors, simple clean design, cartoon style, game asset"
```

## 🔄 Maintenance

### Regular Maintenance Tasks

**Weekly**:
- Clear ComfyUI temp files: `rm -rf ComfyUI/temp/*`
- Check for model updates
- Monitor storage usage

**Monthly**:
- Update ComfyUI: `git pull` in ComfyUI directory
- Update dependencies: `pip install -r requirements.txt --upgrade`
- Clean generated sprites folder if needed

### Model Management

```bash
# Check model integrity periodically
python -c "
import os
import safetensors.torch as st
checkpoint_dir = 'ComfyUI/models/checkpoints'
for file in os.listdir(checkpoint_dir):
    if file.endswith('.safetensors'):
        try:
            path = os.path.join(checkpoint_dir, file)
            with st.safe_open(path, framework='pt') as f:
                print(f'✅ {file}: OK')
        except Exception as e:
            print(f'❌ {file}: {str(e)[:100]}...')
"
```

## 🚀 Next Steps

Once setup is complete:

1. **Test Generation**: Try the "Optimized" quality first
2. **Explore Resolutions**: Test different sizes for your use case
3. **Monitor Performance**: Watch VRAM usage in the interface
4. **Optimize Prompts**: Experiment with different prompt styles
5. **Scale Usage**: Consider upgrading to RTX 4060+ for faster generation

## 📚 Additional Resources

- [ComfyUI Official Documentation](https://github.com/comfyanonymous/ComfyUI)
- [SDXL Model Information](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- [RTX 3050 Optimization Guide](./COMFYUI_RTX3050_OPTIMIZATION_COMPLETE.md)
- [Model Setup Guide](./COMFYUI_MODELS_SETUP.md)

---

**Congratulations!** 🎉 You now have unlimited free local AI art generation optimized for your RTX 3050 6GB GPU!