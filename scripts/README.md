# Scripts Directory

This directory contains utility scripts and automation tools for the ComfyUI project.

## Script Categories

### 🤖 AI System Scripts
- `activate-real-ai.js` - AI system activation and setup
- `model-workflow-optimizer.js` - Production-ready optimization system

### 🧪 Testing Scripts
- `landscape-quality-test-turbo.js` - Landscape generation testing
- `character-consistency-test.js` - Character generation validation
- `degradation-mitigation-test.js` - Performance degradation testing

### ⚙️ Setup & Installation
- `install-comfyui-modules.bat` - Windows ComfyUI module installation
- `install-comfyui-modules.sh` - Linux/Mac ComfyUI module installation
- `start-comfyui.bat` - ComfyUI startup script

### 🎨 Content Generation
- `prompting-demo.js` - Enhanced prompting demonstration
- `fix_img2img.js` - Image-to-image fixes

### 📊 Analysis Scripts
- `rtx3050-stress-test.js` - Hardware-specific stress testing
- `working-models-test.js` - Model validation testing

## Usage

### Starting ComfyUI
```bash
# Windows
scripts/start-comfyui.bat

# Or directly
scripts/install-comfyui-modules.bat
```

### Running Optimization
```bash
node scripts/model-workflow-optimizer.js
```

### Testing Performance
```bash
node scripts/landscape-quality-test-turbo.js
node scripts/character-consistency-test.js
```

## Configuration

Scripts use environment variables and configuration files from the `/config/` directory.